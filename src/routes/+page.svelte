<script>
    import { onMount } from "svelte";

    onMount(() => {
        // Redirigir a login al cargar
        window.location.href = "/login";
    });
</script>

<div
    style="display: flex; justify-content: center; align-items: center; height: 100vh;"
>
    <p>Redirecting to login...</p>
</div>
