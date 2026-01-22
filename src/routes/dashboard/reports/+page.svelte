<script>
    import {
        BarChart3,
        Download,
        Activity,
        Thermometer,
        Droplets,
        Heart,
        ChevronLeft,
        ChevronRight,
        Table as TableIcon,
        Layout as LayoutIcon,
        Calendar as CalendarIcon,
    } from "lucide-svelte";

    /**
     * NOTA SOBRE CONEXIÓN A BASE DE DATOS:
     * Para conectar esto a una base de datos real en SvelteKit, seguirías estos pasos:
     * 1. Crearías un archivo '+page.server.js' en esta misma carpeta.
     * 2. En ese archivo, exportarías una función 'load' que use una librería como Prisma o fetch para traer los datos.
     * 3. SvelteKit pasaría esos datos automáticamente a este componente a través de la prop 'export let data;'.
     *
     * Ejemplo de cómo se vería la prop:
     * export let data;
     */

    // Datos hardcodeados (estáticos) para demostración
    const patients = ["John Doe", "Maria Garcia", "David Johnson"];

    let selectedPatient = patients[0];
    let selectedDate = new Date();

    let vitalSigns = {
        heartRate: true,
        bloodPressure: true,
        oxygenSaturation: true,
        temperature: true,
    };

    let viewMode = "chart"; // 'chart' o 'table'
    let chartData = generateSampleData();
    let isCapturing = false;
    /** @type {any} */
    let captureInterval = null;

    function generateSampleData() {
        return Array.from({ length: 12 }, (_, i) => ({
            time: `${i * 2}h`,
            heartRate: 60 + Math.floor(Math.random() * 40),
            bloodPressure: 110 + Math.floor(Math.random() * 30),
            oxygen: 94 + Math.floor(Math.random() * 6),
            temp: 36.5 + Math.random() * 1.5,
        }));
    }

    function generateReport() {
        if (isCapturing) return;

        isCapturing = true;
        chartData = []; // Limpiamos los datos anteriores
        let pointCount = 0;
        const totalPoints = 12;

        if (captureInterval) clearInterval(captureInterval);

        captureInterval = setInterval(() => {
            if (pointCount >= totalPoints) {
                clearInterval(captureInterval);
                isCapturing = false;
                return;
            }

            // Simulamos la llegada de un nuevo punto de datos
            const newPoint = {
                time: `${pointCount * 2}h`,
                heartRate: 60 + Math.floor(Math.random() * 40),
                bloodPressure: 110 + Math.floor(Math.random() * 30),
                oxygen: 94 + Math.floor(Math.random() * 6),
                temp: 36.5 + Math.random() * 1.5,
            };

            chartData = [...chartData, newPoint];
            pointCount++;
        }, 500); // Cada 500ms captamos un nuevo dato
    }

    function downloadReport() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent +=
            "Hora,Frecuencia Cardiaca,Presion Arterial,Oxigeno,Temperatura\n";
        chartData.forEach((row) => {
            csvContent += `${row.time},${row.heartRate},${row.bloodPressure},${row.oxygen},${row.temp.toFixed(1)}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
            "download",
            `reporte_${selectedPatient.toLowerCase().replace(" ", "_")}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
</script>

<div class="reports-container">
    <!-- Header -->
    <div class="page-header">
        <div class="header-left">
            <BarChart3 size={32} class="header-icon" />
            <h1 class="page-title">Reportes de Pacientes</h1>
        </div>
        <button
            class="generate-btn"
            on:click={generateReport}
            class:capturing={isCapturing}
            disabled={isCapturing}
        >
            <Activity size={20} class={isCapturing ? "pulse" : ""} />
            {isCapturing ? "Capturando datos..." : "Generar Reporte"}
        </button>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
        <!-- Sidebar -->
        <div class="sidebar">
            <!-- Select Patient -->
            <div class="form-section">
                <div class="section-title">Seleccionar Paciente</div>
                <select class="form-select" bind:value={selectedPatient}>
                    {#each patients as patient}
                        <option value={patient}>{patient}</option>
                    {/each}
                </select>
            </div>

            <!-- Date Range Calendar -->
            <div class="form-section">
                <div class="section-title">Rango de Fechas</div>
                <div class="calendar">
                    <div class="calendar-header">
                        <button class="calendar-nav"
                            ><ChevronLeft size={18} /></button
                        >
                        <span class="calendar-month">Diciembre 2023</span>
                        <button class="calendar-nav"
                            ><ChevronRight size={18} /></button
                        >
                    </div>
                    <div class="calendar-grid">
                        {#each ["D", "L", "M", "M", "J", "V", "S"] as day}
                            <div class="calendar-day-header">{day}</div>
                        {/each}
                        {#each Array(17) as _, i}
                            <div
                                class="calendar-day"
                                class:selected={i === 4 || i === 9}
                            >
                                {i < 3 ? "" : i - 2}
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Vital Signs to Include -->
            <div class="form-section">
                <div class="section-title">Signos Vitales a Incluir</div>
                <div class="checkbox-group">
                    <label class="checkbox-item">
                        <input
                            type="checkbox"
                            bind:checked={vitalSigns.heartRate}
                        />
                        <Heart size={16} color="#ef4444" />
                        <span>Frecuencia Cardíaca</span>
                    </label>
                    <label class="checkbox-item">
                        <input
                            type="checkbox"
                            bind:checked={vitalSigns.bloodPressure}
                        />
                        <Activity size={16} color="#3b82f6" />
                        <span>Presión Arterial</span>
                    </label>
                    <label class="checkbox-item">
                        <input
                            type="checkbox"
                            bind:checked={vitalSigns.oxygenSaturation}
                        />
                        <Droplets size={16} color="#10b981" />
                        <span>Saturación de Oxígeno</span>
                    </label>
                    <label class="checkbox-item">
                        <input
                            type="checkbox"
                            bind:checked={vitalSigns.temperature}
                        />
                        <Thermometer size={16} color="#f59e0b" />
                        <span>Temperatura</span>
                    </label>
                </div>
            </div>
        </div>

        <!-- Report View -->
        <div class="report-view">
            <!-- View Toolbar -->
            <div class="view-toolbar">
                <div class="view-tabs">
                    <button
                        class="view-tab"
                        class:active={viewMode === "chart"}
                        on:click={() => (viewMode = "chart")}
                    >
                        <LayoutIcon size={18} /> Vista de Gráfico
                    </button>
                    <button
                        class="view-tab"
                        class:active={viewMode === "table"}
                        on:click={() => (viewMode = "table")}
                    >
                        <TableIcon size={18} /> Vista de Tabla
                    </button>
                </div>

                <button class="download-btn" on:click={downloadReport}>
                    <Download size={18} /> Descargar CSV
                </button>
            </div>

            <!-- Report Content -->
            <div class="report-header">
                <h2 class="report-title">
                    Análisis de Tendencias para {selectedPatient}
                </h2>
                <p class="report-date-range">
                    <CalendarIcon
                        size={14}
                        style="display: inline; vertical-align: middle;"
                    /> 5 de Diciembre, 2023 - 10 de Diciembre, 2023
                </p>
            </div>

            <div class="chart-container">
                {#if isCapturing}
                    <div class="capture-overlay">
                        <div class="capture-status">
                            <Activity size={48} class="pulse" />
                            <h3>Recibiendo datos del hardware...</h3>
                            <p>
                                Procesando signos vitales del paciente en tiempo
                                real
                            </p>
                            <div class="progress-bar">
                                <div
                                    class="progress-fill"
                                    style="width: {(chartData.length / 12) *
                                        100}%"
                                ></div>
                            </div>
                        </div>
                    </div>
                {/if}

                {#if viewMode === "chart"}
                    <svg viewBox="0 0 800 400" class="main-chart">
                        {#each Array(5) as _, i}
                            {@const y = 350 - i * 75}
                            <line
                                x1="50"
                                y1={y}
                                x2="750"
                                y2={y}
                                stroke="#f1f5f9"
                                stroke-width="1"
                            />
                            <text
                                x="40"
                                y={y + 5}
                                text-anchor="end"
                                font-size="10"
                                fill="#94a3b8">{i * 50}</text
                            >
                        {/each}
                        <line
                            x1="50"
                            y1="350"
                            x2="750"
                            y2="350"
                            stroke="#cbd5e1"
                            stroke-width="2"
                        />
                        {#each chartData as d, i}
                            {@const x = 50 + i * 63.6}
                            <text
                                {x}
                                y="375"
                                text-anchor="middle"
                                font-size="10"
                                fill="#64748b">{d.time}</text
                            >
                        {/each}

                        {#if vitalSigns.heartRate}
                            <path
                                d={`M ${chartData.map((d, i) => `${50 + i * 63.6},${350 - (d.heartRate / 200) * 300}`).join(" L ")}`}
                                fill="none"
                                stroke="#ef4444"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            {#each chartData as d, i}
                                <circle
                                    cx={50 + i * 63.6}
                                    cy={350 - (d.heartRate / 200) * 300}
                                    r="4"
                                    fill="#ef4444"
                                />
                            {/each}
                        {/if}

                        {#if vitalSigns.bloodPressure}
                            <path
                                d={`M ${chartData.map((d, i) => `${50 + i * 63.6},${350 - (d.bloodPressure / 200) * 300}`).join(" L ")}`}
                                fill="none"
                                stroke="#3b82f6"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            {#each chartData as d, i}
                                <circle
                                    cx={50 + i * 63.6}
                                    cy={350 - (d.bloodPressure / 200) * 300}
                                    r="4"
                                    fill="#3b82f6"
                                />
                            {/each}
                        {/if}

                        {#if vitalSigns.oxygenSaturation}
                            <path
                                d={`M ${chartData.map((d, i) => `${50 + i * 63.6},${350 - (d.oxygen / 200) * 300}`).join(" L ")}`}
                                fill="none"
                                stroke="#10b981"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            {#each chartData as d, i}
                                <circle
                                    cx={50 + i * 63.6}
                                    cy={350 - (d.oxygen / 200) * 300}
                                    r="4"
                                    fill="#10b981"
                                />
                            {/each}
                        {/if}

                        {#if vitalSigns.temperature}
                            <path
                                d={`M ${chartData.map((d, i) => `${50 + i * 63.6},${350 - (d.temp / 200) * 300}`).join(" L ")}`}
                                fill="none"
                                stroke="#f59e0b"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            {#each chartData as d, i}
                                <circle
                                    cx={50 + i * 63.6}
                                    cy={350 - (d.temp / 200) * 300}
                                    r="4"
                                    fill="#f59e0b"
                                />
                            {/each}
                        {/if}
                    </svg>
                    <div class="chart-legend">
                        {#if vitalSigns.heartRate}
                            <div class="legend-item">
                                <span class="dot red"></span> FC (bpm)
                            </div>
                        {/if}
                        {#if vitalSigns.bloodPressure}
                            <div class="legend-item">
                                <span class="dot blue"></span> PA (mmHg)
                            </div>
                        {/if}
                        {#if vitalSigns.oxygenSaturation}
                            <div class="legend-item">
                                <span class="dot green"></span> SpO2 (%)
                            </div>
                        {/if}
                        {#if vitalSigns.temperature}
                            <div class="legend-item">
                                <span class="dot yellow"></span> Temp (°C)
                            </div>
                        {/if}
                    </div>
                {:else}
                    <div class="table-view">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Hora</th>
                                    <th>FC</th>
                                    <th>PA</th>
                                    <th>SpO2</th>
                                    <th>Temp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each chartData as d}
                                    <tr>
                                        <td>{d.time}</td>
                                        <td>{d.heartRate} bpm</td>
                                        <td>{d.bloodPressure} mmHg</td>
                                        <td>{d.oxygen}%</td>
                                        <td>{d.temp.toFixed(1)}°C</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .reports-container {
        padding: var(--spacing-2xl);
    }

    .page-header {
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

    .page-title {
        font-size: 2rem;
        font-weight: 700;
    }

    .generate-btn {
        padding: var(--spacing-sm) var(--spacing-xl);
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        transition: all 0.2s;
    }

    .generate-btn:hover:not(:disabled) {
        background-color: var(--color-primary-dark);
        transform: translateY(-1px);
    }

    .generate-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        background-color: var(--color-gray-400);
    }

    @keyframes pulse {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.5;
            transform: scale(1.1);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    .capture-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        border-radius: var(--radius-md);
        backdrop-filter: blur(2px);
    }

    .capture-status {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md);
        color: var(--color-primary);
    }

    .progress-bar {
        width: 200px;
        height: 6px;
        background-color: var(--color-gray-200);
        border-radius: 3px;
        overflow: hidden;
        margin-top: var(--spacing-sm);
    }

    .progress-fill {
        height: 100%;
        background-color: var(--color-primary);
        transition: width 0.3s ease-out;
    }

    .content-grid {
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: var(--spacing-xl);
    }

    .sidebar {
        background-color: white;
        padding: var(--spacing-xl);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        height: fit-content;
    }

    .form-section {
        margin-bottom: var(--spacing-xl);
    }

    .form-section:last-child {
        margin-bottom: 0;
    }

    .section-title {
        font-weight: 600;
        font-size: 0.875rem;
        margin-bottom: var(--spacing-md);
        color: var(--gray-900);
    }

    .form-select {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        background-color: white;
        margin-bottom: var(--spacing-md);
    }

    .calendar {
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        margin-bottom: var(--spacing-md);
    }

    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
    }

    .calendar-nav {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        color: var(--gray-600);
    }

    .calendar-month {
        font-weight: 600;
    }

    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
    }

    .calendar-day-header {
        text-align: center;
        font-size: 0.75rem;
        color: var(--text-secondary);
        padding: 4px;
    }

    .calendar-day {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
    }

    .calendar-day:hover {
        background-color: var(--color-gray-100);
    }

    .calendar-day.selected {
        background-color: var(--color-primary);
        color: white;
    }

    .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .checkbox-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        user-select: none;
        cursor: pointer;
    }

    .checkbox-item input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }

    .report-view {
        background-color: white;
        padding: var(--spacing-xl);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
    }

    .view-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-xl);
    }

    .view-tabs {
        display: flex;
        gap: var(--spacing-sm);
    }

    .view-tab {
        padding: var(--spacing-sm) var(--spacing-lg);
        background-color: white;
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        transition: all 0.2s;
    }

    .view-tab.active {
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }

    .download-btn {
        padding: var(--spacing-sm) var(--spacing-lg);
        background-color: white;
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        transition: all 0.2s;
    }

    .download-btn:hover {
        background-color: var(--color-gray-50);
        border-color: var(--color-primary);
        color: var(--color-primary);
    }

    .report-header {
        margin-bottom: var(--spacing-xl);
    }

    .report-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: var(--spacing-xs);
    }

    .report-date-range {
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .chart-container {
        width: 100%;
        min-height: 400px;
        background: linear-gradient(180deg, #f9fafb 0%, white 100%);
        border: 1px solid var(--color-gray-200);
        border-radius: var(--radius-md);
        padding: var(--spacing-lg);
        position: relative;
    }

    .main-chart {
        width: 100%;
        height: auto;
        overflow: visible;
    }

    .chart-legend {
        display: flex;
        justify-content: center;
        gap: var(--spacing-xl);
        margin-top: var(--spacing-lg);
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }

    .dot.red {
        background-color: #ef4444;
    }
    .dot.blue {
        background-color: #3b82f6;
    }

    .dot.green {
        background-color: #10b981;
    }

    .dot.yellow {
        background-color: #f59e0b;
    }

    .table-view {
        padding: var(--spacing-md);
        overflow-x: auto;
    }

    .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
    }

    .data-table th {
        text-align: left;
        padding: var(--spacing-md);
        background-color: var(--gray-50);
        color: var(--text-secondary);
        font-weight: 600;
        border-bottom: 1px solid var(--color-gray-200);
    }

    .data-table td {
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--color-gray-100);
    }

    .data-table tr:hover {
        background-color: #f1f5f9;
    }

    /* --- RESPONSIVENESS --- */
    @media (max-width: 1024px) {
        .content-grid {
            grid-template-columns: 1fr; /* Stack sidebar on tablet/mobile */
        }

        .sidebar {
            order: 2; /* Sidebar below chart on tablet */
        }

        .report-view {
            order: 1;
        }
    }

    @media (max-width: 768px) {
        .reports-container {
            padding: var(--spacing-md);
        }

        .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
        }

        .generate-btn {
            width: 100%;
            justify-content: center;
        }

        .view-toolbar {
            flex-direction: column;
            gap: var(--spacing-md);
            align-items: stretch;
        }

        .view-tabs {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }

        .view-tab {
            justify-content: center;
        }

        .download-btn {
            justify-content: center;
        }

        .chart-container {
            min-height: 300px;
            padding: var(--spacing-sm);
            overflow-x: auto; /* Permite scroll horizontal si la gráfica es muy ancha */
        }

        .main-chart {
            min-width: 600px; /* Asegura legibilidad de la gráfica */
        }

        .chart-legend {
            flex-wrap: wrap;
            gap: var(--spacing-md);
        }

        /* Ajustes para la tabla en móvil */
        .data-table th:nth-child(4),
        .data-table td:nth-child(4),
        .data-table th:nth-child(5),
        .data-table td:nth-child(5) {
            display: none; /* Ocultar SpO2 y Temp en tablas muy pequeñas */
        }
    }

    @media (max-width: 480px) {
        .sidebar {
            padding: var(--spacing-lg);
        }

        .calendar-grid {
            gap: 2px;
        }

        .calendar-day {
            font-size: 0.75rem;
        }
    }
</style>
