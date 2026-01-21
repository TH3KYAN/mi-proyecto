<script>
    import {
        Search,
        Filter,
        Plus,
        X,
        Trash2,
        Save,
        Edit2,
        CheckCircle,
    } from "lucide-svelte";

    // --- MOCK DATA (Traducida) ---
    let alerts = [
        {
            id: 1,
            severity: "Crítica",
            patient: "John Smith (Hab 201A)",
            details: "Frecuencia Cardíaca Baja - 45 bpm",
            time: "2:14 PM",
        },
        {
            id: 2,
            severity: "Crítica",
            patient: "Maria Garcia (Hab 305B)",
            details: "SpO2 Bajo - 88%",
            time: "2:12 PM",
        },
        {
            id: 3,
            severity: "Alta",
            patient: "Robert Johnson (Hab 203A)",
            details: "Presión Arterial Alta - 160/100 mmHg",
            time: "2:11 PM",
        },
        {
            id: 4,
            severity: "Alta",
            patient: "Emily Davis (Hab 410C)",
            details: "Frecuencia Respiratoria Alta - 25 rpm",
            time: "2:09 PM",
        },
        {
            id: 5,
            severity: "Media",
            patient: "David Wilson (Hab 302B)",
            details: "Temperatura Alta - 38.6°C",
            time: "2:05 PM",
        },
    ];

    // --- ESTADOS Y VARIABLES ---
    let searchQuery = "";
    let showModal = false;
    let isEditing = false;
    let isLoading = false;

    // Datos del formulario
    let formData = {
        id: null,
        patient: "",
        severity: "Media",
        details: "",
        time: "",
    };

    // Contadores reactivos
    $: criticalCount = alerts.filter((a) => a.severity === "Crítica").length;
    $: highCount = alerts.filter((a) => a.severity === "Alta").length;
    $: mediumCount = alerts.filter((a) => a.severity === "Media").length;

    // Filtro de búsqueda
    $: filteredAlerts = alerts.filter(
        (alert) =>
            alert.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.details.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // --- FUNCIONES AUXILIARES ---
    // @ts-ignore
    function getSeverityColor(severity) {
        const colors = {
            Crítica: { bg: "#fee2e2", text: "#dc2626" },
            Alta: { bg: "#fed7aa", text: "#ea580c" },
            Media: { bg: "#fef3c7", text: "#d97706" },
        };
        // @ts-ignore
        return colors[severity] || { bg: "#e5e7eb", text: "#6b7280" };
    }

    function getCurrentTime() {
        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // --- GESTIÓN DEL MODAL ---
    function openCreateModal() {
        isEditing = false;
        formData = {
            id: null,
            patient: "",
            severity: "Media",
            details: "",
            time: getCurrentTime(),
        };
        showModal = true;
    }

    // @ts-ignore
    function openEditModal(alert) {
        isEditing = true;
        formData = { ...alert }; // Copia para no mutar directamente
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    // --- LÓGICA CRUD (MOCK - LISTA PARA BD) ---

    // 1. Guardar (Crear o Editar)
    async function handleSaveAlert() {
        if (!formData.patient || !formData.details) return;

        isLoading = true;
        try {
            if (isEditing) {
                // TODO: Conectar a Supabase -> await supabase.from('alerts').update(formData).eq('id', formData.id)
                // @ts-ignore
                alerts = alerts.map((a) =>
                    a.id === formData.id ? { ...formData } : a,
                );
                console.log("Alerta actualizada:", formData);
            } else {
                // TODO: Conectar a Supabase -> await supabase.from('alerts').insert(formData)
                const newAlert = { ...formData, id: Date.now() }; // ID temporal
                alerts = [newAlert, ...alerts]; // Añadir al principio
                console.log("Alerta creada:", newAlert);
            }
            closeModal();
        } catch (error) {
            console.error("Error al guardar:", error);
        } finally {
            isLoading = false;
        }
    }

    // 2. Eliminar (Desde el modal de edición)
    async function handleDeleteAlert() {
        if (!confirm("¿Estás seguro de eliminar esta alerta permanentemente?"))
            return;

        isLoading = true;
        try {
            // TODO: Conectar a Supabase -> await supabase.from('alerts').delete().eq('id', formData.id)
            alerts = alerts.filter((a) => a.id !== formData.id);
            closeModal();
        } catch (error) {
            console.error("Error al eliminar:", error);
        } finally {
            isLoading = false;
        }
    }

    // 3. Reconocer (Acción rápida en tabla - Podría ser un Soft Delete o Update Status)
    // @ts-ignore
    async function handleAcknowledge(alertId) {
        // TODO: Lógica para marcar como "vista" o "resuelta" en BD
        alerts = alerts.filter((a) => a.id !== alertId);
        console.log("Alerta reconocida y archivada:", alertId);
    }
</script>

<div class="page-container">
    <div class="header-row">
        <h1 class="page-title">Alertas de Signos Vitales</h1>
        <button class="add-btn" on:click={openCreateModal}>
            <Plus size={20} /> Nueva Alerta
        </button>
    </div>

    <div class="stats-grid">
        <div class="stat-card critical">
            <div class="stat-label">Alertas Críticas</div>
            <div class="stat-value">{criticalCount}</div>
        </div>

        <div class="stat-card high">
            <div class="stat-label">Prioridad Alta</div>
            <div class="stat-value">{highCount}</div>
        </div>

        <div class="stat-card medium">
            <div class="stat-label">Prioridad Media</div>
            <div class="stat-value">{mediumCount}</div>
        </div>
    </div>

    <div class="toolbar">
        <div class="filter-btns">
            <button class="filter-btn"><Filter size={18} /></button>
        </div>

        <div class="search-box">
            <span class="search-icon"><Search size={18} /></span>
            <input
                type="text"
                class="search-input"
                placeholder="Buscar paciente o detalles..."
                bind:value={searchQuery}
            />
        </div>
    </div>

    <div class="alerts-container">
        <div class="table-header">
            <div>SEVERIDAD</div>
            <div>PACIENTE</div>
            <div>DETALLES DE ALERTA</div>
            <div>HORA</div>
            <div>ACCIONES</div>
        </div>

        {#each filteredAlerts as alert (alert.id)}
            <div class="alert-row">
                <div>
                    <span
                        class="severity-badge"
                        style="background-color: {getSeverityColor(
                            alert.severity,
                        ).bg}; color: {getSeverityColor(alert.severity).text};"
                    >
                        {alert.severity}
                    </span>
                </div>

                <div class="patient-name">{alert.patient}</div>

                <div class="alert-details">{alert.details}</div>

                <div class="time">{alert.time}</div>

                <div class="actions-cell">
                    <button
                        class="icon-btn edit"
                        title="Editar"
                        on:click={() => openEditModal(alert)}
                    >
                        <Edit2 size={18} />
                    </button>

                    <button
                        class="acknowledge-btn"
                        on:click={() => handleAcknowledge(alert.id)}
                    >
                        <CheckCircle size={16} /> Completada
                    </button>
                </div>
            </div>
        {/each}
    </div>
</div>

{#if showModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-backdrop" on:click|self={closeModal}>
        <div class="modal-content">
            <div class="modal-header">
                <h2>{isEditing ? "Editar Alerta" : "Crear Nueva Alerta"}</h2>
                <button class="close-btn-modal" on:click={closeModal}
                    ><X size={20} /></button
                >
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label for="patient">Paciente (y Habitación)</label>
                    <input
                        id="patient"
                        type="text"
                        bind:value={formData.patient}
                        placeholder="Ej: Juan Perez (Hab 101)"
                        class="form-input"
                    />
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="severity">Severidad</label>
                        <select
                            id="severity"
                            bind:value={formData.severity}
                            class="form-input"
                        >
                            <option value="Crítica">Crítica</option>
                            <option value="Alta">Alta</option>
                            <option value="Media">Media</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="time">Hora</label>
                        <input
                            id="time"
                            type="text"
                            bind:value={formData.time}
                            class="form-input"
                        />
                    </div>
                </div>

                <div class="form-group">
                    <label for="details">Detalles de la Alerta</label>
                    <textarea
                        id="details"
                        bind:value={formData.details}
                        placeholder="Describe el signo vital anormal..."
                        class="form-input"
                        rows="3"
                    ></textarea>
                </div>
            </div>

            <div class="modal-footer">
                {#if isEditing}
                    <button
                        class="delete-btn"
                        on:click={handleDeleteAlert}
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
                    on:click={handleSaveAlert}
                    disabled={isLoading}
                >
                    {#if isLoading}Guardando...{:else}<Save size={16} /> Guardar{/if}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .page-container {
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

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-2xl);
    }

    .stat-card {
        background-color: white;
        padding: var(--spacing-lg);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
    }

    .stat-card.critical {
        background-color: #fee2e2;
        border-left: 4px solid #dc2626;
    }
    .stat-card.high {
        background-color: #fed7aa;
        border-left: 4px solid #ea580c;
    }
    .stat-card.medium {
        background-color: #fef3c7;
        border-left: 4px solid #d97706;
    }

    .stat-label {
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: var(--spacing-sm);
    }
    .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
    }

    .toolbar {
        display: flex;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
    }

    .search-box {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
    }
    .search-icon {
        position: absolute;
        left: 12px;
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

    .filter-btns {
        display: flex;
        gap: var(--spacing-sm);
    }
    .filter-btn {
        padding: var(--spacing-sm);
        background-color: white;
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .alerts-container {
        background-color: white;
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        box-shadow: var(--shadow-sm);
    }

    .table-header {
        display: grid;
        grid-template-columns: 1fr 2fr 2.5fr 1fr 1.5fr;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--text-secondary);
        border-bottom: 1px solid var(--color-gray-200);
    }

    .alert-row {
        display: grid;
        grid-template-columns: 1fr 2fr 2.5fr 1fr 1.5fr;
        gap: var(--spacing-md);
        padding: var(--spacing-lg) var(--spacing-md);
        align-items: center;
        border-bottom: 1px solid var(--color-gray-200);
    }

    .alert-row:hover {
        background-color: var(--color-gray-50);
    }

    .severity-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .patient-name {
        font-weight: 600;
        font-size: 0.875rem;
    }
    .alert-details {
        font-size: 0.875rem;
        color: #374151;
    }
    .time {
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .actions-cell {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .acknowledge-btn {
        padding: 6px 12px;
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: 0.75rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .acknowledge-btn:hover {
        background-color: var(--color-primary-dark);
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
        box-shadow: var(--shadow-xl);
        overflow: hidden;
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
        box-sizing: border-box; /* Importante para que no se salga */
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
