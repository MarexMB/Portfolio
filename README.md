# Marex / MB

Moj licni portfolio, kada se katane hover-uju otkrice se tekst pomocu kog mozete da se navigirate kroz sajt

## GitHub Pages

The site is built with Node.js 22 and npm (`npm ci`, then `npm run build`).
Vite builds `index.html`, `about.html`, `projects.html`, and `notes.html` into
`dist/` with the `/Portfolio/` base path. Preview the production build with
`npm run preview` and open `http://127.0.0.1:4173/Portfolio/`.

In GitHub, set **Settings → Pages → Build and deployment → Source** to
**GitHub Actions**. The workflow in `.github/workflows/deploy.yml` builds and
publishes only `dist/` on pushes to `main`, or when manually run from the
Actions tab. Do not publish the repository root: its HTML references TypeScript
source files that must first be compiled by Vite.

After a successful deployment, the site is available at
https://marexmb.github.io/Portfolio/.
