<script>
    import SettingsSidebar from "$lib/components/SettingsSidebar.svelte";

    let settings = {
        theme: "System",
        language: "English (US)",
        displayDensity: "Compact",
    };

    let hasChanges = false;

    const themeOptions = ["System", "Light", "Dark"];
    const languageOptions = ["English (US)", "Spanish", "French", "German"];
    const densityOptions = ["Compact", "Comfortable"];

    let activeTab = "general";

    function handleSave() {
        console.log("Saving settings:", settings);
        hasChanges = false;
        // Aquí iría la lógica para guardar en el backend
    }

    function handleCancel() {
        // Reset settings
        hasChanges = false;
    }

    $: if (settings) {
        hasChanges = true;
    }
</script>

<div class="settings-container">
    <SettingsSidebar />
    <main>
        <!-- Header -->
        <div class="settings-header">
            <h1 class="settings-title">App Settings</h1>
            <p class="settings-subtitle">
                Manage your application and profile settings.
            </p>
        </div>

        <!-- Content -->
        <div class="settings-content">
            <h2 class="section-title">General Settings</h2>
            <p class="section-description">
                Configure theme, language, and display options.
            </p>

            <div class="settings-grid">
                <!-- Theme -->
                <div class="form-group">
                    <label for="theme" class="form-label">Theme</label>
                    <select
                        id="theme"
                        class="select"
                        bind:value={settings.theme}
                    >
                        {#each themeOptions as option}
                            <option value={option}>{option}</option>
                        {/each}
                    </select>
                </div>

                <!-- Language -->
                <div class="form-group">
                    <label for="language" class="form-label">Language</label>
                    <select
                        id="language"
                        class="select"
                        bind:value={settings.language}
                    >
                        {#each languageOptions as option}
                            <option value={option}>{option}</option>
                        {/each}
                    </select>
                </div>

                <!-- Display Density -->
                <div class="form-group density-group">
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label class="form-label">Display Density</label>
                    <div class="radio-group">
                        {#each densityOptions as option}
                            <label class="radio-option">
                                <input
                                    type="radio"
                                    name="density"
                                    value={option}
                                    bind:group={settings.displayDensity}
                                />
                                <span>{option}</span>
                            </label>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="actions">
                <button class="btn btn-cancel" on:click={handleCancel}
                    >Cancel</button
                >
                <button class="btn btn-save" on:click={handleSave}
                    >Save Changes</button
                >
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

    .density-group {
        grid-column: 1 / -1;
    }

    .radio-group {
        display: flex;
        gap: var(--spacing-lg);
        margin-top: var(--spacing-sm);
    }

    .radio-option {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        cursor: pointer;
    }

    .radio-option input[type="radio"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-md);
        padding-top: var(--spacing-xl);
        border-top: 1px solid var(--color-gray-200);
    }

    .btn {
        padding: var(--spacing-sm) var(--spacing-xl);
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-cancel {
        background-color: white;
        border: 1px solid var(--color-gray-300);
        color: var(--gray-700);
    }

    .btn-cancel:hover {
        background-color: var(--color-gray-50);
    }

    .btn-save {
        background-color: var(--color-primary);
        border: none;
        color: white;
    }

    .btn-save:hover {
        background-color: var(--color-primary-dark);
    }
</style>
