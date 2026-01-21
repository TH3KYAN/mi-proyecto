import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Valores por defecto
const defaultSettings = {
    theme: 'Sistema',
    language: 'Español'
};

// Función para obtener valores iniciales de localStorage
const getInitialSettings = () => {
    if (browser) {
        const stored = localStorage.getItem('appSettings');
        if (stored) {
            return JSON.parse(stored);
        }
    }
    return defaultSettings;
};

export const settings = writable(getInitialSettings());

// Suscribirse para guardar cambios en localStorage
if (browser) {
    settings.subscribe((value) => {
        localStorage.setItem('appSettings', JSON.stringify(value));

        // Aplicar tema
        applyTheme(value.theme);
    });
}

/**
 * @param {string} theme
 */
function applyTheme(theme) {
    if (!browser) return;

    const root = document.documentElement;
    const isDark = theme === 'Oscuro' ||
        (theme === 'Sistema' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        root.setAttribute('data-theme', 'dark');
    } else {
        root.setAttribute('data-theme', 'light');
    }
}
