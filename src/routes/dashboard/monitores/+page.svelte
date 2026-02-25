<script>
    import { onMount, onDestroy } from "svelte";
    import { Activity, Thermometer, Clock, RefreshCw } from "lucide-svelte";

    let dispositivos = [];
    let dispositivoSeleccionado = null;
    let datosDispositivo = null;
    let cargando = true;
    let error = null;
    let intervaloPoll;

    // Obtener la lista de todos los dispositivos conectados
    async function cargarDispositivos() {
        try {
            cargando = true;
            error = null;
            const res = await fetch("/api/dispositivos");
            if (res.ok) {
                dispositivos = await res.json();

                // Si hay dispositivos y no hemos seleccionado uno, seleccionamos el primero por defecto
                if (dispositivos.length > 0 && !dispositivoSeleccionado) {
                    seleccionarDispositivo(dispositivos[0].mac);
                }
            } else {
                throw new Error("No se pudieron cargar los dispositivos");
            }
        } catch (err) {
            error = err.message;
        } finally {
            cargando = false;
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
                // Dispositivo ya no dispobible
                datosDispositivo = null;
            }
        } catch (err) {
            console.error("Error al actualizar datos del dispositivo:", err);
        }
    }

    function seleccionarDispositivo(mac) {
        dispositivoSeleccionado = mac;
        datosDispositivo = null; // Limpiar datos anteriores mientras carga
        actualizarDatosDispositivo();

        // Reiniciar el polling
        if (intervaloPoll) clearInterval(intervaloPoll);
        intervaloPoll = setInterval(actualizarDatosDispositivo, 2000); // Actualizar cada 2 segundos
    }

    onMount(() => {
        cargarDispositivos();
    });

    onDestroy(() => {
        if (intervaloPoll) clearInterval(intervaloPoll);
    });

    // Función auxiliar para formatear la fecha
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

    {#if cargando && dispositivos.length === 0}
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Buscando dispositivos conectados...</p>
        </div>
    {:else if error}
        <div class="error-state">
            <p>{error}</p>
            <button class="btn-primary" on:click={cargarDispositivos}
                >Intentar nuevamente</button
            >
        </div>
    {:else if dispositivos.length === 0}
        <div class="empty-state">
            <Activity size={48} class="empty-icon" />
            <h3>No se encontraron dispositivos</h3>
            <p>
                Asegúrate de que los monitores estén encendidos y transmitiendo
                datos vía MQTT.
            </p>
            <button class="btn-primary" on:click={cargarDispositivos}
                >Volver a buscar</button
            >
        </div>
    {:else}
        <div class="dashboard-grid">
            <!-- Panel Lateral: Lista de Dispositivos -->
            <aside class="device-selector panel">
                <h2>Dispositivos Conectados</h2>
                <div class="device-list">
                    {#each dispositivos as dispositivo}
                        <button
                            class="device-card {dispositivoSeleccionado ===
                            dispositivo.mac
                                ? 'active'
                                : ''}"
                            on:click={() =>
                                seleccionarDispositivo(dispositivo.mac)}
                        >
                            <div class="device-icon">
                                <Activity size={20} />
                            </div>
                            <div class="device-info">
                                <span class="device-name"
                                    >Monitor {dispositivo.mac.slice(-4)}</span
                                >
                                <span class="device-mac">{dispositivo.mac}</span
                                >
                            </div>
                            {#if dispositivoSeleccionado === dispositivo.mac}
                                <div class="active-indicator"></div>
                            {/if}
                        </button>
                    {/each}
                </div>
            </aside>

            <!-- Panel Principal: Datos del Dispositivo -->
            <main class="device-data panel">
                {#if !dispositivoSeleccionado}
                    <div class="placeholder-state">
                        <Activity size={48} />
                        <p>
                            Selecciona un dispositivo para ver sus métricas en
                            vivo.
                        </p>
                    </div>
                {:else if !datosDispositivo}
                    <div class="loading-state">
                        <div class="spinner"></div>
                        <p>Obteniendo primeras lecturas...</p>
                    </div>
                {:else}
                    <div class="data-header">
                        <div>
                            <h2>Lecturas en Vivo</h2>
                            <p class="mac-subtitle">
                                Dispositivo: {dispositivoSeleccionado}
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
    {/if}
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

    .spin {
        animation: spin 1s linear infinite;
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
    .empty-state,
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

    .empty-icon,
    .placeholder-state :global(svg) {
        color: #94a3b8;
        margin-bottom: 1rem;
    }

    /* Grid Layout */
    .dashboard-grid {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
        align-items: start;
    }

    @media (max-width: 900px) {
        .dashboard-grid {
            grid-template-columns: 1fr;
        }
    }

    .panel {
        background: white;
        border-radius: 1rem;
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 2px 4px -2px rgba(0, 0, 0, 0.05);
        padding: 1.5rem;
    }

    .panel h2 {
        font-size: 1.25rem;
        margin: 0 0 1.5rem 0;
        color: #1e293b;
    }

    /* Selector de Dispositivos */
    .device-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .device-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
        position: relative;
        overflow: hidden;
    }

    .device-card:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
    }

    .device-card.active {
        background: rgba(16, 185, 129, 0.05);
        border-color: rgba(16, 185, 129, 0.3);
    }

    .device-icon {
        background: white;
        padding: 0.5rem;
        border-radius: 0.5rem;
        color: #64748b;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .device-card.active .device-icon {
        color: #10b981;
    }

    .device-info {
        display: flex;
        flex-direction: column;
    }

    .device-name {
        font-weight: 600;
        color: #334155;
    }

    .device-mac {
        font-size: 0.8rem;
        color: #94a3b8;
        font-family: monospace;
    }

    .active-indicator {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: #10b981;
        border-radius: 4px 0 0 4px;
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
