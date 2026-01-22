<script>
    import { goto } from "$app/navigation"; // Necesario para la redirección
    import {
        Search,
        // @ts-ignore
        Filter,
        Plus,
        X,
        Trash2,
        Save,
        Edit2,
        Activity,
    } from "lucide-svelte";

    // --- MOCK DATA (Traducida y con estructura para CRUD) ---
    let patients = [
        {
            id: "P73-001",
            name: "John Smith",
            avatar: "",
            status: "Crítico",
            lastReading: "Frecuencia Cardíaca: 120 bpm, hace 2 min",
        },
        {
            id: "P73-002",
            name: "Maria Garcia",
            avatar: "",
            status: "Estable",
            lastReading: "PA: 120/80 mmHg, hace 15 min",
        },
        {
            id: "P73-003",
            name: "David Johnson",
            avatar: "",
            status: "Requiere Atención",
            lastReading: "SpO2: 92%, hace 5 min",
        },
        {
            id: "P73-004",
            name: "Emily White",
            avatar: "",
            status: "Estable",
            lastReading: "Temp: 37°C, hace 30 min",
        },
        {
            id: "P73-005",
            name: "Michael Brown",
            avatar: "",
            status: "Alta Médica",
            lastReading: "PA: 118/76 mmHg, hace 1 día",
        },
    ];

    // --- ESTADOS Y VARIABLES ---
    let searchQuery = "";
    let statusFilter = "all";
    let sortBy = "name";

    // Variables para el Modal y CRUD
    let showModal = false;
    let isEditing = false;
    let isLoading = false;

    let formData = {
        id: "",
        name: "",
        status: "Estable",
        lastReading: "",
    };

    // --- LÓGICA DE FILTRADO ---
    $: filteredPatients = patients.filter((patient) => {
        const matchesSearch =
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || patient.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // --- FUNCIONES AUXILIARES ---
    // @ts-ignore
    function getStatusColor(status) {
        const colors = {
            Crítico: "#ef4444",
            "Requiere Atención": "#f59e0b",
            Estable: "#10b981",
            "Alta Médica": "#6b7280",
        };
        // @ts-ignore
        return colors[status] || "#6b7280";
    }

    // @ts-ignore
    function getInitials(name) {
        return (
            name
                .split(" ")
                // @ts-ignore
                .map((n) => n[0])
                .join("")
        );
    }

    // --- FUNCIONES CRUD Y NAVEGACIÓN ---

    // 1. Redirigir al historial del paciente
    // @ts-ignore
    function handleViewVitals(patientId) {
        // Redirige a una ruta dinámica, ej: /dashboard/patients/P73-001
        goto(`/dashboard/patients/${patientId}`);
    }

    // 2. Abrir Modales
    function openCreateModal() {
        isEditing = false;
        // Generamos un ID aleatorio simple para el ejemplo
        const randomId = "P73-" + Math.floor(Math.random() * 900 + 100);
        formData = {
            id: randomId,
            name: "",
            status: "Estable",
            lastReading: "Sin registros recientes",
        };
        showModal = true;
    }

    // @ts-ignore
    function openEditModal(patient) {
        isEditing = true;
        formData = { ...patient };
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    // 3. Guardar (Crear / Editar)
    async function handleSavePatient() {
        if (!formData.name) return;

        isLoading = true;
        try {
            if (isEditing) {
                // TODO: Conectar la bdd
                // @ts-ignore
                patients = patients.map((p) =>
                    p.id === formData.id ? { ...formData } : p,
                );
                console.log("Paciente actualizado:", formData);
            } else {
                // TODO: Conectar a la bdd
                // @ts-ignore
                patients = [formData, ...patients];
                console.log("Paciente creado:", formData);
            }
            closeModal();
        } catch (error) {
            console.error("Error al guardar:", error);
        } finally {
            isLoading = false;
        }
    }

    // 4. Eliminar
    async function handleDeletePatient() {
        if (!confirm(`¿Estás seguro de eliminar al paciente ${formData.name}?`))
            return;

        isLoading = true;
        try {
            // TODO: Conectar a la bdd
            patients = patients.filter((p) => p.id !== formData.id);
            closeModal();
        } catch (error) {
            console.error("Error al eliminar:", error);
        } finally {
            isLoading = false;
        }
    }
</script>

<!-- UI -->
<div class="patients-container">
    <!-- Header -->
    <div class="header-row">
        <h1 class="page-title">Pacientes</h1>
        <button class="add-btn" on:click={openCreateModal}>
            <Plus size={20} /> Nuevo Paciente
        </button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
        <div class="search-box">
            <span class="search-icon"><Search size={18} /></span>
            <input
                type="text"
                class="search-input"
                placeholder="Buscar por nombre o ID..."
                bind:value={searchQuery}
            />
        </div>

        <select class="filter-select" bind:value={statusFilter}>
            <option value="all">Estado: Todos</option>
            <option value="Crítico">Crítico</option>
            <option value="Requiere Atención">Requiere Atención</option>
            <option value="Estable">Estable</option>
            <option value="Alta Médica">Alta Médica</option>
        </select>

        <select class="filter-select" bind:value={sortBy}>
            <option value="name">Ordenar por Nombre</option>
            <option value="status">Ordenar por Estado</option>
            <option value="recent">Recientes</option>
        </select>
    </div>

    <!-- Patients Table -->
    <div class="patients-table">
        <div class="table-header">
            <div>PACIENTE</div>
            <div>ESTADO</div>
            <div>ÚLTIMA LECTURA</div>
            <div>ACCIONES</div>
        </div>

        <!-- Patients List -->
        {#each filteredPatients as patient (patient.id)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="patient-row" on:click={() => openEditModal(patient)}>
                <div class="patient-info">
                    <div class="patient-avatar">
                        {getInitials(patient.name)}
                    </div>
                    <div class="patient-details">
                        <div class="patient-name">{patient.name}</div>
                        <div class="patient-id">ID: {patient.id}</div>
                    </div>
                </div>

                <!-- Status -->
                <div>
                    <span class="status-badge">
                        <span
                            class="status-dot"
                            style="background-color: {getStatusColor(
                                patient.status,
                            )}"
                        ></span>
                        {patient.status}
                    </span>
                </div>

                <!-- Last Reading -->
                <div class="last-reading">{patient.lastReading}</div>

                <!-- Actions -->
                <div class="actions-cell">
                    <button
                        class="view-btn"
                        on:click|stopPropagation={() =>
                            handleViewVitals(patient.id)}
                    >
                        <Activity size={16} style="margin-right: 6px;" /> Ver Signos
                    </button>

                    <!-- Edit Button -->
                    <button
                        class="icon-btn edit"
                        on:click|stopPropagation={() => openEditModal(patient)}
                    >
                        <Edit2 size={16} />
                    </button>
                </div>
            </div>
        {/each}

        <!-- Results Footer -->
        <div class="results-footer">
            <div>Mostrando {filteredPatients.length} resultados</div>
            <div class="pagination">
                <button class="page-btn">&lt;</button>
                <button class="page-btn">&gt;</button>
            </div>
        </div>
    </div>
</div>

{#if showModal}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="modal-backdrop" on:click|self={closeModal}>
        <div class="modal-content">
            <div class="modal-header">
                <h2>
                    {isEditing ? "Editar Paciente" : "Registrar Nuevo Paciente"}
                </h2>
                <button class="close-btn-modal" on:click={closeModal}
                    ><X size={20} /></button
                >
            </div>

            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Nombre Completo</label>
                        <input
                            id="name"
                            type="text"
                            bind:value={formData.name}
                            placeholder="Ej: Juan Perez"
                            class="form-input"
                        />
                    </div>
                    <div class="form-group">
                        <label for="pid">ID Paciente</label>
                        <input
                            id="pid"
                            type="text"
                            bind:value={formData.id}
                            class="form-input"
                            disabled={isEditing}
                        />
                    </div>
                </div>

                <div class="form-group">
                    <label for="status">Estado Actual</label>
                    <select
                        id="status"
                        bind:value={formData.status}
                        class="form-input"
                    >
                        <option value="Estable">Estable</option>
                        <option value="Requiere Atención"
                            >Requiere Atención</option
                        >
                        <option value="Crítico">Crítico</option>
                        <option value="Alta Médica">Alta Médica</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="reading"
                        >Nota de Última Lectura (Opcional)</label
                    >
                    <input
                        id="reading"
                        type="text"
                        bind:value={formData.lastReading}
                        placeholder="Ej: PA 120/80"
                        class="form-input"
                    />
                </div>
            </div>

            <div class="modal-footer">
                {#if isEditing}
                    <button
                        class="delete-btn"
                        on:click={handleDeletePatient}
                        disabled={isLoading}
                    >
                        <Trash2 size={16} /> Eliminar
                    </button>
                {/if}
                <div class="spacer"></div>
                <button class="cancel-btn" on:click={closeModal}
                    >Cancelar</button
                >
                <button
                    class="save-btn"
                    on:click={handleSavePatient}
                    disabled={isLoading}
                >
                    {#if isLoading}Guardando...{:else}<Save size={16} /> Guardar{/if}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .patients-container {
        padding: var(--spacing-2xl);
    }

    .header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-xl);
    }

    .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
    }

    .add-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: var(--color-primary);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        border: none;
        cursor: pointer;
        font-weight: 600;
    }

    .toolbar {
        display: flex;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
    }

    .search-box {
        flex: 1;
        position: relative;
    }

    .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-gray-400);
        pointer-events: none;
    }

    .search-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        padding-left: 40px;
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        background-color: white;
        outline: none;
    }
    .search-input:focus {
        border-color: var(--color-primary);
    }

    .filter-select {
        padding: var(--spacing-sm) var(--spacing-lg);
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        background-color: white;
        cursor: pointer;
    }

    .patients-table {
        background-color: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        overflow: hidden;
    }

    .table-header {
        display: grid;
        grid-template-columns: 2fr 1.5fr 2fr 1.5fr; /* Ajustado para botones */
        gap: var(--spacing-md);
        padding: var(--spacing-md) var(--spacing-lg);
        background-color: var(--color-gray-50);
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--text-secondary);
    }

    .patient-row {
        display: grid;
        grid-template-columns: 2fr 1.5fr 2fr 1.5fr; /* Ajustado para botones */
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        align-items: center;
        border-bottom: 1px solid var(--color-gray-200);
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .patient-row:hover {
        background-color: var(--color-gray-50);
    }

    .patient-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .patient-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.875rem;
        flex-shrink: 0;
    }

    .patient-details {
        flex: 1;
    }

    .patient-name {
        font-weight: 600;
        font-size: 0.875rem;
        margin-bottom: 2px;
    }

    .patient-id {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        background-color: rgba(0, 0, 0, 0.05);
    }

    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .last-reading {
        font-size: 0.875rem;
        color: var(--gray-700);
    }

    .actions-cell {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .view-btn {
        display: flex;
        align-items: center;
        padding: var(--spacing-xs) var(--spacing-md);
        background-color: transparent;
        color: var(--color-primary);
        border: 1px solid var(--color-primary);
        border-radius: var(--radius-md);
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .view-btn:hover {
        background-color: var(--color-primary);
        color: white;
    }

    .icon-btn {
        background: none;
        border: 1px solid var(--color-gray-300);
        padding: 6px;
        border-radius: var(--radius-md);
        cursor: pointer;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .icon-btn:hover {
        background-color: var(--color-gray-50);
        color: var(--color-primary);
    }

    .results-footer {
        padding: var(--spacing-md) var(--spacing-lg);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--color-gray-50);
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .pagination {
        display: flex;
        gap: var(--spacing-sm);
    }

    .page-btn {
        width: 32px;
        height: 32px;
        border: 1px solid var(--color-gray-300);
        background-color: white;
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .page-btn:hover {
        background-color: var(--color-gray-100);
    }

    /* --- RESPONSIVENESS --- */
    @media (max-width: 768px) {
        .patients-container {
            padding: var(--spacing-md);
        }

        .header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
        }

        .add-btn {
            width: 100%;
            justify-content: center;
        }

        .toolbar {
            flex-direction: column;
            gap: var(--spacing-sm);
        }

        .search-box {
            width: 100%;
        }

        .filter-select {
            width: 100%;
        }

        .table-header {
            display: none; /* Ocultar cabecera en móvil */
        }

        .patient-row {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
            padding: var(--spacing-lg);
            position: relative;
        }

        .patient-info {
            width: 100%;
        }

        .status-badge {
            margin-top: 4px;
        }

        .last-reading {
            width: 100%;
            font-size: 0.8125rem;
            color: var(--text-secondary);
        }

        .actions-cell {
            width: 100%;
            justify-content: space-between;
            border-top: 1px solid var(--color-gray-100);
            padding-top: var(--spacing-md);
            margin-top: var(--spacing-xs);
        }

        .view-btn {
            flex: 1;
            justify-content: center;
        }

        .results-footer {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
        }
    }

    /* ESTILOS DEL MODAL */
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(2px);
    }
    .modal-content {
        background: white;
        border-radius: var(--radius-lg);
        width: 100%;
        max-width: 500px;
        margin: var(--spacing-md); /* Margen en móvil */
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--shadow-xl);
    }
    .modal-header {
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--color-gray-200);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .modal-header h2 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #111827;
        margin: 0;
    }
    .close-btn-modal {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-secondary);
    }

    .modal-body {
        padding: var(--spacing-lg);
    }
    .form-group {
        margin-bottom: var(--spacing-md);
    }
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-md);
    }

    @media (max-width: 480px) {
        .form-row {
            grid-template-columns: 1fr;
        }
    }

    .form-group label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        font-size: 0.875rem;
        color: #374151;
    }
    .form-input {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        box-sizing: border-box;
    }
    .form-input:disabled {
        background-color: var(--color-gray-100);
        cursor: not-allowed;
    }
    .form-input:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    .modal-footer {
        padding: var(--spacing-md) var(--spacing-lg);
        background: var(--color-gray-50);
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
        flex-wrap: wrap; /* Envolver botones en pantallas muy pequeñas */
    }

    @media (max-width: 480px) {
        .modal-footer {
            flex-direction: column;
            align-items: stretch;
        }
        .modal-footer .spacer {
            display: none;
        }
    }
    .spacer {
        flex: 1;
    }

    .save-btn {
        background: var(--color-primary);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .cancel-btn {
        background: white;
        border: 1px solid var(--color-gray-300);
        padding: 8px 16px;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-weight: 500;
    }
    .delete-btn {
        background: #fee2e2;
        color: #ef4444;
        border: none;
        padding: 8px 16px;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .delete-btn:hover {
        background: #fecaca;
    }
</style>
