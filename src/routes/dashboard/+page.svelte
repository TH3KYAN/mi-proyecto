<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    // @ts-ignore
    import { Activity, Users, FileText, Bell } from "lucide-svelte";

    let userName = "Cargando...";
    let consultationCount = 0;
    let isLoadingStats = true;

    // Función para decodificar el token JWT manualmente en el frontend
    // @ts-ignore
    function decodeToken(token) {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            return JSON.parse(atob(base64));
        } catch (e) {
            return null;
        }
    }

    async function loadDashboardData() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                goto("/login");
                return;
            }

            // 1. Cargar datos del usuario para el saludo
            const userRes = await fetch("/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (userRes.status === 401) {
                goto("/login");
                return;
            }
            const userData = await userRes.json();
            userName = `${userData.nombre} ${userData.apellido}`;

            // 2. Calcular estadísticas de consultas
            const decoded = decodeToken(token);
            const myCedula = decoded?.cedula;

            if (myCedula) {
                const patientsRes = await fetch("/api/pacientes", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const patients = await patientsRes.json();

                if (Array.isArray(patients)) {
                    // Consultar las consultas de cada paciente concurrentemente
                    const consultationPromises = patients.map(async (p) => {
                        try {
                            const res = await fetch(
                                `/api/pacientes/${p.cedula}/consultas`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                },
                            );
                            const consultations = await res.json();
                            if (Array.isArray(consultations)) {
                                return consultations.filter(
                                    (c) => c.cedula_medico === myCedula,
                                ).length;
                            }
                        } catch (e) {
                            console.error(
                                `Error al cargar consultas de ${p.cedula}:`,
                                e,
                            );
                        }
                        return 0;
                    });

                    const results = await Promise.all(consultationPromises);
                    consultationCount = results.reduce((a, b) => a + b, 0);
                }
            }
        } catch (error) {
            console.error("Error cargando Dashboard:", error);
            userName = "Usuario";
        } finally {
            isLoadingStats = false;
        }
    }

    onMount(loadDashboardData);
</script>

<div class="dashboard-home">
    <h1 class="page-title">Panel de control</h1>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon bg-blue">
                <FileText size={24} color="#3b82f6" />
            </div>
            <div class="stat-info">
                <div class="stat-label">Consultas registradas</div>
                <div class="stat-value">
                    {isLoadingStats ? "..." : consultationCount}
                </div>
            </div>
        </div>
    </div>

    <div class="welcome-section">
        <h2>Bienvenido, {userName}</h2>
        <p>¿Qué está sucediendo en su guardia hoy?</p>
    </div>
</div>

<style>
    .dashboard-home {
        padding: var(--spacing-2xl);
    }

    .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: var(--spacing-xl);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-2xl);
    }

    .stat-card {
        background-color: white;
        padding: var(--spacing-lg);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bg-blue {
        background-color: rgba(59, 130, 246, 0.1);
    }

    .stat-info {
        display: flex;
        flex-direction: column;
    }

    .stat-label {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--gray-900);
    }

    .welcome-section {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: var(--spacing-2xl);
        border-radius: var(--radius-lg);
    }

    .welcome-section h2 {
        font-size: 1.5rem;
        margin-bottom: var(--spacing-sm);
    }

    .welcome-section p {
        opacity: 0.9;
    }
</style>
