<template>
  <div class="about-page">
    <!-- Page Header -->
    <div class="about-hero">
      <h1 class="about-title">About River Blog</h1>
      <p class="about-subtitle">A modern blog platform built with passion and the latest web technologies.</p>
    </div>

    <!-- Mission -->
    <div class="about-section">
      <h2 class="section-heading">Our Mission</h2>
      <p class="section-text">
        River Blog is dedicated to sharing high-quality technical articles and practical experience.
        We believe in the power of knowledge sharing and community-driven learning. Our goal is to
        create a platform where developers can learn, share, and grow together.
      </p>
    </div>

    <!-- Tech Stack -->
    <div class="about-section">
      <h2 class="section-heading">Tech Stack</h2>
      <div class="tech-grid">
        <div class="tech-card">
          <div class="tech-icon tech-icon-vue">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
          </div>
          <h3>Vue 3</h3>
          <p>Composition API, TypeScript, and modern SFC syntax</p>
        </div>
        <div class="tech-card">
          <div class="tech-icon tech-icon-ts">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="1" y="1" width="22" height="22" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M7 13l3-8 3 8M8 11h4" stroke="currentColor" stroke-width="1.5"/></svg>
          </div>
          <h3>TypeScript</h3>
          <p>Static type checking for robust application development</p>
        </div>
        <div class="tech-card">
          <div class="tech-icon tech-icon-plus">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="1.5"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <h3>Element Plus</h3>
          <p>Professional UI component library for Vue 3</p>
        </div>
        <div class="tech-card">
          <div class="tech-icon tech-icon-pinia">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="1.5"/></svg>
          </div>
          <h3>Pinia</h3>
          <p>Intuitive state management with full TypeScript support</p>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="about-section">
      <h2 class="section-heading">Features</h2>
      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-bullet"></div>
          <div>
            <h4>Modern UI Design</h4>
            <p>Clean and responsive interface inspired by modern design trends</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-bullet"></div>
          <div>
            <h4>RBAC Permission System</h4>
            <p>Fine-grained role-based access control for content management</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-bullet"></div>
          <div>
            <h4>Responsive Layout</h4>
            <p>Optimized viewing experience across desktop, tablet, and mobile</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-bullet"></div>
          <div>
            <h4>Dynamic Routing</h4>
            <p>Menu-driven route generation based on user permissions</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact -->
    <div class="about-section">
      <h2 class="section-heading">Contact</h2>
      <p class="section-text">
        Have questions or suggestions? Feel free to reach out.
      </p>
      <div class="contact-links">
        <a href="mailto:contact@riverblog.com" class="contact-link">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M2 5l8 6 8-6" stroke="currentColor" stroke-width="1.5"/></svg>
          contact@riverblog.com
        </a>
        <a href="https://github.com" target="_blank" rel="noopener" class="contact-link">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38v-1.32c-2.23.48-2.69-1.07-2.69-1.07-.36-.93-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.24.83 1.24.83.72 1.23 1.89.88 2.35.67.07-.52.28-.88.51-1.08-1.79-.2-3.67-.89-3.67-3.98 0-.88.31-1.6.83-2.16-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.83a7.68 7.68 0 014 0c1.53-1.04 2.2-.83 2.2-.83.44 1.11.16 1.93.08 2.13.51.56.83 1.28.83 2.16 0 3.1-1.89 3.78-3.69 3.98.29.25.55.74.55 1.5v2.22c0 .21.15.46.55.38A8 8 0 0010 2z" fill="currentColor"/></svg>
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  animation: fade-in 0.5s ease;
}

// ---------- Hero ----------
.about-hero {
  text-align: center;
  padding: var(--space-2xl) 0;
  margin-bottom: var(--space-2xl);
}

.about-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-md);
}

.about-subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-muted);
  margin: 0;
  max-width: 500px;
  margin: 0 auto;
}

// ---------- Sections ----------
.about-section {
  margin-bottom: var(--space-3xl);
}

.section-heading {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  border-bottom: 2px solid var(--color-gray-100);
}

.section-text {
  font-size: var(--font-size-lg);
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0;
}

// ---------- Tech Grid ----------
.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
}

.tech-card {
  @include card;
  padding: var(--space-xl);
  text-align: center;

  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: var(--space-md) 0 var(--space-sm);
  }

  p {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }
}

.tech-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  &-vue { background: #ebfbf0; color: #42b883; }
  &-ts { background: #e8f0fe; color: #3178c6; }
  &-plus { background: #e6f0ff; color: #409eff; }
  &-pinia { background: #fef9e7; color: #f59e0b; }
}

// ---------- Features ----------
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
}

.feature-item {
  @include card-base;
  display: flex;
  gap: var(--space-md);
  padding: var(--space-lg);

  h4 {
    font-size: var(--font-size-base);
    font-weight: 600;
    margin-bottom: var(--space-xs);
  }

  p {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin: 0;
  }
}

.feature-bullet {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  margin-top: 8px;
  flex-shrink: 0;
}

// ---------- Contact ----------
.contact-links {
  display: flex;
  gap: var(--space-lg);
  margin-top: var(--space-lg);
}

.contact-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-gray-50);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-primary-50);
    color: var(--color-primary);
  }
}

@media (max-width: 767px) {
  .tech-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }

  .contact-links {
    flex-direction: column;
  }
}
</style>
