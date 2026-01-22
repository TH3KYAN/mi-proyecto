<script>
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { AlertCircle, PlusIcon } from "lucide-svelte";

    // svelte-ignore export_let_unused
    export let data; // Recibe el ID del paciente desde la URL

    let patient = {
        name: "John Doe",
        patientId: "P-ID: 894321",
        room: "Habitación 402",
        lastSync: "Hace 5 minutos",
    };

    let vitals = [
        {
            name: "Frecuencia Cardíaca",
            value: "72 bpm",
            status: "NORMAL",
            statusColor: "#10b981",
            change: "+2%",
            changeDirection: "up",
            lastUpdate: "Hace 5 minutos",
            chartColor: "#10b981",
        },
        {
            name: "Presión arterial",
            value: "135/85 mmHg",
            status: "ELEVATED",
            statusColor: "#f59e0b",
            change: "-1%",
            changeDirection: "down",
            lastUpdate: "Hace 5 minutos",
            chartColor: "#f59e0b",
        },
        {
            name: "Temperatura",
            value: "37.0°C",
            status: "NORMAL",
            statusColor: "#10b981",
            change: "+0.5%",
            changeDirection: "up",
            lastUpdate: "Hace 5 minutos",
            chartColor: "#10b981",
        },
        {
            name: "Saturación de oxígeno",
            value: "92%",
            status: "CRITICO",
            statusColor: "#ef4444",
            change: "-5%",
            changeDirection: "down",
            lastUpdate: "Hace 5 minutos",
            chartColor: "#ef4444",
        },
    ];

    let showAddMetricModal = false;
</script>

<div class="monitor-container">
    <Sidebar />
    <!-- Header -->
    <div class="monitor-header">
        <div class="header-left">
            <span class="alert-icon"><AlertCircle size={24} /></span>
            <h1 class="header-title">Monitor de Signos Vitales</h1>
        </div>
        <div>
            <button class="add-metric-btn"
                ><PlusIcon size={24} /> Agregar nueva metrica
            </button>
        </div>
    </div>

    <!-- Patient Info -->
    <div class="patient-info">
        <h2 class="patient-name">
            {patient.name}, {patient.patientId}, {patient.room}
        </h2>
        <div class="patient-details">
            <span class="sync-status"
                >Ultima actualización: {patient.lastSync}</span
            >
        </div>
    </div>

    <!-- Vitals Grid -->
    <div class="vitals-grid">
        {#each vitals as vital}
            <div
                class="vital-card"
                class:critical={vital.status === "CRITICO"}
                class:elevated={vital.status === "ELEVADO"}
            >
                <div class="vital-header">
                    <span class="vital-name">{vital.name}</span>
                    <span
                        class="vital-status status-{vital.status.toLowerCase()}"
                        >{vital.status}</span
                    >
                </div>

                <div class="vital-value">{vital.value}</div>

                <div
                    class="vital-change"
                    class:change-up={vital.changeDirection === "UP"}
                    class:change-down={vital.changeDirection === "DOWN"}
                >
                    <span>{vital.changeDirection === "UP" ? "↑" : "↓"}</span>
                    <span>{vital.change}</span>
                    <span style="color: var(--text-secondary);"
                        >{vital.lastUpdate}</span
                    >
                </div>

                <div class="vital-chart" style="color: {vital.chartColor}">
                    <div class="chart-line"></div>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .monitor-container {
        padding: var(--spacing-2xl);
        background-color: var(--bg-secondary);
        min-height: 100vh;
    }

    .monitor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-xl);
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .alert-icon {
        font-size: 1.5rem;
    }

    .header-title {
        font-size: 1.5rem;
        font-weight: 700;
    }

    .patient-info {
        margin-bottom: var(--spacing-xl);
    }

    .patient-name {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: var(--spacing-xs);
    }

    .patient-details {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .sync-status {
        color: var(--color-primary);
        font-weight: 500;
    }

    .add-metric-btn {
        padding: var(--spacing-sm) var(--spacing-lg);
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .add-metric-btn:hover {
        background-color: var(--color-primary-dark);
    }

    .vitals-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--spacing-lg);
    }

    .vital-card {
        background-color: white;
        padding: var(--spacing-lg);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
    }

    .vital-card.critical {
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    }

    .vital-card.elevated {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    }

    .vital-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
    }

    .vital-name {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--gray-700);
    }

    .vital-status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.625rem;
        font-weight: 700;
        letter-spacing: 0.5px;
    }

    .status-normal {
        background-color: #d1fae5;
        color: #065f46;
    }

    .status-elevated {
        background-color: #fef3c7;
        color: #92400e;
    }

    .status-critical {
        background-color: #fee2e2;
        color: #991b1b;
    }

    .vital-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: var(--spacing-sm);
    }

    .vital-change {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: 0.75rem;
        margin-bottom: var(--spacing-lg);
    }

    .change-up {
        color: #dc2626;
    }

    .change-down {
        color: #10b981;
    }

    .vital-chart {
        width: 100%;
        height: 100px;
        background: linear-gradient(
            180deg,
            rgba(16, 185, 129, 0.1) 0%,
            rgba(16, 185, 129, 0.3) 100%
        );
        border-radius: var(--radius-md);
        position: relative;
        overflow: hidden;
    }

    .chart-line {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60%;
        background-image: linear-gradient(
                to right,
                transparent 50%,
                currentColor 50%
            ),
            linear-gradient(to bottom, currentColor 2px, transparent 2px);
        background-size:
            20px 100%,
            100% 20px;
        opacity: 0.3;
    }
</style>
