import { computed } from 'vue';
import { useThemeStore } from '../stores/theme';
import { WPOS_THEMES, WposTheme } from './themes';

export function useTheme() {
  const themeStore = useThemeStore();

  const currentTheme = computed<WposTheme>(() => themeStore.activeTheme);
  const themesList = computed<WposTheme[]>(() => WPOS_THEMES);
  const isDark = computed(() => themeStore.isDarkMode);

  function setTheme(themeId: string) {
    themeStore.setTheme(themeId);
  }

  function toggleDark() {
    themeStore.toggleDarkMode();
  }

  return {
    currentTheme,
    themesList,
    isDark,
    setTheme,
    toggleDark
  };
}
