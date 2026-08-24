<script setup>
import { reactive, ref } from 'vue';

const props = defineProps({
  initial: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Soup', 'Salad'];
const difficulties = ['Easy', 'Medium', 'Hard'];

function emptyIngredient() {
  return { id: crypto.randomUUID(), quantity: '', unit: '', name: '' };
}

function emptyStep() {
  return { id: crypto.randomUUID(), order: 1, text: '' };
}

const form = reactive({
  title: props.initial?.title || '',
  description: props.initial?.description || '',
  category: props.initial?.category || 'Dinner',
  difficulty: props.initial?.difficulty || 'Medium',
  prepMinutes: props.initial?.prepMinutes ?? '',
  cookMinutes: props.initial?.cookMinutes ?? '',
  servings: props.initial?.servings ?? '',
  ingredients: (props.initial?.ingredients || []).map((ing) => ({
    ...ing,
    id: ing.id || crypto.randomUUID(),
  })),
  steps: (props.initial?.steps || []).map((s) => ({
    ...s,
    id: s.id || crypto.randomUUID(),
  })),
});

if (form.ingredients.length === 0) {
  form.ingredients.push(emptyIngredient());
}
if (form.steps.length === 0) {
  form.steps.push(emptyStep());
}

const errors = ref({});

function addIngredient() {
  form.ingredients.push(emptyIngredient());
}

function removeIngredient(index) {
  if (form.ingredients.length > 1) {
    form.ingredients.splice(index, 1);
  }
}

function addStep() {
  form.steps.push(emptyStep());
}

function removeStep(index) {
  if (form.steps.length > 1) {
    form.steps.splice(index, 1);
    renumberSteps();
  }
}

function renumberSteps() {
  form.steps.forEach((s, i) => {
    s.order = i + 1;
  });
}

function validate() {
  const errs = {};

  if (!form.title.trim()) {
    errs.title = 'Title is required';
  }

  const validIngredients = form.ingredients.filter((ing) => ing.name.trim());
  if (validIngredients.length === 0) {
    errs.ingredients = 'At least one ingredient is required';
  }

  for (let i = 0; i < form.ingredients.length; i++) {
    const ing = form.ingredients[i];
    if (!ing.name.trim() && form.ingredients.length > 1) continue;
    if (ing.quantity !== '' && isNaN(Number(ing.quantity))) {
      errs[`ingredient_${i}_qty`] = 'Quantity must be a number';
    }
  }

  const validSteps = form.steps.filter((s) => s.text.trim());
  if (validSteps.length === 0) {
    errs.steps = 'At least one step is required';
  }

  if (form.prepMinutes !== '' && (isNaN(Number(form.prepMinutes)) || Number(form.prepMinutes) < 0)) {
    errs.prepMinutes = 'Must be a positive number';
  }
  if (form.cookMinutes !== '' && (isNaN(Number(form.cookMinutes)) || Number(form.cookMinutes) < 0)) {
    errs.cookMinutes = 'Must be a positive number';
  }
  if (form.servings !== '' && (isNaN(Number(form.servings)) || Number(form.servings) < 1)) {
    errs.servings = 'Must be at least 1';
  }

  errors.value = errs;
  return Object.keys(errs).length === 0;
}

function handleSubmit() {
  renumberSteps();
  if (!validate()) return;

  const cleanIngredients = form.ingredients
    .filter((ing) => ing.name.trim())
    .map((ing) => ({
      id: ing.id,
      quantity: ing.quantity === '' ? null : Number(ing.quantity),
      unit: ing.unit.trim(),
      name: ing.name.trim(),
    }));

  const cleanSteps = form.steps
    .filter((s) => s.text.trim())
    .map((s, i) => ({
      id: s.id,
      order: i + 1,
      text: s.text.trim(),
    }));

  const recipe = {
    id: props.initial?.id || crypto.randomUUID(),
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category,
    difficulty: form.difficulty,
    prepMinutes: Number(form.prepMinutes) || 0,
    cookMinutes: Number(form.cookMinutes) || 0,
    servings: Number(form.servings) || 1,
    imageUrl: '',
    ingredients: cleanIngredients,
    steps: cleanSteps,
    createdAt: props.initial?.createdAt || new Date().toISOString().split('T')[0],
  };

  emit('submit', recipe);
}

function getError(key) {
  return errors.value[key] || null;
}
</script>

<template>
  <form class="recipe-form" @submit.prevent="handleSubmit">
    <!-- Title -->
    <div class="form-group">
      <label class="form-label" for="title">Recipe Title</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        placeholder="e.g. Spicy Thai Basil Chicken"
        :class="{ 'input-error': getError('title') }"
      />
      <p v-if="getError('title')" class="form-error">{{ getError('title') }}</p>
    </div>

    <!-- Description -->
    <div class="form-group">
      <label class="form-label" for="desc">Description</label>
      <textarea
        id="desc"
        v-model="form.description"
        rows="2"
        placeholder="A short description of the dish..."
      ></textarea>
    </div>

    <!-- Meta row -->
    <div class="form-row">
      <div class="form-group form-group-inline">
        <label class="form-label" for="category">Category</label>
        <select id="category" v-model="form.category">
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="form-group form-group-inline">
        <label class="form-label" for="difficulty">Difficulty</label>
        <select id="difficulty" v-model="form.difficulty">
          <option v-for="d in difficulties" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
    </div>

    <div class="form-row form-row-triple">
      <div class="form-group form-group-inline">
        <label class="form-label" for="prep">Prep (min)</label>
        <input
          id="prep"
          v-model="form.prepMinutes"
          type="number"
          min="0"
          placeholder="10"
        />
        <p v-if="getError('prepMinutes')" class="form-error">{{ getError('prepMinutes') }}</p>
      </div>
      <div class="form-group form-group-inline">
        <label class="form-label" for="cook">Cook (min)</label>
        <input
          id="cook"
          v-model="form.cookMinutes"
          type="number"
          min="0"
          placeholder="25"
        />
        <p v-if="getError('cookMinutes')" class="form-error">{{ getError('cookMinutes') }}</p>
      </div>
      <div class="form-group form-group-inline">
        <label class="form-label" for="servings">Servings</label>
        <input
          id="servings"
          v-model="form.servings"
          type="number"
          min="1"
          placeholder="4"
        />
        <p v-if="getError('servings')" class="form-error">{{ getError('servings') }}</p>
      </div>
    </div>

    <!-- Ingredients -->
    <fieldset class="form-section">
      <legend class="form-section-title">Ingredients</legend>
      <p v-if="getError('ingredients')" class="form-error" style="margin-bottom:0.5rem">{{ getError('ingredients') }}</p>
      <div
        v-for="(ing, idx) in form.ingredients"
        :key="ing.id"
        class="ingredient-row"
      >
        <input
          v-model="ing.quantity"
          type="text"
          inputmode="decimal"
          placeholder="Qty"
          class="input-qty"
          :class="{ 'input-error': getError(`ingredient_${idx}_qty`) }"
        />
        <input
          v-model="ing.unit"
          type="text"
          placeholder="Unit"
          class="input-unit"
        />
        <input
          v-model="ing.name"
          type="text"
          placeholder="Ingredient name"
          class="input-name"
        />
        <button
          type="button"
          class="btn-icon btn-icon-sm"
          @click="removeIngredient(idx)"
          :disabled="form.ingredients.length <= 1"
          title="Remove ingredient"
        >
          ✕
        </button>
      </div>
      <p v-if="getError(`ingredient_0_qty`)" class="form-error">{{ getError('ingredient_0_qty') }}</p>
      <button type="button" class="btn btn-secondary btn-sm" @click="addIngredient">
        + Add Ingredient
      </button>
    </fieldset>

    <!-- Steps -->
    <fieldset class="form-section">
      <legend class="form-section-title">Steps</legend>
      <p v-if="getError('steps')" class="form-error" style="margin-bottom:0.5rem">{{ getError('steps') }}</p>
      <div
        v-for="(step, idx) in form.steps"
        :key="step.id"
        class="step-row"
      >
        <span class="step-number">{{ idx + 1 }}</span>
        <textarea
          v-model="step.text"
          rows="2"
          :placeholder="`Step ${idx + 1} instructions...`"
          class="input-step"
        ></textarea>
        <button
          type="button"
          class="btn-icon btn-icon-sm"
          @click="removeStep(idx)"
          :disabled="form.steps.length <= 1"
          title="Remove step"
        >
          ✕
        </button>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" @click="addStep">
        + Add Step
      </button>
    </fieldset>

    <!-- Actions -->
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">
        {{ initial ? 'Update Recipe' : 'Save Recipe' }}
      </button>
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
        Cancel
      </button>
    </div>
  </form>
</template>

<style scoped>
.recipe-form {
  max-width: 640px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.form-row-triple {
  grid-template-columns: 1fr 1fr 1fr;
}

.form-group-inline {
  margin-bottom: 0;
}

.form-section {
  border: var(--border-width-thin) solid var(--color-border-hairline);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.form-section-title {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary);
  padding: 0 var(--space-sm);
  margin-bottom: var(--space-md);
}

.ingredient-row {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
  margin-bottom: var(--space-sm);
}

.input-qty {
  width: 80px;
  flex-shrink: 0;
}

.input-unit {
  width: 100px;
  flex-shrink: 0;
}

.input-name {
  flex: 1;
}

.step-row {
  display: flex;
  gap: var(--space-sm);
  align-items: flex-start;
  margin-bottom: var(--space-sm);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-surface-3);
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 0.5rem;
}

.input-step {
  flex: 1;
  resize: vertical;
}

.btn-icon-sm {
  width: 36px;
  height: 36px;
  min-height: 36px;
  font-size: 0.75rem;
  flex-shrink: 0;
  align-self: center;
}

.form-actions {
  display: flex;
  gap: var(--space-md);
  padding-top: var(--space-md);
}

.input-error {
  border-color: var(--color-danger);
}

@media (max-width: 480px) {
  .form-row,
  .form-row-triple {
    grid-template-columns: 1fr;
  }

  .ingredient-row {
    flex-wrap: wrap;
  }

  .input-qty {
    width: 60px;
  }

  .input-unit {
    width: 80px;
  }
}
</style>
