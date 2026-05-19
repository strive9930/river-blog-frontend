<template>
  <header class="navbar">
    <div class="navbar-inner">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
        <span class="logo-text">{{ siteTitle }}</span>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="navbar-nav">
        <!-- Static menu items -->
        <router-link
          v-for="item in staticNavItems"
          :key="item.name"
          :to="item.path"
          class="nav-link"
          active-class=""
          :class="{ active: isActiveRoute(item.path) }"
        >
          {{ item.name }}
        </router-link>

        <!-- Visible top-level dynamic menus -->
        <template v-for="menu in visibleTopLevelMenus" :key="menu.id">
          <!-- Has children: dropdown -->
          <div
            v-if="menu.children?.length"
            class="nav-dropdown"
            @mouseenter="openSubmenu(menu.id)"
            @mouseleave="scheduleSubmenuClose(menu.id)"
          >
            <button class="nav-link nav-dropdown-trigger" :class="{ active: isMenuActive(menu) }">
              <span>{{ menu.title || menu.name }}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" class="dropdown-arrow" :class="{ open: openSubmenuId === menu.id }">
                <path d="M3 4l2 2 2-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div
              v-show="openSubmenuId === menu.id"
              class="submenu-dropdown"
              @mouseenter="cancelSubmenuClose"
              @mouseleave="scheduleSubmenuClose(menu.id)"
            >
              <router-link
                v-for="child in menu.children"
                :key="child.id"
                :to="resolveMenuPath(child)"
                class="submenu-link"
                active-class=""
                :class="{ active: isActiveRoute(resolveMenuPath(child)) }"
                @click="closeAllDropdowns"
              >
                <span v-if="child.icon" class="submenu-icon">{{ child.icon }}</span>
                {{ child.title || child.name }}
              </router-link>
            </div>
          </div>
          <!-- No children: direct link -->
          <router-link
            v-else
            :to="resolveMenuPath(menu)"
            class="nav-link"
            active-class=""
            :class="{ active: isActiveRoute(resolveMenuPath(menu)) }"
          >
            {{ menu.title || menu.name }}
          </router-link>
        </template>

        <!-- More dropdown (overflow) -->
        <div v-if="hiddenTopLevelMenus.length" ref="moreMenuRef" class="nav-dropdown">
          <button class="nav-link nav-more-btn" @click="toggleMoreMenu">
            <span>More</span>
            <svg width="10" height="10" viewBox="0 0 10 10" class="dropdown-arrow" :class="{ open: showMoreMenu }">
              <path d="M3 4l2 2 2-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div v-show="showMoreMenu" class="more-dropdown">
            <template v-for="menu in hiddenTopLevelMenus" :key="menu.id">
              <!-- Parent with children: grouped -->
              <template v-if="menu.children?.length">
                <div class="more-group-label">{{ menu.title || menu.name }}</div>
                <router-link
                  v-for="child in menu.children"
                  :key="child.id"
                  :to="resolveMenuPath(child)"
                  class="more-dropdown-link more-dropdown-child"
                  active-class=""
                  :class="{ active: isActiveRoute(resolveMenuPath(child)) }"
                  @click="showMoreMenu = false"
                >
                  {{ child.title || child.name }}
                </router-link>
              </template>
              <!-- No children: direct link -->
              <router-link
                v-else
                :to="resolveMenuPath(menu)"
                class="more-dropdown-link"
                active-class=""
                :class="{ active: isActiveRoute(resolveMenuPath(menu)) }"
                @click="showMoreMenu = false"
              >
                {{ menu.title || menu.name }}
              </router-link>
            </template>
          </div>
        </div>

        <div class="navbar-actions">
          <!-- Guest: Login / Register -->
          <template v-if="!userStore.isLoggedIn">
            <router-link to="/login" class="btn btn-ghost">Login</router-link>
            <router-link to="/register" class="btn btn-primary">Sign Up</router-link>
          </template>

          <!-- Logged In: User Menu -->
          <div v-else ref="userMenuRef" class="user-menu">
            <button class="user-trigger" @click="toggleUserDropdown">
              <img
                :src="userStore.userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                :alt="userStore.userInfo?.nickName || 'User'"
                class="user-avatar"
              />
              <span class="user-name">{{ userStore.userInfo?.nickName || userStore.userInfo?.email || 'User' }}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" class="dropdown-arrow" :class="{ open: userDropdownOpen }">
                <path d="M3 4l2 2 2-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-show="userDropdownOpen" class="user-dropdown">
              <router-link to="/" class="user-dropdown-link">Dashboard</router-link>
              <a href="#" class="user-dropdown-link logout" @click.prevent="handleLogout">Sign Out</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Mobile Hamburger -->
      <button class="hamburger" :class="{ open: mobileMenuOpen }" @click="toggleMobileMenu" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition name="mobile-slide">
      <div v-show="mobileMenuOpen" class="mobile-menu">
        <!-- Static items -->
        <router-link
          v-for="item in staticNavItems"
          :key="item.name"
          :to="item.path"
          class="mobile-link"
          active-class=""
          :class="{ active: isActiveRoute(item.path) }"
          @click="mobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>

        <!-- Dynamic items with hierarchy -->
        <template v-for="menu in topLevelMenus" :key="menu.id">
          <template v-if="menu.children?.length">
            <button
              class="mobile-link mobile-parent"
              :class="{ active: isMenuActive(menu) }"
              @click="toggleMobileSubmenu(menu.id)"
            >
              <span>{{ menu.title || menu.name }}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" class="mobile-parent-arrow" :class="{ open: expandedMobileSubmenus.has(menu.id) }">
                <path d="M4 3l2 2 2-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-show="expandedMobileSubmenus.has(menu.id)" class="mobile-submenu">
              <router-link
                v-for="child in menu.children"
                :key="child.id"
                :to="resolveMenuPath(child)"
                class="mobile-link mobile-sub-link"
                active-class=""
                :class="{ active: isActiveRoute(resolveMenuPath(child)) }"
                @click="mobileMenuOpen = false"
              >
                {{ child.title || child.name }}
              </router-link>
            </div>
          </template>
          <router-link
            v-else
            :to="resolveMenuPath(menu)"
            class="mobile-link"
            active-class=""
            :class="{ active: isActiveRoute(resolveMenuPath(menu)) }"
            @click="mobileMenuOpen = false"
          >
            {{ menu.title || menu.name }}
          </router-link>
        </template>

        <div class="mobile-divider"></div>
        <template v-if="!userStore.isLoggedIn">
          <router-link to="/login" class="mobile-link" @click="mobileMenuOpen = false">Login</router-link>
          <router-link to="/register" class="mobile-link mobile-link-primary" @click="mobileMenuOpen = false">Sign Up</router-link>
        </template>
        <template v-else>
          <a href="#" class="mobile-link logout" @click.prevent="handleLogout">Sign Out</a>
        </template>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRoute, useRouter } from 'vue-router';
import type { MenuTree } from '@/types/api';
import { onClickOutside } from '@/composables/onClickOutside';

interface Props {
  siteTitle?: string;
  staticNavItems?: Array<{ name: string; path: string }>;
}

withDefaults(defineProps<Props>(), {
  siteTitle: 'River Blog',
  staticNavItems: () => [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ],
});

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

// State
const mobileMenuOpen = ref(false);
const userDropdownOpen = ref(false);
const showMoreMenu = ref(false);
const openSubmenuId = ref<string | null>(null);
const expandedMobileSubmenus = ref<Set<string>>(new Set());
const topLevelMenus = ref<MenuTree[]>([]);

let submenuCloseTimer: ReturnType<typeof setTimeout> | null = null;

// Computed
const maxVisibleTopLevel = 4;
const visibleTopLevelMenus = computed(() => topLevelMenus.value.slice(0, maxVisibleTopLevel));
const hiddenTopLevelMenus = computed(() => topLevelMenus.value.slice(maxVisibleTopLevel));

// Helpers
const resolveMenuPath = (menu: MenuTree): string => {
  return menu.path.startsWith('/') ? menu.path : `/${menu.path}`;
};

const isActiveRoute = (path: string) => route.path === path;

const isMenuActive = (menu: MenuTree): boolean => {
  if (isActiveRoute(resolveMenuPath(menu))) return true;
  if (menu.children?.length) {
    return menu.children.some(child => isActiveRoute(resolveMenuPath(child)));
  }
  return false;
};

// Submenu hover
const openSubmenu = (id: string) => {
  cancelSubmenuClose();
  openSubmenuId.value = id;
};

const scheduleSubmenuClose = (id: string) => {
  submenuCloseTimer = setTimeout(() => {
    if (openSubmenuId.value === id) {
      openSubmenuId.value = null;
    }
  }, 200);
};

const cancelSubmenuClose = () => {
  if (submenuCloseTimer) {
    clearTimeout(submenuCloseTimer);
    submenuCloseTimer = null;
  }
};

const closeAllDropdowns = () => {
  openSubmenuId.value = null;
  showMoreMenu.value = false;
  userDropdownOpen.value = false;
};

// Toggles
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  closeAllDropdowns();
};

const toggleUserDropdown = () => {
  userDropdownOpen.value = !userDropdownOpen.value;
  showMoreMenu.value = false;
};

const toggleMoreMenu = () => {
  showMoreMenu.value = !showMoreMenu.value;
  userDropdownOpen.value = false;
};

const toggleMobileSubmenu = (id: string) => {
  const set = expandedMobileSubmenus.value;
  if (set.has(id)) {
    set.delete(id);
  } else {
    set.add(id);
  }
  // Trigger reactivity
  expandedMobileSubmenus.value = new Set(set);
};

// Refs for click-outside
const moreMenuRef = ref<HTMLElement | null>(null);
const userMenuRef = ref<HTMLElement | null>(null);

onClickOutside(moreMenuRef, () => { showMoreMenu.value = false; });
onClickOutside(userMenuRef, () => { userDropdownOpen.value = false; });

const handleLogout = async () => {
  await userStore.logout();
  mobileMenuOpen.value = false;
  closeAllDropdowns();
  router.push('/login');
};

// Menu loading
const loadUserMenus = () => {
  if (userStore.isLoggedIn && userStore.menus?.length) {
    topLevelMenus.value = userStore.menus.filter(m => !m.parentId);
  } else {
    topLevelMenus.value = [];
  }
};

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    mobileMenuOpen.value = false;
  }
};

onMounted(() => {
  loadUserMenus();
  window.addEventListener('resize', handleResize);
});

watch(() => userStore.isLoggedIn, loadUserMenus);
watch(() => userStore.menus, loadUserMenus, { deep: true });

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (submenuCloseTimer) clearTimeout(submenuCloseTimer);
});
</script>

<style lang="scss" scoped>
// ---------- Header ----------
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  @include glass-morphism;
}

.navbar-inner {
  @include container;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--navbar-height);
}

// ---------- Logo ----------
.navbar-logo {
  text-decoration: none;
  flex-shrink: 0;
}

.logo-text {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  @include gradient-text;
}

// ---------- Nav Links ----------
.navbar-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: var(--space-2xl);
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: var(--font-size-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  border: none;
  background: none;
  cursor: pointer;
  transition: color var(--transition-fast);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: inherit;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--color-primary);
    border-radius: 2px;
    transition: all var(--transition-base);
    transform: translateX(-50%);
  }

  &:hover::after {
    width: 60%;
  }

  &:hover {
    color: var(--text-primary) !important;
  }

  &.active {
    color: var(--color-primary) !important;
    font-weight: 600;

    &::after { width: 60%; }
  }
}

.nav-link.btn:hover::after {
  width: 0;
}

// ---------- Dropdown (submenu) ----------
.nav-dropdown {
  position: relative;
}

.nav-dropdown-trigger {
  cursor: pointer;
}

.dropdown-arrow {
  transition: transform var(--transition-fast);
  &.open { transform: rotate(180deg); }
}

.submenu-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color-light);
  min-width: 180px;
  padding: var(--space-sm);
  z-index: var(--z-dropdown);
}

.submenu-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  white-space: nowrap;

  &:hover {
    background: var(--color-primary-50);
    color: var(--color-primary);
  }

  &.active {
    background: var(--color-primary-50);
    color: var(--color-primary);
    font-weight: 600;
  }
}

.submenu-icon {
  opacity: 0.6;
}

// ---------- More Dropdown ----------
.nav-more-btn {
  cursor: pointer;
}

.more-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color-light);
  min-width: 200px;
  max-height: 420px;
  overflow-y: auto;
  padding: var(--space-sm);
  z-index: var(--z-dropdown);
}

.more-group-label {
  padding: var(--space-sm) var(--space-md);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-top: var(--space-xs);

  &:first-child { margin-top: 0; }
}

.more-dropdown-link {
  display: block;
  padding: var(--space-sm) var(--space-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-primary-50);
    color: var(--color-primary);
  }

  &.active {
    background: var(--color-primary-50);
    color: var(--color-primary);
    font-weight: 600;
  }
}

.more-dropdown-child {
  padding-left: var(--space-xl);
  font-size: 13px;
}

// ---------- Actions ----------
.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-left: var(--space-lg);
}

.btn {
  text-decoration: none;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
  white-space: nowrap;
  border: none;
  cursor: pointer;
  line-height: 1.5;
}

.btn-ghost {
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-color);

  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary-100);
    background: var(--color-primary-50);
  }
}

.btn-primary {
  color: var(--text-inverse);
  background: var(--color-primary);

  &:hover {
    background: var(--color-primary-hover);
    color: var(--text-inverse);
  }
}

// ---------- User Menu ----------
.user-menu {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 4px 12px 4px 4px;
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  transition: background var(--transition-fast);

  &:hover {
    background: var(--color-gray-100);
  }
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 2px solid var(--border-color);
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-primary);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-arrow {
  color: var(--text-muted);
  transition: transform var(--transition-fast);
  &.open { transform: rotate(180deg); }
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color-light);
  min-width: 180px;
  padding: var(--space-sm);
  z-index: var(--z-dropdown);
}

.user-dropdown-link {
  display: block;
  padding: var(--space-sm) var(--space-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-gray-100);
    color: var(--text-primary);
  }

  &.logout:hover {
    background: #fef2f2;
    color: #ef4444;
  }
}

// ---------- Hamburger ----------
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-md);

  span {
    display: block;
    width: 100%;
    height: 2px;
    background: var(--text-primary);
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  &.open {
    span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  }
}

// ---------- Mobile Menu ----------
.mobile-menu {
  display: none;
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-card);
  padding: var(--space-sm);
  overflow-y: auto;
  z-index: var(--z-dropdown);
}

.mobile-link {
  display: block;
  width: 100%;
  padding: 14px var(--space-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;

  &:hover, &.active {
    background: var(--color-primary-50);
    color: var(--color-primary);
  }
}

.mobile-parent {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-parent-arrow {
  transition: transform var(--transition-fast);
  &.open { transform: rotate(180deg); }
}

.mobile-submenu {
  padding-left: var(--space-lg);
  border-left: 2px solid var(--color-gray-100);
  margin-left: var(--space-md);
}

.mobile-sub-link {
  font-size: var(--font-size-sm);
  padding: 10px var(--space-md);
}

.mobile-link-primary {
  color: var(--color-primary) !important;
  font-weight: 600;
}

.mobile-link.logout {
  color: #ef4444 !important;
  &:hover { background: #fef2f2; }
}

.mobile-divider {
  height: 1px;
  background: var(--border-color);
  margin: var(--space-sm) var(--space-md);
}

// ---------- Transitions ----------
.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.mobile-slide-enter-from,
.mobile-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// ---------- Responsive ----------
@media (max-width: 1023px) {
  .navbar-nav {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }
}
</style>
