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

    // 1. Definición de Interfaces (Elimina errores de tipo 'any')
    interface Paciente {
        cedula: string;
        nombre: string;
        apellido: string;
        fecha_nacimiento: string;
        fecha_registro?: string;
    }

    // 2. Estado de la página
    let patients: Paciente[] = [];
    let searchQuery: string = "";
    let showModal: boolean = false;
    let isEditing: boolean = false;
    let isLoading: boolean = false;
    let cedulaOriginal: string = ""; // Vital para editar/eliminar si se cambia la cédula

    let formData: Paciente = {
        cedula: "",
        nombre: "",
        apellido: "",
        fecha_nacimiento: "",
    };

    // 3. Carga de datos
    onMount(loadPatients);

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

    // 4. Lógica de Modal (Corrige errores de tus imágenes 5, 6, 7, 8 y 9)
    function openCreateModal(): void {
        isEditing = false;
        formData = {
            cedula: "",
            nombre: "",
            apellido: "",
            fecha_nacimiento: "",
        };
        showModal = true;
    }

    function openEditModal(patient: Paciente): void {
        isEditing = true;
        cedulaOriginal = patient.cedula; // Guardamos la llave primaria actual
        formData = { ...patient };
        showModal = true;
    }

    function closeModal(): void {
        showModal = false;
    }

    // 5. Acciones (Corrige error de Imagen 10)
    async function handleSavePatient(): Promise<void> {
        if (!formData.cedula || !formData.nombre) return;
        isLoading = true;

        try {
            const token = localStorage.getItem("token");
            const method = isEditing ? "PATCH" : "POST";
            const url = isEditing
                ? `/api/pacientes/${cedulaOriginal}`
                : "/api/pacientes";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                await loadPatients();
                closeModal();
            }
        } catch (error) {
            console.error("Error al guardar:", error);
        } finally {
            isLoading = false;
        }
    }

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
                        <button
                            class="icon-btn add"
                            title="Añadir Consulta"
                            on:click={() =>
                                goto(
                                    `/dashboard/patients/${patient.cedula}/consultas/nueva`,
                                )}
                        >
                            <ClipboardPlus size={18} />
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
                <div class="form-group">
                    <label for="name">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        bind:value={formData.nombre}
                        class="input"
                    />
                </div>
                <div class="form-group">
                    <label for="lastname">Apellido</label>
                    <input
                        id="lastname"
                        type="text"
                        bind:value={formData.apellido}
                        class="input"
                    />
                </div>
                <div class="form-group">
                    <label for="pid">Cédula</label>
                    <input
                        id="pid"
                        type="text"
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
    .icon-btn.add:hover {
        background-color: rgba(245, 158, 11, 0.1);
        color: #f59e0b; /* Ambar para destacar creación */
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
</style>
