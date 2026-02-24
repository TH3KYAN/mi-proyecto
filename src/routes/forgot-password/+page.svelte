<script>
    import { ArrowLeft, Eye, EyeOff } from "lucide-svelte";
    import { goto } from '$app/navigation';

    let email = "";
    let cedula = "";
    let newPassword = "";
    let confirmPassword = "";
    
    let isLoading = false;
    let success = false;
    let message = "";
    let showPassword = false;

    async function handleResetPassword() {
        // Validaciones básicas
        if (newPassword !== confirmPassword) {
            message = "Las contraseñas no coinciden.";
            return;
        }

        isLoading = true;
        message = "";

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    cedula, 
                    newPassword 
                })
            });

            const result = await response.json();

            if (response.ok) {
                success = true;
                message = "¡Contraseña actualizada con éxito!";
                // Redirigir al login tras 2 segundos
                setTimeout(() => goto("/login"), 2000);
            } else {
                message = result.message || "Error al restablecer la contraseña.";
            }
        } catch (err) {
            message = "Error de conexión con el servidor.";
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="container">
    <div class="card">
        <p class="back-link">
            <ArrowLeft size={15} />
            <a href="/login">Volver al Login</a>
        </p>
        
        <h1 class="title">Restablecer Contraseña</h1>
        <p class="description">
            Introduce tu correo y tu cédula para validar tu identidad y crear una nueva clave.
        </p>

        {#if message}
            <div class={success ? "success-message" : "error-message"}>
                {message}
            </div>
        {/if}

        <form on:submit|preventDefault={handleResetPassword}>
            <div class="form-group">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input id="email" type="email" class="form-input" placeholder="usuario@correo.com"
                    bind:value={email} required />
            </div>

            <div class="form-group">
                <label for="cedula" class="form-label">Cédula</label>
                <input id="cedula" type="text" class="form-input" placeholder="Ingresa tu cédula registrada"
                    bind:value={cedula} required />
            </div>

            <hr class="separator" />

            <div class="form-group">
                <label for="newPassword" class="form-label">Nueva Contraseña</label>
                <div class="input-wrapper">
                    <input id="newPassword" type={showPassword ? "text" : "password"} 
                        class="form-input" bind:value={newPassword} required minlength="8" />
                    <button type="button" class="toggle-btn" on:click={() => showPassword = !showPassword}>
                        {#if showPassword}<Eye size={18}/>{:else}<EyeOff size={18}/>{/if}
                    </button>
                </div>
            </div>

            <div class="form-group">
                <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                <input id="confirmPassword" type="password" class="form-input"
                    bind:value={confirmPassword} required />
            </div>

            <button type="submit" class="submit-button" disabled={isLoading || success}>
                {isLoading ? "Procesando..." : "Actualizar Contraseña"}
            </button>
        </form>
    </div>
</div>

<style>
    /* ... Tus estilos anteriores ... */
    .container {
        display: flex;
        min-height: 100vh;
        background-color: var(--bg-secondary);
        align-items: center;
        justify-content: center;
    }

    .card {
        background: white;
        padding: var(--spacing-2xl);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        max-width: 500px;
        width: 100%;
        margin: var(--spacing-lg);
    }

    .title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: var(--spacing-md);
        text-align: center;
    }

    .description {
        color: var(--text-secondary);
        text-align: center;
        margin-bottom: var(--spacing-xl);
    }

    .form-group {
        margin-bottom: var(--spacing-lg);
    }

    .form-label {
        display: block;
        margin-bottom: var(--spacing-sm);
        font-weight: 500;
    }

    .form-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
    }

    .submit-button {
        width: 100%;
        padding: var(--spacing-md);
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .submit-button:hover:not(:disabled) {
        background-color: var(--color-primary-dark);
    }

    .submit-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .success-message {
        background-color: #d1fae5;
        border: 1px solid var(--color-primary);
        color: var(--color-primary-dark);
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-lg);
        text-align: center;
    }

    .back-link {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-sm);
        margin-bottom: var(--spacing-lg);
        color: var(--text-secondary);
    }
    .back-link a {
        color: var(--color-secondary);
        text-decoration: none;
        font-weight: 600;
    }
    .separator {
        border: 0;
        border-top: 1px solid var(--color-gray-300);
        margin: var(--spacing-xl) 0;
    }

    .error-message {
        background-color: #fee2e2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-lg);
        text-align: center;
        font-size: 0.875rem;
    }

    .input-wrapper {
        position: relative;
    }

    .toggle-btn {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-gray-500);
    }

    /* Reutiliza el success-message que ya tenías */
</style>