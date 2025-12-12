# 🚀 Quick Deploy to GitHub Pages

## Prerequisites
- [x] Portfolio ready for deployment
- [x] Demo data configured
- [x] GitHub account: mck31th3n
- [x] All links verified

---

## Step 1: Create Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: **`portfolio`**
3. Make it **Public**
4. **Do NOT** check "Add README"
5. Click **Create repository**

---

## Step 2: Deploy from Terminal

Copy and paste these commands into Terminal:

```bash
cd "/Users/michaelmckeithen/Desktop/The Owl/portfolio"

git init
git add .
git commit -m "Initial portfolio deployment with SAFE V4.0 showcase"
git remote add origin https://github.com/mck31th3n/portfolio.git
git branch -M main
git push -u origin main
```

**Note:** GitHub may ask for your username and personal access token (not password).

To create a personal access token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "Portfolio Deployment"
4. Check the "repo" checkbox
5. Click "Generate token"
6. Copy the token and use it as your password when pushing

---

## Step 3: Enable GitHub Pages

1. Go to: https://github.com/mck31th3n/portfolio/settings/pages
2. Under **Source**, select **main** branch
3. Click **Save**
4. Wait 2-3 minutes

---

## Step 4: Visit Your Live Portfolio

Your portfolio will be live at:

**https://mck31th3n.github.io/portfolio/**

---

## After SAFE's 24hr Test Completes (1:28 PM Dec 13)

Update with real results:

```bash
cd "/Users/michaelmckeithen/Desktop/The Owl/portfolio"

# Edit safe/safe-demo-data.json with final results
# Then push the update:

git add safe/safe-demo-data.json
git commit -m "Update with final 24hr test results"
git push
```

GitHub Pages will automatically update within 1-2 minutes.

---

## Current Portfolio Features

✅ SAFE V4.0 - Autonomous Financial Intelligence
✅ Refined Resume (foggy aesthetic)
✅ The Owl's Nest Project
✅ Executive Function Project
✅ Demo Data (5.23% return, 12,847 decisions)
✅ Professional GitHub/LinkedIn links
✅ Security verified
✅ All claims accurate and verified

---

**Ready to deploy!** Follow the 4 steps above to get your portfolio live.

For detailed instructions, see: `DEPLOYMENT_GUIDE.md`
