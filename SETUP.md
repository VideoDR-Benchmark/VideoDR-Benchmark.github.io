# GitTaskBench Frontend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd FE
npm install
```

### 2. Start Development Server

```bash
npm run serve
```

The application will be available at: `http://localhost:8080`

### 3. Build for Production

```bash
npm run build
```

## Project Features

### ✨ Modern Design
- Glass-morphism UI inspired by FutureX-AI
- Responsive design for all devices
- Smooth animations and transitions
- Modern gradient backgrounds

### 🏠 Home Page
- Hero section with project introduction
- Feature showcase with icons and descriptions
- Statistics section with key metrics
- Getting started guide with copy-to-clipboard functionality

### 🏆 LeaderBoard Page
- Interactive model performance table
- Sortable columns and filtering options
- Model comparison capabilities
- Real-time statistics dashboard

### 🎨 UI Components
- Reusable navigation bar with mobile menu
- Professional footer with links and social media
- Consistent button and card styles
- Smooth hover effects and animations

## Technology Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router 4** - Official router for Vue.js
- **CSS3** - Modern styling with flexbox and grid
- **Font Awesome** - Icon library
- **Google Fonts** - Inter font family

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run serve

# Build for production
npm run build

# Lint and fix files
npm run lint
```

## Deployment

The application is configured to be deployed on GitHub Pages with the base path `/GitTaskBench/`. For other deployment targets, modify the `publicPath` in `vue.config.js`.

## Customization

### Colors and Themes
Modify the CSS variables in `src/assets/css/global.css` to customize the color scheme.

### Content
Update the data in the Vue components to reflect your actual benchmark results and project information.

### Styling
The application uses a glass-morphism design with backdrop filters. All styles are scoped to components for easy maintenance.

## Contributing

1. Follow Vue.js style guide
2. Use semantic HTML elements
3. Maintain responsive design principles
4. Test on multiple browsers and devices

Happy coding! 🚀
