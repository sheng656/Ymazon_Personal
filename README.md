# NASA Turbofan Engine Maintenance Dashboard

A React-based dashboard for monitoring and predicting maintenance needs of NASA turbofan engines, built with modern web technologies.

## Tech Stack

### Frontend Framework
- **React** - UI library with TypeScript support
- **Vite** - Modern build tool and development server

### UI Components
- **Radix UI** - Unstyled, accessible UI components
- **Custom UI Components** - Built on top of Radix UI primitives
- **Lucide React** - Beautiful icons

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Variables** - Theme system support
- **tailwindcss-animate** - Animation utilities

### Data Visualization
- **Recharts** - Chart library for React

## Project Structure

```
├── src/
│   └── main.tsx           # Application entry point
├── components/
│   ├── ui/                # Reusable UI components
│   ├── Dashboard.tsx      # Main dashboard view
│   ├── Prediction.tsx     # Predictive analytics view
│   ├── Maintenance.tsx    # Maintenance management view
│   └── Navigation.tsx     # Navigation component
├── styles/
│   └── globals.css        # Global styles and CSS variables
├── App.tsx                # Main application component
└── index.html             # HTML template

```

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- **Fleet Overview** - Monitor 708+ turbofan engines
- **RUL Prediction** - Remaining Useful Life analysis
- **Health Status** - Real-time engine health monitoring
- **Maintenance Planning** - Predictive maintenance scheduling
- **Data Visualization** - Interactive charts and graphs
- **Responsive Design** - Works on desktop and mobile devices

## License

This project is for educational and demonstration purposes.
