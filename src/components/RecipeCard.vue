<script setup>
defineProps({
  recipe: {
    type: Object,
    required: true,
  },
});

function formatTime(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

const categoryColors = {
  Breakfast: '#d4a853',
  Lunch: '#5b9e8a',
  Dinner: '#c2695a',
  Dessert: '#b07cc6',
  Soup: '#c9a050',
  Salad: '#6dad5a',
};
</script>

<template>
  <div class="recipe-card card">
    <div class="card-image">
      <div
        class="card-placeholder"
        :style="{ background: categoryColors[recipe.category] || '#35383c' }"
      >
        <span class="card-emoji">{{ recipe.category === 'Breakfast' ? '🥞' : recipe.category === 'Dessert' ? '🍰' : recipe.category === 'Soup' ? '🍲' : recipe.category === 'Salad' ? '🥗' : '🍽️' }}</span>
      </div>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span class="badge badge-accent">{{ recipe.category }}</span>
        <span class="card-time">{{ formatTime(recipe.prepMinutes + recipe.cookMinutes) }}</span>
      </div>
      <h3 class="card-title">{{ recipe.title }}</h3>
      <p class="card-desc">{{ recipe.description }}</p>
      <div class="card-footer">
        <span class="card-difficulty">{{ recipe.difficulty }}</span>
        <span class="card-servings">{{ recipe.servings }} servings</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-card {
  display: flex;
  flex-direction: column;
  transition: border-color 0.15s ease;
}

.recipe-card:hover {
  border-color: var(--color-border);
}

.card-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-emoji {
  font-size: 2.5rem;
  opacity: 0.8;
}

.card-body {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.card-time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--color-text-primary);
}

.card-desc {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-sm);
  border-top: var(--border-width-thin) solid var(--color-border-hairline);
}

.card-difficulty {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.card-servings {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
