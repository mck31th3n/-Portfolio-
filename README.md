# Official Portfolio UI - Complete Setup ✅

## Location
`/Users/michaelmckeithen/Desktop/The Owl/portfolio/`

---

## Portfolio Structure

```
portfolio/
├── index.html                    Main landing page (all 3 projects)
├── README.md                     This file
│
├── nest/                         THE OWL
│   ├── owl_boot.html            Fingerprint boot animation
│   ├── owl_boot.css             Styling
│   └── owl_boot.js              Boot sequence logic
│
├── safe/                         S.A.F.E.
│   ├── index.html               Main UI (luxury obsidian & gold)
│   ├── styles-v4.css            Polished obsidian luxury theme
│   └── script-v4.js             Interactive features
│
└── executive_function/           EXECUTIVE FUNCTION
    ├── index.html               Presidential governance UI
    ├── styles.css               Elite styling
    ├── script.js                Simulation logic
    └── whitepaper.html          Project documentation
```

---

## The Three UIs

### 1. THE OWL - Complete Intelligence Interface
**File:** `nest/index.html`

**Features:**
- Animated logo intro with fingerprint pyramid and eye
- Full multi-page layout with navigation
- Hero section with live stats
- Problem/Solution presentation
- Five Finger showcase cards
- System architecture diagram
- System status panel

**Boot Sequence:**
1. ROYGBIV ripple animation
2. Fingerprint pyramid draws in
3. Owl eye appears at apex
4. "The OWL" text fades in
5. Interface reveals

**Stats Displayed:**
- **348K+ files analyzed** - Deep file system intelligence extraction
- **5 Intelligence Cores** - Specialized AI agents
- **13.6 GB storage recovered** - Space optimization

**Five Finger Intelligence Cores:**
- **ZELLE** (Purple #9B59B6) - Strategic Intelligence - ACTIVE
- **MUSE** (Orange #E67E22) - Creative Intelligence - ACTIVE
- **KEYSTONE** (Blue #4A90E2) - Foundation Intelligence - ACTIVE
- **VECTOR** (Gray #95A5A6) - Analytical Intelligence - ACTIVE
- **ALLY** (Green #27AE60) - Collaborative Intelligence - ACTIVE

**Architecture Diagram:**
- Shows YOUR FILES → OWL ORCHESTRATOR → Five Finger routing (Z, M, K, V, A) → LLM API LAYER

**Current Status:**
- "Coming Soon" overlay with foggy blur effect
- Full UI visible behind overlay
- "RETURN TO S.A.F.E." button active

### 2. S.A.F.E. - Luxury Obsidian & Gold
**File:** `safe/index.html`

**Design Theme:**
- **Polished Obsidian Black** (#000000, #0A0A0A, #121212)
- **Eclipse Gold** (#d4af37, #FFD700)
- **Glossy surfaces** with depth & shadow
- **Intelligence Spine** (left sidebar with live metrics)

**Key Features:**
- Two-Brain Architecture display
- Real-time performance metrics
- Operational mode selector
- Security indicators
- **Live Test Section** (shows 24hr test progress)

**Currently:** Running 24-hour live paper trading test

### 3. EXECUTIVE FUNCTION - Presidential/Elite UI
**File:** `executive_function/index.html`

**Design Theme:**
- Presidential command center aesthetic
- Warning screen with acknowledgment
- Role selection (Mr./Madam President)
- Quad-core AI advisor display (Alpha, Beta, Charlie, Delta)
- Crisis scenario selection

**Features:**
- High-fidelity geopolitical simulation
- Multi-perspective AI advisors
- Ethical complexity modeling
- Decision consequence analysis

---

## Navigation

**Main Portfolio Entry:** `file:///Users/michaelmckeithen/Desktop/The Owl/portfolio/index.html`
- **Automatically redirects to S.A.F.E.** (the main portfolio showcase)

**Project Access:**
- **S.A.F.E.** - Fully accessible and interactive
- **The Owl** - "Coming Soon" overlay with foggy blur (can glimpse UI behind)
- **Executive Function** - "Coming Soon" overlay with foggy blur (can glimpse UI behind)

Each project has a **"RETURN TO S.A.F.E."** button from the Coming Soon overlays.

---

## How to Update SAFE's 24-Hour Test Results

When SAFE finishes the 24-hour test (started 2025-12-11 23:03:51):

### Option 1: Manual Entry

1. Open `safe/index.html` in browser
2. Open developer console (F12)
3. Enter final values:
   ```javascript
   // Get values from: /Users/michaelmckeithen/Step/paper_trading_v4_portfolio_snapshot.csv

   // Example (replace with actual final values):
   const finalValue = 9716.96;  // portfolio_value from last CSV line
   const returnPct = -2.83;      // return_pct from last CSV line
   const cycles = 94;            // cycle_count from last CSV line
   const totalTrades = 470;      // line count from trades CSV

   // Display results on page
   document.querySelector('.test-return').textContent = returnPct.toFixed(2) + '%';
   document.querySelector('.test-cycles').textContent = cycles;
   ```

### Option 2: Edit HTML Directly

Edit `safe/index.html` and add a results section showing final stats.

### Data Sources (SAFE Test Results)
```
/Users/michaelmckeithen/Step/
├── paper_trading_v4_portfolio_snapshot.csv  (portfolio value over time)
├── paper_trading_v4_multi_asset.csv         (all trading decisions)
└── paper_trading_v4_council_decisions.csv   (strategic analyses)
```

---

## Design Notes

**Color Palette (Shared):**
- Primary Gold: #FFD700
- Eclipse Gold: #d4af37
- Obsidian Black: #000000
- Glossy Black: #0A0A0A

**Typography:**
- Display: Cinzel (serif)
- Body: Inter (sans-serif)
- Code/Mono: JetBrains Mono

**Effects:**
- Blur overlays: `backdrop-filter: blur(8px)`
- Glows: `box-shadow: 0 0 40px rgba(255, 215, 0, 0.3)`
- Smooth transitions: `cubic-bezier(0.34, 1.56, 0.64, 1)`

---

## Testing Checklist

✅ Main portfolio entry redirects to SAFE
✅ SAFE: Obsidian/gold luxury UI fully accessible
✅ The Owl: "Coming Soon" overlay active with foggy blur effect
✅ Executive Function: "Coming Soon" overlay active with foggy blur effect
✅ Both overlays allow glimpse of UI behind the blur
✅ "RETURN TO S.A.F.E." buttons work from both Coming Soon pages
✅ Live test indicator shows on SAFE UI

---

## Ready for Presentation

This is the **official portfolio** with:
- ✅ **S.A.F.E.** (luxury obsidian black and gold) - **LIVE & ACCESSIBLE**
- ✅ **The Owl** (fingerprint pyramid with stats dashboard) - **COMING SOON overlay**
- ✅ **Executive Function** (presidential/elite governance) - **COMING SOON overlay**

Portfolio defaults to S.A.F.E. as the main showcase until the other two are finalized!

---

**Open Portfolio:** `file:///Users/michaelmckeithen/Desktop/The Owl/portfolio/index.html`
