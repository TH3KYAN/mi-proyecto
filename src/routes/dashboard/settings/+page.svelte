<script>
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { settings } from "$lib/stores/settings";

    const themeOptions = ["Sistema", "Claro", "Oscuro"];
    const languageOptions = ["Español", "Inglés", "Francés", "Alemán"];

    let activeTab = "general";

    // No necesitamos handleSave porque el store se actualiza automáticamente
    // y persiste en localStorage.
    function handleCancel() {
        // Opcional: Podríamos revertir cambios si guardáramos un "estado previo"
        // pero por simplicidad en este UX, el cambio es inmediato.
        // Aquí podrías recargar la página o volver al dashboard si lo prefieres.
    }
</script>

<div class="settings-container">
    <Sidebar />
    <main>
        <!-- Header -->
        <div class="settings-header">
            <h1 class="settings-title">Configuración</h1>
            <p class="settings-subtitle">
                Configura tus preferencias y ajustes de la aplicación.
            </p>
        </div>

        <!-- Content -->
        <div class="settings-content">
            <h2 class="section-title">Configuración General</h2>
            <p class="section-description">
                Configure tus preferencias y ajustes de la aplicación.
            </p>

            <div class="settings-grid">
                <!-- Theme -->
                <div class="form-group">
                    <label for="theme" class="form-label">Tema</label>
                    <select
                        id="theme"
                        class="select"
                        bind:value={$settings.theme}
                    >
                        {#each themeOptions as option}
                            <option value={option}>{option}</option>
                        {/each}
                    </select>
                </div>

                <!-- Language -->
                <div class="form-group">
                    <label for="language" class="form-label">Idioma</label>
                    <select
                        id="language"
                        class="select"
                        bind:value={$settings.language}
                    >
                        {#each languageOptions as option}
                            <option value={option}>{option}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <!-- Actions -->
            <div class="actions">
                <!-- Botones ocultos o simplificados ya que el cambio es inmediato -->
                <!-- <button class="btn btn-save" on:click={handleSave}>Guardar Cambios</button> -->
            </div>
        </div>
    </main>
</div>

<style>
    .settings-container {
        padding: 0;
        max-width: 100%;
    }

    main {
        margin-left: 250px;
        padding: var(--spacing-2xl);
        max-width: 1200px;
        transition: margin-left 0.3s ease-in-out;
    }

    @media (max-width: 768px) {
        main {
            margin-left: 0;
            padding: var(--spacing-md);
        }

        .settings-content {
            padding: var(--spacing-xl);
        }

        .settings-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
        }
    }

    .settings-header {
        margin-bottom: var(--spacing-xl);
    }

    .settings-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: var(--spacing-sm);
    }

    .settings-subtitle {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .settings-content {
        background-color: white;
        padding: var(--spacing-2xl);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
    }

    .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: var(--spacing-md);
    }

    .section-description {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin-bottom: var(--spacing-xl);
    }

    .settings-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-xl);
        margin-bottom: var(--spacing-2xl);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .form-label {
        font-weight: 600;
        font-size: 0.875rem;
        color: var(--gray-900);
    }

    .select {
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        background-color: white;
        font-size: 0.875rem;
        cursor: pointer;
    }

    .select:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
</style>
