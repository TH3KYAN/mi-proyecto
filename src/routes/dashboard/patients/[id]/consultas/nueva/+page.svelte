<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { ArrowLeft, Save } from "lucide-svelte";

    const cedula = $page.params.id;
    let paciente: any = null;
    let isLoading = false;
    let cargandoPaciente = true;

    // Estado del formulario
    let formData = {
        motivo: "",
        diagnostico: "",
        tratamiento: "",
    };

    onMount(async () => {
        await cargarPaciente();
    });

    async function cargarPaciente() {
        cargandoPaciente = true;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/pacientes/${cedula}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                paciente = await res.json();
            }
        } catch (error) {
            console.error("Error cargando paciente:", error);
        } finally {
            cargandoPaciente = false;
        }
    }

    async function handleSubmit() {
        if (!formData.motivo) {
            alert("El motivo es obligatorio");
            return;
        }

        isLoading = true;
        try {
            const token = localStorage.getItem("token");

            // Requerimiento backend: enviar 'cedula_paciente' incluido en el body
            const bodyData = {
                ...formData,
                cedula_paciente: cedula,
            };

            const res = await fetch(`/api/pacientes/${cedula}/consultas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyData),
            });

            if (res.ok) {
                // Volver a la lista de consultas del paciente
                goto(`/dashboard/patients/${cedula}/consultas`);
            } else {
                const data = await res.json();
                alert(
                    `Error al guardar: ${data.message || "Error desconocido"}`,
                );
            }
        } catch (error) {
            console.error("Error guardando consulta:", error);
            alert("Error de conexión al guardar la consulta");
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="nueva-consulta-page">
    <div class="header-actions">
        <button
            class="btn btn-back"
            on:click={() => goto(`/dashboard/patients/${cedula}/consultas`)}
        >
            <ArrowLeft size={18} /> Volver a Consultas
        </button>
    </div>

    <div class="header-row">
        <div>
            <h1 class="page-title">Registrar Nueva Consulta</h1>
            {#if cargandoPaciente}
                <p class="subtitle">Cargando paciente...</p>
            {:else if paciente}
                <p class="subtitle">
                    Paciente: <strong
                        >{paciente.nombre} {paciente.apellido}</strong
                    >
                    (C.I. {paciente.cedula})
                </p>
            {/if}
        </div>
    </div>

    <div class="form-container">
        <form on:submit|preventDefault={handleSubmit} class="consulta-form">
            <div class="form-group required">
                <label for="motivo">Motivo de la Consulta</label>
                <textarea
                    id="motivo"
                    bind:value={formData.motivo}
                    placeholder="Describa el motivo por el cual el paciente acude a la consulta"
                    required
                    rows="3"
                    class="input textarea"
                ></textarea>
            </div>

            <div class="form-group">
                <label for="diagnostico">Diagnóstico</label>
                <textarea
                    id="diagnostico"
                    bind:value={formData.diagnostico}
                    placeholder="Diagnóstico médico establecido (opcional si aún no está definido)"
                    rows="3"
                    class="input textarea"
                ></textarea>
            </div>

            <div class="form-group">
                <label for="tratamiento">Tratamiento Indicado</label>
                <textarea
                    id="tratamiento"
                    bind:value={formData.tratamiento}
                    placeholder="Medicamentos, indicaciones, reposo, etc. (opcional)"
                    rows="4"
                    class="input textarea"
                ></textarea>
            </div>

            <div class="form-actions">
                <button
                    type="button"
                    class="btn btn-secondary"
                    on:click={() =>
                        goto(`/dashboard/patients/${cedula}/consultas`)}
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    class="btn btn-primary"
                    disabled={isLoading || !formData.motivo}
                >
                    <Save size={18} />
                    {isLoading ? "Guardando..." : "Guardar Consulta"}
                </button>
            </div>
        </form>
    </div>
</div>

<style>
    .nueva-consulta-page {
        padding: var(--spacing-2xl);
        max-width: 800px;
        margin: 0 auto;
    }

    .header-actions {
        margin-bottom: var(--spacing-md);
    }

    .btn-back {
        background: transparent;
        border: 1px solid var(--color-gray-200);
        color: var(--text-secondary);
        padding: 0.5rem 1rem;
    }

    .btn-back:hover {
        background: var(--color-gray-50);
        color: var(--text-primary);
    }

    .header-row {
        margin-bottom: var(--spacing-xl);
    }

    .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
    }

    .subtitle {
        color: var(--text-secondary);
        margin: 0.5rem 0 0 0;
        font-size: 1.1rem;
    }

    .form-container {
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: var(--spacing-xl);
    }

    .consulta-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        font-weight: 600;
        color: var(--text-primary);
    }

    .form-group.required label::after {
        content: " *";
        color: var(--color-error, #ef4444);
    }

    .textarea {
        resize: vertical;
        padding: 0.75rem;
        font-family: inherit;
        line-height: 1.5;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-md);
        margin-top: var(--spacing-lg);
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--color-gray-100);
    }

    .btn-secondary {
        background: white;
        border: 1px solid var(--color-gray-300);
        color: var(--text-primary);
    }

    .btn-secondary:hover:not(:disabled) {
        background: var(--color-gray-50);
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
</style>
