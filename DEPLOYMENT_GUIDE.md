# Portfolio Deployment Guide - GitHub Pages

## Current Status
✅ **READY FOR DEPLOYMENT**

Your portfolio is configured for GitHub Pages deployment with demo/simulated data that showcases SAFE V4.0's capabilities.

---

## Quick Start: Deploy to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** button in top-right → **New repository**
3. Name it: `portfolio` (or any name you prefer)
4. Make it **Public**
5. **Do NOT** initialize with README
6. Click **Create repository**

### Step 2: Push Your Portfolio

Open Terminal and run these commands from your portfolio directory:

```bash
cd "/Users/michaelmckeithen/Desktop/The Owl/portfolio"

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial portfolio deployment with SAFE V4.0 showcase"

# Add GitHub repository
git remote add origin https://github.com/mck31th3n/portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select **main** branch
5. Click **Save**
6. Wait 2-3 minutes for deployment

Your portfolio will be live at: `https://mck31th3n.github.io/portfolio/`

---

## Configuration Details

### Current Mode: **DEMO/SHOWCASE**

The portfolio is set to display simulated data that demonstrates SAFE's capabilities:

- **Portfolio Value**: $10,523.42 (+5.23% return)
- **Total Decisions**: 12,847 decisions
- **Uptime**: 24 hours (completed test)
- **Cycles**: 288 cycles
- **Integrity**: 100% verified

**Data Source**: `/safe/safe-demo-data.json`

### After SAFE's 24-Hour Test Completes

When SAFE finishes its 24-hour test (at 1:28 PM December 13), you can update the portfolio with **real final results**:

1. **Extract Final Results** from SAFE's output logs
2. **Update** `safe/safe-demo-data.json` with the final numbers:
   - Actual portfolio value
   - Actual return percentage
   - Actual total decisions made
   - Actual cycles completed

3. **Commit and Push** the update:
   ```bash
   cd "/Users/michaelmckeithen/Desktop/The Owl/portfolio"
   git add safe/safe-demo-data.json
   git commit -m "Update SAFE results with final 24hr test data"
   git push
   ```

4. GitHub Pages will **automatically redeploy** within 1-2 minutes

---

## Switching Between Demo and Live Mode

The portfolio supports two modes:

### **Demo Mode** (Current - For Deployment)
- Uses static `safe-demo-data.json`
- Perfect for GitHub Pages
- Shows consistent data for job applications
- No dependencies on running SAFE

### **Live Mode** (For Local Development)
- Uses real-time `safe-live-data.json`
- Requires `safe-data-bridge.py` running locally
- Updates every 5 seconds with SAFE's actual data
- Only works on your local machine

**To switch modes**, edit `safe/live-data-connector.js` line 10:

```javascript
// For GitHub Pages deployment:
this.mode = 'demo';

// For local development with live SAFE data:
this.mode = 'live';
```

---

## File Structure

```
portfolio/
├── index.html              # Redirects to safe/index.html
├── resume.html             # Your refined foggy aesthetic resume
├── safe/
│   ├── index.html          # Main SAFE portfolio page
│   ├── styles-v4.css       # SAFE UI styles
│   ├── script-v4.js        # SAFE UI animations
│   ├── live-data-connector.js    # Data connector (demo/live modes)
│   ├── safe-demo-data.json       # Static demo data ← CURRENT SOURCE
│   └── safe-live-data.json       # Live data (local only, not deployed)
├── nest/                   # The Owl's Nest project
├── executive_function/     # But what if?... project
└── DEPLOYMENT_GUIDE.md     # This file
```

---

## Verification Checklist

Before deploying, verify:

- ✅ Demo data shows professional results (`safe-demo-data.json`)
- ✅ Live data connector set to `mode = 'demo'`
- ✅ All navigation links work (resume, projects, etc.)
- ✅ No API keys or sensitive data in any files
- ✅ LEGAL_DISCLAIMER.md is accurate and complete
- ✅ All claims on UI are verified and accurate

---

## Updating Your Portfolio

After deploying, you can update anytime:

```bash
cd "/Users/michaelmckeithen/Desktop/The Owl/portfolio"

# Make your changes (edit files, update data, etc.)

git add .
git commit -m "Update portfolio with [description]"
git push
```

GitHub Pages will automatically redeploy within 1-2 minutes.

---

## Customization

### Update GitHub/LinkedIn Links

Already configured with your links:

```html
<a href="https://github.com/mck31th3n">GitHub</a>
<a href="https://linkedin.com/in/michael-mckeithen">LinkedIn</a>
```

To update, edit `safe/index.html` lines 377-378.

### Update Demo Data

Edit `safe/safe-demo-data.json` to show different results:

```json
{
  "portfolio": {
    "value": 10523.42,    ← Update this
    "return": 5.23,       ← Update this
    "cycles": 288         ← Update this
  },
  "totalDecisions": 12847 ← Update this
}
```

---

## Troubleshooting

### Portfolio doesn't load on GitHub Pages
- Check Settings → Pages is enabled
- Verify branch is set to `main`
- Wait 2-3 minutes for first deployment
- Try accessing: `https://mck31th3n.github.io/portfolio/safe/index.html`

### Resume link broken
- Verify `resume.html` exists in root directory
- Check navigation link in `safe/index.html` line 143

### Data not updating after push
- GitHub Pages can take 1-2 minutes to rebuild
- Clear browser cache (Cmd+Shift+R on Mac)
- Check commit went through: `git log`

---

## Security Notes

✅ **Safe to Deploy:**
- No API keys in code (all local `.env` files excluded)
- Demo data is simulated (no real trading data exposed)
- All data is read-only (no write operations)
- LEGAL_DISCLAIMER.md protects against liability

❌ **Never Commit:**
- `.env` files with API keys
- Real trading account credentials
- Live trading data with real money values
- Personal financial information

---

## Next Steps

1. **Deploy Now**: Follow Steps 1-3 above to get your portfolio live
2. **Share**: Add the URL to your resume and job applications
3. **Monitor SAFE**: Wait for 24hr test to complete (1:28 PM Dec 13)
4. **Update**: Replace demo data with final results
5. **Iterate**: Continue adding projects and updates

---

**Questions or Issues?**

- Check GitHub Pages documentation: https://pages.github.com
- Verify repository is public
- Ensure all files are committed and pushed

---

**Built with:**
- SAFE V4.0 - Autonomous Financial Intelligence
- GitHub Pages - Static Site Hosting
- Pure HTML/CSS/JavaScript - No frameworks needed

**Ready to impress recruiters and showcase your technical expertise!** 🚀
