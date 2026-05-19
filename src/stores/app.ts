import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useAppStore = defineStore('app', () => {
  const sidebarVisible = ref(true);
  const theme = ref<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  const applyTheme = (t: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  };

  // Initialize on creation
  applyTheme(theme.value);

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    applyTheme(theme.value);
  };

  const setTheme = (t: 'light' | 'dark') => {
    theme.value = t;
    applyTheme(t);
  };

  const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value;
  };

  return {
    sidebarVisible,
    theme,
    toggleSidebar,
    setTheme,
    toggleTheme,
  };
});
