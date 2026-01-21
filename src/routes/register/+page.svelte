<script lang="ts">
    //Icons
    import { Eye, EyeOff, Activity } from "lucide-svelte";

    interface FormErrors {
        fullName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }

    let formData = {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    let showPassword = false;
    let showConfirmPassword = false;
    let isLoading = false;
    let errors: FormErrors = {};

    function validateForm() {
        errors = {};
        if (!formData.fullName) {
            errors.fullName = "El nombre es requerido";
        }

        if (!formData.email) {
            errors.email = "El correo es requerido";
        }

        if (formData.password.length < 8) {
            errors.password = "La contraseña debe tener al menos 8 caracteres";
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Las contraseñas no coinciden";
        }

        return Object.keys(errors).length === 0;
    }

    async function handleRegister() {
        if (!validateForm()) return;

        isLoading = true;
        console.log("Registering:", formData);

        // Simular registro
        setTimeout(() => {
            isLoading = false;
            window.location.href = "/login";
        }, 1000);
    }

    function togglePassword() {
        showPassword = !showPassword;
    }

    function toggleConfirmPassword() {
        showConfirmPassword = !showConfirmPassword;
    }
</script>

<div class="register-container">
    <div class="hero-section">
        <div class="logo">
            <Activity size={32} />
            <span style="font-size: 1.5rem; font-weight: 700;">VitalCare</span>
        </div>

        <h1
            style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.2;"
        >
            Únete a VitalCare<br />
            Hoy
        </h1>

        <p
            style="color: var(--color-primary-dark); font-size: 1.125rem; margin-bottom: 2rem;"
        >
            Crea tu cuenta para comenzar a monitorear los signos vitales de tus
            pacientes.
        </p>
    </div>

    <div class="form-section">
        <div class="form-container">
            <div class="logo-title">
                <Activity size={32} />
                <span style="font-size: 1.5rem; font-weight: 700;"
                    >VitalCare</span
                >
            </div>
            <h2 class="form-title">Crea tu cuenta</h2>
            <p class="form-description">Llena los detalles para comenzar.</p>

            <form on:submit|preventDefault={handleRegister}>
                <!-- Full Name -->
                <div class="form-group">
                    <label for="fullName" class="form-label"
                        >Nombre completo</label
                    >
                    <input
                        id="fullName"
                        type="text"
                        class="form-input"
                        class:error={errors.fullName}
                        placeholder="Ingresa tu nombre completo"
                        bind:value={formData.fullName}
                    />
                    {#if errors.fullName}
                        <p class="error-message">{errors.fullName}</p>
                    {/if}
                </div>

                <!-- Email -->
                <div class="form-group">
                    <label for="email" class="form-label"
                        >Correo electrónico</label
                    >
                    <input
                        id="email"
                        type="email"
                        class="form-input"
                        class:error={errors.email}
                        placeholder="Ingresa tu correo electrónico"
                        bind:value={formData.email}
                    />
                    {#if errors.email}
                        <p class="error-message">{errors.email}</p>
                    {/if}
                </div>

                <!-- Password -->
                <div class="form-group">
                    <label for="password" class="form-label">Contraseña</label>
                    <div class="input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            class="form-input"
                            class:error={errors.password}
                            placeholder="Ingresa una contraseña"
                            bind:value={formData.password}
                        />
                        <button
                            type="button"
                            class="password-toggle"
                            on:click={togglePassword}
                        >
                            {#if showPassword}
                                <Eye size={20} />
                            {:else}
                                <EyeOff size={20} />
                            {/if}
                        </button>
                    </div>
                    {#if errors.password}
                        <p class="error-message">{errors.password}</p>
                    {/if}
                </div>

                <!-- Confirm Password -->
                <div class="form-group">
                    <label for="confirmPassword" class="form-label"
                        >Confirmar Contraseña</label
                    >
                    <div class="input-wrapper">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            class="form-input"
                            class:error={errors.confirmPassword}
                            placeholder="Confirma tu contraseña"
                            bind:value={formData.confirmPassword}
                        />
                        <button
                            type="button"
                            class="password-toggle"
                            on:click={toggleConfirmPassword}
                        >
                            {#if showConfirmPassword}
                                <Eye size={20} />
                            {:else}
                                <EyeOff size={20} />
                            {/if}
                        </button>
                    </div>
                    {#if errors.confirmPassword}
                        <p class="error-message">{errors.confirmPassword}</p>
                    {/if}
                </div>

                <button
                    type="submit"
                    class="register-button"
                    disabled={isLoading}
                >
                    {isLoading ? "Creando cuenta..." : "Registrarse"}
                </button>
            </form>

            <p class="login-link">
                Ya tienes una cuenta? <a href="/login">Iniciar sesión</a>
            </p>
        </div>
    </div>
</div>

<style>
    .logo-title {
        display: none;
    }

    .register-container {
        display: flex;
        min-height: 100vh;
        background-color: var(--bg-secondary);
    }

    .hero-section {
        flex: 1;
        background: linear-gradient(135deg, #d1f5e8 0%, #8de6c4 100%);
        padding: var(--spacing-2xl);
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .form-section {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-2xl);
        background-color: white;
    }

    .form-container {
        width: 100%;
        max-width: 400px;
    }

    .form-title {
        font-size: 2rem;
        font-weight: 700;
    }

    .form-description {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-sm);
    }

    .form-group {
        margin-bottom: var(--spacing-md);
    }

    .form-label {
        display: block;
        margin-bottom: var(--spacing-xs);
        font-weight: 500;
        font-size: 0.875rem;
    }

    .input-wrapper {
        position: relative;
    }

    .form-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        font-size: 0.875rem;
    }

    .form-input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .form-input.error {
        border-color: var(--color-error);
    }

    .error-message {
        color: var(--color-error);
        font-size: 0.75rem;
        margin-top: var(--spacing-xs);
    }

    .password-toggle {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-success);
    }

    .register-button {
        width: 100%;
        padding: var(--spacing-md);
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
        margin-top: var(--spacing-sm);
    }

    .register-button:hover:not(:disabled) {
        background-color: var(--color-primary-dark);
    }

    .register-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .login-link {
        text-align: center;
        margin-top: var(--spacing-sm);
        color: var(--text-secondary);
    }

    .login-link a {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 600;
    }

    @media (max-width: 768px) {
        .register-container {
            flex-direction: column;
        }

        .hero-section {
            display: none;
        }

        .logo-title {
            color: var(--color-success);
            display: flex;
            align-items: center;
            margin-bottom: var(--spacing-md);
        }
    }
</style>
