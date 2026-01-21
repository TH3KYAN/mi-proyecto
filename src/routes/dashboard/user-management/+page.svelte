<script>
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { Search, Filter, X, Trash2, Save } from "lucide-svelte"; // Añadí iconos necesarios

    // MOCK DATA - Se mantiene igual por ahora
    let users = [
        {
            id: 1,
            name: "Dr. Alex Chen",
            email: "alex.chen@healthsys.io",
            role: "Clinician",
            status: "Active",
            avatar: "/avatars/alex.jpg",
        },
        {
            id: 2,
            name: "Dr. Maria Garcia",
            email: "maria.garcia@healthsys.io",
            role: "Administrator",
            status: "Active",
            avatar: "/avatars/maria.jpg",
        },
        {
            id: 3,
            name: "Kenji Tanaka",
            email: "kenji.tanaka@healthsys.io",
            role: "Viewer",
            status: "Invited",
            avatar: "/avatars/kenji.jpg",
        },
        {
            id: 4,
            name: "Sarah Johnson",
            email: "sarah.j@healthsys.io",
            role: "Clinician",
            status: "Deactivated",
            avatar: "/avatars/sarah.jpg",
        },
    ];

    // --- ESTADO DEL FILTRO ---
    let searchQuery = "";
    let showFilterMenu = false;
    let filters = {
        role: "",
        status: "",
    };

    // --- ESTADO DEL MODAL Y FORMULARIO ---
    let showModal = false;
    let isEditing = false; // true = editando, false = creando
    let isLoading = false; // Para feedback visual al guardar

    // Objeto base para el formulario
    let formData = {
        id: null,
        name: "",
        email: "",
        role: "Clinician",
        status: "Invited",
    };

    // --- LÓGICA REACTIVA DE FILTRADO ---
    // Se ejecuta automáticamente cuando cambian users, searchQuery o filters
    $: filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = filters.role ? user.role === filters.role : true;
        const matchesStatus = filters.status
            ? user.status === filters.status
            : true;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // --- FUNCIONES AUXILIARES (UI) ---
    // @ts-ignore
    function getStatusColor(status) {
        const colors = {
            Active: "#10b981",
            Invited: "#f59e0b",
            Deactivated: "#ef4444",
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

    // --- GESTIÓN DEL MODAL ---
    function openCreateModal() {
        isEditing = false;
        formData = {
            id: null,
            name: "",
            email: "",
            role: "Clinician",
            status: "Invited",
        };
        showModal = true;
    }

    // @ts-ignore
    function openEditModal(user) {
        isEditing = true;
        // Creamos una copia para no modificar la tabla en tiempo real mientras escribimos
        formData = { ...user };
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        showFilterMenu = false;
    }

    // --- LÓGICA DE NEGOCIO (LISTA PARA BD) ---

    async function handleSaveUser() {
        if (!formData.name || !formData.email) return; // Validación básica

        isLoading = true;

        try {
            if (isEditing) {
                // TODO: AQUI CONECTARÁS CON TU BASE DE DATOS

                // Lógica Mock:
                // @ts-ignore
                users = users.map((u) =>
                    u.id === formData.id ? { ...formData } : u,
                );
                console.log("Usuario actualizado:", formData);
            } else {
                // TODO: AQUI CONECTARÁS CON TU BASE DE DATOS

                // Lógica Mock:
                const newUser = { ...formData, id: Math.random(), avatar: "" }; // Generamos ID falso
                users = [...users, newUser]; // Reasignar para disparar reactividad de Svelte
                console.log("Usuario creado:", newUser);
            }
            closeModal();
        } catch (error) {
            console.error("Error guardando usuario:", error);
        } finally {
            isLoading = false;
        }
    }

    async function handleDeleteUser() {
        if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

        isLoading = true;
        try {
            // TODO: AQUI CONECTARÁS CON TU BASE DE DATOS

            // Lógica Mock:
            users = users.filter((u) => u.id !== formData.id);
            closeModal();
        } catch (error) {
            console.error("Error eliminando usuario:", error);
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="page-container">
    <Sidebar />
    <!-- Header -->
    <div class="page-header">
        <h1 class="page-title">Gestión de Usuarios</h1>
        <p class="page-description">
            Agregar, editar, o desactivar cuentas de usuario. También puedes
            asignar roles para controlar sus niveles de acceso.
        </p>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
        <div class="search-box">
            <span class="search-icon"
                ><Search size={20} color="var(--color-gray-600)" /></span
            >
            <input
                type="text"
                class="search-input"
                placeholder="Buscar por nombre o correo..."
                bind:value={searchQuery}
            />
        </div>

        <div style="position: relative;">
            <button
                class="filter-btn"
                on:click={() => (showFilterMenu = !showFilterMenu)}
                class:active={showFilterMenu || filters.role || filters.status}
            >
                <Filter
                    size={14}
                    color={filters.role || filters.status
                        ? "var(--color-primary)"
                        : "var(--color-gray-600)"}
                />
            </button>

            {#if showFilterMenu}
                <div class="filter-dropdown">
                    <div class="filter-group">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label>Rol</label>
                        <select bind:value={filters.role}>
                            <option value="">Todos</option>
                            <option value="Clinician">Clinician</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label>Estado</label>
                        <select bind:value={filters.status}>
                            <option value="">Todos</option>
                            <option value="Active">Active</option>
                            <option value="Invited">Invited</option>
                            <option value="Deactivated">Deactivated</option>
                        </select>
                    </div>
                </div>
            {/if}
        </div>

        <button class="add-user-btn" on:click={openCreateModal}>
            <span>+</span> Agregar Nuevo Usuario
        </button>
    </div>

    <!-- Users Table -->
    <div class="users-table">
        <div class="table-header">
            <div>Nombre</div>
            <div>Rol</div>
            <div>Estado</div>
            <div>Acciones</div>
        </div>

        {#each filteredUsers as user (user.id)}
            <div class="user-row">
                <!-- User Info -->
                <div class="user-info">
                    <div class="user-avatar">
                        {getInitials(user.name)}
                    </div>
                    <div class="user-details">
                        <div class="user-name">{user.name}</div>
                        <div class="user-email">{user.email}</div>
                    </div>
                </div>

                <!-- Role -->
                <div class="user-role">{user.role}</div>

                <!-- Status -->
                <div class="status-badge">
                    <span
                        class="status-dot"
                        style="background-color: {getStatusColor(user.status)}"
                    ></span>
                    <span>{user.status}</span>
                </div>

                <!-- Actions -->
                <button class="edit-btn" on:click={() => openEditModal(user)}
                    >Editar</button
                >
            </div>
        {/each}
    </div>

    {#if showModal}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="modal-backdrop" on:click|self={closeModal}>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>{isEditing ? "Editar Usuario" : "Nuevo Usuario"}</h2>
                    <button class="close-btn-modal" on:click={closeModal}
                        ><X size={20} /></button
                    >
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label>Nombre Completo</label>
                        <input
                            type="text"
                            bind:value={formData.name}
                            placeholder="Dr. Juan Perez"
                            class="form-input"
                        />
                    </div>

                    <div class="form-group">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label>Correo Electrónico</label>
                        <input
                            type="email"
                            bind:value={formData.email}
                            placeholder="juan@ejemplo.com"
                            class="form-input"
                        />
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <!-- svelte-ignore a11y_label_has_associated_control -->
                            <label>Rol</label>
                            <select
                                bind:value={formData.role}
                                class="form-input"
                            >
                                <option value="Clinician">Clinician</option>
                                <option value="Administrator"
                                    >Administrator</option
                                >
                                <option value="Viewer">Viewer</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <!-- svelte-ignore a11y_label_has_associated_control -->
                            <label>Estado</label>
                            <select
                                bind:value={formData.status}
                                class="form-input"
                            >
                                <option value="Active">Active</option>
                                <option value="Invited">Invited</option>
                                <option value="Deactivated">Deactivated</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    {#if isEditing}
                        <button
                            class="delete-btn"
                            on:click={handleDeleteUser}
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
                        on:click={handleSaveUser}
                        disabled={isLoading}
                    >
                        {#if isLoading}Guardando...{:else}<Save size={16} /> Guardar{/if}
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .page-container {
        padding: var(--spacing-2xl);
    }

    .page-header {
        margin-bottom: var(--spacing-xl);
    }

    .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: var(--spacing-sm);
    }

    .page-description {
        color: var(--text-secondary);
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
    }

    .search-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        padding-left: 40px;
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        background-color: white;
    }

    .filter-btn {
        padding: var(--spacing-sm) var(--spacing-md);
        background-color: white;
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        cursor: pointer;
    }

    .add-user-btn {
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

    .add-user-btn:hover {
        background-color: var(--color-primary-dark);
    }

    .users-table {
        background-color: white;
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        box-shadow: var(--shadow-sm);
    }

    .table-header {
        display: grid;
        grid-template-columns: 3fr 2fr 1.5fr 1fr;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--text-secondary);
        border-bottom: 1px solid var(--color-gray-200);
    }

    .user-row {
        display: grid;
        grid-template-columns: 3fr 2fr 1.5fr 1fr;
        gap: var(--spacing-md);
        padding: var(--spacing-lg) var(--spacing-md);
        align-items: center;
        border-bottom: 1px solid var(--color-gray-200);
    }

    .user-row:hover {
        background-color: var(--color-gray-50);
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .user-avatar {
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
    }

    .user-details {
        flex: 1;
    }

    .user-name {
        font-weight: 600;
        font-size: 0.875rem;
        margin-bottom: 2px;
    }

    .user-email {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .user-role {
        font-size: 0.875rem;
        color: var(--gray-700);
    }

    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.75rem;
        font-weight: 500;
    }

    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .edit-btn {
        color: var(--color-primary);
        background: none;
        border: none;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.875rem;
    }

    .edit-btn:hover {
        text-decoration: underline;
    }

    /* Estilos del Dropdown de Filtro */
    .filter-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        padding: 1rem;
        z-index: 50;
        width: 200px;
        margin-top: 5px;
    }
    .filter-group {
        margin-bottom: 0.8rem;
    }
    .filter-group label {
        display: block;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 4px;
    }
    .filter-group select {
        width: 100%;
        padding: 6px;
        border-radius: 4px;
        border: 1px solid var(--color-gray-300);
    }

    /* Estilos del Modal */
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
        color: var(--gray-900);
    }
    .close-btn-modal {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--gray-500);
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
    }
    .form-input {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
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
