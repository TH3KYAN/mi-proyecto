# VitalCare - Sistema de Monitoreo de Signos Vitales 🏥

VitalCare es una plataforma moderna y profesional diseñada para el monitoreo en tiempo real de pacientes en entornos médicos. Este proyecto proporciona una interfaz de dashboard intuitiva, responsiva y funcional para profesionales de la salud.

## 🚀 Características Principales

### 📊 Dashboard e Interactividad
- **Panel de Control**: Vista resumida del estado general de los pacientes y alertas activas.
- **Reportes con Gráficas SVG**: Visualización dinámica de tendencias de signos vitales (FC, PA, SpO2, Temperatura).
- **Simulación de Hardware**: Sistema integrado para simular la captura de datos en tiempo real desde hardware externo con feedback visual progresivo.
- **Exportación de Datos**: Función para descargar reportes detallados en formato CSV.

### 👥 Gestión Integral
- **Módulo de Pacientes**: CRUD completo para el registro, edición y seguimiento de pacientes con indicadores de estado de salud.
- **Sistema de Alertas**: Clasificación de incidencias por severidad (Crítica, Alta, Media) con opción de reconocimiento y resolución.
- **Gestión de Usuarios**: Administración de personal médico con control de roles (Administrador, Clínico, Observador) y estados de cuenta.

### 📱 Diseño y UX
- **Responsividad Total**: Interfaz optimizada para el uso en dispositivos móviles, tablets y escritorio.
- **Estética Premium**: Diseño moderno con iconografía profesional (`Lucide Icons`), tipografía clara y paletas de colores armoniosas.
- **Navegación Intuitiva**: Sidebar lateral adaptativo y flujos de trabajo simplificados.

## 🛠️ Tecnologías Usadas

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **Iconos**: [Lucide Svelte](https://lucide.dev/)
- **Estilos**: Vanilla CSS (Modularizado y con variables de diseño)
- **Lógica**: JavaScript (ES6+)

## 📦 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd sb-frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   Visita `http://localhost:5173` para ver la aplicación.

## 📂 Estructura del Proyecto

- `src/routes/`: Contiene las páginas y la lógica de enrutamiento por pestañas (Pacientes, Alertas, Reportes, etc.).
- `src/lib/components/`: Componentes reutilizables como el Sidebar y elementos de la interfaz.
- `src/lib/stores/`: Gestión de estados globales como preferencias de usuario y configuración.
- `static/`: Activos estáticos como logos e imágenes.

---
Desarrollado con ❤️ para mejorar la eficiencia en el cuidado de la salud.
