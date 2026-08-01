# AGENTS.md

## Project overview
- This repository is a small static web app for a simple horizontal action game MVP.
- The main entry point is [index.html](index.html), with styling in [style.css](style.css) and game logic in [game.js](game.js).
- Keep the implementation lightweight and dependency-free.

## Working conventions
- Prefer plain HTML, CSS, and JavaScript without framework additions.
- Preserve the MVP scope: small, readable, and easy to run locally.
- Keep UI changes simple and responsive for desktop and small screens.
- When adding gameplay features, focus on clarity and maintainability over complexity.

## How to run locally
- From the repository root, run:
  - `python3 -m http.server 8000`
- Then open `http://localhost:8000/` in a browser.

## Documentation
- Refer to [README.md](README.md) for project notes and general context.
- If behavior changes significantly, update the README so future agents and contributors can understand the app quickly.
