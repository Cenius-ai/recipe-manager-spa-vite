# Usage Guide

## Browsing Recipes

The home page (`/`) shows all recipes grouped by category. Use the **search bar** at the top to find recipes by title, description, or ingredient name. Click a **category badge** to filter by category.

## Viewing a Recipe

Click any recipe card to open its detail page (`/recipe/:id`). You'll see:

- Prep time, cook time, total time, and servings
- Full ingredient list with quantities
- Numbered step-by-step instructions
- An **"Add to Shopping List"** button that copies all ingredients to your shopping list

Use the **Edit** button to modify the recipe, or **Delete** to remove it permanently.

## Creating a Recipe

Click **Add Recipe** in the left navigation (or visit `/add`).

The form supports:

- **Dynamic ingredient rows** — click "+ Add Ingredient" to add more rows; click ✕ to remove
- **Dynamic step rows** — click "+ Add Step" to add more steps; click ✕ to remove
- Category and difficulty dropdowns
- Numeric prep time, cook time, and servings

Fill in at minimum a title, at least one ingredient, and at least one step. Click **Save Recipe** to add it to your collection. You'll be redirected to the new recipe's detail page.

To edit an existing recipe, click the **Edit** button on its detail page — the form pre-fills with the current values.

## Managing the Shopping List

Visit `/shopping-list` (🛒 Shopping List in the nav).

- **Add items manually** using the input field at the top
- Items from recipes appear automatically when you click "Add to Shopping List" on a recipe detail page
- **Check off items** as you buy them — checked items move to the "Checked" tab
- Checked state persists across page reloads
- Use **Clear Checked** to remove purchased items, or **Clear All** to start fresh

## Data Persistence

Everything is saved to your browser's localStorage. Your recipes and shopping list survive page reloads and browser restarts. No data is sent to any server — it stays on your device.

## Mobile Use

The app is fully responsive. On smaller screens, the left navigation rail moves to a bottom tab bar for easy thumb access.
