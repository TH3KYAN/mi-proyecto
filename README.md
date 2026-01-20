# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# Sistema de Monitoreo VitalCare 🏥

Proyecto de gestión hospitalaria desarrollado con **Svelte 5** y **Tailwind CSS**.

## Estructura del Proyecto
- `/`: Pantalla de Login.
- `/alerts`: Panel de control de alertas críticas.
- `/usuarios`: Gestión de personal médico.

## Cómo ejecutarlo localmente
1. Clona el repositorio.
2. Ejecuta `npm install` para instalar las dependencias.
3. Ejecuta `npm run dev` para iniciar el servidor de desarrollo.