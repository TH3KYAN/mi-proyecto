<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import favicon from '$lib/assets/favicon.svg';

    let { children } = $props();

    // Configuramos Tailwind una sola vez para toda la app
    onMount(() => {
        if (window.tailwind) {
            window.tailwind.config = {
                darkMode: "class",
                theme: {
                    extend: {
                        colors: {
                            "primary": "#13ec5b",
                            "background-light": "#f6f8f6",
                            "background-dark": "#102216",
                        },
                        fontFamily: { "display": ["Inter", "sans-serif"] }
                    },
                },
            };
        }
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>VitalCare System</title>
</svelte:head>

<style>
    :global(.material-symbols-outlined) {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
</style>

{#if $page.url.pathname === '/'}
    {@render children()}
{:else}
    <div class="font-display bg-background-light dark:bg-background-dark min-h-screen flex">
        
        <aside class="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-4 flex flex-col justify-between h-screen sticky top-0">
            <div class="flex flex-col gap-4">
                <div class="flex items-center gap-3 p-2 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div class="rounded-full size-10 bg-primary/20 flex items-center justify-center">
                        <span class="material-symbols-outlined text-primary">medical_services</span>
                    </div>
                    <div class="flex flex-col">
                        <h1 class="text-gray-900 dark:text-gray-100 text-sm font-bold">Dr. Evelyn Reed</h1>
                        <p class="text-green-600 text-xs">Cardiologist</p>
                    </div>
                </div>

                <nav class="flex flex-col gap-2 mt-4">
                    <a href="/dashboard" class="flex items-center gap-3 px-3 py-2 rounded-lg {$page.url.pathname === '/dashboard' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'}">
                        <span class="material-symbols-outlined">dashboard</span>
                        <span class="text-sm">Dashboard</span>
                    </a>
                    <a href="/alerts" class="flex items-center gap-3 px-3 py-2 rounded-lg {$page.url.pathname === '/alerts' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'}">
                        <span class="material-symbols-outlined">notifications_active</span>
                        <span class="text-sm">Alerts</span>
                    </a>
                    <a href="/patients" class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100">
                        <span class="material-symbols-outlined">group</span>
                        <span class="text-sm">Patients</span>
                    </a>
					<a href="/usuarios" class="flex items-center gap-3 px-3 py-2 rounded-lg {$page.url.pathname === '/usuarios' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'}">
    					<span class="material-symbols-outlined">group</span>
    					<span class="text-sm">Manejador de usuarios</span>
					</a>
                </nav>
            </div>

            <div class="border-t border-gray-100 dark:border-gray-800 pt-4">
                <a href="/" class="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <span class="material-symbols-outlined">logout</span>
                    <span class="text-sm font-medium">Cerrar Sesión</span>
                </a>
            </div>
        </aside>

        <main class="flex-1 overflow-y-auto">
            {@render children()}
        </main>
    </div>
{/if}