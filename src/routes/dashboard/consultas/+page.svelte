<script lang="ts">
    import { onMount } from 'svelte';
    import { 
        Plus, Trash2, Calendar, Search, 
        ClipboardList, User, Save, X, Fingerprint 
    } from 'lucide-svelte';

    let consultas: any[] = [];
    let filtroCedula = ''; 
    let isFetching = true;
    let showModal = false;
    let isLoading = false;

    // Objeto para la nueva consulta
    let nuevaConsulta = {
        cedula_paciente: '',
        descripcion: ''
    };

    onMount(loadConsultas);

    async function loadConsultas() {
        isFetching = true;
        try {
            const token = localStorage.getItem('token');
            // Endpoint global para traer todo
            const res = await fetch('/api/consultas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            consultas = Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Error cargando consultas:", error);
        } finally {
            isFetching = false;
        }
    }

    async function handleCreate() {
        // 1. Validaciones previas
        if (!nuevaConsulta.cedula_paciente.trim() || !nuevaConsulta.descripcion.trim()) {
            alert("La cédula y la descripción son obligatorias");
            return;
        }

        isLoading = true;
        try {
            const token = localStorage.getItem('token');
        
            // IMPORTANTE: La URL debe incluir la cédula del paciente para que 
            // Express la capture en req.params.cedula
            const res = await fetch(`/api/pacientes/${nuevaConsulta.cedula_paciente}/consultas`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    descripcion: nuevaConsulta.descripcion 
                })
            });

            const result = await res.json();

            if (res.ok && result.type !== "error") {
                // Éxito: Limpiar y recargar
                nuevaConsulta = { cedula_paciente: '', descripcion: '' };
                showModal = false;
                await loadConsultas(); // Función para refrescar la lista
                alert("Consulta guardada exitosamente");
            } else {
                alert("Error al guardar: " + (result.message || "Verifique los datos"));
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor");
        } finally {
            isLoading = false;
        }
    }

    // Filtrado lógico en el cliente
    $: filtered = consultas.filter(c => 
        c.cedula_paciente.includes(filtroCedula)
    );
</script>

<div class="dashboard-container">
    <header class="header">
        <div>
            <h1>Consultas Médicas</h1>
            <p>Historial global de atenciones</p>
        </div>
        <button class="btn-primary" on:click={() => showModal = true}>
            <Plus size={20} /> Registrar Nueva Consulta
        </button>
    </header>

    <div class="filters">
        <div class="search-box">
            <Search size={18} />
            <input 
                type="text" 
                placeholder="Filtrar por cédula de paciente..." 
                bind:value={filtroCedula}
            />
        </div>
    </div>

    <main>
        {#if isFetching}
            <div class="loading">Cargando registros médicos...</div>
        {:else if filtered.length > 0}
            <div class="grid">
                {#each filtered as c}
                    <div class="card">
                        <div class="card-header">
                            <span class="patient-tag">
                                <Fingerprint size={14}/> {c.cedula_paciente}
                            </span>
                            <span class="date">
                                {new Date(c.fecha_consulta).toLocaleDateString()}
                            </span>
                        </div>
                        <div class="card-body">
                            <p>{c.descripcion}</p>
                        </div>
                        <div class="card-footer">
                            <span><User size={14}/> Dr. {c.cedula_medico}</span>
                            <div class="actions">
                                <button class="delete-btn"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="empty-state">
                <ClipboardList size={48} />
                <p>No se encontraron consultas registradas.</p>
            </div>
        {/if}
    </main>
</div>

{#if showModal}
    <div class="modal-backdrop">
        <div class="modal">
            <div class="modal-header">
                <h2>Registrar Consulta</h2>
                <button class="close" on:click={() => showModal = false}><X/></button>
            </div>
            <div class="modal-content">
                <div class="input-group">
                    <label>Cédula del Paciente</label>
                    <input 
                        type="text" 
                        bind:value={nuevaConsulta.cedula_paciente} 
                        placeholder="Ingrese CI del paciente"
                    />
                </div>
                <div class="input-group">
                    <label>Descripción Clínica</label>
                    <textarea 
                        bind:value={nuevaConsulta.descripcion} 
                        placeholder="Síntomas, diagnóstico y tratamiento..."
                    ></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-alt" on:click={() => showModal = false}>Cancelar</button>
                <button class="btn-save" on:click={handleCreate} disabled={isLoading}>
                    <Save size={18} /> {isLoading ? 'Guardando...' : 'Guardar Consulta'}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .dashboard-container { padding: 2rem; max-width: 1100px; margin: 0 auto; font-family: sans-serif; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header h1 { margin: 0; color: #1e293b; }
    .header p { margin: 0; color: #64748b; }

    .filters { margin-bottom: 2rem; }
    .search-box { display: flex; align-items: center; gap: 0.5rem; background: white; padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 400px; }
    .search-box input { border: none; outline: none; width: 100%; font-size: 1rem; }

    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
    .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card-header { padding: 1rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
    .patient-tag { background: #eff6ff; color: #2563eb; padding: 0.25rem 0.75rem; border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
    .date { font-size: 0.85rem; color: #94a3b8; }
    .card-body { padding: 1rem; color: #475569; line-height: 1.5; min-height: 80px; }
    .card-footer { padding: 0.75rem 1rem; background: #f8fafc; border-radius: 0 0 12px 12px; display: flex; justify-content: space-between; font-size: 0.8rem; color: #64748b; }

    .btn-primary { background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
    
    /* Modal */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal { background: white; width: 90%; max-width: 500px; border-radius: 12px; overflow: hidden; }
    .modal-header { padding: 1rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; }
    .modal-content { padding: 1.5rem; }
    .input-group { margin-bottom: 1rem; }
    .input-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #475569; }
    .input-group input, .input-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; }
    .input-group textarea { height: 120px; resize: none; }
    .modal-footer { padding: 1rem; background: #f8fafc; display: flex; justify-content: flex-end; gap: 0.5rem; }
    .btn-save { background: #2563eb; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; }
    .btn-alt { background: white; border: 1px solid #cbd5e1; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; }
</style>