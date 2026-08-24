<script setup>
import { ref, computed } from 'vue';
import { useRecipes } from '../composables/useRecipes.js';
import RecipeCard from '../components/RecipeCard.vue';

const { recipes, recipesByCategory, searchRecipes } = useRecipes();

const searchQuery = ref('');
const selectedCategory = ref('All');

const categories = computed(() => {
  const cats = new Set(recipes.value.map((r) => r.category).filter(Boolean));
  return ['All', ...Array.from(cats).sort()];
});

const filteredRecipes = computed(() => {
  let result = searchRecipes(searchQuery.value);
  if (selectedCategory.value !== 'All') {
    result = result.filter((r) => r.category === selectedCategory.value);
  }
  return result;
});

const groupedRecipes = computed(() => {
  const groups = {};
  for (const r of filteredRecipes.value) {
    const cat = r.category || 'Uncategorized';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(r);
  }
  return groups;
});
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1 class="page-title">Recipes</h1>
      <p class="page-subtitle">{{ recipes.length }} recipes in your collection</p>
    </header>

    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search recipes or ingredients..."
          class="search-input"
        />
      </div>
      <div class="category-filters">
        <button
          v-for="cat in categories"
          :key="cat"
          class="badge"
          :class="{ 'badge-accent': selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <div v-if="filteredRecipes.length === 0" class="empty-state">
      <h3>No recipes found</h3>
      <p v-if="searchQuery">Try a different search term or clear the filters.</p>
      <p v-else>
        <router-link to="/add">Add your first recipe</router-link>
        to get started.
      </p>
    </div>

    <div v-else v-for="(groupRecipes, category) in groupedRecipes" :key="category" class="category-section">
      <h2 class="category-title">{{ category }}</h2>
      <div class="recipe-grid">
        <router-link
          v-for="recipe in groupRecipes"
          :key="recipe.id"
          :to="'/recipe/' + recipe.id"
          class="recipe-link"
        >
          <RecipeCard :recipe="recipe" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--space-xl);
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-top: var(--space-xs);
}

.toolbar {
  margin-bottom: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
  pointer-events: none;
}

.search-input {
  padding-left: 2.5rem;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.category-filters .badge {
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.category-section {
  margin-bottom: var(--space-2xl);
}

.category-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: var(--border-width-thin) solid var(--color-border-hairline);
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: var(--space-lg);
}

.recipe-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

@media (max-width: 480px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 1.375rem;
  }
}
</style>
