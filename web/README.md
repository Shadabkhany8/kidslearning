# Little Learner - Web Edition 🌟

A complete, standalone web version of the **Kids Learning App**, built with React, TypeScript, and Vite. Designed to be hosted for free on **GitHub Pages** with 100% feature parity to the mobile app.

---

## ✨ Features

- **ABC Learning**: 5 progressive levels covering the entire alphabet (A–Z) with illustrations, phonics, and audio pronunciation.
- **Numbers (1–100)**: 10 structured levels from counting 1–10 up to 100 with cheerful voice narration.
- **10 Rich Learning Categories**:
  - 🦁 Animals (with animal sounds, diet, habitat, and facts)
  - 🍎 Fruits
  - 🥕 Vegetables
  - 🎨 Colors (with vibrant swatches and name pronunciation)
  - 🚗 Vehicles
  - 🪐 Solar System (Sun, planets, Moon)
  - 🦜 Birds
  - 🔺 Shapes (interactive SVG geometric shapes)
  - 🌸 Flowers
  - 👨‍⚕️ Community Helpers / Jobs
- **4 Interactive Educational Games**:
  - ❓ **Quiz Game**: "Where is the [item]?" with real-time score counter, instant voice feedback, and star rewards.
  - 🧠 **Memory Match**: 3D card flip game with matching pairs, turns counter, and celebratory fanfare.
  - 🎨 **Magic Drawing**: Interactive canvas with color palette, brush sizes, eraser, undo, and one-click image export.
  - 🖌️ **Color Fill**: Interactive SVG coloring book with 6 themed levels and clickable paths.
- **Parents' Corner & Security**:
  - Child profile management (name, age, class, photo avatar upload via local file reader).
  - Parental Gate (math challenge) protecting settings and profile modifications.
  - Sound Effects toggle and Voice Guidance narration toggle.
  - Persistent progress tracking stored in browser `localStorage`.
  - Reset progress with safety confirmation.
- **Responsive & Kid-Friendly**:
  - Designed for mobile phones, tablets, and desktop computers.
  - Includes a quick toggle between mobile phone framing and tablet/desktop view.
  - Built with kid-friendly typography, lively gradients, and celebratory confetti fireworks.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **Routing**: `react-router-dom` with `HashRouter` (ensures zero 404 errors on GitHub Pages)
- **Audio & Speech**:
  - **Voice Pronunciation**: Web Speech API (`window.speechSynthesis`)
  - **Sound Effects**: HTML5 Web Audio API synthesizer (instant zero-latency clicks, chimes, and fanfare)
- **Graphics**: HTML5 Canvas (Drawing) + Vector SVG (Shapes & Color Fill)
- **Effects**: `canvas-confetti` for celebratory star bursts and fireworks
- **Icons**: `lucide-react`

---

## 🚀 Getting Started

### 1. Install Dependencies

Navigate to the `web` directory and install the packages:

```bash
cd web
npm install
```

### 2. Run Locally in Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
```

This compiles TypeScript and builds optimized static assets into `web/dist/`.

### 4. Preview the Production Build Locally

```bash
npm run preview
```

Open [http://localhost:4173](http://localhost:4173) in your browser.

---

## 🌐 Deploying to GitHub Pages (Free Hosting)

### Method A: Automated Deployment with GitHub Actions (Recommended)

A pre-configured GitHub Actions workflow is provided in [`.github/workflows/deploy-web.yml`](../.github/workflows/deploy-web.yml).

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add web version of Kids Learning App"
   git push origin main
   ```

2. **Enable GitHub Pages via GitHub Actions**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages** (under "Code and automation").
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.

3. **Automatic Deployment**:
   - GitHub Actions will automatically detect commits to `web/**` or manual workflow triggers, build the project, and deploy it to:
     ```
     https://<your-username>.github.io/<repository-name>/
     ```

### Method B: Manual Deployment with `gh-pages`

If you prefer to deploy manually from your terminal:

1. Install `gh-pages` as a dev dependency inside `web/`:
   ```bash
   cd web
   npm install -D gh-pages
   ```

2. Add a deploy script to `web/package.json`:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

---

## 📁 Folder Structure

```
web/
├── public/
│   └── assets/
│       └── images/         # All illustrations and icons
├── src/
│   ├── components/         # Reusable UI (FeatureCard, FloatingShapes, TabBar, Modals)
│   ├── constants/          # Datasets (Alphabet, Animals, Numbers, Fruits, etc.)
│   ├── context/            # SettingsContext (Profile, Audio toggles)
│   ├── hooks/              # useProgress (Stars, category completion)
│   ├── pages/              # Main tabs (Learn, Play, Settings, Explore)
│   │   ├── games/          # Quiz, Memory, Drawing, Color Fill
│   │   └── learning/       # 12 Category learning screens
│   ├── styles/             # Global CSS and design tokens
│   ├── utils/              # Audio synthesizer, Speech, Storage, Confetti
│   ├── App.tsx             # Root router and responsive container
│   └── main.tsx            # Application entrypoint
├── index.html              # HTML shell with fonts and metadata
├── vite.config.ts          # Vite configuration with relative base path ('./')
└── package.json
```
