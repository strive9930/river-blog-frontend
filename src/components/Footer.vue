<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand Column -->
        <div class="footer-col footer-brand">
          <h3 class="footer-logo">River Blog</h3>
          <p class="footer-desc">A place to share knowledge and technology. Built with passion and dedication.</p>
        </div>

        <!-- Quick Links Column -->
        <div class="footer-col">
          <h4 class="footer-heading">Quick Links</h4>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/blog">Blog</router-link></li>
            <li><router-link to="/about">About</router-link></li>
          </ul>
        </div>

        <!-- Connect Column -->
        <div class="footer-col">
          <h4 class="footer-heading">Connect</h4>
          <ul class="footer-links">
            <li><a href="https://github.com" target="_blank" rel="noopener">GitHub</a></li>
            <li><a href="mailto:contact@riverblog.com">Email</a></li>
            <li><a href="#">RSS Feed</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} River Blog. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<style lang="scss" scoped>
.site-footer {
  background: var(--bg-footer);
  color: var(--text-inverse);
  padding: var(--space-3xl) 0 var(--space-xl);
  margin-top: auto;
}

.footer-container {
  @include container;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-2xl);
  padding-bottom: var(--space-2xl);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-logo {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
  color: var(--text-inverse);
}

.footer-desc {
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  max-width: 300px;
}

.footer-heading {
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-md);
  color: rgba(255, 255, 255, 0.8);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: var(--space-sm);
  }

  a {
    color: rgba(255, 255, 255, 0.6);
    font-size: var(--font-size-sm);
    transition: color var(--transition-fast);

    &:hover {
      color: var(--text-inverse);
    }
  }
}

.footer-bottom {
  padding-top: var(--space-xl);
  text-align: center;

  p {
    margin: 0;
    font-size: var(--font-size-xs);
    color: rgba(255, 255, 255, 0.4);
  }
}

@media (max-width: 767px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  .footer-desc {
    max-width: 100%;
  }
}
</style>
