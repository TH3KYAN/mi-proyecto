<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { ArrowLeft, Plus, FileText, Calendar, Search, Trash2 } from "lucide-svelte";

    const cedula = $page.params.id;
    let consultas: any[] = [];
    let paciente: any = null;
    let searchQuery = "";
    let cargando = true;

    onMount(async () => {
        await cargarPaciente();
        await cargarConsultas();
    });

    async function cargarPaciente() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/pacientes/${cedula}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                paciente = await res.json();
            }
        } catch (error) {
            console.error("Error cargando paciente:", error);
        }
    }

    async function cargarConsultas() {
        cargando = true;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/pacientes/${cedula}/consultas`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) {
                goto("/login");
                return;
            }

            const data = await res.json();
            consultas = Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Error cargando consultas:", error);
            consultas = [];
        } finally {
            cargando = false;
        }
    }

    // Filtrar consultas
    $: filteredConsultas = consultas.filter((c) =>
        (c.descripcion || "")
            .toLowerCase()
            .includes((searchQuery || "").toLowerCase()),
    );

    async function eliminarConsulta(idConsulta: string) {
        if (!confirm("¿Está seguro que desea eliminar esta consulta?")) return;
        
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/pacientes/${cedula}/consultas/${idConsulta}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.ok) {
                // Actualizar la lista localmente
                consultas = consultas.filter(c => c.id !== idConsulta);
            } else {
                const data = await res.json();
                alert(`Error al eliminar la consulta: ${data.message || ""}`);
            }
        } catch (error) {
            console.error("Error eliminando consulta:", error);
            alert("Error de red al eliminar la consulta");
        }
    }
</script>

<div class="consultas-page">
    <div class="header-actions">
        <button
            class="btn btn-back"
            on:click={() => goto("/dashboard/patients")}
        >
            <ArrowLeft size={18} /> Volver a Pacientes
        </button>
    </div>

    <div class="header-row">
        <div>
            <h1 class="page-title">Consultas Médicas</h1>
            {#if paciente}
                <p class="subtitle">
                    Paciente: <strong
                        >{paciente.nombre} {paciente.apellido}</strong
                    >
                    (C.I. {paciente.cedula})
                </p>
            {/if}
        </div>
        <button
            class="btn btn-primary"
            on:click={() =>
                goto(`/dashboard/patients/${cedula}/consultas/nueva`)}
        >
            <Plus size={20} /> Nueva Consulta
        </button>
    </div>

    {#if cargando}
        <div class="loading-state">Obteniendo historial médico...</div>
    {:else}
        <div class="table-container">
            <div class="consultas-table">
                <div class="table-header">
                    <div>FECHA</div>
                    <div>DESCRIPCIÓN</div>
                    <div class="text-right">CÓDIGO</div>
                    <div class="text-center">ACCIONES</div>
                </div>

                {#each filteredConsultas as consulta}
                    <div class="table-row">
                        <div class="fecha-col">
                            <Calendar size={16} class="text-secondary" />
                            <span
                                >{new Date(
                                    consulta.fecha_consulta,
                                ).toLocaleDateString("es-ES")}</span
                            >
                        </div>
                        <div class="truncate" title={consulta.descripcion}>
                            {consulta.descripcion}
                        </div>
                        <div class="text-right text-secondary text-sm">
                            #{consulta.id}
                        </div>
                        <div class="text-center">
                            <button
                                class="btn-icon text-danger"
                                title="Eliminar consulta"
                                on:click={() => eliminarConsulta(consulta.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                {:else}
                    <div class="empty-state">
                        <FileText size={48} class="empty-icon" />
                        <p>
                            No se encontraron consultas registradas para este
                            paciente.
                        </p>
                        <button
                            class="btn btn-primary mt-4"
                            on:click={() =>
                                goto(
                                    `/dashboard/patients/${cedula}/consultas/nueva`,
                                )}
                        >
                            Registrar primera consulta
                        </button>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .consultas-page {
        padding: var(--spacing-2xl);
    }

    .header-actions {
        margin-bottom: var(--spacing-md);
    }

    .btn-back {
        background: transparent;
        border: 1px solid var(--color-gray-200);
        color: var(--text-secondary);
        padding: 0.5rem 1rem;
    }

    .btn-back:hover {
        background: var(--color-gray-50);
        color: var(--text-primary);
    }

    .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
    }

    .subtitle {
        color: var(--text-secondary);
        margin: 0.5rem 0 0 0;
        font-size: 1.1rem;
    }

    .header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: var(--spacing-xl);
    }

    .toolbar {
        margin-bottom: var(--spacing-lg);
    }

    .search-box {
        position: relative;
        max-width: 400px;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
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
        grid-template-columns: 150px 1fr 100px 80px;
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
        grid-template-columns: 150px 1fr 100px 80px;
        padding: var(--spacing-md) var(--spacing-lg);
        align-items: center;
        border-bottom: 1px solid var(--color-gray-50);
        transition: background-color 0.2s;
        gap: 1rem;
    }

    .table-row:hover {
        background-color: var(--color-gray-50);
    }

    .table-row:last-child {
        border-bottom: none;
    }

    .fecha-col {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
    }

    .truncate {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .text-right {
        text-align: right;
    }

    .text-center {
        text-align: center;
    }

    .text-secondary {
        color: var(--text-secondary);
    }

    .text-sm {
        font-size: 0.85rem;
    }

    .empty-state {
        padding: 4rem 2rem;
        text-align: center;
        color: var(--text-secondary);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .empty-icon {
        color: var(--color-gray-300);
        margin-bottom: 1rem;
    }

    .loading-state {
        padding: 4rem;
        text-align: center;
        color: var(--text-secondary);
        background: white;
        border-radius: var(--radius-lg);
    }

    .mt-4 {
        margin-top: 1rem;
    }

    .btn-icon {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--radius-sm);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .btn-icon:hover {
        background-color: var(--color-gray-100);
    }

    .text-danger {
        color: #ef4444;
    }

    .text-danger:hover {
        color: #dc2626;
        background-color: #fee2e2;
    }
</style>
