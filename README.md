# Learning Continuity Matrix

A React-based Learning Continuity Matrix designed to enhance student engagement through gamified progress tracking. This component visualizes weekly learning activity, provides motivational feedback, and includes peer benchmarking features.

## Features

- **Weekly Engagement Matrix**: Visual representation of learning activity from Monday to Sunday
- **Interactive Day Toggling**: Click to mark days as completed/incomplete
- **Motivational Feedback**: Dynamic messages based on current streak
- **Progress Tracking**: Current streak and peak streak metrics
- **Peer Benchmarking**: Leaderboard showing top performers
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Keyboard navigation and screen reader support
- **State Management**: Local state management with React Hooks

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   - Update the values in the `.env` file as needed
   - The application will work with the default values for local development

### Running the Application

```bash
npm start
# or
yarn start
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  ├── components/           # Reusable UI components
  │   ├── EngagementMatrix/ # Weekly engagement grid
  │   ├── MotivationPanel/  # Progress and motivation display
  │   └── PeerBenchmark/    # Leaderboard component
  ├── hooks/                # Custom React hooks
  ├── styles/               # Global styles
  ├── types/                # TypeScript type definitions
  ├── App.tsx               # Main application component
  ├── index.tsx             # Application entry point
  └── index.css             # Global styles
```

## Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: Application environment (development/production)
- `PORT`: Port to run the development server (default: 3000)
- `SKIP_PREFLIGHT_CHECK`: Set to `true` to skip dependency checks
- `DISABLE_ESLINT_PLUGIN`: Set to `true` to disable ESLint plugin in development

For development, you can use the `.env.example` file as a template. Copy it to `.env` and modify as needed.

## Technical Details

- **React**: Built with functional components and hooks
- **TypeScript**: Type-safe codebase
- **CSS Modules**: Scoped styling for components
- **Responsive Design**: Mobile-first approach with media queries
- **Accessibility**: ARIA attributes and keyboard navigation

## Customization

### Mock Data

Edit the `MOCK_ENGAGEMENT` and `MOCK_PEERS` arrays in `src/hooks/useEngagement.ts` to customize the initial data.

### Styling

Each component has its own CSS Module file for scoped styling. The color scheme and other design tokens can be customized in the respective module files.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Contact

For any issues or collaboration opportunities, please contact [dasarisambasivanaidu7@gmail.com](mailto:dasarisambasivanaidu7@gmail.com)
