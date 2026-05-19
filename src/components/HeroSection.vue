<template>
  <section class="hero">
    <div class="hero-bg">
      <div class="hero-blob hero-blob-1"></div>
      <div class="hero-blob hero-blob-2"></div>
      <div class="hero-blob hero-blob-3"></div>
    </div>
    <div class="hero-content">
      <h1 class="hero-title">{{ title }}</h1>
      <p v-if="subtitle" class="hero-subtitle">{{ subtitle }}</p>
      <div v-if="showCta" class="hero-actions">
        <router-link :to="ctaLink" class="hero-cta">{{ ctaText }}</router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  showCta?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  showCta: false,
  ctaText: 'Get Started',
  ctaLink: '/',
});
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  padding: var(--space-3xl) var(--space-lg);
  margin-top: calc(-1 * var(--navbar-height) - var(--space-xl));
  margin-left: calc(-1 * var(--space-lg));
  margin-right: calc(-1 * var(--space-lg));
  border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-blob {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);

  &-1 {
    width: 500px;
    height: 500px;
    top: -100px;
    right: -100px;
    animation: float 20s infinite ease-in-out;
  }

  &-2 {
    width: 350px;
    height: 350px;
    bottom: -80px;
    left: -60px;
    animation: float 25s infinite ease-in-out;
    animation-delay: -7s;
  }

  &-3 {
    width: 200px;
    height: 200px;
    top: 40%;
    left: 40%;
    animation: float 18s infinite ease-in-out;
    animation-delay: -14s;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 700px;
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: 800;
  color: var(--text-inverse);
  margin-bottom: var(--space-md);
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.hero-subtitle {
  font-size: var(--font-size-xl);
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 var(--space-2xl);
  line-height: 1.5;
}

.hero-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

.hero-cta {
  display: inline-block;
  padding: 14px 36px;
  background: var(--color-white);
  color: var(--color-primary);
  font-weight: 600;
  font-size: var(--font-size-base);
  border-radius: var(--radius-xl);
  text-decoration: none;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-lg);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
    color: var(--color-primary-dark);
  }
}

@media (max-width: 767px) {
  .hero {
    min-height: 340px;
    padding: var(--space-2xl) var(--space-lg);
  }

  .hero-title {
    font-size: var(--font-size-4xl);
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
  }
}
</style>
