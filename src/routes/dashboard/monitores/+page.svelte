<script>
    // @ts-nocheck

    import { onMount, onDestroy } from "svelte";
    import { Activity, Thermometer, Clock, RefreshCw } from "lucide-svelte";

    /**
     * @type {string | any[] | null | undefined}
     */
    let dispositivos = [];
    let dispositivoSeleccionado = "";
    /**
     * @type {any[] | null | undefined}
     */
    let pacientes = [];
    let pacienteSeleccionado = "";
    /**
     * @type {{ timestamp: any; data: { temp1: number | undefined; temp2: number | undefined; }; } | null}
     */
    let isCapturing = false;
    let datosDispositivo = null;
    let cargando = true;
    /**
     * @type {string | null}
     */
    let error = null;
    /**
     * @type {number | any}
     */
    let intervaloPoll;

    // Obtener la lista de todos los dispositivos conectados
    async function cargarDispositivos() {
        try {
            cargando = true;
            error = null;
            const res = await fetch("/api/dispositivos");
            if (res.ok) {
                dispositivos = await res.json();
            } else {
                throw new Error("No se pudieron cargar los dispositivos");
            }
        } catch (err) {
            // @ts-ignore
            error = err.message;
        } finally {
            cargando = false;
        }
    }

    // Obtener la lista de pacientes registrados
    async function cargarPacientes() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/pacientes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                pacientes = await res.json();
            }
        } catch (err) {
            console.error("Error al cargar pacientes:", err);
        }
    }

    // Obtener los datos más recientes de un dispositivo específico
    async function actualizarDatosDispositivo() {
        if (!dispositivoSeleccionado) return;

        try {
            const res = await fetch(
                `/api/dispositivos/${dispositivoSeleccionado}`,
            );
            if (res.ok) {
                datosDispositivo = await res.json();
            } else if (res.status === 404) {
                // Dispositivo ya no disponible
                datosDispositivo = null;
            }
        } catch (err) {
            console.error("Error al actualizar datos del dispositivo:", err);
        }
    }

    /**
     * @param {string} mac
     */
    function seleccionarDispositivo(mac) {
        dispositivoSeleccionado = mac;
        datosDispositivo = null; // Limpiar datos anteriores mientras carga
    }

    function toggleCaptura() {
        if (isCapturing) {
            // Detener captura
            if (intervaloPoll) clearInterval(intervaloPoll);
            isCapturing = false;
        } else {
            // Iniciar captura
            if (!dispositivoSeleccionado || !pacienteSeleccionado) return;
            isCapturing = true;
            actualizarDatosDispositivo();
            intervaloPoll = setInterval(actualizarDatosDispositivo, 2000);
        }
    }

    onMount(() => {
        cargarDispositivos();
        cargarPacientes();
    });

    onDestroy(() => {
        if (intervaloPoll) clearInterval(intervaloPoll);
    });

    // Función auxiliar para formatear la fecha
    /**
     * @param {string | number | Date} timestamp
     */
    function formatearFecha(timestamp) {
        if (!timestamp) return "No disponible";
        return new Date(timestamp).toLocaleString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }
</script>

<div class="monitores-container">
    <header class="page-header">
        <div>
            <h1>Monitores de Dispositivos</h1>
            <p>Visualización en tiempo real de las lecturas captadas.</p>
        </div>
        <button
            class="btn-refresh"
            on:click={cargarDispositivos}
            disabled={cargando}
        >
            <RefreshCw size={18} class={cargando ? "spin" : ""} />
            Actualizar Lista
        </button>
    </header>

    <div class="monitor-controls panel">
        <div class="control-group">
            <label for="dispositivo" class="control-label"
                >Dispositivo de Monitoreo</label
            >
            <select
                id="dispositivo"
                bind:value={dispositivoSeleccionado}
                class="form-select"
                disabled={isCapturing}
            >
                {#if dispositivos.length === 0}
                    <option value="">no hay dispositivos enlazados</option>
                {:else}
                    <option value="" disabled>Seleccione un dispositivo</option>
                    {#each dispositivos as dispositivo}
                        <option value={dispositivo.mac}>
                            Monitor {dispositivo.mac.slice(-4)} ({dispositivo.mac})
                        </option>
                    {/each}
                {/if}
            </select>
        </div>

        <div class="control-group">
            <label for="paciente" class="control-label">Paciente Asignado</label
            >
            <select
                id="paciente"
                bind:value={pacienteSeleccionado}
                class="form-select"
                disabled={isCapturing}
            >
                <option value="" disabled>Seleccione un paciente</option>
                {#if pacientes.length === 0}
                    <option value="" disabled
                        >No hay pacientes registrados</option
                    >
                {:else}
                    {#each pacientes as paciente}
                        <option value={paciente.cedula}>
                            {paciente.nombre}
                            {paciente.apellido} - {paciente.cedula}
                        </option>
                    {/each}
                {/if}
            </select>
        </div>

        <div class="control-group action-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label class="control-label">&nbsp;</label>
            <button
                class="btn-capture {isCapturing ? 'btn-stop' : 'btn-start'}"
                on:click={toggleCaptura}
                disabled={!dispositivoSeleccionado || !pacienteSeleccionado}
            >
                {#if isCapturing}
                    Detener captura
                {:else}
                    Capturar datos
                {/if}
            </button>
        </div>
    </div>

    <!-- Panel Principal: Datos del Dispositivo -->
    <main class="device-data panel">
        {#if error}
            <div class="error-state">
                <p>{error}</p>
                <button class="btn-primary" on:click={cargarDispositivos}
                    >Intentar nuevamente</button
                >
            </div>
        {:else if !isCapturing}
            <div class="placeholder-state">
                <Activity size={48} />
                <p>
                    Seleccione un paciente y un dispositivo, luego presione <strong
                        >"Capturar datos"</strong
                    >.
                </p>
            </div>
        {:else if !datosDispositivo}
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Iniciando recepción de datos...</p>
            </div>
        {:else}
            <div class="data-header">
                <div>
                    <h2>Lecturas en Vivo</h2>
                    <p class="mac-subtitle">
                        Dispositivo: {dispositivoSeleccionado}
                        {#if pacienteSeleccionado}
                            <span class="patient-tag">
                                | Paciente: {pacientes.find(
                                    (p) => p.cedula === pacienteSeleccionado,
                                )?.nombre}
                                {pacientes.find(
                                    (p) => p.cedula === pacienteSeleccionado,
                                )?.apellido}
                            </span>
                        {/if}
                    </p>
                </div>
                <div class="last-update">
                    <Clock size={16} />
                    <span
                        >Última actualización: {formatearFecha(
                            datosDispositivo.timestamp,
                        )}</span
                    >
                </div>
            </div>

            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-icon primary">
                        <Thermometer size={24} color="white" />
                    </div>
                    <div class="metric-content">
                        <span class="metric-label">Temperatura 1</span>
                        <div class="metric-value">
                            {datosDispositivo.data.temp1 !== undefined
                                ? datosDispositivo.data.temp1.toFixed(1)
                                : "--.-"}
                            <span class="unit">°C</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card">
                    <div class="metric-icon secondary">
                        <Thermometer size={24} color="white" />
                    </div>
                    <div class="metric-content">
                        <span class="metric-label">Temperatura 2</span>
                        <div class="metric-value">
                            {datosDispositivo.data.temp2 !== undefined
                                ? datosDispositivo.data.temp2.toFixed(1)
                                : "--.-"}
                            <span class="unit">°C</span>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </main>
</div>

<style>
    .monitores-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        color: #1a1a2e;
        font-family: "Inter", system-ui, sans-serif;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 2rem;
        border-bottom: 1px solid #eaeaea;
        padding-bottom: 1rem;
    }

    h1 {
        font-size: 1.8rem;
        font-weight: 700;
        color: #10b981;
        margin: 0 0 0.25rem 0;
    }

    .page-header p {
        margin: 0;
        color: #64748b;
        font-size: 0.95rem;
    }

    .btn-refresh {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: white;
        border: 1px solid #cbd5e1;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-weight: 500;
        color: #475569;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .btn-refresh:hover:not(:disabled) {
        background: #f8fafc;
        border-color: #94a3b8;
    }

    .btn-refresh:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @keyframes spin {
        100% {
            transform: rotate(360deg);
        }
    }

    .btn-primary {
        background: #10b981;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease;
        margin-top: 1rem;
    }

    .btn-primary:hover {
        background: #059669;
    }

    /* Estados Varios */
    .loading-state,
    .error-state,
    .placeholder-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        text-align: center;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #10b981;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    /* Control Section */
    .monitor-controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .control-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .control-label {
        font-weight: 600;
        color: #475569;
        font-size: 0.9rem;
    }

    .form-select {
        padding: 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        background-color: #f8fafc;
        color: #1e293b;
        font-size: 1rem;
        cursor: pointer;
        transition: border-color 0.2s;
    }

    .form-select:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .action-group {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .btn-capture {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        color: white;
    }

    .btn-capture:disabled {
        background: #cbd5e1;
        cursor: not-allowed;
    }

    .btn-start {
        background: #10b981;
    }

    .btn-start:hover:not(:disabled) {
        background: #059669;
    }

    .btn-stop {
        background: #ef4444;
    }

    .btn-stop:hover {
        background: #dc2626;
    }

    .patient-tag {
        color: #10b981;
        font-weight: 600;
        margin-left: 0.5rem;
    }

    .panel {
        background: white;
        border-radius: 1rem;
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 2px 4px -2px rgba(0, 0, 0, 0.05);
        padding: 1.5rem;
    }

    /* Area de Datos */
    .data-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
    }

    .data-header h2 {
        margin-bottom: 0.25rem;
    }

    .mac-subtitle {
        color: #64748b;
        font-family: monospace;
        font-size: 0.9rem;
        margin: 0;
    }

    .last-update {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #f1f5f9;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.85rem;
        color: #64748b;
    }

    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
    }

    .metric-card {
        background: linear-gradient(145deg, #ffffff, #f8fafc);
        border: 1px solid #e2e8f0;
        border-radius: 1rem;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1.25rem;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }

    .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    }

    .metric-icon {
        width: 56px;
        height: 56px;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .metric-icon.primary {
        background: linear-gradient(135deg, #10b981, #059669);
    }

    .metric-icon.secondary {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
    }

    .metric-content {
        flex: 1;
    }

    .metric-label {
        display: block;
        color: #64748b;
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 0.25rem;
    }

    .metric-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1e293b;
        line-height: 1;
        display: flex;
        align-items: baseline;
        gap: 0.25rem;
    }

    .metric-value .unit {
        font-size: 1.25rem;
        font-weight: 600;
        color: #94a3b8;
    }
</style>
