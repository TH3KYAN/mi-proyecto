<script lang="ts">
    import { onMount } from "svelte";
    import {
        Plus,
        Trash2,
        Search,
        ClipboardList,
        Save,
        X,
        Fingerprint,
        User,
        Calendar,
    } from "lucide-svelte";

    interface Consulta {
        id?: number | string;
        cedula_paciente: string;
        cedula_medico?: string;
        descripcion: string;
        fecha_consulta?: string;
    }

    let consultas: Consulta[] = [];
    let filtroCedula = "";
    let isFetching = true;
    let showModal = false;
    let isLoading = false;

    let nuevaConsulta: Consulta = {
        cedula_paciente: "",
        descripcion: "",
    };

    onMount(loadConsultas);

    async function loadConsultas(): Promise<void> {
        isFetching = true;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/consultas", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            consultas = Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Error cargando consultas:", error);
            consultas = [];
        } finally {
            isFetching = false;
        }
    }

    function openCreateModal(): void {
        nuevaConsulta = { cedula_paciente: "", descripcion: "" };
        showModal = true;
    }

    function closeModal(): void {
        showModal = false;
    }

    async function handleCreate(): Promise<void> {
        if (
            !nuevaConsulta.cedula_paciente.trim() ||
            !nuevaConsulta.descripcion.trim()
        ) {
            alert("La cédula y la descripción son obligatorias");
            return;
        }

        isLoading = true;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `/api/pacientes/${nuevaConsulta.cedula_paciente}/consultas`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        descripcion: nuevaConsulta.descripcion,
                    }),
                },
            );

            const result = await res.json();

            if (res.ok && result.type !== "error") {
                nuevaConsulta = { cedula_paciente: "", descripcion: "" };
                closeModal();
                await loadConsultas();
            } else {
                alert(
                    "Error al guardar: " +
                        (result.message || "Verifique los datos"),
                );
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor");
        } finally {
            isLoading = false;
        }
    }

    async function handleDelete(
        cedula: string,
        id: string | number | undefined,
    ): Promise<void> {
        if (!confirm("¿Está seguro de eliminar esta consulta?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `/api/pacientes/${cedula}/consultas/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            if (res.ok) await loadConsultas();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }

    function formatDate(dateStr: string | undefined): string {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("es-VE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    $: filtered = consultas.filter(
        (c) =>
            c.cedula_paciente
                .toLowerCase()
                .includes(filtroCedula.toLowerCase()) ||
            (c.descripcion
                ?.toLowerCase()
                .includes(filtroCedula.toLowerCase()) ??
                false),
    );
</script>

<div class="consultas-page">
    <div class="header-row">
        <h1 class="page-title">Consultas Médicas</h1>
        <button class="btn btn-primary" on:click={openCreateModal}>
            <Plus size={20} /> Nueva Consulta
        </button>
    </div>

    <div class="toolbar">
        <div class="search-box">
            <Search size={18} class="search-icon" />
            <input
                type="text"
                placeholder="Buscar por cédula o descripción..."
                bind:value={filtroCedula}
                class="input search-input"
            />
        </div>
    </div>

    <div class="table-container">
        <div class="consultas-table">
            <div class="table-header">
                <div>PACIENTE / CÉDULA</div>
                <div>DESCRIPCIÓN</div>
                <div>MÉDICO</div>
                <div>FECHA</div>
                <div class="text-right">ACCIONES</div>
            </div>

            {#if isFetching}
                <div class="empty-state">Cargando registros médicos...</div>
            {:else}
                {#each filtered as c}
                    <div class="table-row">
                        <div class="patient-info">
                            <div class="avatar">
                                <Fingerprint size={16} />
                            </div>
                            <span class="name">{c.cedula_paciente}</span>
                        </div>
                        <div class="text-secondary descripcion">
                            {c.descripcion}
                        </div>
                        <div class="text-secondary">
                            {#if c.cedula_medico}
                                <span class="medico-tag"
                                    ><User size={13} /> {c.cedula_medico}</span
                                >
                            {:else}
                                —
                            {/if}
                        </div>
                        <div class="text-secondary">
                            <span class="date-tag"
                                ><Calendar size={13} />
                                {formatDate(c.fecha_consulta)}</span
                            >
                        </div>
                        <div class="actions">
                            <button
                                class="icon-btn delete"
                                title="Eliminar"
                                on:click={() =>
                                    handleDelete(c.cedula_paciente, c.id)}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                {:else}
                    <div class="empty-state">
                        <ClipboardList size={40} />
                        <p>No se encontraron consultas registradas.</p>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>

{#if showModal}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="modal-backdrop" on:click|self={closeModal}>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Registrar Consulta</h2>
                <button class="close-btn-modal" on:click={closeModal}
                    ><X size={20} /></button
                >
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label for="cedula">Cédula del Paciente</label>
                    <input
                        id="cedula"
                        type="text"
                        bind:value={nuevaConsulta.cedula_paciente}
                        placeholder="Ingrese CI del paciente"
                        class="input"
                    />
                </div>
                <div class="form-group">
                    <label for="descripcion">Descripción Clínica</label>
                    <textarea
                        id="descripcion"
                        bind:value={nuevaConsulta.descripcion}
                        placeholder="Síntomas, diagnóstico y tratamiento..."
                        class="input textarea"
                    ></textarea>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-ghost" on:click={closeModal}
                    >Cancelar</button
                >
                <button
                    class="btn btn-primary"
                    on:click={handleCreate}
                    disabled={isLoading}
                >
                    <Save size={16} />
                    {isLoading ? "Guardando..." : "Guardar Consulta"}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .consultas-page {
        padding: var(--spacing-2xl);
    }

    .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
    }

    .header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-xl);
    }

    .toolbar {
        margin-bottom: var(--spacing-lg);
    }

    .search-box {
        position: relative;
        max-width: 420px;
    }

    .search-input {
        padding-left: 40px;
    }

    .table-container {
        background-color: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        overflow: hidden;
    }

    .table-header {
        display: grid;
        grid-template-columns: 1.5fr 2.5fr 1.5fr 1.2fr 100px;
        padding: var(--spacing-md) var(--spacing-lg);
        background-color: var(--color-gray-50);
        border-bottom: 1px solid var(--color-gray-100);
        color: var(--text-secondary);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .table-row {
        display: grid;
        grid-template-columns: 1.5fr 2.5fr 1.5fr 1.2fr 100px;
        padding: var(--spacing-md) var(--spacing-lg);
        align-items: center;
        border-bottom: 1px solid var(--color-gray-50);
        transition: background-color 0.2s;
    }

    .table-row:hover {
        background-color: var(--color-gray-50);
    }

    .table-row:last-child {
        border-bottom: none;
    }

    .patient-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .avatar {
        width: 36px;
        height: 36px;
        background-color: rgba(16, 185, 129, 0.1);
        color: var(--color-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .name {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.9rem;
    }

    .text-secondary {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .descripcion {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: var(--spacing-md);
    }

    .medico-tag,
    .date-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }

    .text-right {
        text-align: right;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-xs);
    }

    .icon-btn {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all 0.2s;
    }

    .icon-btn.delete:hover {
        background-color: rgba(239, 68, 68, 0.1);
        color: var(--color-error);
    }

    .empty-state {
        padding: var(--spacing-2xl);
        text-align: center;
        color: var(--text-secondary);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md);
    }

    /* Modal */
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        backdrop-filter: blur(4px);
    }

    .modal-content {
        background-color: white;
        border-radius: var(--radius-lg);
        width: 100%;
        max-width: 500px;
        box-shadow: var(--shadow-lg);
        overflow: hidden;
    }

    .modal-header {
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--color-gray-100);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-header h2 {
        font-size: 1.25rem;
        font-weight: 600;
    }

    .close-btn-modal {
        border: none;
        background: transparent;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: var(--radius-sm);
    }

    .close-btn-modal:hover {
        background-color: var(--color-gray-100);
    }

    .modal-body {
        padding: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .form-group label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-secondary);
    }

    .textarea {
        height: 130px;
        resize: none;
    }

    .modal-footer {
        padding: var(--spacing-lg);
        border-top: 1px solid var(--color-gray-100);
        background-color: var(--color-gray-50);
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-sm);
    }
</style>
