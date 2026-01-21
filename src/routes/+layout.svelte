<script>
	// Este es el layout raíz que envuelve todas las páginas
	import "../lib/styles/global.css";
	import { settings } from "$lib/stores/settings";
</script>

<!-- {#slots} es donde se renderizarán las páginas -->
<slot />
