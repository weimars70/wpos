import { defineStore } from 'pinia';
import { setCssVar, Dark } from 'quasar';
import { WPOS_THEMES, WposTheme } from '../themes/themes';

const STORAGE_KEY = 'wpos_active_theme_id';

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '25, 118, 210';
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    activeThemeId: 'corporate-blue' as string,
    isDarkMode: false as boolean
  }),
  getters: {
    activeTheme(): WposTheme {
      return WPOS_THEMES.find(t => t.id === this.activeThemeId) || WPOS_THEMES[0];
    },
    allThemes(): WposTheme[] {
      return WPOS_THEMES;
    }
  },
  actions: {
    setTheme(themeId: string) {
      const theme = WPOS_THEMES.find(t => t.id === themeId) || WPOS_THEMES[0];
      this.activeThemeId = theme.id;
      const rgbPrimary = hexToRgb(theme.primary);

      // Aplicar variables CSS mediante helper de Quasar
      setCssVar('primary', theme.primary);
      setCssVar('secondary', theme.secondary);
      setCssVar('accent', theme.accent);
      setCssVar('positive', theme.positive);
      setCssVar('negative', theme.negative);
      setCssVar('warning', theme.warning);
      setCssVar('info', theme.info);

      // Inyección directa en el DOM para asegurarnos de que la actualización se aplique
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.style.setProperty('--q-primary', theme.primary);
        root.style.setProperty('--q-primary-rgb', rgbPrimary);
        root.style.setProperty('--q-secondary', theme.secondary);
        root.style.setProperty('--q-accent', theme.accent);
        root.style.setProperty('--q-positive', theme.positive);
        root.style.setProperty('--q-negative', theme.negative);
        root.style.setProperty('--q-warning', theme.warning);
        root.style.setProperty('--q-info', theme.info);

        document.body.style.setProperty('--q-primary', theme.primary);
        document.body.style.setProperty('--q-primary-rgb', rgbPrimary);
        document.body.style.setProperty('--q-secondary', theme.secondary);
        document.body.style.setProperty('--q-accent', theme.accent);
        document.body.style.setProperty('--q-positive', theme.positive);
        document.body.style.setProperty('--q-negative', theme.negative);
        document.body.style.setProperty('--q-warning', theme.warning);
        document.body.style.setProperty('--q-info', theme.info);
      }

      // Si el tema está etiquetado como modo oscuro por defecto
      if (theme.dark !== undefined) {
        Dark.set(theme.dark);
        this.isDarkMode = theme.dark;
      }

      localStorage.setItem(STORAGE_KEY, theme.id);
    },
    toggleDarkMode() {
      Dark.toggle();
      this.isDarkMode = Dark.isActive;
    },
    initTheme() {
      const savedThemeId = localStorage.getItem(STORAGE_KEY);
      if (savedThemeId) {
        this.setTheme(savedThemeId);
      } else {
        this.setTheme('corporate-blue');
      }
      this.isDarkMode = Dark.isActive;
    }
  }
});
