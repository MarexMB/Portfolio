# Marko

A small personal site with a sheathed-katana menu and an interactive ASCII katana.

## Run locally

On this Windows checkout, double-click **start.cmd**, then open the URL it prints (normally http://127.0.0.1:5173). Keep the terminal open; Ctrl+C stops the server.

With Node.js 22+ installed:

```sh
npm ci
npm run dev
```

This is a Vite project. Open it through the dev server, not by double-clicking index.html.

## Structure

Inspired by Bucov/my-site: root HTML pages, TypeScript in src/, shared components in src/components/, and downloadable models in public/models/.

- index.html — homepage and viewer controls
- about.html, projects.html, notes.html — real separate pages
- src/config.ts — shared menu destinations
- src/components/KatanaMenu.ts — original SVG sheath/draw interaction
- src/components/AsciiModel.ts — Three.js GLTFLoader, AsciiEffect, OrbitControls
- src/style.css — layout and responsive styling
- public/models/ — local CC0 model and source credits

The renderer defaults to ASCII, like the reference. Drag to orbit; arrow keys rotate; Home resets. A button switches to solid rendering. Rendering is on demand, with no idle animation. On touch screens the first menu tap reveals the blade and the second follows the link. Keyboard focus draws the blade too. Reduced-motion users get immediate state changes.

## Content and new pages

No sample projects or articles are included. Add your actual work to projects.html and writing to notes.html. Edit about.html with your bio.

To add a page, copy an existing HTML page, add it to src/config.ts, and add its HTML entry to vite.config.ts.

## Build

```sh
npm run build
npm run preview
```

Deploy the contents of dist/ to a static host. Relative asset paths support a GitHub Pages repository subpath. No deployment is performed automatically.

## Model

Katana by Pichuliru, CC0: https://poly.pizza/m/15A7InejC7
See public/models/CREDITS.md. The model is downloaded locally, not fetched from a third party at runtime.
