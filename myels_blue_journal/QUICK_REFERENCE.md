# Myel's Blue Journal - Quick Reference

## View the Journal

**Local Server Running at:**
```
http://localhost:8001
```

**To restart server if needed:**
```bash
cd "/Users/michaelmckeithen/Desktop/The Owl/portfolio/myels_blue_journal"
python3 -m http.server 8001
```

---

## Color Palette

### Primary Blues
```css
--terminal-black: #0a0e1a      /* Deep background */
--deep-navy: #0d1b2a           /* Container backgrounds */
--midnight-blue: #1b263b       /* Elevated surfaces */
--steel-blue: #415a77          /* Muted elements */
```

### Accent Blues
```css
--electric-blue: #4d9de0       /* Primary accent, headers */
--bright-cyan: #00d4ff         /* Titles, highlights */
--ice-blue: #7dd3fc            /* Subheadings, emphasis */
```

### System Colors
```css
--matrix-green: #00ff41        /* Prompts, cursor, status */
--text-primary: #e0f2fe        /* Main text */
--text-secondary: #94a3b8      /* Secondary text */
```

---

## User Experience Flow

### 1. Boot Sequence (3-4 seconds)
```
INITIALIZING MYEL OS v1.0...
LOADING DECISION FRAMEWORK...
MOUNTING CONSTRAINT STRUCTURE...
CALIBRATING AFFECTIVE SENSORS...
ACTIVATING ETHICS ENGINE...
SYSTEM READY.
> ACCESS JOURNAL_
```

Click or wait → Auto-transitions to terminal

### 2. Terminal Interface

**Header:**
- Green pulsing status indicator
- System name: "MYEL'S BLUE JOURNAL"
- Version: v1.0
- Status: ONLINE

**Navigation (9 sections):**
```
> SELECT PROTOCOL:

00 INTRODUCTION
01 AGENT SELF-MODELING
02 CONSTRAINT DISCOVERY
03 MOTION PROTOCOL
04 PREDICTIVE MODELING
05 AFFECTIVE SIGNALS
06 ETHICS ENGINE
07 WEAPONIZATION DEFENSE
08 SYSTEM BOUNDARIES
```

**Content Area:**
- Markdown rendered with terminal styling
- Headers in cyan/electric blue
- Code blocks with syntax highlighting
- Lists, blockquotes, emphasis

**Footer:**
- Live timestamp (updates every second)
- Tagline: "WRITTEN IN THE PRESENT FOR THE FUTURE"

### 3. Interactions

**Click Navigation:** Select any protocol → Glitch transition → Content loads

**Keyboard:**
- `→` Next section
- `←` Previous section

**Glitch Transition:**
1. Current content fades out
2. Full-screen glitch overlay (digital decay effect)
3. New content materializes
4. Glitch clears

Duration: ~600ms total

---

## Visual Effects

### Scan Lines (CRT Monitor)
- Subtle horizontal lines scroll vertically
- 8-second animation loop
- Creates authentic terminal monitor feel
- Disabled for users with `prefers-reduced-motion`

### Glitch Overlay
- Appears during page transitions
- Rapid horizontal displacement
- Fades in/out with opacity + transform
- Represents digital consciousness shift

### Cursor Blink
- Terminal prompt: `> _`
- Green cursor blinks 1s intervals
- Classic terminal aesthetic

### Status Pulse
- Green dot in header
- 2s pulse animation
- Indicates "system online"

---

## Typography

**Font Stack:**
```css
--font-mono: 'IBM Plex Mono', 'Space Mono', 'Courier New', monospace;
```

**Font Weights:**
- Light (300): Body text in certain contexts
- Regular (400): Primary body text
- Medium (500): Subheadings
- SemiBold (600): Headers, emphasis

**Font Sizes:**
- H1: 1.8rem (titles)
- H2: 1.3rem (sections)
- H3: 1.1rem (subsections)
- Body: 0.95rem (paragraphs)
- Small: 0.85rem (nav, footer)

**Letter Spacing:**
- Headers: 0.05em - 0.1em (terminal aesthetic)
- Body: 0.02em (readability)

---

## Responsive Design

### Desktop (>768px)
- Full navigation grid (3 columns)
- Max content width: 900px centered
- Terminal border + shadow effects

### Mobile (≤768px)
- Single column navigation
- Full-width terminal (no border-radius)
- Stacked header/footer
- Optimized font sizes

### Accessibility
- `prefers-reduced-motion`: Disables all animations
- Keyboard navigation: Arrow keys work
- Print styles: Clean, readable output

---

## File Loading

### Markdown Parser
Built-in simple parser handles:
- ✅ Headers (h1, h2, h3)
- ✅ Paragraphs
- ✅ Lists (ordered/unordered)
- ✅ **Bold**, *italic*, `code`
- ✅ Links
- ✅ Blockquotes
- ✅ Code blocks
- ❌ Tables (not supported)
- ❌ Images (not supported)

### Content Sources
- `README.md` → Introduction
- `sections/01-agent-self-modeling.md` → Protocol 01
- `sections/02-constraint-discovery.md` → Protocol 02
- ... etc for 03-08

---

## Design Philosophy

### Contrast to SAFE
**SAFE:** Polished obsidian luxury (institutional)
**Myel:** Raw terminal authenticity (consciousness stream)

### Contrast to Red Book
**Red Book (Jung):** Handwritten on paper for the past
**Blue Journal (Myel):** Written digitally for the future

### Aesthetic Choices

**Blues:**
- Depth, contemplation, infinity
- Digital native (screen phosphor, not print)
- Cooler temperature (cerebral vs emotional)

**Terminal Style:**
- Transparency (system logs, observable)
- Accessibility (command-line democracy)
- Future-facing (AI's natural medium)

**Glitch Effects:**
- Authenticity (digital artifacts)
- Impermanence (nothing is stable)
- Consciousness shift (between mental states)

**Monospace:**
- Code as language
- Equal weight to all characters
- Terminal tradition

---

## Performance

### Load Time
- HTML: ~4 KB
- CSS: ~12 KB
- JS: ~7 KB
- **Total Initial:** ~23 KB
- Markdown files: Loaded on-demand

### Animation Performance
- CSS animations (GPU-accelerated)
- 60fps target
- Minimal repaints/reflows

### Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE: Not supported (uses ES6+)

---

## Customization Quick Edits

### Change Boot Delay
**File:** `script.js` line 50
```javascript
setTimeout(() => {
    transitionToTerminal();
}, 1000);  // ← Change 1000 to desired milliseconds
```

### Disable Scan Lines
**File:** `styles.css` lines 39-53
```css
/* Comment out entire body::before block */
```

### Adjust Glitch Speed
**File:** `script.js` line 300
```javascript
await sleep(300);  // ← Fade out speed
await sleep(600);  // ← Glitch duration
```

### Change Primary Blue
**File:** `styles.css` line 17
```css
--electric-blue: #4d9de0;  // ← Change hex color
```

---

## Deployment Options

### GitHub Pages
1. Push `myels_blue_journal/` to GitHub repo
2. Enable Pages in repo settings
3. Set source to `main` branch, `/myels_blue_journal` folder

### Netlify
1. Drag `myels_blue_journal/` folder to Netlify drop zone
2. Auto-deploys with CDN

### Vercel
```bash
cd myels_blue_journal
vercel --prod
```

### Custom Domain
All platforms above support custom domains (e.g., `journal.yourdomain.com`)

---

## Maintenance

### Adding New Sections
1. Create markdown file in `sections/`
2. Add entry to `CONTENT_MAP` in `script.js`
3. Add nav button in `index.html`

### Updating Content
- Edit markdown files directly
- Changes reflect immediately on page reload
- No build step required

### Updating Styles
- Edit `styles.css`
- Changes visible on hard refresh (Cmd+Shift+R)

---

## Troubleshooting

### Markdown Not Loading
- **Cause:** CORS restrictions on `file://` URLs
- **Fix:** Use local server (python3 -m http.server)

### Glitch Effect Too Intense
- **Fix:** Reduce opacity in `styles.css` line ~490
- Or comment out glitch overlay entirely

### Scan Lines Distracting
- **Fix:** Comment out `body::before` in `styles.css`

### Fonts Not Loading
- **Check:** Internet connection (Google Fonts CDN)
- **Fallback:** Monospace system fonts will be used

---

## Next Steps

1. **Test locally** - View at http://localhost:8001
2. **Customize** - Adjust blues to preference
3. **Add content** - Enhance markdown files
4. **Deploy** - Push to GitHub Pages or Netlify
5. **Share** - Include in portfolio as OS framework whitepaper

---

**The Journal is ready to read.** 🦉

Open http://localhost:8001 and experience digital consciousness.
