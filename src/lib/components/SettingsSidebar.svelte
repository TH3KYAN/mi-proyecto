<script>
    import {
        Settings,
        Users,
        Bell,
        Shield,
        ArrowLeft,
        LogOut,
        Menu,
        X,
    } from "lucide-svelte";

    export let currentPage = "general"; // Default to general settings

    // Valores por defecto del usuario (se reemplazarán con datos de la BD)
    let userName = "Dr. Evelyn Reed";
    let userRole = "Administrator";
    let isMobileMenuOpen = false;

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }

    // TODO: Implementar cuando se conecte a la base de datos
    // async function loadUserData() {
    //     try {
    //         const response = await fetch('/api/user/profile');
    //         const data = await response.json();
    //         userName = data.fullName;
    //         userRole = data.role;
    //     } catch (error) {
    //         console.error('Error loading user data:', error);
    //     }
    // }

    // onMount(() => {
    //     loadUserData();
    // });

    const menuItems = [
        {
            id: "general",
            label: "General",
            icon: Settings,
            href: "/dashboard/settings",
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: Bell,
            href: "/dashboard/settings/notifications",
        },
        {
            id: "user-management",
            label: "User Management",
            icon: Users,
            href: "/dashboard/settings/user-management",
        },
    ];
</script>

<!-- Mobile Menu Toggle Button -->
<button class="mobile-toggle" on:click={toggleMobileMenu}>
    <Menu size={24} />
</button>

<!-- Overlay -->
{#if isMobileMenuOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="overlay" on:click={toggleMobileMenu}></div>
{/if}

<aside class="sidebar" class:open={isMobileMenuOpen}>
    <div class="sidebar-header-mobile">
        <div class="logo">Settings</div>
        <button class="close-btn" on:click={toggleMobileMenu}>
            <X size={24} />
        </button>
    </div>

    <div class="sidebar-header">
        <a href="/dashboard" class="back-link">
            <ArrowLeft size={20} />
            <span>Volver</span>
        </a>
    </div>

    <nav class="menu-section">
        {#each menuItems as item}
            <a
                href={item.href}
                class="menu-item"
                class:active={currentPage === item.id}
                on:click={() => (isMobileMenuOpen = false)}
            >
                <svelte:component this={item.icon} size={20} />
                <span>{item.label}</span>
            </a>
        {/each}
    </nav>

    <div class="settings-section">
        <button
            class="logout-btn"
            on:click={() => (window.location.href = "/login")}
        >
            <LogOut size={18} />
            <span>Salir</span>
        </button>
    </div>
</aside>

<style>
    .mobile-toggle {
        display: none; /* Hidden on desktop */
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 50;
        background: white;
        border: 1px solid var(--color-gray-200);
        padding: 0.5rem;
        border-radius: var(--radius-md);
        cursor: pointer;
        color: var(--gray-700);
        box-shadow: var(--shadow-sm);
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 90;
        backdrop-filter: blur(2px);
    }

    .sidebar-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-xl);
        padding-bottom: var(--spacing-lg);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .back-link {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        text-decoration: none;
        color: var(--gray-700);
        font-size: 0.875rem;
        transition: all 0.2s;
    }

    .sidebar {
        width: 250px;
        background-color: #e5f3ec;
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding: var(--spacing-lg);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100;
        transition: transform 0.3s ease-in-out;
    }

    .sidebar-header-mobile {
        display: none; /* Hidden on desktop */
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-lg);
    }

    .logo {
        font-weight: 700;
        font-size: 1.25rem;
        color: var(--color-primary);
    }

    .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--gray-700);
        padding: 0;
    }

    .menu-section {
        margin-bottom: var(--spacing-lg);
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        text-decoration: none;
        color: var(--gray-700);
        font-size: 0.875rem;
        transition: all 0.2s;
        margin-bottom: var(--spacing-xs);
    }

    .menu-item:hover {
        background-color: rgba(16, 185, 129, 0.1);
    }

    .menu-item.active {
        background-color: var(--color-primary);
        color: white;
    }

    .logout-btn {
        width: 100%;
        padding: var(--spacing-sm);
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        margin-top: var(--spacing-md);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
    }

    .logout-btn:hover {
        background-color: var(--color-primary-dark);
    }

    .settings-section {
        margin-top: auto;
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
        .mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .sidebar {
            transform: translateX(-100%);
            width: 80%; /* Wider on mobile */
            max-width: 300px;
        }

        .sidebar.open {
            transform: translateX(0);
            box-shadow: var(--shadow-xl);
        }

        .sidebar-header-mobile {
            display: flex;
        }
    }
</style>
