# FRS Tracker - Ravyn Summers MMA RPG

A Fight Readiness Score tracking dashboard for your MMA career RPG.

## Features

- **Activity Checklist** - Track daily activities grouped by priority (Core/Secondary/Tertiary)
- **FRS Calculation** - Real-time weighted score calculation
- **Fight Countdown** - Days remaining until your debut vs. Javon "The Blitz" Barnes
- **Weight Tracking** - Monitor your cut from 145 to 135 lbs
- **MCAT Pomodoro Tracker** - Track study sessions (high-weighted activity)
- **Camp History** - Visual history of your daily FRS scores
- **Win Probability** - Estimated chance of victory based on FRS vs opponent

## Deploy to Netlify

### Option 1: GitHub + Netlify (Recommended)

1. Create a new GitHub repository
2. Upload all these files to the repository
3. Go to [netlify.com](https://netlify.com) and sign in
4. Click "Add new site" → "Import an existing project"
5. Connect your GitHub account and select the repository
6. Netlify will auto-detect the settings from `netlify.toml`
7. Click "Deploy site"

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod
```

### Option 3: Drag & Drop

1. Run `npm install && npm run build` locally
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist` folder to deploy

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Data Storage

All data is stored in your browser's localStorage:
- Daily activity completions
- Weight entries
- MCAT pomodoro counts
- Camp history

Data persists between sessions but is browser-specific.

## Fight Details

- **Fighter**: Ravyn Summers (0-0)
- **Division**: Bantamweight (135 lbs)
- **Gym**: Iron Horse Wrestling Club
- **Coach**: Clay Peterson (Grizzled Wrestler)
- **Promotion**: NYC Cage Wars
- **First Fight**: February 22, 2026
- **Opponent**: Javon "The Blitz" Barnes (0-0, Hidden FRS: 3.8)

---

*"Hard 90-minute wrestling session today. Focus on takedown defense and chain-wrestling from the clinch."* — Coach Clay
