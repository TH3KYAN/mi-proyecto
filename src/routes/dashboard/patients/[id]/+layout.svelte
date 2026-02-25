<script>
    // Este layout en [id] permite que tanto /patients/[id] (signos vitales)
    // como /patients/[id]/consultas u otras subrutas se rendericen correctamente
    // Pasamos los datos de la URL a las páginas hijas mediante el layout (si es necesario)
</script>

<!-- Renderiza las sub-páginas aquí -->
<slot />
