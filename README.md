# Marine Biology Data Visualization

An interactive web application for visualizing marine biology data with multiple chart types and code generation capabilities.

## Features

- Interactive data visualization with multiple chart types:

  - Coral Reef Health Monitoring
  - Marine Species Diversity
  - Ocean Temperature Trends
  - Marine Ecosystem Health

- Code Generation in Multiple Languages:

  - Python (using matplotlib, plotly, seaborn)
  - R (using ggplot2, plotly)
  - Vega-Lite (JSON specifications)

- Interactive Features:

  - Zoom and pan controls
  - Interactive tooltips
  - Feature selection
  - Chart remixing capabilities

- Preview System:
  - Live chart previews
  - Feature-specific previews
  - Interactive preview controls

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd marine-biology-viz
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. Select charts for remixing by checking the "Select for remix" checkbox
2. Choose specific features you want to include
3. Click "Show Code" to view the generated code
4. Select your preferred language (Python, R, or Vega-Lite)
5. Use the "Copy Code" button to copy the generated code
6. Preview the charts with specific features using the feature selector

## Dependencies

### Python

```bash
pip install matplotlib numpy plotly seaborn scipy
```

### R

```R
install.packages(c("ggplot2", "plotly", "fmsb"))
```

### Vega-Lite

```bash
npm install vega-lite vega-embed
```

## Deployment

The application is deployed using Vite and can be built for production using:

```bash
npm run build
```

The production build will be available in the `dist` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chart.js for the powerful charting library
- Tailwind CSS for the utility-first CSS framework
- Vercel for the deployment platform
