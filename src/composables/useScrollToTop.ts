import { ref, onMounted, onUnmounted } from 'vue';

export function useScrollToTop(threshold = 300) {
  const isVisible = ref(false);

  const handleScroll = () => {
    isVisible.value = window.scrollY > threshold;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return {
    isVisible,
    scrollToTop,
  };
}
