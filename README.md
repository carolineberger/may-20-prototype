# Marine Biology Data Visualization

An interactive React application for visualizing marine biology data using Chart.js. This application provides a modern, user-friendly interface for exploring and analyzing marine ecosystem data through various chart types and interactive features.

## Features

### Interactive Charts

- **Coral Reef Health Monitoring**: Line chart showing monthly coral cover percentage trends
- **Marine Species Diversity**: Bar chart displaying distribution of different marine species
- **Ocean Temperature Trends**: Line chart with temperature impact analysis
- **Marine Ecosystem Health**: Radar chart comparing current status vs target levels

### Interactive Features

- **Zoom Controls**: Pan and zoom functionality for detailed data exploration
- **Tooltips**: Detailed information on hover
- **Selection**: Click interactions for detailed species and ecosystem metrics
- **Preference Selection**: Mark what you like about each chart
- **Chart Remixing**: Select multiple charts for remixing

### Technical Features

- Built with React and Chart.js
- Responsive design using Tailwind CSS
- Smooth animations and transitions
- Modern UI/UX design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd may-20-prototype
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

### Viewing Charts

- Each chart displays different aspects of marine biology data
- Hover over data points to see detailed information
- Use zoom controls to explore specific time periods or data ranges

### Selecting Preferences

1. Below each chart, you'll find a "What do you like about this chart?" section
2. Check the boxes for features you like
3. Your selections will be displayed below the checkboxes

### Remixing Charts

1. Select charts for remixing using the checkbox at the bottom of each chart
2. The number of selected charts will be displayed at the top of the page
3. Selected charts will be highlighted with a blue border

## Deployment

The application is deployed on Vercel. To deploy your own version:

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```

## Technologies Used

- [React](https://reactjs.org/)
- [Chart.js](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)

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
