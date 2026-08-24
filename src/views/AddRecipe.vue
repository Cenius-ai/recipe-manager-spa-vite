<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRecipes } from '../composables/useRecipes.js';
import RecipeForm from '../components/RecipeForm.vue';

const route = useRoute();
const router = useRouter();
const { getRecipe, addRecipe, updateRecipe } = useRecipes();

const editId = computed(() => route.query.edit || null);
const existingRecipe = computed(() => (editId.value ? getRecipe(editId.value) : null));

const isEditing = computed(() => !!existingRecipe.value);

function handleSubmit(recipe) {
  if (isEditing.value) {
    updateRecipe(existingRecipe.value.id, recipe);
  } else {
    addRecipe(recipe);
  }
  router.push('/recipe/' + recipe.id);
}

function handleCancel() {
  if (isEditing.value) {
    router.push('/recipe/' + existingRecipe.value.id);
  } else {
    router.push('/');
  }
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1 class="page-title">{{ isEditing ? 'Edit Recipe' : 'Add Recipe' }}</h1>
      <p class="page-subtitle">
        {{ isEditing
          ? 'Update the details of your recipe.'
          : 'Create a new recipe to add to your collection.' }}
      </p>
    </header>

    <RecipeForm
      :initial="existingRecipe"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
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
</style>
