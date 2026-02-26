<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import {
        Search,
        Plus,
        X,
        Trash2,
        Save,
        Edit2,
        List,
        ClipboardPlus,
        User,
    } from "lucide-svelte";

    // Definición de Interfaces (Elimina errores de tipo 'any')
    interface Paciente {
        cedula: string;
        nombre: string;
        apellido: string;
        fecha_nacimiento: string;
        fecha_registro?: string;
    }

    // Estado de la página
    let patients: Paciente[] = [];
    let searchQuery: string = "";
    let showModal: boolean = false;
    let isEditing: boolean = false;
    let isLoading: boolean = false;
    let cedulaOriginal: string = ""; // Vital para editar/eliminar si se cambia la cédula
    let errorMessage: string = "";

    let formData: Paciente = {
        cedula: "",
        nombre: "",
        apellido: "",
        fecha_nacimiento: "",
    };

    // Carga de datos
    onMount(loadPatients);

    // Carga de datos
    async function loadPatients(): Promise<void> {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/pacientes", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) {
                goto("/login");
                return;
            }

            const data = await res.json();
            // Manejo de error del service
            patients =
                data && data.type === "error"
                    ? []
                    : Array.isArray(data)
                      ? data
                      : [];
        } catch (error) {
            console.error("Error cargando pacientes:", error);
            patients = [];
        }
    }

    // Abre el modal para crear un nuevo paciente
    function openCreateModal(): void {
        isEditing = false;
        formData = {
            cedula: "",
            nombre: "",
            apellido: "",
            fecha_nacimiento: "",
        };
        showModal = true;
        errorMessage = "";
    }

    // Abre el modal para editar un paciente
    function openEditModal(patient: Paciente): void {
        isEditing = true;
        cedulaOriginal = patient.cedula;
        formData = { ...patient };
        showModal = true;
        errorMessage = "";
    }

    // Acciones
    async function handleSavePatient(): Promise<void> {
        const { cedula, nombre, apellido, fecha_nacimiento } = formData;

        if (
            !cedula?.trim() ||
            !nombre?.trim() ||
            !apellido?.trim() ||
            !fecha_nacimiento
        ) {
            errorMessage = "Todos los campos son obligatorios.";
            return;
        }

        if (/\D/.test(cedula.trim())) {
            errorMessage =
                "La cédula no puede contener letras ni caracteres especiales.";
            return;
        }
        errorMessage = "";
        isLoading = true;

        try {
            const token = localStorage.getItem("token");
            const method = isEditing ? "PATCH" : "POST";
            const url = isEditing
                ? `/api/pacientes/${cedulaOriginal}`
                : "/api/pacientes";

            // Filtramos el cuerpo para PATCH para no enviar campos innecesarios o protegidos
            const body = isEditing
                ? {
                      nombre: nombre.trim(),
                      apellido: apellido.trim(),
                      fecha_nacimiento,
                  }
                : {
                      ...formData,
                      cedula: cedula.trim(),
                      nombre: nombre.trim(),
                      apellido: apellido.trim(),
                  };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const result = await res.json();

            if (res.ok && result.type !== "error") {
                await loadPatients();
                closeModal();
            } else {
                errorMessage =
                    result.message || "Error al guardar el paciente.";
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            errorMessage = "Error de comunicación con el servidor.";
        } finally {
            isLoading = false;
        }
    }

    // Elimina un paciente
    async function handleDeletePatient(cedula: string): Promise<void> {
        if (!confirm("¿Está seguro de eliminar este paciente?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/pacientes/${cedula}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) await loadPatients();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }

    function getInitials(nombre: string, apellido: string): string {
        return `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase();
    }

    // 6. Filtro reactivo
    $: filteredPatients = patients.filter(
        (p) =>
            p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.cedula.includes(searchQuery),
    );

    // Cierra el modal
    function closeModal(): void {
        showModal = false;
    }
</script>

<div class="patients-page">
    <div class="header-row">
        <h1 class="page-title">Gestión de Pacientes</h1>
        <button class="btn btn-primary" on:click={openCreateModal}>
            <Plus size={20} /> Nuevo Paciente
        </button>
    </div>

    <div class="toolbar">
        <div class="search-box">
            <Search size={18} class="search-icon" />
            <input
                type="text"
                placeholder="Buscar por nombre o cédula..."
                bind:value={searchQuery}
                class="input search-input"
            />
        </div>
    </div>

    <div class="table-container">
        <div class="patients-table">
            <div class="table-header">
                <div>PACIENTE</div>
                <div>CÉDULA</div>
                <div>FECHA NACIMIENTO</div>
                <div class="text-right">ACCIONES</div>
            </div>

            {#each filteredPatients as patient}
                <div class="table-row">
                    <div class="patient-info">
                        <div class="avatar">
                            {getInitials(patient.nombre, patient.apellido)}
                        </div>
                        <span class="name"
                            >{patient.nombre} {patient.apellido}</span
                        >
                    </div>
                    <div class="text-secondary">{patient.cedula}</div>
                    <div class="text-secondary">{patient.fecha_nacimiento}</div>
                    <div class="actions">
                        <button
                            class="icon-btn edit"
                            title="Editar"
                            on:click={() => openEditModal(patient)}
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            class="icon-btn delete"
                            title="Eliminar"
                            on:click={() => handleDeletePatient(patient.cedula)}
                        >
                            <Trash2 size={18} />
                        </button>
                        <button
                            class="icon-btn list"
                            title="Ver Consultas"
                            on:click={() =>
                                goto(
                                    `/dashboard/patients/${patient.cedula}/consultas`,
                                )}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            {:else}
                <div class="empty-state">No se encontraron pacientes.</div>
            {/each}
        </div>
    </div>
</div>

{#if showModal}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="modal-backdrop" on:click|self={closeModal}>
        <div class="modal-content">
            <div class="modal-header">
                <h2>{isEditing ? "Editar Paciente" : "Registrar Nuevo"}</h2>
                <button class="close-btn-modal" on:click={closeModal}
                    ><X size={20} /></button
                >
            </div>

            <div class="modal-body">
                {#if errorMessage}
                    <div class="error-alert">
                        {errorMessage}
                    </div>
                {/if}

                <div class="form-group">
                    <label for="name">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Nombre"
                        bind:value={formData.nombre}
                        class="input"
                    />
                </div>
                <div class="form-group">
                    <label for="lastname">Apellido</label>
                    <input
                        id="lastname"
                        type="text"
                        placeholder="Apellido"
                        bind:value={formData.apellido}
                        class="input"
                    />
                </div>
                <div class="form-group">
                    <label for="pid">Cédula</label>
                    <input
                        id="pid"
                        type="text"
                        placeholder="Cédula"
                        bind:value={formData.cedula}
                        class="input"
                    />
                </div>
                <div class="form-group">
                    <label for="birth">Fecha de Nacimiento</label>
                    <input
                        id="birth"
                        type="date"
                        bind:value={formData.fecha_nacimiento}
                        class="input"
                    />
                </div>
            </div>

            <div class="modal-footer">
                <button
                    class="btn btn-primary w-full"
                    on:click={handleSavePatient}
                    disabled={isLoading}
                >
                    <Save size={16} />
                    {isLoading ? "Guardando..." : "Guardar"}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .patients-page {
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
        max-width: 400px;
        display: flex;
        align-items: center;
        gap: 10px;
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
        grid-template-columns: 2fr 1.5fr 1.5fr 120px;
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
        grid-template-columns: 2fr 1.5fr 1.5fr 120px;
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
        width: 40px;
        height: 40px;
        background-color: rgba(16, 185, 129, 0.1);
        color: var(--color-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.875rem;
    }

    .name {
        font-weight: 500;
        color: var(--text-primary);
    }

    .text-secondary {
        color: var(--text-secondary);
        font-size: 0.875rem;
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

    .icon-btn.edit:hover {
        background-color: rgba(59, 130, 246, 0.1);
        color: var(--color-info);
    }
    .icon-btn.delete:hover {
        background-color: rgba(239, 68, 68, 0.1);
        color: var(--color-error);
    }
    .icon-btn.list:hover {
        background-color: rgba(16, 185, 129, 0.1);
        color: var(--color-primary);
    }

    .empty-state {
        padding: var(--spacing-2xl);
        text-align: center;
        color: var(--text-secondary);
    }

    /* Modal Styles */
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
        max-width: 480px;
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

    .modal-footer {
        padding: var(--spacing-lg);
        border-top: 1px solid var(--color-gray-100);
        background-color: var(--color-gray-50);
    }

    .w-full {
        width: 100%;
        justify-content: center;
    }

    .error-alert {
        background-color: rgba(239, 68, 68, 0.1);
        color: var(--color-error);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-error);
        font-size: 0.875rem;
        margin-bottom: var(--spacing-md);
        text-align: center;
    }
</style>
