<script>
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { page } from "$app/stores";

    // $page.url.pathname contiene la ruta actual
    $: currentPath = $page.url.pathname;
    $: currentPage = currentPath.split("/").pop() || "dashboard";
</script>

<div class="dashboard-layout">
    <Sidebar {currentPage} />

    <main class="main-content">
        <slot />
    </main>
</div>

<style>
    .dashboard-layout {
        display: flex;
        min-height: 100vh;
    }

    .main-content {
        flex: 1;
        margin-left: 250px; /* Ancho del sidebar corregido */
        background-color: var(--bg-secondary);
        transition: margin-left 0.3s ease-in-out;
    }

    @media (max-width: 768px) {
        .main-content {
            margin-left: 0;
        }
    }
</style>
