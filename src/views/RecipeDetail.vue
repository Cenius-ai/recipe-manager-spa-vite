<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRecipes } from '../composables/useRecipes.js';
import { useShoppingList } from '../composables/useShoppingList.js';

const route = useRoute();
const router = useRouter();
const { getRecipe, deleteRecipe } = useRecipes();
const { addIngredientsFromRecipe } = useShoppingList();

const recipe = computed(() => getRecipe(route.params.id));

function formatTime(minutes) {
  if (!minutes) return '\u2014';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function ingredientLabel(ing) {
  const parts = [];
  if (ing.quantity) parts.push(ing.quantity);
  if (ing.unit) parts.push(ing.unit);
  parts.push(ing.name);
  return parts.join(' ');
}

function handleAddToShoppingList() {
  if (!recipe.value) return;
  addIngredientsFromRecipe(recipe.value.ingredients, recipe.value.title);
  router.push('/shopping-list');
}

function handleDelete() {
  if (!recipe.value) return;
  if (confirm(`Delete "${recipe.value.title}"? This cannot be undone.`)) {
    deleteRecipe(recipe.value.id);
    router.push('/');
  }
}
</script>

<template>
  <div class="page" v-if="recipe">
    <router-link to="/" class="back-link">&larr; Back to recipes</router-link>

    <header class="detail-header">
      <div class="detail-meta">
        <span class="badge badge-accent">{{ recipe.category }}</span>
        <span class="badge">{{ recipe.difficulty }}</span>
      </div>
      <h1 class="detail-title">{{ recipe.title }}</h1>
      <p class="detail-desc">{{ recipe.description }}</p>
      <div class="detail-stats">
        <div class="stat">
          <span class="stat-label">Prep</span>
          <span class="stat-value">{{ formatTime(recipe.prepMinutes) }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Cook</span>
          <span class="stat-value">{{ formatTime(recipe.cookMinutes) }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Total</span>
          <span class="stat-value">{{ formatTime((recipe.prepMinutes || 0) + (recipe.cookMinutes || 0)) }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Servings</span>
          <span class="stat-value">{{ recipe.servings }}</span>
        </div>
      </div>
    </header>

    <section class="detail-section">
      <div class="section-header">
        <h2 class="section-title">Ingredients</h2>
        <button class="btn btn-secondary btn-sm" @click="handleAddToShoppingList">
          &#x1f6d2; Add to Shopping List
        </button>
      </div>
      <ul class="ingredient-list">
        <li v-for="ing in recipe.ingredients" :key="ing.id" class="ingredient-item">
          <span class="ingredient-bullet">&bull;</span>
          <span>{{ ingredientLabel(ing) }}</span>
        </li>
      </ul>
    </section>

    <section class="detail-section">
      <h2 class="section-title">Instructions</h2>
      <ol class="step-list">
        <li v-for="step in recipe.steps" :key="step.id" class="step-item">
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <div class="detail-actions">
      <router-link :to="'/add?edit=' + recipe.id" class="btn btn-secondary">
        &#x270f;&#xfe0f; Edit Recipe
      </router-link>
      <button class="btn btn-danger" @click="handleDelete">
        &#x1f5d1; Delete Recipe
      </button>
    </div>
  </div>

  <div v-else class="empty-state">
    <h3>Recipe Not Found</h3>
    <p>The recipe you are looking for does not exist or has been deleted.</p>
    <router-link to="/" class="btn btn-primary" style="margin-top: 1rem;">Back to Recipes</router-link>
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  margin-bottom: var(--space-lg);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.back-link:hover {
  color: var(--color-text-primary);
}

.detail-header {
  margin-bottom: var(--space-2xl);
}

.detail-meta {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.detail-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.detail-desc {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-lg);
}

.detail-stats {
  display: flex;
  gap: var(--space-xl);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.detail-section {
  margin-bottom: var(--space-2xl);
  padding: var(--space-lg);
  background: var(--color-surface-1);
  border: var(--border-width-thin) solid var(--color-border-hairline);
  border-radius: var(--radius-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0;
}

.ingredient-list {
  list-style: none;
}

.ingredient-item {
  display: flex;
  gap: var(--space-sm);
  padding: 0.5rem 0;
  font-size: 0.9375rem;
  color: var(--color-text-primary);
  border-bottom: var(--border-width-thin) solid var(--color-border-hairline);
}

.ingredient-item:last-child {
  border-bottom: none;
}

.ingredient-bullet {
  color: var(--color-accent);
  font-weight: 700;
}

.step-list {
  padding-left: 1.5rem;
}

.step-item {
  padding: 0.625rem 0;
  font-size: 0.9375rem;
  color: var(--color-text-primary);
  line-height: 1.6;
}

.step-item::marker {
  color: var(--color-accent);
  font-weight: 600;
}

.detail-actions {
  display: flex;
  gap: var(--space-md);
  padding-top: var(--space-lg);
  border-top: var(--border-width-thin) solid var(--color-border-hairline);
}

@media (max-width: 480px) {
  .detail-title {
    font-size: 1.5rem;
  }

  .detail-stats {
    gap: var(--space-md);
  }
}
</style>
