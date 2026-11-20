# LifeOS — Personal Productivity Dashboard

A free, all-in-one productivity dashboard that runs entirely in your browser. No sign-up, no servers, no ads — all your data stays on your device.

Built with **React + Vite + Tailwind CSS**, stored locally with **IndexedDB (Dexie.js)**, and installable as an offline app (PWA). Hosted for free on **GitHub Pages**.

---

## ✨ Features

- **Dashboard** — today's completion %, streaks, total stats, weekly productivity score, level progress, and an "Aurora Heatmap" of your activity
- **Daily Routines** — add, edit, reorder (drag & drop), categorize, prioritize, and track daily routines with a "Reset Today" option
- **Roadmap Tracker** — supports 400+ items, with search, filters, categories, tags, due dates, bulk actions, and sorting. Starts empty for every user — build your own roadmap for any goal (fully editable/removable)
- **Goals** — long-term and short-term goals with progress bars and deadlines
- **Habit Tracker** — daily, weekly, or monthly habits with streaks and completion percentages
- **Analytics** — daily/weekly/monthly/yearly trend charts, roadmap completion trend, and habit consistency charts
- **Notes & Journal** — markdown-based notes with a formatting toolbar and live preview, plus a daily journal
- **Calendar** — monthly view showing routine completion, roadmap progress, and journal entries per day
- **Pomodoro Timer** — customizable focus/break durations with session stats
- **Achievements** — badges and productivity levels that unlock as you progress
- **Settings** — light/dark/system theme, streak threshold, notifications, backup & restore, and data reset

---

## 🔒 Privacy & Data Storage

All data is stored **locally in your browser** using IndexedDB. Nothing is ever sent to a server. This means:

- Your PC and phone each have **separate** data by default
- To move data between devices, use **Settings → Export Backup** (downloads a `.json` file) and **Settings → Import Backup** on the other device
- Clearing your browser's site data will erase everything — export a backup first!

---

## 🚀 Getting Started (Local Development)

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

```bash
npm run build      # Build for production (output in dist/)
npm run preview    # Preview the production build locally
```

---

## 🧪 Automated Testing

LifeOS uses **Vitest 3.2.7** for automated testing. Tests run in a Node.js environment using the configuration in `vitest.config.js`.

### Prerequisites

- Node.js 22
- npm

### Install Dependencies

From the project root, run:

```bash
npm ci
```

This installs dependencies using the committed `package-lock.json`.

### Run All Tests

```bash
npm test
```

The `test` script executes `vitest run`, which runs the test suite once and exits with a nonzero status if a test fails.

### Run a Specific Test File

```bash
npx vitest run src/utils/score.test.js
```

### Verify the Production Build

```bash
npm run build
```

### Test Organization

- `vitest.config.js` configures the Node.js test environment and discovers `src/**/*.test.{js,jsx}`.
- Test files are colocated with the source modules they verify.
- `src/utils/score.test.js` contains 32 productivity score and level regression tests.
- `src/utils/streaks.test.js` contains 15 routine streak, completion percentage, and heatmap regression tests.
- `src/utils/dateUtils.test.js` contains 13 calendar date calculation regression tests.

The automated regression suite currently contains 60 tests covering
productivity scoring, routine streaks, completion percentages,
heatmap generation, and date calculations.

Additional regression coverage for backup/restore behavior and habit
periods remains future work.

### Continuous Integration (GitHub Actions)

LifeOS uses GitHub Actions to automatically verify application builds
and regression tests.

The workflow is defined in `.github/workflows/ci.yml`.

#### Workflow Triggers

The CI workflow runs automatically when:

- A pull request is opened or updated against `main`.
- A commit is pushed to the `main` branch.

#### CI Environment

- Operating system: Ubuntu (`ubuntu-latest`)
- Node.js: Version 22
- Timezone: UTC
- Dependencies: Installed using `npm ci` and the committed `package-lock.json`

UTC is configured to provide a consistent environment for
date-sensitive regression tests.

#### Automated Verification

The workflow executes these commands:

```bash
npm ci
npm run build
npm test
```

The build step verifies that the application compiles successfully
for production. The test step executes the complete Vitest
regression suite.

If installation, compilation, or any test fails, the workflow
reports a failed check.

#### Viewing CI Results

1. Open the LifeOS repository on GitHub.
2. Select the **Actions** tab.
3. Select the **CI** workflow.
4. Open a workflow run to inspect the `build-and-test` job.
5. Expand individual steps to view installation, build, and test logs.

For pull requests targeting `main`, CI results also appear in
the pull request's **Checks** section.

A green check indicates that the workflow succeeded.
A red failure indicator means that one or more steps failed.

#### Local Verification

Developers can reproduce the CI verification commands locally:

```bash
npm ci
TZ=UTC npm run build
TZ=UTC npm test
```

These commands should succeed before submitting a pull request.

The CI workflow performs verification only. It does not deploy
the application or modify production data.

---

## 🌐 Deploying to GitHub Pages (Free)

1. **Create a GitHub repository** (e.g. `lifeos`)

2. **Push your code:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/lifeos.git
   git push -u origin main
   ```

3. **Deploy:**

   ```bash
   npm run deploy
   ```

   This builds the app and pushes it to a `gh-pages` branch.

4. **Enable GitHub Pages:**
   Go to your repo → **Settings → Pages** → set Branch to `gh-pages`, folder to `/ (root)` → Save

5. Your app will be live at:

   ```
   https://YOUR_USERNAME.github.io/lifeos/
   ```

6. **Install as an app:** open the link on desktop (Chrome/Edge) or mobile and use "Install"/"Add to Home Screen" for offline access.

---

## 🛠️ Tech Stack

| Purpose         | Library                                                   |
| --------------- | --------------------------------------------------------- |
| UI Framework    | React 18 + Vite                                           |
| Styling         | Tailwind CSS                                              |
| Local Database  | Dexie.js (IndexedDB)                                      |
| Charts          | Recharts                                                  |
| Icons           | react-icons (Lucide set)                                  |
| State           | Zustand                                                   |
| Routing         | React Router (HashRouter, for GitHub Pages compatibility) |
| Offline Support | vite-plugin-pwa                                           |

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components, layout, heatmap, search
├── db/               # Dexie database schema, seed data, backup/restore
├── hooks/            # Live-query hooks for reactive data
├── pages/            # One file per app page (Dashboard, Routines, etc.)
├── store/            # Zustand stores (theme, UI state)
└── utils/            # Date, streak, score, achievement, analytics helpers
```

---

## 📝 Notes

- The pre-loaded roadmap is just starter data — edit, delete, or replace it freely from the Roadmap page.
- Keyboard shortcut: **Ctrl/Cmd + K** opens global search across routines, roadmap, goals, habits, and notes.
- Browser notifications (for Pomodoro) only work while LifeOS is open in a tab — true background push notifications would require a backend service.

---

Made with LifeOS 💜
