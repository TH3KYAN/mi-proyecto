<script>
    //Icons
    import { Activity, Lock, Mail, Eye, EyeOff } from "lucide-svelte";

    // Variables reactivas para el formulario
    let email = "";
    let password = "";
    let showPassword = false;
    let isLoading = false;

    // Función para manejar el login
    async function handleLogin() {
        isLoading = true;

        // Aquí irá la lógica de autenticación
        console.log("Login con:", { email, password });

        // Simular llamada a API
        setTimeout(() => {
            isLoading = false;
            // Redirigir al dashboard
            window.location.href = "/dashboard";
        }, 1000);
    }

    // Función para toggle de contraseña
    function togglePassword() {
        showPassword = !showPassword;
    }
</script>

<div class="login-container">
    <!-- Sección Hero (izquierda) -->
    <div class="hero-section">
        <div class="logo">
            <Activity size={32} />
            <span style="font-size: 1.5rem; font-weight: 700;">VitalCare</span>
        </div>

        <h1 class="hero-title">
            Monitoreando la Salud,<br /> Garantizando la Tranquilidad
        </h1>

        <p class="hero-subtitle">
            Tu compañero de confianza en el monitoreo continuo de signos vitales
            de pacientes.<br />
        </p>
        <p
            class="hero-subtitle"
            style="font-size: 1.125rem; font-weight: 500; color: var(--color-gray-900);"
        >
            Bienvenido a VitalCare
        </p>
    </div>

    <!-- Sección del Formulario (derecha) -->
    <div class="form-section">
        <div class="form-container">
            <div class="logo-title">
                <Activity size={32} />
                <span style="font-size: 1.5rem; font-weight: 700;"
                    >VitalCare</span
                >
            </div>
            <h2 class="form-title">Iniciar Sesión</h2>
            <p class="form-description">
                Por favor, ingresa tus datos para acceder a tu dashboard.
            </p>

            <form on:submit|preventDefault={handleLogin}>
                <!-- Campo Email -->
                <div class="form-group">
                    <label for="email" class="form-label"
                        >Correo Electrónico</label
                    >
                    <div class="input-wrapper">
                        <div class="icon-container">
                            <Mail size={20} />
                        </div>

                        <input
                            id="email"
                            type="email"
                            class="form-input"
                            placeholder="Ejemplo@correo.com"
                            bind:value={email}
                            required
                        />
                    </div>

                    <!-- Campo Password -->
                    <div class="form-group">
                        <label for="password" class="form-label"
                            >Contraseña</label
                        >
                        <div class="input-wrapper">
                            <div class="icon-container">
                                <Lock size={20} />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                class="form-input"
                                placeholder="Ingresa tu contraseña"
                                bind:value={password}
                                required
                            />
                            <button
                                type="button"
                                class="password-toggle"
                                on:click={togglePassword}
                            >
                                {#if showPassword}
                                    <EyeOff size={20} />
                                {:else}
                                    <Eye size={20} />
                                {/if}
                            </button>
                        </div>
                        <div style="display: flex; justify-content: flex-end;">
                            <a href="/forgot-password" class="forgot-password"
                                >¿Olvidaste tu contraseña?</a
                            >
                        </div>
                    </div>

                    <!-- Botón de Login -->
                    <button
                        type="submit"
                        class="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Iniciando Sesión..." : "Iniciar Sesión"}
                    </button>
                </div>
            </form>

            <!-- Link de Registro -->
            <p class="signup-link">
                ¿No tienes una cuenta? <a href="/register">Registrarse</a>
            </p>
        </div>
    </div>
</div>

<style>
    .logo-title {
        display: none;
    }
    .icon-container {
        position: absolute;
        left: 12px;
        display: flex;
        color: var(--color-success);
        pointer-events: none;
        z-index: 10;
        margin-top: 10px;
    }

    .login-container {
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

    .logo {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-xl);
    }

    .hero-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--gray-900);
        line-height: 1.2;
        margin-bottom: var(--spacing-md);
    }

    .hero-subtitle {
        color: var(--color-primary-dark);
        font-size: 1.125rem;
        margin-bottom: var(--spacing-2xl);
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
        margin-bottom: var(--spacing-sm);
    }

    .form-description {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-xl);
    }

    .form-group {
        margin-bottom: var(--spacing-lg);
    }

    .form-label {
        display: block;
        margin-top: var(--spacing-sm);
        margin-bottom: var(--spacing-sm);
        font-weight: 500;
        font-size: 0.875rem;
    }

    .input-wrapper {
        position: relative;
    }

    .form-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        padding-left: 40px;
        border: 1px solid var(--color-gray-300);
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        transition: all 0.2s;
    }

    .form-input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .password-toggle {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--color-success);
        cursor: pointer;
    }

    .forgot-password {
        display: block;
        text-align: right;
        color: var(--color-primary);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 600;
        margin-top: var(--spacing-sm);
    }

    .forgot-password:hover {
        text-decoration: underline;
    }

    .login-button {
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
        margin-top: var(--spacing-lg);
    }

    .login-button:hover:not(:disabled) {
        background-color: var(--color-primary-dark);
    }

    .login-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .signup-link {
        text-align: center;
        margin-top: var(--spacing-lg);
        color: var(--text-secondary);
    }

    .signup-link a {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 600;
    }

    .signup-link a:hover {
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        .login-container {
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
