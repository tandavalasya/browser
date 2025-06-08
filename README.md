# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# TandavaLasya Dance School Website

## Instructor Profiles

Instructor data is managed in `src/config/instructors.json`. Each instructor has:
- `id`: unique string (used in URLs)
- `name`: full name
- `title`: role/title
- `image`: path to image (e.g. `/logo.png` or `/teacher1.png`)
- `shortBio`: short markdown bio (shown on About page)
- `detailedBio`: markdown for full bio (shown on instructor detail page)

To add or edit instructors, update this JSON file. Images should be placed in the `public/` directory or referenced by URL.

## Student Reviews

Reviews are managed in `src/config/reviews.json`. Each review has:
- `id`: unique string
- `name`: reviewer's name
- `image`: path to image (optional)
- `rating`: number (1-5)
- `review`: review text

To add or edit reviews, update this JSON file. Images should be placed in the `public/` directory or referenced by URL.

## Instructor Detail Pages

Each instructor card on the About page links to `/instructor/:id`, which displays the full markdown bio from the config.

## Animations & Styling

The About and Home pages use modern, subtle animations via framer-motion. Instructor and review content is config/markdown-driven for easy updates.

## Adding More Instructors or Reviews
- Add new objects to the respective JSON config files.
- Use markdown for bios for rich formatting.
- Use small, square images for best appearance.
