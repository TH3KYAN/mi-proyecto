<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { Search, Plus, X, Trash2, Save, Edit2, Activity, User } from 'lucide-svelte';

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
    let searchQuery: string = '';
    let showModal: boolean = false;
    let isEditing: boolean = false;
    let isLoading: boolean = false;
    let cedulaOriginal: string = ''; // Vital para editar/eliminar si se cambia la cédula

    let formData: Paciente = {
        cedula: '',
        nombre: '',
        apellido: '',
        fecha_nacimiento: ''
    };

    // 3. Carga de datos
    onMount(loadPatients);

    async function loadPatients(): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/pacientes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401) {
                goto('/login');
                return;
            }

            const data = await res.json();
            // Manejo de error del service
            patients = (data && data.type === "error") ? [] : (Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error cargando pacientes:', error);
            patients = [];
        }
    }

    // 4. Lógica de Modal (Corrige errores de tus imágenes 5, 6, 7, 8 y 9)
    function openCreateModal(): void {
        isEditing = false;
        formData = { cedula: '', nombre: '', apellido: '', fecha_nacimiento: '' };
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
            const token = localStorage.getItem('token');
            const method = isEditing ? 'PATCH' : 'POST';
            const url = isEditing ? `/api/pacientes/${cedulaOriginal}` : '/api/pacientes';

            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                await loadPatients();
                closeModal();
            }
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            isLoading = false;
        }
    }

    async function handleDeletePatient(cedula: string): Promise<void> {
        if (!confirm('¿Está seguro de eliminar este paciente?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/pacientes/${cedula}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) await loadPatients();
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    }

    function getInitials(nombre: string, apellido: string): string {
        return `${nombre?.[0] || ''}${apellido?.[0] || ''}`.toUpperCase();
    }

    // 6. Filtro reactivo
    $: filteredPatients = patients.filter(p => 
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.cedula.includes(searchQuery)
    );
</script>

<div class="patients-container">
    <div class="header-row">
        <h1 class="page-title">Gestión de Pacientes</h1>
        <button class="add-btn" on:click={openCreateModal}>
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
                class="search-input"
            />
        </div>
    </div>

    <div class="patients-table">
        <div class="table-header">
            <div>PACIENTE</div>
            <div>CÉDULA</div>
            <div>FECHA NACIMIENTO</div>
            <div>ACCIONES</div>
        </div>

        {#each filteredPatients as patient}
            <div class="table-row">
                <div class="patient-info">
                    <div class="avatar">{getInitials(patient.nombre, patient.apellido)}</div>
                    <span class="name">{patient.nombre} {patient.apellido}</span>
                </div>
                <div class="text-secondary">{patient.cedula}</div>
                <div class="text-secondary">{patient.fecha_nacimiento}</div>
                <div class="actions">
                    <button class="icon-btn edit" title="Editar" on:click={() => openEditModal(patient)}>
                        <Edit2 size={18} />
                    </button>
                    <button class="icon-btn delete" title="Eliminar" on:click={() => handleDeletePatient(patient.cedula)}>
                        <Trash2 size={18} />
                    </button>
                    <button class="icon-btn vitals" title="Ver Vitales" on:click={() => goto(`/dashboard/patients/${patient.cedula}`)}>
                        <Activity size={18} />
                    </button>
                </div>
            </div>
        {:else}
            <div class="empty-state">No se encontraron pacientes.</div>
        {/each}
    </div>
</div>

{#if showModal}
    <div class="modal-backdrop" on:click|self={closeModal}>
        <div class="modal-content">
            <div class="modal-header">
                <h2>{isEditing ? 'Editar Paciente' : 'Registrar Nuevo'}</h2>
                <button class="close-btn-modal" on:click={closeModal}><X size={20} /></button>
            </div>
            
            <div class="modal-body">
                <div class="form-group">
                    <label for="name">Nombre</label>
                    <input id="name" type="text" bind:value={formData.nombre} class="form-input" />
                </div>
                <div class="form-group">
                    <label for="lastname">Apellido</label>
                    <input id="lastname" type="text" bind:value={formData.apellido} class="form-input" />
                </div>
                <div class="form-group">
                    <label for="pid">Cédula</label>
                    <input id="pid" type="text" bind:value={formData.cedula} class="form-input" />
                </div>
                <div class="form-group">
                    <label for="birth">Fecha de Nacimiento</label>
                    <input id="birth" type="date" bind:value={formData.fecha_nacimiento} class="form-input" />
                </div>
            </div>

            <div class="modal-footer">
                <button class="save-btn" on:click={handleSavePatient} disabled={isLoading}>
                    <Save size={16} /> {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    /* Agrega aquí tu CSS existente */
    .patients-container { padding: 2rem; }
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .table-header, .table-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 1rem; align-items: center; }
    .table-header { font-weight: bold; background: #f8f9fa; border-radius: 8px; }
    .avatar { width: 35px; height: 35px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 0.8rem; }
    .patient-info { display: flex; align-items: center; }
    .actions { display: flex; gap: 8px; }
    .icon-btn { border: none; background: none; cursor: pointer; padding: 5px; border-radius: 4px; transition: 0.2s; }
    .edit:hover { color: #3b82f6; background: #eff6ff; }
    .delete:hover { color: #ef4444; background: #fef2f2; }
    .vitals:hover { color: #10b981; background: #ecfdf5; }
    
    /* Modal Styles */
    .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; padding: 2rem; border-radius: 12px; width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1rem; }
    .form-input { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px; }
    .save-btn { width: 100%; background: #3b82f6; color: white; border: none; padding: 0.8rem; border-radius: 6px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; }
</style>