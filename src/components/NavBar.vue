<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const navLinks = [
  { to: '/', label: 'Recipes', icon: '📖' },
  { to: '/add', label: 'Add Recipe', icon: '➕' },
  { to: '/shopping-list', label: 'Shopping List', icon: '🛒' },
];
</script>

<template>
  <nav class="rail">
    <div class="rail-brand">
      <span class="rail-logo">🍳</span>
      <span class="rail-title">Recipe<br />Manager</span>
    </div>
    <ul class="rail-links">
      <li v-for="link in navLinks" :key="link.to">
        <router-link
          :to="link.to"
          class="rail-link"
          :class="{ active: route.path === link.to }"
          :title="link.label"
        >
          <span class="rail-link-icon">{{ link.icon }}</span>
          <span class="rail-link-label">{{ link.label }}</span>
        </router-link>
      </li>
    </ul>
    <div class="rail-footer">
      <p class="rail-hint">All data stored locally in your browser.</p>
    </div>
  </nav>
</template>

<style scoped>
.rail {
  width: var(--rail-width);
  min-width: var(--rail-width);
  height: 100vh;
  position: sticky;
  top: 0;
  background: var(--color-surface-1);
  border-right: var(--border-width-thin) solid var(--color-border-hairline);
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  z-index: 10;
  overflow-y: auto;
}

.rail-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-lg);
  border-bottom: var(--border-width-thin) solid var(--color-border-hairline);
}

.rail-logo {
  font-size: 1.75rem;
}

.rail-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-text-primary);
}

.rail-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  flex: 1;
}

.rail-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0.625rem var(--space-md);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
  min-height: 44px;
}

.rail-link:hover {
  background: var(--color-surface-2);
  color: var(--color-text-primary);
}

.rail-link.active {
  background: var(--color-accent-muted);
  color: var(--color-accent);
}

.rail-link-icon {
  font-size: 1.125rem;
  width: 1.5rem;
  text-align: center;
  flex-shrink: 0;
}

.rail-link-label {
  line-height: 1;
}

.rail-footer {
  margin-top: auto;
  padding-top: var(--space-lg);
  border-top: var(--border-width-thin) solid var(--color-border-hairline);
}

.rail-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

/* Tablet: compact icon-only rail */
@media (max-width: 900px) {
  .rail {
    width: 64px;
    min-width: 64px;
    padding: var(--space-md) var(--space-sm);
  }

  .rail-brand {
    justify-content: center;
    padding-bottom: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .rail-logo {
    font-size: 1.5rem;
  }

  .rail-title {
    display: none;
  }

  .rail-link {
    justify-content: center;
    padding: 0.625rem 0;
    gap: 0;
  }

  .rail-link-icon {
    width: auto;
    font-size: 1.25rem;
  }

  .rail-link-label {
    display: none;
  }

  .rail-footer {
    display: none;
  }
}

/* Mobile: bottom tab bar */
@media (max-width: 720px) {
  .rail {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    width: 100%;
    min-width: 0;
    height: auto;
    flex-direction: row;
    align-items: center;
    padding: 0;
    border-right: none;
    border-top: var(--border-width-thin) solid var(--color-border-hairline);
    z-index: 100;
    overflow-y: visible;
  }

  .rail-brand {
    display: none;
  }

  .rail-links {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    padding: var(--space-xs);
  }

  .rail-link {
    flex-direction: column;
    gap: 2px;
    padding: var(--space-xs) var(--space-sm);
    font-size: 0.6875rem;
    min-height: auto;
    border-radius: var(--radius-sm);
  }

  .rail-link-icon {
    font-size: 1.25rem;
  }

  .rail-link-label {
    display: block;
    font-size: 0.6875rem;
  }

  .rail-footer {
    display: none;
  }
}
</style>
