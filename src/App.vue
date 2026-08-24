<script setup>
import NavBar from './components/NavBar.vue';
</script>

<template>
  <NavBar />
  <main class="main-content">
    <router-view />
  </main>
</template>

<style scoped>
.main-content {
  flex: 1;
  padding: var(--space-2xl) var(--space-xl);
  overflow-y: auto;
  min-height: 100vh;
}

/* Tablet: compact rail — less horizontal padding */
@media (max-width: 900px) {
  .main-content {
    padding: var(--space-xl) var(--space-lg);
  }
}

/* Mobile: bottom bar — pad above it */
@media (max-width: 720px) {
  .main-content {
    padding: var(--space-lg) var(--space-md);
    padding-bottom: 5rem;
  }
}
</style>
