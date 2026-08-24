# Installation Guide

## Prerequisites

- **Node.js** 20 or later
- **npm** 9 or later (ships with Node.js)

## Steps

### 1. Install dependencies

```bash
sh install.sh
```

This runs `npm install` to populate `node_modules/`. No database setup or environment variables are needed — the app is fully client-side and uses localStorage for persistence.

### 2. Start the dev server

```bash
npm run dev
```

The server starts on **http://0.0.0.0:5173**. Open your browser and start browsing — demo recipes are automatically seeded on the first visit.

### 3. Build for production (optional)

```bash
npm run build
```

Output goes to `dist/`. Serve the files with any static file server.

## Notes

- No `.env` file is required. The app has no backend and reads no environment variables at runtime.
- All data is stored in your browser's localStorage. Clearing browser data will reset the app to its seeded state.
- The seed is idempotent — it runs only when localStorage is empty, so re-visiting won't overwrite your data.
