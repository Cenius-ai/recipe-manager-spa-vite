import { createRouter, createWebHistory } from 'vue-router';
import RecipeList from '../views/RecipeList.vue';
import RecipeDetail from '../views/RecipeDetail.vue';
import AddRecipe from '../views/AddRecipe.vue';
import ShoppingList from '../views/ShoppingList.vue';

const routes = [
  { path: '/', name: 'home', component: RecipeList },
  { path: '/recipe/:id', name: 'recipe-detail', component: RecipeDetail },
  { path: '/add', name: 'add-recipe', component: AddRecipe },
  { path: '/shopping-list', name: 'shopping-list', component: ShoppingList },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: { template: '<div class="empty-state"><h3>Page Not Found</h3><p>The page you are looking for does not exist.</p></div>' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
