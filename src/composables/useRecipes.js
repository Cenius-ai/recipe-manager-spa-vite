import { ref, watch } from 'vue';
import seedRecipes from '../data/seedRecipes.js';

const STORAGE_KEY = 'recipe-manager-recipes';

const recipes = ref([]);

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      recipes.value = JSON.parse(raw);
      return true;
    }
  } catch (e) {
    console.error('Failed to load recipes from localStorage:', e);
  }
  return false;
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes.value));
  } catch (e) {
    console.error('Failed to save recipes to localStorage:', e);
  }
}

function seedIfEmpty() {
  if (!loadFromStorage() || recipes.value.length === 0) {
    recipes.value = [...seedRecipes];
    saveToStorage();
  }
}

export function useRecipes() {
  if (recipes.value.length === 0) {
    seedIfEmpty();
  }

  watch(recipes, saveToStorage, { deep: true });

  function getRecipe(id) {
    return recipes.value.find((r) => r.id === id) || null;
  }

  function addRecipe(recipe) {
    recipes.value.unshift(recipe);
  }

  function deleteRecipe(id) {
    const idx = recipes.value.findIndex((r) => r.id === id);
    if (idx !== -1) {
      recipes.value.splice(idx, 1);
    }
  }

  function updateRecipe(id, updates) {
    const recipe = recipes.value.find((r) => r.id === id);
    if (recipe) {
      Object.assign(recipe, updates);
    }
  }

  function recipesByCategory() {
    const groups = {};
    for (const r of recipes.value) {
      const cat = r.category || 'Uncategorized';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(r);
    }
    return groups;
  }

  function searchRecipes(query) {
    const q = query.toLowerCase().trim();
    if (!q) return recipes.value;
    return recipes.value.filter((r) => {
      const inTitle = r.title.toLowerCase().includes(q);
      const inDesc = r.description.toLowerCase().includes(q);
      const inIngredients = r.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(q)
      );
      return inTitle || inDesc || inIngredients;
    });
  }

  return {
    recipes,
    getRecipe,
    addRecipe,
    deleteRecipe,
    updateRecipe,
    recipesByCategory,
    searchRecipes,
  };
}
