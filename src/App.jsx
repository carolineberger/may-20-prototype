import { Line, Bar, Scatter, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { useRef } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

// Common zoom options for line charts
const zoomOptions = {
  pan: {
    enabled: true,
    mode: "x",
    modifierKey: "shift",
  },
  zoom: {
    wheel: {
      enabled: true,
    },
    pinch: {
      enabled: true,
    },
    mode: "x",
    drag: {
      enabled: true,
      backgroundColor: "rgba(0,0,0,0.1)",
      borderColor: "rgba(0,0,0,0.3)",
      borderWidth: 1,
    },
    limits: {
      max: 5, // Maximum zoom level
      min: 0.5, // Minimum zoom level
    },
  },
};

function App() {
  const dnaChartRef = useRef(null);
  const cellGrowthChartRef = useRef(null);

  const resetZoom = (chartRef) => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const zoomIn = (chartRef) => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const currentZoom = chart.getZoomLevel();
      chart.zoom(1.5);
    }
  };

  const zoomOut = (chartRef) => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const currentZoom = chart.getZoomLevel();
      chart.zoom(0.75);
    }
  };

  // DNA Sequencing Data
  const dnaData = {
    labels: ["A", "T", "G", "C", "A", "T", "G", "C"],
    datasets: [
      {
        label: "DNA Base Pairs",
        data: [65, 59, 80, 81, 56, 55, 40, 45],
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
    ],
  };

  // Protein Expression Levels
  const proteinData = {
    labels: ["Protein A", "Protein B", "Protein C", "Protein D", "Protein E"],
    datasets: [
      {
        label: "Expression Level",
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  // Cell Growth Over Time
  const cellGrowthData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Cell Count (x10^6)",
        data: [1, 2.5, 4.2, 6.8, 9.5, 12.3, 15.1],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  // Gene Expression Patterns
  const geneExpressionData = {
    labels: ["Gene A", "Gene B", "Gene C", "Gene D", "Gene E"],
    datasets: [
      {
        label: "Control Group",
        data: [65, 59, 90, 81, 56],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
      {
        label: "Treatment Group",
        data: [28, 48, 40, 19, 96],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
      },
    ],
  };

  const ZoomControls = ({ chartRef }) => (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => zoomIn(chartRef)}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Zoom In
      </button>
      <button
        onClick={() => zoomOut(chartRef)}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Zoom Out
      </button>
      <button
        onClick={() => resetZoom(chartRef)}
        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        Reset Zoom
      </button>
    </div>
  );

  const charts = [
    {
      id: 1,
      title: "DNA Sequencing Analysis",
      description:
        "Distribution of nucleotide bases in DNA sequence. Use mouse wheel to zoom, hold shift to pan.",
      component: (
        <div>
          <Line
            ref={dnaChartRef}
            data={dnaData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "DNA Base Pair Distribution",
                },
                zoom: zoomOptions,
              },
            }}
          />
          <ZoomControls chartRef={dnaChartRef} />
        </div>
      ),
    },
    {
      id: 2,
      title: "Protein Expression Analysis",
      description: "Relative expression levels of different proteins",
      component: (
        <Bar
          data={proteinData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Protein Expression Levels",
              },
            },
          }}
        />
      ),
    },
    {
      id: 3,
      title: "Cell Growth Curve",
      description:
        "Exponential growth of cell culture over time. Use mouse wheel to zoom, hold shift to pan.",
      component: (
        <div>
          <Line
            ref={cellGrowthChartRef}
            data={cellGrowthData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Cell Growth Over Time",
                },
                zoom: zoomOptions,
              },
            }}
          />
          <ZoomControls chartRef={cellGrowthChartRef} />
        </div>
      ),
    },
    {
      id: 4,
      title: "Gene Expression Patterns",
      description:
        "Comparative analysis of gene expression between control and treatment groups",
      component: (
        <Radar
          data={geneExpressionData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Gene Expression Analysis",
              },
            },
          }}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Scientific Data Visualization
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {charts.map((chart) => (
            <div
              key={chart.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {chart.title}
                </h2>
                <p className="text-gray-600 mb-4">{chart.description}</p>
                <div className="h-80">{chart.component}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
