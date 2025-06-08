# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# TandavaLasya Dance School Website

A modern, responsive website for TandavaLasya Dance School, showcasing Bharatanatyam classes, instructors, and student testimonials.

## Features

- Responsive design for all devices
- Dynamic Google Business reviews integration
- Modern animations and transitions
- Interactive class schedules
- Instructor profiles
- Student testimonials
- Contact information

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd tandavalasya
```

2. Install dependencies:
```bash
npm install
```

3. Google Places API Setup:
   - The project uses Google Places API for fetching business reviews
   - API credentials are configured in `src/config/googlePlaces.js`
   - Current configuration:
     - Place ID: ChIJEVt4NMRzkFQRiQ2waSlam8o (TandavaLasya Dance School)
     - API Key: AIzaSyDq2U_m1Pw8asLmg9LWaOYhE4ubDNzxrr0
   - Note: The API key is restricted to the Places API and specific domains for security

4. Start the development server:
```bash
npm start
```

## Development

- Built with React and modern JavaScript
- Uses Framer Motion for animations
- Styled with Tailwind CSS
- Implements responsive design principles
- Follows accessibility best practices

## Google Places API Integration

The website integrates with Google Places API to display real-time business reviews. The integration:

- Fetches reviews dynamically from Google Places API
- Displays reviews in a modern carousel
- Shows review dates, ratings, and author names
- Provides direct links to Google Maps reviews
- Handles loading states and errors gracefully

## TODO: Future Improvements

### CI/CD and Environment Configuration
- [ ] Set up proper environment variable handling for CI/CD
- [ ] Move API keys to environment variables
- [ ] Add GitHub Actions for automated testing and deployment
- [ ] Set up staging and production environments
- [ ] Implement proper secrets management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or concerns, please contact the TandavaLasya Dance School administration.

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
