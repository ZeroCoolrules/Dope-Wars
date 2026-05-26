# Dope Wars: Empire - Deployment Instructions

## Game Info
- **Starting Cash:** $10,000
- **Starting Debt:** $15,000
- **Total Weeks:** 30
- **All 10 cities unlocked from the start**

## Prerequisites
- Node.js 18+ and npm

## Quick Start (Local Development)

```bash
# 1. Navigate to the project
cd app

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open http://localhost:5173 in your browser
```

## Build for Production

```bash
# 1. Navigate to the project
cd app

# 2. Install dependencies (if not already done)
npm install

# 3. Build the production bundle
npm run build

# 4. The built files are in the `dist/` folder
#    - index.html (entry point)
#    - assets/ (JS, CSS, and media files)
```

## Deploy to Any Static Host

The `dist/` folder contains everything you need. Just upload its contents to any static web host:

### Netlify
```bash
# Install netlify-cli if needed
npm install -g netlify-cli

# Deploy
cd app && npm run build && netlify deploy --dir=dist --prod
```

### Vercel
```bash
# Install vercel if needed
npm install -g vercel

# Deploy
cd app && npm run build && vercel --yes
```

### GitHub Pages
```bash
# Build first
cd app && npm run build

# Copy dist contents to your gh-pages branch or docs folder
# Then push to GitHub
```

### Manual Upload
Upload all files from the `app/dist/` folder to any web server, S3 bucket, or static hosting service.

## Project Structure

```
app/
  dist/              # Production build output (deploy this)
  public/            # Static assets (images, icons)
  src/
    components/      # React components
      MainMenu.tsx       # Title screen
      LevelSelect.tsx    # City selection
      DealerSelect.tsx   # Dealer archetype picker
      GameScreen.tsx     # Main gameplay (market, travel, inventory, shark)
      GameOver.tsx       # Victory / defeat screen
      Leaderboard.tsx    # High scores
      Settings.tsx       # Audio and reset options
      TutorialSlideshow.tsx  # 10-slide how-to-play
      EventModal.tsx     # Random event popups
    store/
      gameStore.ts     # All game logic (Zustand)
    types/
      game.ts          # TypeScript types and game data
    App.tsx            # Root component
    index.css          # Global styles (neon theme, CRT effects)
  package.json
  vite.config.ts
  tailwind.config.js
```

## Key Features

- **10 cities** with unique difficulty, volatility, and police presence
- **6 products** to trade (Weed, Acid, Shrooms, Speed, Heroin, Coke)
- **5 dealer types** with unique perks
- **Random events** (cops, muggers, market crashes, old lady visits)
- **Custom quantity trading** (MAX mode or +/- steppers)
- **End Week button** to advance time without traveling
- **Quick Travel** buttons directly on the market screen
- **10-slide visual tutorial** accessible from menu and gameplay
- **Twitter/X share** on game over
- **Persistent leaderboard** via localStorage
- **Neon-noir pixel art aesthetic** with CRT scanline overlay
