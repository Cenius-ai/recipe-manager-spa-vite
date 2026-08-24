import { ref, watch } from 'vue';

const STORAGE_KEY = 'recipe-manager-shopping-list';

const items = ref([]);

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      items.value = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load shopping list from localStorage:', e);
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
  } catch (e) {
    console.error('Failed to save shopping list to localStorage:', e);
  }
}

export function useShoppingList() {
  loadFromStorage();

  watch(items, saveToStorage, { deep: true });

  function addItem(ingredientName, recipeId = null) {
    const name = ingredientName.trim();
    if (!name) return;

    const existing = items.value.find(
      (i) => i.name.toLowerCase() === name.toLowerCase() && !i.checked
    );
    if (existing) return;

    items.value.push({
      id: crypto.randomUUID(),
      name,
      checked: false,
      recipeId,
    });
  }

  function addIngredientsFromRecipe(ingredients, recipeTitle) {
    for (const ing of ingredients) {
      const label = ing.quantity
        ? `${ing.quantity}${ing.unit ? ' ' + ing.unit : ''} ${ing.name}`
        : ing.name;
      addItem(label, null);
    }
  }

  function toggleItem(id) {
    const item = items.value.find((i) => i.id === id);
    if (item) {
      item.checked = !item.checked;
    }
  }

  function removeItem(id) {
    const idx = items.value.findIndex((i) => i.id === id);
    if (idx !== -1) {
      items.value.splice(idx, 1);
    }
  }

  function clearChecked() {
    items.value = items.value.filter((i) => !i.checked);
  }

  function clearAll() {
    items.value = [];
  }

  const uncheckedCount = () => items.value.filter((i) => !i.checked).length;
  const checkedCount = () => items.value.filter((i) => i.checked).length;

  return {
    items,
    addItem,
    addIngredientsFromRecipe,
    toggleItem,
    removeItem,
    clearChecked,
    clearAll,
    uncheckedCount,
    checkedCount,
  };
}
