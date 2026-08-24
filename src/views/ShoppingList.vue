<script setup>
import { ref } from 'vue';
import { useShoppingList } from '../composables/useShoppingList.js';

const {
  items,
  addItem,
  toggleItem,
  removeItem,
  clearChecked,
  clearAll,
  uncheckedCount,
  checkedCount,
} = useShoppingList();

const newItemName = ref('');

function handleAddItem() {
  if (!newItemName.value.trim()) return;
  addItem(newItemName.value);
  newItemName.value = '';
}

const activeTab = ref('pending');
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div class="header-row">
        <div>
          <h1 class="page-title">Shopping List</h1>
          <p class="page-subtitle">
            {{ uncheckedCount() }} item{{ uncheckedCount() !== 1 ? 's' : '' }} to buy
            <template v-if="checkedCount()"> &middot; {{ checkedCount() }} checked</template>
          </p>
        </div>
      </div>
    </header>

    <!-- Add item form -->
    <form class="add-item-form" @submit.prevent="handleAddItem">
      <input
        v-model="newItemName"
        type="text"
        placeholder="Add an item to your list..."
        class="add-item-input"
      />
      <button type="submit" class="btn btn-primary" :disabled="!newItemName.trim()">
        Add
      </button>
    </form>

    <!-- Empty state -->
    <div v-if="items.length === 0" class="empty-state">
      <h3>Your shopping list is empty</h3>
      <p>
        Add items manually above, or browse
        <router-link to="/">recipes</router-link>
        and click &ldquo;Add to Shopping List&rdquo; on a recipe.
      </p>
    </div>

    <!-- Tabs -->
    <div v-else class="tabs">
      <button
        class="tab"
        :class="{ active: activeTab === 'pending' }"
        @click="activeTab = 'pending'"
      >
        To Buy ({{ uncheckedCount() }})
      </button>
      <button
        class="tab"
        :class="{ active: activeTab === 'checked' }"
        @click="activeTab = 'checked'"
      >
        Checked ({{ checkedCount() }})
      </button>
    </div>

    <!-- Pending items -->
    <ul v-if="activeTab === 'pending'" class="item-list">
      <li
        v-for="item in items.filter((i) => !i.checked)"
        :key="item.id"
        class="item-row"
      >
        <button
          class="check-btn"
          @click="toggleItem(item.id)"
          title="Mark as purchased"
        >
          <span class="check-circle"></span>
        </button>
        <span class="item-name">{{ item.name }}</span>
        <button
          class="btn-icon btn-icon-sm remove-btn"
          @click="removeItem(item.id)"
          title="Remove item"
        >
          &times;
        </button>
      </li>
    </ul>

    <!-- Checked items -->
    <ul v-if="activeTab === 'checked'" class="item-list">
      <li
        v-for="item in items.filter((i) => i.checked)"
        :key="item.id"
        class="item-row checked"
      >
        <button
          class="check-btn"
          @click="toggleItem(item.id)"
          title="Mark as not purchased"
        >
          <span class="check-circle checked-circle">&#10003;</span>
        </button>
        <span class="item-name">{{ item.name }}</span>
        <button
          class="btn-icon btn-icon-sm remove-btn"
          @click="removeItem(item.id)"
          title="Remove item"
        >
          &times;
        </button>
      </li>
      <li v-if="checkedCount() === 0" class="empty-tab">
        <p class="empty-tab-text">No checked items yet.</p>
      </li>
    </ul>

    <!-- Bulk actions -->
    <div v-if="items.length > 0" class="bulk-actions">
      <button
        v-if="checkedCount() > 0"
        class="btn btn-secondary btn-sm"
        @click="clearChecked"
      >
        Clear Checked
      </button>
      <button class="btn btn-danger btn-sm" @click="clearAll">
        Clear All
      </button>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 640px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--space-xl);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.add-item-form {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.add-item-input {
  flex: 1;
}

.tabs {
  display: flex;
  gap: 0;
  margin-bottom: var(--space-lg);
  border-bottom: var(--border-width-thin) solid var(--color-border-hairline);
}

.tab {
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.tab:hover {
  color: var(--color-text-secondary);
}

.tab.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.item-list {
  list-style: none;
}

.item-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0.625rem var(--space-md);
  border-radius: var(--radius-md);
  transition: background 0.1s ease;
}

.item-row:hover {
  background: var(--color-surface-2);
}

.check-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}

.check-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  display: block;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.check-btn:hover .check-circle {
  border-color: var(--color-accent);
}

.checked-circle {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.item-name {
  flex: 1;
  font-size: 0.9375rem;
}

.checked .item-name {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.remove-btn {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  opacity: 0;
  transition: opacity 0.1s ease;
}

.item-row:hover .remove-btn {
  opacity: 1;
}

.empty-tab {
  padding: var(--space-xl);
  text-align: center;
}

.empty-tab-text {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.bulk-actions {
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: var(--border-width-thin) solid var(--color-border-hairline);
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.375rem;
  }
}
</style>
