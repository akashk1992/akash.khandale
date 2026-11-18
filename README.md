# Akash Khandale - Portfolio

A responsive personal portfolio built with Vite, vanilla JavaScript, and Three.js. A dark observatory theme showcases software engineering, cloud architecture, technical leadership, and AI agents.

## Getting started

Use Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. For a production build and local preview:

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` directory to any static website host.

## Features

- Three scroll chapters with distinct 3D exhibits: an orbital sculpture, connected software modules, and an AI agent network.
- Staged entrances, project spotlight effects, pointer tilt, and reading progress.
- Desktop pinned scrolling with an unpinned layout on smaller screens and for reduced-motion preferences.
- Actual website imagery and live links for Starbliss, Vadhu Var Parichay, and Neighborely.
- Keyboard navigation and a static visual fallback when WebGL is unavailable.

## Personalization and source layout

- `site.config.js`: email, LinkedIn URL, project titles, descriptions, and links. Contact opens LinkedIn until an email is supplied.
- `index.html`: homepage copy, initial project markup, image paths, and page metadata. Keep initial markup consistent with the configuration when editing projects.
- `src/main.js`: Three.js exhibits and configuration-driven content updates.
- `src/story.js` and `src/story.css`: pinned chapters and transitions.
- `src/motion.js` and `src/motion.css`: entrances, progress, card interactions, and scroll spotlight.
- `src/style.css` and `src/readability.css`: layout, typography, and responsive styles.
- `public/projects/`: project images; `sources.json` records original public URLs.

Google Fonts are loaded remotely. No backend or contact form service is required. The email address remains a placeholder.

## Hosting

Build with `npm ci` and `npm run build`, then serve `dist/`. The existing `.openai/hosting.json` contains a Sites project identifier, not credentials; it is only needed for Sites hosting. npm scripts do not publish the website.

## Repository hygiene

## GitHub Pages

`.github/workflows/pages.yml` builds and deploys the static site on pushes to `main`, or through a manual Actions run. Set repository Settings > Pages > Source to GitHub Actions before deploying. GitHub Pages requires a public repository on GitHub Free, or a supported paid plan for this private repository.

The workflow sets `GITHUB_PAGES=true`; `vite.config.js` then uses `/akashk-portfolio-website/` as the asset base. Local development and other hosting retain `/`. The expected site address after a successful deployment is `https://akashk1992.github.io/akashk-portfolio-website/`.

## Repository hygiene

Dependencies, build output, environment files, local editor settings, logs, archives, and the original LinkedIn reference screenshot are ignored. Never commit credentials or private environment values.
