# PortfolioOverlap Pro — Mutual Funds Overlap Calculator

A mutual funds overlap and portfolio concentration analysis engine capable of comparing across **2 to 15+ mutual funds** simultaneously.

Includes:
- **Pairwise Overlap Deep Dive & SVG Venn Diagram** (reproducing the verified 30.1% overlap benchmark for *ICICI Pru India Opportunities* vs *Parag Parikh Flexi Cap*).
- **11-Fund Overlap Heatmap Matrix ($N \times N$)**.
- **Consolidated Stock Holdings** with weighted portfolio impact and fund incidence counters.
- **Sector & Market Cap Breakdown**.
- **Redundancy & Pruning Optimizer**.
- **Live AMFI Open API Search (10,000+ Schemes)** via `api.mfapi.in`.

---

## 🚀 How to Host on GitHub Pages

You have **two simple options** to host this on GitHub Pages:

### **Option 1: Automatic Deployment with GitHub Actions (Recommended)**

The repository includes a ready-made GitHub Actions workflow (`.github/workflows/deploy.yml`) and `vite.config.ts` configured with `base: './'`.

1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** &rarr; **Pages** (left sidebar).
   - Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
3. That's it! GitHub Actions will automatically run `npm run build` and publish your app live at `https://<your-username>.github.io/<repo-name>/`.

---

### **Option 2: Zero-Build Standalone HTML & JavaScript**

If you prefer **zero build tools** (no Node.js, no `npm install`, no build step):

1. The file [`public/standalone-github-pages.html`](./public/standalone-github-pages.html) is a single, self-contained HTML/JS web application with embedded Tailwind and standard browser JavaScript.
2. Simply copy `public/standalone-github-pages.html` to `index.html` at the root of your GitHub repository:
   ```bash
   cp public/standalone-github-pages.html index.html
   git add index.html
   git commit -m "Add zero-build GitHub Pages index"
   git push
   ```
3. In your GitHub repository:
   - Go to **Settings** &rarr; **Pages**.
   - Under **Build and deployment** &rarr; **Source**, select **Deploy from a branch**.
   - Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
4. Your application will be live immediately!

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Run dev server on port 3000
npm run dev

# Build production static bundle (dist/ folder)
npm run build
```
