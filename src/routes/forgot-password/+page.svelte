<script>
    // Icons
    import { ArrowLeft } from "lucide-svelte";

    let email = "";
    let isLoading = false;
    let emailSent = false;

    async function handleResetPassword() {
        if (!email) return;

        isLoading = true;
        console.log("Sending reset email to:", email);

        setTimeout(() => {
            isLoading = false;
            emailSent = true;
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        }, 700);
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
            Introduce tu dirección de correo electrónico y te enviaremos un
            enlace para restablecer tu contraseña.
        </p>

        {#if emailSent}
            <div class="success-message">
                Contraseña restablecida! Revisa tu correo.
            </div>
        {/if}

        <form on:submit|preventDefault={handleResetPassword}>
            <div class="form-group">
                <label for="email" class="form-label">Correo Electronico</label>
                <input
                    id="email"
                    type="email"
                    class="form-input"
                    placeholder="Introduce tu correo electronico"
                    bind:value={email}
                    required
                />
            </div>

            <button
                type="submit"
                class="submit-button"
                disabled={isLoading || emailSent}
            >
                {isLoading
                    ? "Enviando..."
                    : emailSent
                      ? "Email Enviado"
                      : "Enviar Enlace de Restablecimiento"}
            </button>
        </form>
    </div>
</div>

<style>
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
</style>
