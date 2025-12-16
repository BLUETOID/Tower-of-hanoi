# Tower of Hanoi — Interactive Animation

A single-page, browser-based interactive visualization of the classic "Tower of Hanoi" puzzle. The site demonstrates the recursive algorithm, animates the disk moves, and includes a debug panel that shows the corresponding C++ implementation and the live recursion call stack.

Features
- Dark, professional UI with solid disk colors (no gradients or glow)
- Adjustable disk count (3–7) and animation speed
- Animated moves (lift, slide, drop) with smooth transitions
- Step mode (advance one move at a time) and automated play
- Debug panel: shows full C++ function and active call stack for each move
- Responsive layout and GitHub Pages-ready metadata

Files
- `index.html` — single-page application markup and SEO metadata
- `styles.css` — styling and responsive layout
- `script.js` — core logic: move generation, animation, step & debug UI
- `robots.txt`, `sitemap.xml`, `manifest.json`, `favicon.svg` — publishing / SEO support

Running locally
1. Open `index.html` in your browser (no build step required).
2. Alternatively run a simple local server (recommended for some browsers):
   - Python 3: `python -m http.server 8000`
   - Then open `http://localhost:8000` in your browser.

Deployment (GitHub Pages)
1. Push the repository to `https://github.com/BLUETOID/Tower-of-hanoi`.
2. In GitHub repository Settings → Pages, set Source to `main` branch and root (`/`).
3. Wait a minute and your site will be available at `https://BLUETOID.github.io/Tower-of-hanoi/`.

Notes
- Replace placeholder OG image and canonical URL in `index.html` if you use a different domain.
- Panels are designed to be internally scrollable so the entire site fits in one viewport without page scrolling.

License
This project is provided as-is; add a license file if you want to publish under a particular license.

Contributing
If you want enhancements (e.g., export C++ moves, add a 'back' step, or increase accessibility), open an issue or submit a pull request.

---
This README is intentionally concise and free from emojis.
