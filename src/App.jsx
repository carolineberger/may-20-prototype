import {
  Line,
  Bar,
  Scatter,
  Radar,
  Pie,
  Doughnut,
  PolarArea,
  Bubble,
} from "react-chartjs-2";
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
  ArcElement,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { useRef, useState, useEffect } from "react";

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
  ArcElement,
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
  const coralChartRef = useRef(null);
  const speciesChartRef = useRef(null);
  const [coralZoomLevel, setCoralZoomLevel] = useState(1);
  const [speciesZoomLevel, setSpeciesZoomLevel] = useState(1);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [showTemperatureImpact, setShowTemperatureImpact] = useState(false);
  const [ecosystemFocus, setEcosystemFocus] = useState(null);
  const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState([]);
  const [activeTab, setActiveTab] = useState("data");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [csvData, setCsvData] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [existingCode, setExistingCode] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [charts, setCharts] = useState(null); // Will be initialized with initialCharts
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [codeAnalysis, setCodeAnalysis] = useState(null);

  // Initialize charts state with initialCharts
  useEffect(() => {
    if (charts === null) {
      setCharts(initialCharts);
    }
    // Only run once on mount
  }, []);

  // Debug: Monitor charts state changes
  useEffect(() => {
    if (charts) {
      console.log(
        "Charts state updated:",
        charts.map((c) => c.id)
      );
    }
  }, [charts]);

  // Animation for coral data
  const [animatedCoralData, setAnimatedCoralData] = useState([]);
  useEffect(() => {
    const data = coralData.datasets[0].data;
    const interval = setInterval(() => {
      setAnimatedCoralData((prev) => {
        if (prev.length === data.length) {
          clearInterval(interval);
          return prev;
        }
        return [...prev, data[prev.length]];
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const resetZoom = (chartRef, setZoomLevel) => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
      setZoomLevel(1);
    }
  };

  const zoomIn = (chartRef, setZoomLevel) => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const newZoom = Math.min(5, chart.getZoomLevel() * 1.5);
      chart.zoom(1.5);
      setZoomLevel(newZoom);
    }
  };

  const zoomOut = (chartRef, setZoomLevel) => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const newZoom = Math.max(0.5, chart.getZoomLevel() * 0.75);
      chart.zoom(0.75);
      setZoomLevel(newZoom);
    }
  };

  const handleSliderChange = (chartRef, setZoomLevel, value) => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const currentZoom = chart.getZoomLevel();
      const zoomFactor = value / currentZoom;
      chart.zoom(zoomFactor);
      setZoomLevel(value);
    }
  };

  const ZoomControls = ({ chartRef, zoomLevel, setZoomLevel }) => (
    <div className="mt-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={() => zoomOut(chartRef, setZoomLevel)}
            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            −
          </button>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={zoomLevel}
            onChange={(e) =>
              handleSliderChange(
                chartRef,
                setZoomLevel,
                parseFloat(e.target.value)
              )
            }
            className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <button
            onClick={() => zoomIn(chartRef, setZoomLevel)}
            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{zoomLevel.toFixed(1)}x</span>
          <button
            onClick={() => resetZoom(chartRef, setZoomLevel)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );

  // Coral Reef Health Data with animation
  const coralData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Coral Cover (%)",
        data: [45, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33],
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointStyle: "circle",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "rgba(75, 192, 192, 0.8)",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        animation: {
          duration: 2000,
          easing: "easeInOutQuart",
        },
      },
    ],
  };

  // Marine Species Abundance with interactive bars
  const speciesData = {
    labels: ["Coral", "Fish", "Crustaceans", "Mollusks", "Echinoderms"],
    datasets: [
      {
        label: "Species Count",
        data: [120, 85, 65, 45, 30],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderWidth: 2,
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderRadius: 5,
        barPercentage: 0.8,
      },
    ],
  };

  // Ocean Temperature Impact with gradient
  const temperatureData = {
    labels: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Average Ocean Temperature (°C)",
        data: [24.5, 24.8, 25.2, 25.5, 25.9, 26.2, 26.5],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(75, 192, 192, 0.8)");
          gradient.addColorStop(1, "rgba(75, 192, 192, 0.1)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointStyle: "circle",
        pointBackgroundColor: "rgb(75, 192, 192)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "rgba(75, 192, 192, 0.8)",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        animation: {
          duration: 2000,
          easing: "easeInOutQuart",
        },
      },
    ],
  };

  // Marine Ecosystem Health with interactive segments
  const ecosystemData = {
    labels: [
      "Biodiversity",
      "Water Quality",
      "Habitat Health",
      "Species Richness",
      "Coral Cover",
    ],
    datasets: [
      {
        label: "Current Status",
        data: [75, 82, 68, 70, 65],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
        pointRadius: 6,
        pointHoverRadius: 8,
        pointStyle: "circle",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        animation: {
          duration: 2000,
          easing: "easeInOutQuart",
        },
      },
      {
        label: "Target Level",
        data: [90, 90, 85, 85, 80],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
        pointRadius: 6,
        pointHoverRadius: 8,
        pointStyle: "circle",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        animation: {
          duration: 2000,
          easing: "easeInOutQuart",
        },
      },
    ],
  };

  // Habitat Type Proportions Pie Data
  const habitatPieData = {
    labels: ["Coral", "Seagrass", "Sand", "Rock"],
    datasets: [
      {
        label: "Habitat Proportion",
        data: [40, 25, 20, 15],
        backgroundColor: ["#4BC0C0", "#36A2EB", "#FFCE56", "#9966FF"],
        borderWidth: 2,
      },
    ],
  };

  // Marine Protected Areas Doughnut Data
  const mpaDoughnutData = {
    labels: ["No-Take Zone", "Multiple Use", "Buffer Zone", "Research Area"],
    datasets: [
      {
        label: "Protected Area Coverage",
        data: [25, 40, 20, 15],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 2,
        cutout: "60%",
      },
    ],
  };

  // Species Population & Threats Bubble Data
  const bubbleData = {
    datasets: [
      {
        label: "Species Population vs Threats",
        data: [
          { x: 120, y: 8, r: 15, species: "Coral" },
          { x: 85, y: 6, r: 12, species: "Fish" },
          { x: 65, y: 4, r: 10, species: "Crustaceans" },
          { x: 45, y: 7, r: 8, species: "Mollusks" },
          { x: 30, y: 3, r: 6, species: "Echinoderms" },
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        borderWidth: 2,
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  // Marine Threats Horizontal Bar Data
  const threatData = {
    labels: [
      "Climate Change",
      "Overfishing",
      "Pollution",
      "Habitat Loss",
      "Invasive Species",
    ],
    datasets: [
      {
        label: "Threat Level",
        data: [85, 72, 68, 65, 45],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        borderWidth: 1,
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  // Plankton Abundance Polar Area Data
  const planktonData = {
    labels: ["Spring", "Summer", "Fall", "Winter"],
    datasets: [
      {
        label: "Plankton Abundance",
        data: [65, 85, 55, 40],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 2,
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // Plastic Debris Stacked Bar Data
  const plasticData = {
    labels: ["Beach A", "Beach B", "Beach C", "Beach D"],
    datasets: [
      {
        label: "Bottles",
        data: [45, 38, 52, 41],
        backgroundColor: "#FF6384",
        borderWidth: 1,
        borderColor: "#FF6384",
      },
      {
        label: "Bags",
        data: [32, 28, 35, 29],
        backgroundColor: "#36A2EB",
        borderWidth: 1,
        borderColor: "#36A2EB",
      },
      {
        label: "Microplastics",
        data: [18, 15, 22, 16],
        backgroundColor: "#FFCE56",
        borderWidth: 1,
        borderColor: "#FFCE56",
      },
    ],
  };

  // Marine Threats Bar Data
  const threatsBarData = {
    labels: [
      "Climate Change",
      "Overfishing",
      "Pollution",
      "Habitat Loss",
      "Invasive Species",
    ],
    datasets: [
      {
        label: "Threat Level",
        data: [85, 72, 68, 65, 45],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        borderWidth: 2,
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderRadius: 5,
        barPercentage: 0.8,
      },
    ],
  };

  // Plankton Abundance Polar Area Data
  const planktonPolarData = {
    labels: ["Spring", "Summer", "Fall", "Winter"],
    datasets: [
      {
        label: "Plankton Abundance",
        data: [65, 85, 55, 40],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 2,
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // Plastic Debris Stacked Bar Data
  const plasticStackedData = {
    labels: ["Beach A", "Beach B", "Beach C", "Beach D"],
    datasets: [
      {
        label: "Bottles",
        data: [45, 38, 52, 41],
        backgroundColor: "#FF6384",
        borderWidth: 1,
        borderColor: "#FF6384",
      },
      {
        label: "Bags",
        data: [32, 28, 35, 29],
        backgroundColor: "#36A2EB",
        borderWidth: 1,
        borderColor: "#36A2EB",
      },
      {
        label: "Microplastics",
        data: [18, 15, 22, 16],
        backgroundColor: "#FFCE56",
        borderWidth: 1,
        borderColor: "#FFCE56",
      },
    ],
  };

  // 1. Add scatterplot data
  const scatterData = {
    datasets: [
      {
        label: "Species Size vs. Abundance",
        data: [
          { x: 2.1, y: 120, species: "Coral" },
          { x: 5.3, y: 85, species: "Fish" },
          { x: 3.8, y: 65, species: "Crustaceans" },
          { x: 4.5, y: 45, species: "Mollusks" },
          { x: 6.2, y: 30, species: "Echinoderms" },
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        pointRadius: 8,
        pointHoverRadius: 12,
      },
    ],
  };

  // Add state for selected charts
  const [chartLikes, setChartLikes] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
  });

  const handleLikeToggle = (chartId, preference) => {
    console.log("handleLikeToggle called with:", chartId, preference);
    chartId = Number(chartId);
    setChartLikes((prev) => {
      const newLikes = prev[chartId].includes(preference)
        ? prev[chartId].filter((p) => p !== preference)
        : [...prev[chartId], preference];
      console.log(
        "Toggling",
        preference,
        "for chart",
        chartId,
        "New likes:",
        newLikes
      );
      return {
        ...prev,
        [chartId]: newLikes,
      };
    });
  };

  const chartPreferences = {
    1: [
      "Clear monthly trend visualization",
      "Interactive zoom functionality",
      "Detailed tooltips with coral cover data",
      "Smooth line transitions",
      "Color scheme representing ocean health",
    ],
    2: [
      "Easy-to-read species distribution",
      "Interactive bar selection",
      "Colorful species categorization",
      "Clear species count display",
      "Animated bar transitions",
    ],
    3: [
      "Temperature trend visualization",
      "Impact analysis in tooltips",
      "Gradient background effect",
      "Zoom and pan controls",
      "Clear yearly progression",
    ],
    4: [
      "Comparative current vs target view",
      "Interactive segment selection",
      "Clear metric visualization",
      "Color-coded status indicators",
      "Detailed gap analysis",
    ],
    5: [
      "Species size vs. abundance",
      "Distinct color for each species",
      "Interactive point tooltips",
      "Highlight outliers",
      "Zoom and pan scatter area",
    ],
    6: [
      "Clear habitat proportions",
      "Distinct color for each habitat",
      "Show percentage labels",
      "Interactive legend",
      "Explode largest segment",
    ],
    7: [
      "Zone-based color coding",
      "Show total protected area",
      "Interactive legend",
      "Highlight no-take zones",
      "Show percentage labels",
    ],
    8: [
      "Bubble size by threat level",
      "Interactive tooltips",
      "Highlight endangered species",
      "Zoom and pan",
      "Color by species",
    ],
    9: [
      "Horizontal bar orientation",
      "Color by threat type",
      "Show impact values",
      "Highlight top threat",
      "Interactive legend",
    ],
    10: [
      "Seasonal color palette",
      "Show abundance values",
      "Interactive legend",
      "Highlight peak season",
      "Polar area animation",
    ],
    11: [
      "Stacked bars by debris type",
      "Color by plastic type",
      "Show total debris",
      "Interactive legend",
      "Highlight most polluted location",
    ],
  };

  const PreferenceSelector = ({ chartId }) => {
    console.log(
      "PreferenceSelector rendered with chartId:",
      chartId,
      "type:",
      typeof chartId
    );
    console.log("chartLikes for this chart:", chartLikes[chartId]);
    // Updated checkbox implementation - working version
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          What do you like about this chart?
        </h4>
        <div className="space-y-2">
          {chartPreferences[chartId].map((preference) => (
            <div key={preference} className="flex items-center space-x-2">
              <button
                type="button"
                className={`w-4 h-4 border-2 rounded cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  chartLikes[chartId].includes(preference)
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-gray-300"
                }`}
                onClick={(e) => {
                  console.log("Checkbox clicked:", chartId, preference);
                  e.preventDefault();
                  e.stopPropagation();
                  handleLikeToggle(chartId, preference);
                }}
              >
                {chartLikes[chartId].includes(preference) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <span
                className="text-sm text-gray-600 cursor-pointer"
                onClick={(e) => {
                  console.log("Text clicked:", chartId, preference);
                  e.preventDefault();
                  e.stopPropagation();
                  handleLikeToggle(chartId, preference);
                }}
              >
                {preference}
              </span>
            </div>
          ))}
        </div>
        {chartLikes[chartId].length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Your preferences:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              {chartLikes[chartId].map((like) => (
                <li key={like} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {like}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div
              className={`w-4 h-4 border-2 rounded cursor-pointer flex items-center justify-center ${
                selectedCharts.includes(chartId)
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-300"
              }`}
              onClick={(e) => {
                console.log("Select checkbox clicked:", chartId);
                e.preventDefault();
                e.stopPropagation();
                handleChartSelection(chartId);
              }}
            >
              {selectedCharts.includes(chartId) && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span
              className="text-sm font-medium text-gray-700 cursor-pointer"
              onClick={(e) => {
                console.log("Select text clicked:", chartId);
                e.preventDefault();
                e.stopPropagation();
                handleChartSelection(chartId);
              }}
            >
              Select for remix
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Add function to get annotation options based on preferences
  const getChartAnnotations = (chartId) => {
    const likes = chartLikes[chartId];
    const annotations = {};

    switch (chartId) {
      case 1: // Coral Reef Chart
        if (likes.includes("Clear monthly trend visualization")) {
          annotations.trend = {
            type: "line",
            yMin: 33,
            yMax: 45,
            borderColor: "rgba(75, 192, 192, 0.5)",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: "Trend",
              enabled: true,
              position: "start",
            },
          };
        }
        if (likes.includes("Interactive zoom functionality")) {
          annotations.zoom = {
            type: "box",
            xMin: 0,
            xMax: 11,
            yMin: 30,
            yMax: 50,
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            borderColor: "rgba(75, 192, 192, 0.3)",
            borderWidth: 1,
            label: {
              content: "Zoom Area",
              enabled: true,
              position: "start",
            },
          };
        }
        break;

      case 2: // Species Diversity Chart
        if (likes.includes("Colorful species categorization")) {
          annotations.colors = {
            type: "box",
            xMin: -0.5,
            xMax: 4.5,
            yMin: 0,
            yMax: 120,
            backgroundColor: "rgba(255, 99, 132, 0.1)",
            borderColor: "rgba(255, 99, 132, 0.3)",
            borderWidth: 1,
            label: {
              content: "Species Categories",
              enabled: true,
              position: "start",
            },
          };
        }
        if (likes.includes("Interactive bar selection")) {
          annotations.selection = {
            type: "box",
            xMin: selectedSpecies
              ? speciesData.labels.indexOf(selectedSpecies) - 0.3
              : -0.5,
            xMax: selectedSpecies
              ? speciesData.labels.indexOf(selectedSpecies) + 0.3
              : 4.5,
            yMin: 0,
            yMax: 120,
            backgroundColor: "rgba(54, 162, 235, 0.1)",
            borderColor: "rgba(54, 162, 235, 0.3)",
            borderWidth: 1,
            label: {
              content: "Selection Area",
              enabled: true,
              position: "start",
            },
          };
        }
        break;

      case 3: // Temperature Trends Chart
        if (likes.includes("Temperature trend visualization")) {
          annotations.trend = {
            type: "line",
            yMin: 24.5,
            yMax: 26.5,
            borderColor: "rgba(75, 192, 192, 0.5)",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: "Temperature Trend",
              enabled: true,
              position: "start",
            },
          };
        }
        if (likes.includes("Impact analysis in tooltips")) {
          annotations.impact = {
            type: "box",
            xMin: 0,
            xMax: 6,
            yMin: 24,
            yMax: 27,
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            borderColor: "rgba(75, 192, 192, 0.3)",
            borderWidth: 1,
            label: {
              content: "Impact Analysis Area",
              enabled: true,
              position: "start",
            },
          };
        }
        break;

      case 4: // Ecosystem Health Chart
        if (likes.includes("Comparative current vs target view")) {
          annotations.comparison = {
            type: "box",
            xMin: -0.5,
            xMax: 4.5,
            yMin: 60,
            yMax: 95,
            backgroundColor: "rgba(255, 99, 132, 0.1)",
            borderColor: "rgba(255, 99, 132, 0.3)",
            borderWidth: 1,
            label: {
              content: "Comparison Area",
              enabled: true,
              position: "start",
            },
          };
        }
        if (likes.includes("Interactive segment selection")) {
          annotations.selection = {
            type: "box",
            xMin: ecosystemFocus
              ? ecosystemData.labels.indexOf(ecosystemFocus) - 0.3
              : -0.5,
            xMax: ecosystemFocus
              ? ecosystemData.labels.indexOf(ecosystemFocus) + 0.3
              : 4.5,
            yMin: 60,
            yMax: 95,
            backgroundColor: "rgba(54, 162, 235, 0.1)",
            borderColor: "rgba(54, 162, 235, 0.3)",
            borderWidth: 1,
            label: {
              content: "Selection Area",
              enabled: true,
              position: "start",
            },
          };
        }
        break;

      case 5: // Scatterplot
        if (likes.includes("Species size vs. abundance")) {
          annotations.scatter = {
            type: "scatter",
            xMin: 0,
            xMax: 8,
            yMin: 0,
            yMax: 140,
            backgroundColor: "rgba(153, 102, 255, 0.1)",
            borderColor: "rgba(153, 102, 255, 0.3)",
            borderWidth: 1,
            label: {
              content: "Species Size vs. Abundance",
              enabled: true,
              position: "start",
            },
          };
        }
        break;

      case 6: // Pie Chart
        if (likes.includes("Clear habitat proportions")) {
          annotations.pie = {
            type: "pie",
            yMin: 0,
            yMax: 100,
            borderColor: "rgba(75, 192, 192, 0.5)",
            borderWidth: 2,
            label: {
              content: "Habitat Proportion",
              enabled: true,
              position: "start",
            },
          };
        }
        break;

      case 7: // Doughnut Chart
        if (likes.includes("Zone-based color coding")) {
          annotations.doughnut = {
            type: "doughnut",
            yMin: 0,
            yMax: 100,
            borderColor: "rgba(75, 192, 192, 0.5)",
            borderWidth: 2,
            label: {
              content: "MPA Coverage",
              enabled: true,
              position: "start",
            },
          };
        }
        break;

      case 8: // Bubble Chart
        if (likes.includes("Bubble size by threat level")) {
          annotations.bubble = {
            type: "bubble",
            xMin: 0,
            xMax: 60,
            yMin: 0,
            yMax: 250,
            borderColor: "rgba(75, 192, 192, 0.5)",
            borderWidth: 2,
            label: {
              content: "Species Population & Threats",
              enabled: true,
              position: "start",
            },
          };
        }
        break;

      case 9: // Horizontal Bar Chart
        if (likes.includes("Horizontal bar orientation")) {
          annotations.bar = {
            type: "bar",
            yMin: 0,
            yMax: 100,
            borderColor: "rgba(75, 192, 192, 0.5)",
            borderWidth: 2,
            label: {
              content: "Top Threats to Marine Life",
              enabled: true,
              position: "start",
            },
          };
        }
        break;

      case 10: // Polar Area Chart
        if (likes.includes("Seasonal color palette")) {
          annotations.polar = {
            type: "polarArea",
            yMin: 0,
            yMax: 100,
            borderColor: "rgba(75, 192, 192, 0.5)",
            borderWidth: 2,
            label: {
              content: "Seasonal Plankton Abundance",
              enabled: true,
              position: "start",
            },
          };
        }
        break;

      case 11: // Stacked Bar Chart
        if (likes.includes("Stacked bars by debris type")) {
          annotations.stacked = {
            type: "bar",
            yMin: 0,
            yMax: 100,
            borderColor: "rgba(75, 192, 192, 0.5)",
            borderWidth: 2,
            label: {
              content: "Plastic Debris by Location",
              enabled: true,
              position: "start",
            },
          };
        }
        break;
    }

    return annotations;
  };

  const initialCharts = [
    {
      id: 1,
      title: "Coral Reef Health Monitoring",
      description:
        "Monthly coral cover percentage in the Great Barrier Reef region. Hover over points to see detailed data.",
      component: (
        <div>
          <Line
            ref={coralChartRef}
            data={coralData}
            options={{
              responsive: true,
              interaction: {
                mode: "nearest",
                axis: "x",
                intersect: false,
              },
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Coral Cover Trends",
                },
                tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  titleColor: "#fff",
                  bodyColor: "#fff",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                  padding: 10,
                  displayColors: false,
                  callbacks: {
                    label: function (context) {
                      return `Coral Cover: ${context.parsed.y}%`;
                    },
                  },
                },
                zoom: {
                  ...zoomOptions.zoom,
                  onZoom: () => {
                    if (coralChartRef.current) {
                      setCoralZoomLevel(coralChartRef.current.getZoomLevel());
                    }
                  },
                },
                annotation: {
                  annotations: getChartAnnotations(1),
                },
              },
              animation: {
                duration: 2000,
                easing: "easeInOutQuart",
              },
            }}
          />
          <ZoomControls
            chartRef={coralChartRef}
            zoomLevel={coralZoomLevel}
            setZoomLevel={setCoralZoomLevel}
          />
          <PreferenceSelector chartId={1} />
        </div>
      ),
    },
    {
      id: 2,
      title: "Marine Species Diversity",
      description:
        "Distribution of different marine species in the ecosystem. Click on bars to see detailed information.",
      component: (
        <div>
          <Bar
            data={speciesData}
            options={{
              responsive: true,
              interaction: {
                mode: "index",
                intersect: false,
              },
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Species Abundance",
                },
                tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  titleColor: "#fff",
                  bodyColor: "#fff",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                  padding: 10,
                  callbacks: {
                    label: function (context) {
                      return `Count: ${context.parsed.y} species`;
                    },
                  },
                },
                annotation: {
                  annotations: getChartAnnotations(2),
                },
              },
              onClick: (event, elements) => {
                if (elements.length > 0) {
                  const index = elements[0].index;
                  setSelectedSpecies(speciesData.labels[index]);
                }
              },
              animation: {
                duration: 2000,
                easing: "easeInOutQuart",
              },
            }}
          />
          {selectedSpecies && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
              Selected: {selectedSpecies} -{" "}
              {
                speciesData.datasets[0].data[
                  speciesData.labels.indexOf(selectedSpecies)
                ]
              }{" "}
              species
            </div>
          )}
          <PreferenceSelector chartId={2} />
        </div>
      ),
    },
    {
      id: 3,
      title: "Ocean Temperature Trends",
      description:
        "Annual average ocean temperature changes affecting marine life. Hover to see temperature impact.",
      component: (
        <div>
          <Line
            ref={speciesChartRef}
            data={temperatureData}
            options={{
              responsive: true,
              interaction: {
                mode: "nearest",
                axis: "x",
                intersect: false,
              },
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Temperature Impact Analysis",
                },
                tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  titleColor: "#fff",
                  bodyColor: "#fff",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                  padding: 10,
                  callbacks: {
                    label: function (context) {
                      const temp = context.parsed.y;
                      let impact = "";
                      if (temp > 26) impact = "High stress on coral reefs";
                      else if (temp > 25.5)
                        impact = "Moderate stress on marine life";
                      else impact = "Normal conditions";
                      return [`Temperature: ${temp}°C`, `Impact: ${impact}`];
                    },
                  },
                },
              },
              scales: {
                y: { display: false },
                x: { display: false },
              },
              animation: {
                duration: 2000,
                easing: "easeInOutQuart",
              },
            }}
          />
          <ZoomControls
            chartRef={speciesChartRef}
            zoomLevel={speciesZoomLevel}
            setZoomLevel={setSpeciesZoomLevel}
          />
          <PreferenceSelector chartId={3} />
        </div>
      ),
    },
    {
      id: 4,
      title: "Marine Ecosystem Health",
      description:
        "Comparative analysis of current ecosystem status versus target levels. Click on segments to focus.",
      component: (
        <div>
          <Radar
            data={ecosystemData}
            options={{
              responsive: true,
              interaction: {
                mode: "nearest",
                intersect: true,
              },
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Ecosystem Health Metrics",
                },
                tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  titleColor: "#fff",
                  bodyColor: "#fff",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 1,
                  padding: 10,
                  callbacks: {
                    label: function (context) {
                      const value = context.parsed.value;
                      const target =
                        context.dataset.label === "Target Level"
                          ? value
                          : ecosystemData.datasets[1].data[context.dataIndex];
                      const current =
                        context.dataset.label === "Current Status"
                          ? value
                          : ecosystemData.datasets[0].data[context.dataIndex];
                      const gap = target - current;
                      return [
                        `${context.dataset.label}: ${value}%`,
                        gap > 0 ? `Gap to target: ${gap}%` : "Target achieved!",
                      ];
                    },
                  },
                },
                annotation: {
                  annotations: getChartAnnotations(4),
                },
              },
              onClick: (event, elements) => {
                if (elements.length > 0) {
                  const index = elements[0].index;
                  setEcosystemFocus(ecosystemData.labels[index]);
                }
              },
              animation: {
                duration: 2000,
                easing: "easeInOutQuart",
              },
            }}
          />
          {ecosystemFocus && (
            <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-800">
              Focus: {ecosystemFocus} - Current:{" "}
              {
                ecosystemData.datasets[0].data[
                  ecosystemData.labels.indexOf(ecosystemFocus)
                ]
              }
              % | Target:{" "}
              {
                ecosystemData.datasets[1].data[
                  ecosystemData.labels.indexOf(ecosystemFocus)
                ]
              }
              %
            </div>
          )}
          <PreferenceSelector chartId={4} />
        </div>
      ),
    },
    {
      id: 5,
      title: "Species Size vs. Abundance",
      description:
        "Scatterplot showing the relationship between species size and abundance. Hover over points for details.",
      component: (
        <div>
          <Scatter
            data={scatterData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Species Size vs. Abundance",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const d = context.raw;
                      return `${d.species}: Size ${d.x} cm, Abundance ${d.y}`;
                    },
                  },
                },
                zoom: zoomOptions.zoom,
              },
              scales: {
                x: {
                  title: { display: true, text: "Average Size (cm)" },
                  min: 0,
                  max: 8,
                },
                y: {
                  title: { display: true, text: "Abundance" },
                  min: 0,
                  max: 140,
                },
              },
              animation: {
                duration: 2000,
                easing: "easeInOutQuart",
              },
            }}
          />
          <PreferenceSelector chartId={5} />
        </div>
      ),
    },
    {
      id: 6,
      title: "Habitat Type Proportions",
      description:
        "Pie chart showing the proportion of different marine habitat types.",
      component: (
        <div>
          <Pie
            data={habitatPieData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Habitat Type Proportions" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
          <PreferenceSelector chartId={6} />
        </div>
      ),
    },
    {
      id: 7,
      title: "Marine Protected Area Coverage",
      description:
        "Doughnut chart showing coverage of marine protected area zones.",
      component: (
        <div>
          <Doughnut
            data={mpaDoughnutData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Marine Protected Area Coverage",
                },
              },
              cutout: "70%",
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
          <PreferenceSelector chartId={7} />
        </div>
      ),
    },
    {
      id: 8,
      title: "Species Population & Threats",
      description:
        "Bubble chart showing species population, area, and threat level.",
      component: (
        <div>
          <Bubble
            data={bubbleData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Species Population & Threats" },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const d = context.raw;
                      return `${d.species}: Area ${d.x} km², Pop. ${d.y}, Threat ${d.r}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: "Area (km²)" },
                  min: 0,
                  max: 60,
                },
                y: {
                  title: { display: true, text: "Population" },
                  min: 0,
                  max: 250,
                },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
          <PreferenceSelector chartId={8} />
        </div>
      ),
    },
    {
      id: 9,
      title: "Top Threats to Marine Life",
      description:
        "Horizontal bar chart of the top 5 threats to marine life by impact score.",
      component: (
        <div>
          <Bar
            data={threatsBarData}
            options={{
              indexAxis: "y",
              plugins: {
                legend: { display: false },
                title: { display: true, text: "Top Threats to Marine Life" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
          <PreferenceSelector chartId={9} />
        </div>
      ),
    },
    {
      id: 10,
      title: "Seasonal Plankton Abundance",
      description: "Polar area chart showing plankton abundance by season.",
      component: (
        <div>
          <PolarArea
            data={planktonPolarData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Seasonal Plankton Abundance" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
          <PreferenceSelector chartId={10} />
        </div>
      ),
    },
    {
      id: 11,
      title: "Plastic Debris by Location",
      description:
        "Stacked bar chart showing types of plastic debris by location.",
      component: (
        <div>
          <Bar
            data={plasticStackedData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Plastic Debris by Location" },
              },
              responsive: true,
              scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
          <PreferenceSelector chartId={11} />
        </div>
      ),
    },
  ];

  const getPythonCode = (chartId, likes) => {
    const codeSnippets = {
      1: {
        "Clear monthly trend visualization": `# Create a line chart for coral cover trends
import matplotlib.pyplot as plt
import numpy as np

# Monthly coral cover data
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
coral_cover = [45, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33]

plt.figure(figsize=(12, 6))
plt.plot(months, coral_cover, 'o-', color='#4BC0C0', linewidth=2)
plt.fill_between(months, coral_cover, alpha=0.2, color='#4BC0C0')
plt.title('Coral Cover Trends')
plt.ylabel('Coral Cover (%)')
plt.grid(True, alpha=0.3)
plt.show()`,
        "Interactive zoom functionality": `# Add interactive zoom functionality
import matplotlib.pyplot as plt
from matplotlib.widgets import SpanSelector

def onselect(xmin, xmax):
    plt.xlim(xmin, xmax)
    plt.draw()

fig, ax = plt.subplots()
ax.plot(months, coral_cover, 'o-', color='#4BC0C0')
span = SpanSelector(ax, onselect, 'horizontal', useblit=True,
                   props=dict(alpha=0.5, facecolor='#4BC0C0'))`,
        "Detailed tooltips with coral cover data": `# Add interactive tooltips
import plotly.graph_objects as go

fig = go.Figure()
fig.add_trace(go.Scatter(
    x=months,
    y=coral_cover,
    mode='lines+markers',
    hovertemplate='Month: %{x}<br>Coral Cover: %{y}%<extra></extra>',
    line=dict(color='#4BC0C0', width=2),
    marker=dict(size=8)
))
fig.update_layout(title='Coral Cover Trends with Tooltips')
fig.show()`,
        "Smooth line transitions": `# Create smooth line transitions
import numpy as np
from scipy.interpolate import make_interp_spline

# Create smooth curve
x_smooth = np.linspace(0, len(months)-1, 200)
y_smooth = make_interp_spline(range(len(months)), coral_cover)(x_smooth)

plt.figure(figsize=(12, 6))
plt.plot(x_smooth, y_smooth, color='#4BC0C0', linewidth=2)
plt.xticks(range(len(months)), months)
plt.title('Smooth Coral Cover Trends')
plt.show()`,
      },
      2: {
        "Easy-to-read species distribution": `# Create a bar chart for species distribution
import matplotlib.pyplot as plt

species = ['Coral', 'Fish', 'Crustaceans', 'Mollusks', 'Echinoderms']
counts = [120, 85, 65, 45, 30]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

plt.figure(figsize=(10, 6))
bars = plt.bar(species, counts, color=colors, alpha=0.6)
plt.title('Marine Species Distribution')
plt.ylabel('Species Count')
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height,
             f'{int(height)}', ha='center', va='bottom')`,
        "Interactive bar selection": `# Add interactive bar selection
import plotly.graph_objects as go

fig = go.Figure(data=[
    go.Bar(
        x=species,
        y=counts,
        marker_color=colors,
        hovertemplate='Species: %{x}<br>Count: %{y}<extra></extra>'
    )
])
fig.update_layout(title='Interactive Species Distribution')
fig.show()`,
        "Colorful species categorization": `# Create color-coded species categories
import seaborn as sns

plt.figure(figsize=(10, 6))
sns.barplot(x=species, y=counts, palette='husl')
plt.title('Color-Coded Species Categories')
plt.xticks(rotation=45)
plt.show()`,
      },
      3: {
        "Temperature trend visualization": `# Create temperature trend visualization
import matplotlib.pyplot as plt
import numpy as np

years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
temperatures = [24.5, 24.8, 25.2, 25.5, 25.9, 26.2, 26.5]

plt.figure(figsize=(10, 6))
plt.plot(years, temperatures, 'o-', color='#4BC0C0', linewidth=2)
plt.fill_between(years, temperatures, alpha=0.2, color='#4BC0C0')
plt.title('Ocean Temperature Trends')
plt.ylabel('Temperature (°C)')
plt.grid(True, alpha=0.3)`,
        "Impact analysis in tooltips": `# Add impact analysis tooltips
import plotly.graph_objects as go

def get_impact(temp):
    if temp > 26:
        return 'High stress on coral reefs'
    elif temp > 25.5:
        return 'Moderate stress on marine life'
    return 'Normal conditions'

fig = go.Figure()
fig.add_trace(go.Scatter(
    x=years,
    y=temperatures,
    mode='lines+markers',
    hovertemplate='Year: %{x}<br>Temperature: %{y}°C<br>Impact: ' + 
                 [get_impact(t) for t in temperatures][0] + '<extra></extra>',
    line=dict(color='#4BC0C0', width=2)
))
fig.update_layout(title='Temperature Impact Analysis')
fig.show()`,
      },
      4: {
        "Comparative current vs target view": `# Create radar chart for ecosystem health
import plotly.graph_objects as go

categories = ['Biodiversity', 'Water Quality', 'Habitat Health', 'Species Richness', 'Coral Cover']
current = [75, 82, 68, 70, 65]
target = [90, 90, 85, 85, 80]

fig = go.Figure()
fig.add_trace(go.Scatterpolar(
    r=current,
    theta=categories,
    fill='toself',
    name='Current Status'
))
fig.add_trace(go.Scatterpolar(
    r=target,
    theta=categories,
    fill='toself',
    name='Target Level'
))
fig.update_layout(
    polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
    showlegend=True
)`,
        "Interactive segment selection": `# Add interactive segment selection
import plotly.graph_objects as go

fig = go.Figure()
fig.add_trace(go.Scatterpolar(
    r=current,
    theta=categories,
    fill='toself',
    name='Current Status',
    hovertemplate='Category: %{theta}<br>Current: %{r}%<br>Target: ' + 
                 str(target[categories.index('%{theta}')]) + '%<extra></extra>'
))
fig.add_trace(go.Scatterpolar(
    r=target,
    theta=categories,
    fill='toself',
    name='Target Level'
))
fig.update_layout(
    polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
    showlegend=True
)`,
      },
      5: {
        "Species size vs. abundance": `# Create scatterplot for species size vs. abundance
import matplotlib.pyplot as plt
import numpy as np

# Data
species = ['Coral', 'Fish', 'Crustaceans', 'Mollusks', 'Echinoderms']
sizes = [2.1, 5.3, 3.8, 4.5, 6.2]
abundances = [120, 85, 65, 45, 30]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create scatter plot
plt.figure(figsize=(10, 6))
plt.scatter(sizes, abundances, c=colors, s=100, alpha=0.7)
plt.title('Species Size vs. Abundance')
plt.xlabel('Average Size (cm)')
plt.ylabel('Abundance')
plt.grid(True)
plt.show()`,
        "Distinct color for each species": `# Use different colors for each species
import matplotlib.pyplot as plt
import numpy as np

# Data
species = ['Coral', 'Fish', 'Crustaceans', 'Mollusks', 'Echinoderms']
sizes = [2.1, 5.3, 3.8, 4.5, 6.2]
abundances = [120, 85, 65, 45, 30]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create scatter plot
plt.figure(figsize=(10, 6))
plt.scatter(sizes, abundances, c=colors, s=100, alpha=0.7)
plt.title('Species Size vs. Abundance')
plt.xlabel('Average Size (cm)')
plt.ylabel('Abundance')
plt.grid(True)
plt.show()`,
        "Interactive point tooltips": `# Add interactive tooltips
import matplotlib.pyplot as plt
import numpy as np

# Data
species = ['Coral', 'Fish', 'Crustaceans', 'Mollusks', 'Echinoderms']
sizes = [2.1, 5.3, 3.8, 4.5, 6.2]
abundances = [120, 85, 65, 45, 30]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create scatter plot
plt.figure(figsize=(10, 6))
plt.scatter(sizes, abundances, c=colors, s=100, alpha=0.7)
plt.title('Species Size vs. Abundance')
plt.xlabel('Average Size (cm)')
plt.ylabel('Abundance')
plt.grid(True)

# Add tooltips
for i, species in enumerate(species):
    plt.annotate(species, (sizes[i], abundances[i]), textcoords="offset points", xytext=(0,10), ha='center')

plt.show()`,
        "Highlight outliers": `# Highlight outliers in the scatter plot
import matplotlib.pyplot as plt
import numpy as np

# Data
species = ['Coral', 'Fish', 'Crustaceans', 'Mollusks', 'Echinoderms']
sizes = [2.1, 5.3, 3.8, 4.5, 6.2]
abundances = [120, 85, 65, 45, 30]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create scatter plot
plt.figure(figsize=(10, 6))
plt.scatter(sizes, abundances, c=colors, s=100, alpha=0.7)
plt.title('Species Size vs. Abundance')
plt.xlabel('Average Size (cm)')
plt.ylabel('Abundance')
plt.grid(True)

# Add tooltips
for i, species in enumerate(species):
    plt.annotate(species, (sizes[i], abundances[i]), textcoords="offset points", xytext=(0,10), ha='center')

# Highlight outliers
outliers = [0, 1]  # Indices of outliers
plt.scatter(sizes[outliers], abundances[outliers], c='red', s=100, marker='x', label='Outliers')
plt.legend()

plt.show()`,
        "Zoom and pan scatter area": `# Add zoom and pan functionality to the scatter plot
import matplotlib.pyplot as plt
import numpy as np

# Data
species = ['Coral', 'Fish', 'Crustaceans', 'Mollusks', 'Echinoderms']
sizes = [2.1, 5.3, 3.8, 4.5, 6.2]
abundances = [120, 85, 65, 45, 30]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create scatter plot
plt.figure(figsize=(10, 6))
plt.scatter(sizes, abundances, c=colors, s=100, alpha=0.7)
plt.title('Species Size vs. Abundance')
plt.xlabel('Average Size (cm)')
plt.ylabel('Abundance')
plt.grid(True)

# Add tooltips
for i, species in enumerate(species):
    plt.annotate(species, (sizes[i], abundances[i]), textcoords="offset points", xytext=(0,10), ha='center')

# Add zoom and pan functionality
from matplotlib.widgets import Slider
ax_zoom = plt.axes([0.2, 0.1, 0.65, 0.03])
zoom = Slider(ax_zoom, 'Zoom', 0.1, 10, valinit=1)

def update(val):
    plt.xlim(0, zoom.val * len(sizes))
    plt.ylim(0, zoom.val * max(abundances))
    plt.draw()

zoom.on_changed(update)

plt.show()`,
      },
      6: {
        "Clear habitat proportions": `# Create a pie chart for habitat proportions
import matplotlib.pyplot as plt

# Data
habitat_types = ['Coral', 'Seagrass', 'Sand', 'Rock']
proportions = [40, 25, 20, 15]
colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF']

# Create pie chart
plt.figure(figsize=(8, 8))
plt.pie(proportions, labels=habitat_types, colors=colors, autopct='%1.1f%%', startangle=140)
plt.title('Habitat Type Proportions')
plt.show()`,
        "Distinct color for each habitat": `# Use different colors for each habitat
import matplotlib.pyplot as plt

# Data
habitat_types = ['Coral', 'Seagrass', 'Sand', 'Rock']
proportions = [40, 25, 20, 15]
colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF']

# Create pie chart
plt.figure(figsize=(8, 8))
plt.pie(proportions, labels=habitat_types, colors=colors, autopct='%1.1f%%', startangle=140)
plt.title('Habitat Type Proportions')
plt.show()`,
        "Show percentage labels": `# Add percentage labels to the pie chart
import matplotlib.pyplot as plt

# Data
habitat_types = ['Coral', 'Seagrass', 'Sand', 'Rock']
proportions = [40, 25, 20, 15]
colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF']

# Create pie chart
plt.figure(figsize=(8, 8))
plt.pie(proportions, labels=habitat_types, colors=colors, autopct='%1.1f%%', startangle=140)
plt.title('Habitat Type Proportions')
plt.show()`,
        "Interactive legend": `# Add interactive legend to the pie chart
import matplotlib.pyplot as plt

# Data
habitat_types = ['Coral', 'Seagrass', 'Sand', 'Rock']
proportions = [40, 25, 20, 15]
colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF']

# Create pie chart
plt.figure(figsize=(8, 8))
plt.pie(proportions, labels=habitat_types, colors=colors, autopct='%1.1f%%', startangle=140)
plt.title('Habitat Type Proportions')
plt.legend(title='Habitat Types', loc='upper right')
plt.show()`,
        "Explode largest segment": `# Explode the largest segment in the pie chart
import matplotlib.pyplot as plt

# Data
habitat_types = ['Coral', 'Seagrass', 'Sand', 'Rock']
proportions = [40, 25, 20, 15]
colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF']

# Create pie chart
plt.figure(figsize=(8, 8))
plt.pie(proportions, labels=habitat_types, colors=colors, autopct='%1.1f%%', startangle=140, explode=[0.1, 0, 0, 0])
plt.title('Habitat Type Proportions')
plt.legend(title='Habitat Types', loc='upper right')
plt.show()`,
      },
      7: {
        "Zone-based color coding": `# Create a doughnut chart for MPA coverage
import matplotlib.pyplot as plt

# Data
mpa_zones = ['No-Take', 'Limited Use', 'General Use', 'Unprotected']
coverage = [30, 20, 25, 25]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#E0E0E0']

# Create doughnut chart
plt.figure(figsize=(8, 8))
plt.pie(coverage, labels=mpa_zones, colors=colors, autopct='%1.1f%%', startangle=140, pctdistance=0.85)
plt.title('Marine Protected Area Coverage')
plt.legend(title='MPA Zones', loc='upper right')
plt.show()`,
        "Show total protected area": `# Add total protected area to the doughnut chart
import matplotlib.pyplot as plt

# Data
mpa_zones = ['No-Take', 'Limited Use', 'General Use', 'Unprotected']
coverage = [30, 20, 25, 25]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#E0E0E0']

# Create doughnut chart
plt.figure(figsize=(8, 8))
plt.pie(coverage, labels=mpa_zones, colors=colors, autopct='%1.1f%%', startangle=140, pctdistance=0.85)
plt.title('Marine Protected Area Coverage')
plt.legend(title='MPA Zones', loc='upper right')
plt.text(0.5, 0.5, 'Total Protected Area: 100 km²', ha='center', va='center', fontsize=12, color='black')
plt.show()`,
        "Interactive legend": `# Add interactive legend to the doughnut chart
import matplotlib.pyplot as plt

# Data
mpa_zones = ['No-Take', 'Limited Use', 'General Use', 'Unprotected']
coverage = [30, 20, 25, 25]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#E0E0E0']

# Create doughnut chart
plt.figure(figsize=(8, 8))
plt.pie(coverage, labels=mpa_zones, colors=colors, autopct='%1.1f%%', startangle=140, pctdistance=0.85)
plt.title('Marine Protected Area Coverage')
plt.legend(title='MPA Zones', loc='upper right')
plt.show()`,
        "Highlight no-take zones": `# Highlight no-take zones in the doughnut chart
import matplotlib.pyplot as plt

# Data
mpa_zones = ['No-Take', 'Limited Use', 'General Use', 'Unprotected']
coverage = [30, 20, 25, 25]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#E0E0E0']

# Create doughnut chart
plt.figure(figsize=(8, 8))
plt.pie(coverage, labels=mpa_zones, colors=colors, autopct='%1.1f%%', startangle=140, pctdistance=0.85)
plt.title('Marine Protected Area Coverage')
plt.legend(title='MPA Zones', loc='upper right')
plt.text(0.5, 0.5, 'No-Take Zones: 30 km²', ha='center', va='center', fontsize=12, color='black')
plt.show()`,
        "Show percentage labels": `# Add percentage labels to the doughnut chart
import matplotlib.pyplot as plt

# Data
mpa_zones = ['No-Take', 'Limited Use', 'General Use', 'Unprotected']
coverage = [30, 20, 25, 25]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#E0E0E0']

# Create doughnut chart
plt.figure(figsize=(8, 8))
plt.pie(coverage, labels=mpa_zones, colors=colors, autopct='%1.1f%%', startangle=140, pctdistance=0.85)
plt.title('Marine Protected Area Coverage')
plt.legend(title='MPA Zones', loc='upper right')
plt.show()`,
      },
      8: {
        "Bubble size by threat level": `# Create a bubble chart for species population vs. area vs. threat
import matplotlib.pyplot as plt
import numpy as np

# Data
species = ['Coral', 'Fish', 'Turtle', 'Crab', 'Seahorse']
areas = [10, 20, 30, 40, 50]
populations = [200, 150, 100, 80, 60]
threats = [15, 10, 20, 8, 12]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create bubble chart
plt.figure(figsize=(10, 6))
plt.scatter(areas, populations, s=threats, c=colors, alpha=0.7)
plt.title('Species Population vs. Area vs. Threat')
plt.xlabel('Area (km²)')
plt.ylabel('Population')
plt.colorbar(label='Threat Level')
plt.show()`,
        "Interactive tooltips": `# Add interactive tooltips to the bubble chart
import matplotlib.pyplot as plt
import numpy as np

# Data
species = ['Coral', 'Fish', 'Turtle', 'Crab', 'Seahorse']
areas = [10, 20, 30, 40, 50]
populations = [200, 150, 100, 80, 60]
threats = [15, 10, 20, 8, 12]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create bubble chart
plt.figure(figsize=(10, 6))
plt.scatter(areas, populations, s=threats, c=colors, alpha=0.7)
plt.title('Species Population vs. Area vs. Threat')
plt.xlabel('Area (km²)')
plt.ylabel('Population')
plt.colorbar(label='Threat Level')
plt.show()`,
        "Highlight endangered species": `# Highlight endangered species in the bubble chart
import matplotlib.pyplot as plt
import numpy as np

# Data
species = ['Coral', 'Fish', 'Turtle', 'Crab', 'Seahorse']
areas = [10, 20, 30, 40, 50]
populations = [200, 150, 100, 80, 60]
threats = [15, 10, 20, 8, 12]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create bubble chart
plt.figure(figsize=(10, 6))
plt.scatter(areas, populations, s=threats, c=colors, alpha=0.7)
plt.title('Species Population vs. Area vs. Threat')
plt.xlabel('Area (km²)')
plt.ylabel('Population')
plt.colorbar(label='Threat Level')
plt.show()`,
        "Zoom and pan": `# Add zoom and pan functionality to the bubble chart
import matplotlib.pyplot as plt
import numpy as np

# Data
species = ['Coral', 'Fish', 'Turtle', 'Crab', 'Seahorse']
areas = [10, 20, 30, 40, 50]
populations = [200, 150, 100, 80, 60]
threats = [15, 10, 20, 8, 12]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create bubble chart
plt.figure(figsize=(10, 6))
plt.scatter(areas, populations, s=threats, c=colors, alpha=0.7)
plt.title('Species Population vs. Area vs. Threat')
plt.xlabel('Area (km²)')
plt.ylabel('Population')
plt.colorbar(label='Threat Level')
plt.show()`,
        "Color by species": `# Use different colors for each species in the bubble chart
import matplotlib.pyplot as plt
import numpy as np

# Data
species = ['Coral', 'Fish', 'Turtle', 'Crab', 'Seahorse']
areas = [10, 20, 30, 40, 50]
populations = [200, 150, 100, 80, 60]
threats = [15, 10, 20, 8, 12]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create bubble chart
plt.figure(figsize=(10, 6))
plt.scatter(areas, populations, s=threats, c=colors, alpha=0.7)
plt.title('Species Population vs. Area vs. Threat')
plt.xlabel('Area (km²)')
plt.ylabel('Population')
plt.colorbar(label='Threat Level')
plt.show()`,
      },
      9: {
        "Horizontal bar orientation": `# Create a horizontal bar chart for top threats
import matplotlib.pyplot as plt

# Data
threats = ['Overfishing', 'Pollution', 'Climate Change', 'Habitat Loss', 'Invasive Species']
impact_scores = [95, 85, 80, 70, 60]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create horizontal bar chart
plt.figure(figsize=(10, 6))
plt.barh(threats, impact_scores, color=colors)
plt.title('Top Threats to Marine Life')
plt.xlabel('Impact Score')
plt.ylabel('Threat')
plt.show()`,
        "Color by threat type": `# Use different colors for each threat type
import matplotlib.pyplot as plt

# Data
threats = ['Overfishing', 'Pollution', 'Climate Change', 'Habitat Loss', 'Invasive Species']
impact_scores = [95, 85, 80, 70, 60]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create horizontal bar chart
plt.figure(figsize=(10, 6))
plt.barh(threats, impact_scores, color=colors)
plt.title('Top Threats to Marine Life')
plt.xlabel('Impact Score')
plt.ylabel('Threat')
plt.show()`,
        "Show impact values": `# Add impact values to the horizontal bar chart
import matplotlib.pyplot as plt

# Data
threats = ['Overfishing', 'Pollution', 'Climate Change', 'Habitat Loss', 'Invasive Species']
impact_scores = [95, 85, 80, 70, 60]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create horizontal bar chart
plt.figure(figsize=(10, 6))
plt.barh(threats, impact_scores, color=colors)
plt.title('Top Threats to Marine Life')
plt.xlabel('Impact Score')
plt.ylabel('Threat')
plt.show()`,
        "Highlight top threat": `# Highlight the top threat in the horizontal bar chart
import matplotlib.pyplot as plt

# Data
threats = ['Overfishing', 'Pollution', 'Climate Change', 'Habitat Loss', 'Invasive Species']
impact_scores = [95, 85, 80, 70, 60]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create horizontal bar chart
plt.figure(figsize=(10, 6))
plt.barh(threats, impact_scores, color=colors)
plt.title('Top Threats to Marine Life')
plt.xlabel('Impact Score')
plt.ylabel('Threat')
plt.show()`,
        "Interactive legend": `# Add interactive legend to the horizontal bar chart
import matplotlib.pyplot as plt

# Data
threats = ['Overfishing', 'Pollution', 'Climate Change', 'Habitat Loss', 'Invasive Species']
impact_scores = [95, 85, 80, 70, 60]
colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

# Create horizontal bar chart
plt.figure(figsize=(10, 6))
plt.barh(threats, impact_scores, color=colors)
plt.title('Top Threats to Marine Life')
plt.xlabel('Impact Score')
plt.ylabel('Threat')
plt.show()`,
      },
      10: {
        "Seasonal color palette": `# Create a polar area chart for seasonal plankton abundance
import matplotlib.pyplot as plt

# Data
seasons = ['Winter', 'Spring', 'Summer', 'Autumn']
abundances = [30, 60, 90, 50]
colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384']

# Create polar area chart
plt.figure(figsize=(8, 8))
plt.polar(seasons, abundances, 'o-', color=colors)
plt.title('Seasonal Plankton Abundance')
plt.show()`,
        "Show abundance values": `# Add abundance values to the polar area chart
import matplotlib.pyplot as plt

# Data
seasons = ['Winter', 'Spring', 'Summer', 'Autumn']
abundances = [30, 60, 90, 50]
colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384']

# Create polar area chart
plt.figure(figsize=(8, 8))
plt.polar(seasons, abundances, 'o-', color=colors)
plt.title('Seasonal Plankton Abundance')
plt.show()`,
        "Interactive legend": `# Add interactive legend to the polar area chart
import matplotlib.pyplot as plt

# Data
seasons = ['Winter', 'Spring', 'Summer', 'Autumn']
abundances = [30, 60, 90, 50]
colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384']

# Create polar area chart
plt.figure(figsize=(8, 8))
plt.polar(seasons, abundances, 'o-', color=colors)
plt.title('Seasonal Plankton Abundance')
plt.legend(title='Season', loc='upper right')
plt.show()`,
        "Highlight peak season": `# Highlight the peak season in the polar area chart
import matplotlib.pyplot as plt

# Data
seasons = ['Winter', 'Spring', 'Summer', 'Autumn']
abundances = [30, 60, 90, 50]
colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384']

# Create polar area chart
plt.figure(figsize=(8, 8))
plt.polar(seasons, abundances, 'o-', color=colors)
plt.title('Seasonal Plankton Abundance')
plt.legend(title='Season', loc='upper right')
plt.show()`,
        "Polar area animation": `# Add animation to the polar area chart
import matplotlib.pyplot as plt

# Data
seasons = ['Winter', 'Spring', 'Summer', 'Autumn']
abundances = [30, 60, 90, 50]
colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384']

# Create polar area chart
plt.figure(figsize=(8, 8))
plt.polar(seasons, abundances, 'o-', color=colors)
plt.title('Seasonal Plankton Abundance')
plt.legend(title='Season', loc='upper right')
plt.show()`,
      },
      11: {
        "Stacked bars by debris type": `# Create a stacked bar chart for plastic debris by location
import matplotlib.pyplot as plt

# Data
locations = ['Beach', 'Reef', 'Open Ocean']
microplastics = [40, 30, 20]
macroplastics = [20, 25, 30]
fishing_gear = [10, 15, 25]
colors = ['#4BC0C0', '#FF6384', '#FFCE56']

# Create stacked bar chart
plt.figure(figsize=(10, 6))
plt.bar(locations, microplastics, color=colors[0], label='Microplastics')
plt.bar(locations, macroplastics, bottom=microplastics, color=colors[1], label='Macroplastics')
plt.bar(locations, fishing_gear, bottom=np.array(microplastics) + np.array(macroplastics), color=colors[2], label='Fishing Gear')
plt.title('Plastic Debris by Location')
plt.xlabel('Location')
plt.ylabel('Percentage')
plt.legend()
plt.show()`,
        "Color by plastic type": `# Use different colors for each plastic type
import matplotlib.pyplot as plt

# Data
locations = ['Beach', 'Reef', 'Open Ocean']
microplastics = [40, 30, 20]
macroplastics = [20, 25, 30]
fishing_gear = [10, 15, 25]
colors = ['#4BC0C0', '#FF6384', '#FFCE56']

# Create stacked bar chart
plt.figure(figsize=(10, 6))
plt.bar(locations, microplastics, color=colors[0], label='Microplastics')
plt.bar(locations, macroplastics, bottom=microplastics, color=colors[1], label='Macroplastics')
plt.bar(locations, fishing_gear, bottom=np.array(microplastics) + np.array(macroplastics), color=colors[2], label='Fishing Gear')
plt.title('Plastic Debris by Location')
plt.xlabel('Location')
plt.ylabel('Percentage')
plt.legend()
plt.show()`,
        "Show total debris": `# Add total debris to the stacked bar chart
import matplotlib.pyplot as plt

# Data
locations = ['Beach', 'Reef', 'Open Ocean']
microplastics = [40, 30, 20]
macroplastics = [20, 25, 30]
fishing_gear = [10, 15, 25]
colors = ['#4BC0C0', '#FF6384', '#FFCE56']

# Create stacked bar chart
plt.figure(figsize=(10, 6))
plt.bar(locations, microplastics, color=colors[0], label='Microplastics')
plt.bar(locations, macroplastics, bottom=microplastics, color=colors[1], label='Macroplastics')
plt.bar(locations, fishing_gear, bottom=np.array(microplastics) + np.array(macroplastics), color=colors[2], label='Fishing Gear')
plt.title('Plastic Debris by Location')
plt.xlabel('Location')
plt.ylabel('Percentage')
plt.legend()
plt.show()`,
        "Interactive legend": `# Add interactive legend to the stacked bar chart
import matplotlib.pyplot as plt

# Data
locations = ['Beach', 'Reef', 'Open Ocean']
microplastics = [40, 30, 20]
macroplastics = [20, 25, 30]
fishing_gear = [10, 15, 25]
colors = ['#4BC0C0', '#FF6384', '#FFCE56']

# Create stacked bar chart
plt.figure(figsize=(10, 6))
plt.bar(locations, microplastics, color=colors[0], label='Microplastics')
plt.bar(locations, macroplastics, bottom=microplastics, color=colors[1], label='Macroplastics')
plt.bar(locations, fishing_gear, bottom=np.array(microplastics) + np.array(macroplastics), color=colors[2], label='Fishing Gear')
plt.title('Plastic Debris by Location')
plt.xlabel('Location')
plt.ylabel('Percentage')
plt.legend()
plt.show()`,
        "Highlight most polluted location": `# Highlight the most polluted location in the stacked bar chart
import matplotlib.pyplot as plt

# Data
locations = ['Beach', 'Reef', 'Open Ocean']
microplastics = [40, 30, 20]
macroplastics = [20, 25, 30]
fishing_gear = [10, 15, 25]
colors = ['#4BC0C0', '#FF6384', '#FFCE56']

# Create stacked bar chart
plt.figure(figsize=(10, 6))
plt.bar(locations, microplastics, color=colors[0], label='Microplastics')
plt.bar(locations, macroplastics, bottom=microplastics, color=colors[1], label='Macroplastics')
plt.bar(locations, fishing_gear, bottom=np.array(microplastics) + np.array(macroplastics), color=colors[2], label='Fishing Gear')
plt.title('Plastic Debris by Location')
plt.xlabel('Location')
plt.ylabel('Percentage')
plt.legend()
plt.show()`,
      },
    };

    return likes.map((like) => codeSnippets[chartId][like]).join("\n\n");
  };

  const getRCode = (chartId, likes) => {
    const codeSnippets = {
      1: {
        "Clear monthly trend visualization": `# Create a line chart for coral cover trends
library(ggplot2)

# Monthly coral cover data
months <- c('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
coral_cover <- c(45, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33)

# Create data frame
df <- data.frame(months = months, cover = coral_cover)

# Create plot
ggplot(df, aes(x = months, y = cover)) +
  geom_line(color = "#4BC0C0", size = 1) +
  geom_point(color = "#4BC0C0", size = 3) +
  geom_area(fill = "#4BC0C0", alpha = 0.2) +
  theme_minimal() +
  labs(title = "Coral Cover Trends",
       y = "Coral Cover (%)")`,
        "Interactive zoom functionality": `# Add interactive zoom functionality
library(plotly)

# Create interactive plot
plot_ly(df, x = ~months, y = ~cover, type = 'scatter', mode = 'lines+markers',
        line = list(color = '#4BC0C0', width = 2),
        marker = list(color = '#4BC0C0', size = 8)) %>%
  layout(title = "Interactive Coral Cover Trends",
         xaxis = list(title = "Month"),
         yaxis = list(title = "Coral Cover (%)"))`,
        "Detailed tooltips with coral cover data": `# Add detailed tooltips
library(plotly)

plot_ly(df, x = ~months, y = ~cover, type = 'scatter', mode = 'lines+markers',
        line = list(color = '#4BC0C0', width = 2),
        marker = list(color = '#4BC0C0', size = 8),
        hovertemplate = paste(
          "Month: %{x}<br>",
          "Coral Cover: %{y}%<extra></extra>"
        )) %>%
  layout(title = "Coral Cover Trends with Tooltips")`,
        "Smooth line transitions": `# Create smooth line transitions
library(ggplot2)

ggplot(df, aes(x = months, y = cover)) +
  geom_smooth(method = "loess", color = "#4BC0C0", se = FALSE) +
  geom_point(color = "#4BC0C0", size = 3) +
  theme_minimal() +
  labs(title = "Smooth Coral Cover Trends")`,
      },
      2: {
        "Easy-to-read species distribution": `# Create a bar chart for species distribution
library(ggplot2)

# Species data
species <- c('Coral', 'Fish', 'Crustaceans', 'Mollusks', 'Echinoderms')
counts <- c(120, 85, 65, 45, 30)
colors <- c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(species = species, count = counts)

# Create plot
ggplot(df, aes(x = species, y = count, fill = species)) +
  geom_bar(stat = "identity") +
  scale_fill_manual(values = colors) +
  theme_minimal() +
  labs(title = "Marine Species Distribution",
       y = "Species Count")`,
        "Interactive bar selection": `# Add interactive bar selection
library(plotly)

plot_ly(df, x = ~species, y = ~count, type = 'bar',
        marker = list(color = colors),
        hovertemplate = paste(
          "Species: %{x}<br>",
          "Count: %{y}<extra></extra>"
        )) %>%
  layout(title = "Interactive Species Distribution")`,
        "Colorful species categorization": `# Create color-coded species categories
library(ggplot2)

ggplot(df, aes(x = species, y = count, fill = species)) +
  geom_bar(stat = "identity") +
  scale_fill_brewer(palette = "Set3") +
  theme_minimal() +
  labs(title = "Color-Coded Species Categories")`,
      },
      3: {
        "Temperature trend visualization": `# Create temperature trend visualization
library(ggplot2)

# Temperature data
years <- c('2018', '2019', '2020', '2021', '2022', '2023', '2024')
temperatures <- c(24.5, 24.8, 25.2, 25.5, 25.9, 26.2, 26.5)

# Create data frame
df <- data.frame(year = years, temp = temperatures)

# Create plot
ggplot(df, aes(x = year, y = temp)) +
  geom_line(color = "#4BC0C0", size = 1) +
  geom_point(color = "#4BC0C0", size = 3) +
  geom_area(fill = "#4BC0C0", alpha = 0.2) +
  theme_minimal() +
  labs(title = "Ocean Temperature Trends",
       y = "Temperature (°C)")`,
        "Impact analysis in tooltips": `# Add impact analysis tooltips
library(plotly)

# Function to determine impact
get_impact <- function(temp) {
  if (temp > 26) return("High stress on coral reefs")
  else if (temp > 25.5) return("Moderate stress on marine life")
  else return("Normal conditions")
}

plot_ly(df, x = ~year, y = ~temp, type = 'scatter', mode = 'lines+markers',
        line = list(color = '#4BC0C0', width = 2),
        marker = list(color = '#4BC0C0', size = 8),
        hovertemplate = paste(
          "Year: %{x}<br>",
          "Temperature: %{y}°C<br>",
          "Impact: ", sapply(df$temp, get_impact), "<extra></extra>"
        )) %>%
  layout(title = "Temperature Impact Analysis")`,
      },
      4: {
        "Comparative current vs target view": `# Create radar chart for ecosystem health
library(fmsb)

# Ecosystem health data
categories <- c('Biodiversity', 'Water Quality', 'Habitat Health', 'Species Richness', 'Coral Cover')
current <- c(75, 82, 68, 70, 65)
target <- c(90, 90, 85, 85, 80)

# Create data frame
df <- data.frame(
  Category = categories,
  Current = current,
  Target = target
)

# Create radar chart
radarchart(df[,2:3], 
           axistype = 1,
           pcol = c("#FF6384", "#36A2EB"),
           pfcol = c(scales::alpha("#FF6384", 0.2), scales::alpha("#36A2EB", 0.2)),
           plwd = 2,
           title = "Ecosystem Health Metrics")`,
        "Interactive segment selection": `# Add interactive segment selection
library(plotly)

plot_ly(type = 'scatterpolar',
        r = current,
        theta = categories,
        fill = 'toself',
        name = 'Current Status') %>%
  add_trace(r = target,
            theta = categories,
            fill = 'toself',
            name = 'Target Level') %>%
  layout(
    polar = list(
      radialaxis = list(
        visible = TRUE,
        range = c(0, 100)
      )
    ),
    showlegend=TRUE
  )`,
      },
      5: {
        "Species size vs. abundance": `# Create scatterplot for species size vs. abundance
library(ggplot2)

# Data
species = c('Coral', 'Fish', 'Crustaceans', 'Mollusks', 'Echinoderms')
sizes = c(2.1, 5.3, 3.8, 4.5, 6.2)
abundances = c(120, 85, 65, 45, 30)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(species = species, size = sizes, abundance = abundances)

# Create scatter plot
ggplot(df, aes(x = size, y = abundance, color = species)) +
  geom_point(size = 4) +
  scale_color_manual(values = colors) +
  theme_minimal() +
  labs(title = "Species Size vs. Abundance",
       x = "Average Size (cm)",
       y = "Abundance")`,
        "Distinct color for each species": `# Use different colors for each species
library(ggplot2)

# Data
species = c('Coral', 'Fish', 'Crustaceans', 'Mollusks', 'Echinoderms')
sizes = c(2.1, 5.3, 3.8, 4.5, 6.2)
abundances = c(120, 85, 65, 45, 30)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(species = species, size = sizes, abundance = abundances)

# Create scatter plot
ggplot(df, aes(x = size, y = abundance, color = species)) +
  geom_point(size = 4) +
  scale_color_manual(values = colors) +
  theme_minimal() +
  labs(title = "Species Size vs. Abundance",
       x = "Average Size (cm)",
       y = "Abundance")`,
        "Interactive point tooltips": `# Add interactive tooltips
library(ggplot2)

# Data
species = c('Coral', 'Fish', 'Crustaceans', 'Mollusks', 'Echinoderms')
sizes = c(2.1, 5.3, 3.8, 4.5, 6.2)
abundances = c(120, 85, 65, 45, 30)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(species = species, size = sizes, abundance = abundances)

# Create scatter plot
ggplot(df, aes(x = size, y = abundance, color = species)) +
  geom_point(size = 4) +
  scale_color_manual(values = colors) +
  theme_minimal() +
  labs(title = "Species Size vs. Abundance",
       x = "Average Size (cm)",
       y = "Abundance") +
  geom_text(aes(label = species), hjust = 0.5, vjust = -0.5, color = "black")`,
        "Highlight outliers": `# Highlight outliers in the scatter plot
library(ggplot2)

# Data
species = c('Coral', 'Fish', 'Crustaceans', 'Mollusks', 'Echinoderms')
sizes = c(2.1, 5.3, 3.8, 4.5, 6.2)
abundances = c(120, 85, 65, 45, 30)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(species = species, size = sizes, abundance = abundances)

# Create scatter plot
ggplot(df, aes(x = size, y = abundance, color = species)) +
  geom_point(size = 4) +
  scale_color_manual(values = colors) +
  theme_minimal() +
  labs(title = "Species Size vs. Abundance",
       x = "Average Size (cm)",
       y = "Abundance") +
  geom_text(aes(label = species), hjust = 0.5, vjust = -0.5, color = "black") +
  geom_point(data = df[c(1, 2), ], color = "red", size = 4, shape = 8)`,
        "Zoom and pan scatter area": `# Add zoom and pan functionality to the scatter plot
library(ggplot2)

# Data
species = c('Coral', 'Fish', 'Crustaceans', 'Mollusks', 'Echinoderms')
sizes = c(2.1, 5.3, 3.8, 4.5, 6.2)
abundances = c(120, 85, 65, 45, 30)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(species = species, size = sizes, abundance = abundances)

# Create scatter plot
ggplot(df, aes(x = size, y = abundance, color = species)) +
  geom_point(size = 4) +
  scale_color_manual(values = colors) +
  theme_minimal() +
  labs(title = "Species Size vs. Abundance",
       x = "Average Size (cm)",
       y = "Abundance") +
  geom_text(aes(label = species), hjust = 0.5, vjust = -0.5, color = "black") +
  geom_point(data = df[c(1, 2), ], color = "red", size = 4, shape = 8) +
  scale_x_continuous(trans = 'log10') +
  scale_y_continuous(trans = 'log10') +
  theme(legend.position = "none")`,
      },
      6: {
        "Clear habitat proportions": `# Create a pie chart for habitat proportions
library(ggplot2)

# Data
habitat_types = c('Coral', 'Seagrass', 'Sand', 'Rock')
proportions = c(40, 25, 20, 15)
colors = c('#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF')

# Create pie chart
ggplot(df, aes(x = "", y = proportions, fill = habitat_types)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Habitat Type Proportions") +
  theme(legend.position = "none")`,
        "Distinct color for each habitat": `# Use different colors for each habitat
library(ggplot2)

# Data
habitat_types = c('Coral', 'Seagrass', 'Sand', 'Rock')
proportions = c(40, 25, 20, 15)
colors = c('#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF')

# Create pie chart
ggplot(df, aes(x = "", y = proportions, fill = habitat_types)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Habitat Type Proportions") +
  theme(legend.position = "none")`,
        "Show percentage labels": `# Add percentage labels to the pie chart
library(ggplot2)

# Data
habitat_types = c('Coral', 'Seagrass', 'Sand', 'Rock')
proportions = c(40, 25, 20, 15)
colors = c('#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF')

# Create pie chart
ggplot(df, aes(x = "", y = proportions, fill = habitat_types)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Habitat Type Proportions") +
  theme(legend.position = "none")`,
        "Interactive legend": `# Add interactive legend to the pie chart
library(ggplot2)

# Data
habitat_types = c('Coral', 'Seagrass', 'Sand', 'Rock')
proportions = c(40, 25, 20, 15)
colors = c('#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF')

# Create pie chart
ggplot(df, aes(x = "", y = proportions, fill = habitat_types)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Habitat Type Proportions") +
  theme(legend.position = "none")`,
        "Explode largest segment": `# Explode the largest segment in the pie chart
library(ggplot2)

# Data
habitat_types = c('Coral', 'Seagrass', 'Sand', 'Rock')
proportions = c(40, 25, 20, 15)
colors = c('#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF')

# Create pie chart
ggplot(df, aes(x = "", y = proportions, fill = habitat_types)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Habitat Type Proportions") +
  theme(legend.position = "none")`,
      },
      7: {
        "Zone-based color coding": `# Create a doughnut chart for MPA coverage
library(ggplot2)

# Data
mpa_zones = c('No-Take', 'Limited Use', 'General Use', 'Unprotected')
coverage = c(30, 20, 25, 25)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#E0E0E0')

# Create doughnut chart
ggplot(df, aes(x = "", y = coverage, fill = mpa_zones)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Marine Protected Area Coverage") +
  theme(legend.position = "none")`,
        "Show total protected area": `# Add total protected area to the doughnut chart
library(ggplot2)

# Data
mpa_zones = c('No-Take', 'Limited Use', 'General Use', 'Unprotected')
coverage = c(30, 20, 25, 25)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#E0E0E0')

# Create doughnut chart
ggplot(df, aes(x = "", y = coverage, fill = mpa_zones)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Marine Protected Area Coverage") +
  theme(legend.position = "none") +
  geom_text(aes(label = paste0(coverage, " km²")), x = 0.5, y = 0.5, color = "black")`,
        "Interactive legend": `# Add interactive legend to the doughnut chart
library(ggplot2)

# Data
mpa_zones = c('No-Take', 'Limited Use', 'General Use', 'Unprotected')
coverage = c(30, 20, 25, 25)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#E0E0E0')

# Create doughnut chart
ggplot(df, aes(x = "", y = coverage, fill = mpa_zones)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Marine Protected Area Coverage") +
  theme(legend.position = "none")`,
        "Highlight no-take zones": `# Highlight no-take zones in the doughnut chart
library(ggplot2)

# Data
mpa_zones = c('No-Take', 'Limited Use', 'General Use', 'Unprotected')
coverage = c(30, 20, 25, 25)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#E0E0E0')

# Create doughnut chart
ggplot(df, aes(x = "", y = coverage, fill = mpa_zones)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Marine Protected Area Coverage") +
  theme(legend.position = "none") +
  geom_text(aes(label = paste0(coverage, " km²")), x = 0.5, y = 0.5, color = "black")`,
        "Show percentage labels": `# Add percentage labels to the doughnut chart
library(ggplot2)

# Data
mpa_zones = c('No-Take', 'Limited Use', 'General Use', 'Unprotected')
coverage = c(30, 20, 25, 25)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#E0E0E0')

# Create doughnut chart
ggplot(df, aes(x = "", y = coverage, fill = mpa_zones)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Marine Protected Area Coverage") +
  theme(legend.position = "none")`,
      },
      8: {
        "Bubble size by threat level": `# Create a bubble chart for species population vs. area vs. threat
library(ggplot2)

# Data
species = c('Coral', 'Fish', 'Turtle', 'Crab', 'Seahorse')
areas = c(10, 20, 30, 40, 50)
populations = c(200, 150, 100, 80, 60)
threats = c(15, 10, 20, 8, 12)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(species = species, area = areas, population = populations, threat = threats)

# Create bubble chart
ggplot(df, aes(x = area, y = population, size = threat, color = species)) +
  geom_point() +
  scale_color_manual(values = colors) +
  scale_size_continuous(range = c(2, 10)) +
  theme_minimal() +
  labs(title = "Species Population vs. Area vs. Threat",
       x = "Area (km²)",
       y = "Population",
       size = "Threat Level")`,
        "Interactive tooltips": `# Add interactive tooltips to the bubble chart
library(ggplot2)

# Data
species = c('Coral', 'Fish', 'Turtle', 'Crab', 'Seahorse')
areas = c(10, 20, 30, 40, 50)
populations = c(200, 150, 100, 80, 60)
threats = c(15, 10, 20, 8, 12)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(species = species, area = areas, population = populations, threat = threats)

# Create bubble chart
ggplot(df, aes(x = area, y = population, size = threat, color = species)) +
  geom_point() +
  scale_color_manual(values = colors) +
  scale_size_continuous(range = c(2, 10)) +
  theme_minimal() +
  labs(title = "Species Population vs. Area vs. Threat",
       x = "Area (km²)",
       y = "Population",
       size = "Threat Level")`,
        "Highlight endangered species": `# Highlight endangered species in the bubble chart
library(ggplot2)

# Data
species = c('Coral', 'Fish', 'Turtle', 'Crab', 'Seahorse')
areas = c(10, 20, 30, 40, 50)
populations = c(200, 150, 100, 80, 60)
threats = c(15, 10, 20, 8, 12)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(species = species, area = areas, population = populations, threat = threats)

# Create bubble chart
ggplot(df, aes(x = area, y = population, size = threat, color = species)) +
  geom_point() +
  scale_color_manual(values = colors) +
  scale_size_continuous(range = c(2, 10)) +
  theme_minimal() +
  labs(title = "Species Population vs. Area vs. Threat",
       x = "Area (km²)",
       y = "Population",
       size = "Threat Level")`,
        "Zoom and pan": `# Add zoom and pan functionality to the bubble chart
library(ggplot2)

# Data
species = c('Coral', 'Fish', 'Turtle', 'Crab', 'Seahorse')
areas = c(10, 20, 30, 40, 50)
populations = c(200, 150, 100, 80, 60)
threats = c(15, 10, 20, 8, 12)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(species = species, area = areas, population = populations, threat = threats)

# Create bubble chart
ggplot(df, aes(x = area, y = population, size = threat, color = species)) +
  geom_point() +
  scale_color_manual(values = colors) +
  scale_size_continuous(range = c(2, 10)) +
  theme_minimal() +
  labs(title = "Species Population vs. Area vs. Threat",
       x = "Area (km²)",
       y = "Population",
       size = "Threat Level")`,
        "Color by species": `# Use different colors for each species in the bubble chart
library(ggplot2)

# Data
species = c('Coral', 'Fish', 'Turtle', 'Crab', 'Seahorse')
areas = c(10, 20, 30, 40, 50)
populations = c(200, 150, 100, 80, 60)
threats = c(15, 10, 20, 8, 12)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(species = species, area = areas, population = populations, threat = threats)

# Create bubble chart
ggplot(df, aes(x = area, y = population, size = threat, color = species)) +
  geom_point() +
  scale_color_manual(values = colors) +
  scale_size_continuous(range = c(2, 10)) +
  theme_minimal() +
  labs(title = "Species Population vs. Area vs. Threat",
       x = "Area (km²)",
       y = "Population",
       size = "Threat Level")`,
      },
      9: {
        "Horizontal bar orientation": `# Create a horizontal bar chart for top threats
library(ggplot2)

# Data
threats = c('Overfishing', 'Pollution', 'Climate Change', 'Habitat Loss', 'Invasive Species')
impact_scores = c(95, 85, 80, 70, 60)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(threat = threats, impact_score = impact_scores)

# Create horizontal bar chart
ggplot(df, aes(x = impact_score, y = reorder(threat, -impact_score), fill = threat)) +
  geom_bar(stat = "identity") +
  scale_fill_manual(values = colors) +
  theme_minimal() +
  labs(title = "Top Threats to Marine Life",
       x = "Impact Score",
       y = "Threat")`,
        "Color by threat type": `# Use different colors for each threat type
library(ggplot2)

# Data
threats = c('Overfishing', 'Pollution', 'Climate Change', 'Habitat Loss', 'Invasive Species')
impact_scores = c(95, 85, 80, 70, 60)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(threat = threats, impact_score = impact_scores)

# Create horizontal bar chart
ggplot(df, aes(x = impact_score, y = reorder(threat, -impact_score), fill = threat)) +
  geom_bar(stat = "identity") +
  scale_fill_manual(values = colors) +
  theme_minimal() +
  labs(title = "Top Threats to Marine Life",
       x = "Impact Score",
       y = "Threat")`,
        "Show impact values": `# Add impact values to the horizontal bar chart
library(ggplot2)

# Data
threats = c('Overfishing', 'Pollution', 'Climate Change', 'Habitat Loss', 'Invasive Species')
impact_scores = c(95, 85, 80, 70, 60)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(threat = threats, impact_score = impact_scores)

# Create horizontal bar chart
ggplot(df, aes(x = impact_score, y = reorder(threat, -impact_score), fill = threat)) +
  geom_bar(stat = "identity") +
  scale_fill_manual(values = colors) +
  theme_minimal() +
  labs(title = "Top Threats to Marine Life",
       x = "Impact Score",
       y = "Threat")`,
        "Highlight top threat": `# Highlight the top threat in the horizontal bar chart
library(ggplot2)

# Data
threats = c('Overfishing', 'Pollution', 'Climate Change', 'Habitat Loss', 'Invasive Species')
impact_scores = c(95, 85, 80, 70, 60)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(threat = threats, impact_score = impact_scores)

# Create horizontal bar chart
ggplot(df, aes(x = impact_score, y = reorder(threat, -impact_score), fill = threat)) +
  geom_bar(stat = "identity") +
  scale_fill_manual(values = colors) +
  theme_minimal() +
  labs(title = "Top Threats to Marine Life",
       x = "Impact Score",
       y = "Threat")`,
        "Interactive legend": `# Add interactive legend to the horizontal bar chart
library(ggplot2)

# Data
threats = c('Overfishing', 'Pollution', 'Climate Change', 'Habitat Loss', 'Invasive Species')
impact_scores = c(95, 85, 80, 70, 60)
colors = c('#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF')

# Create data frame
df <- data.frame(threat = threats, impact_score = impact_scores)

# Create horizontal bar chart
ggplot(df, aes(x = impact_score, y = reorder(threat, -impact_score), fill = threat)) +
  geom_bar(stat = "identity") +
  scale_fill_manual(values = colors) +
  theme_minimal() +
  labs(title = "Top Threats to Marine Life",
       x = "Impact Score",
       y = "Threat")`,
      },
      10: {
        "Seasonal color palette": `# Create a polar area chart for seasonal plankton abundance
library(ggplot2)

# Data
seasons = c('Winter', 'Spring', 'Summer', 'Autumn')
abundances = c(30, 60, 90, 50)
colors = c('#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384')

# Create polar area chart
ggplot(df, aes(x = "", y = abundances, fill = seasons)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Seasonal Plankton Abundance") +
  theme(legend.position = "none")`,
        "Show abundance values": `# Add abundance values to the polar area chart
library(ggplot2)

# Data
seasons = c('Winter', 'Spring', 'Summer', 'Autumn')
abundances = c(30, 60, 90, 50)
colors = c('#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384')

# Create polar area chart
ggplot(df, aes(x = "", y = abundances, fill = seasons)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Seasonal Plankton Abundance") +
  theme(legend.position = "none")`,
        "Interactive legend": `# Add interactive legend to the polar area chart
library(ggplot2)

# Data
seasons = c('Winter', 'Spring', 'Summer', 'Autumn')
abundances = c(30, 60, 90, 50)
colors = c('#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384')

# Create polar area chart
ggplot(df, aes(x = "", y = abundances, fill = seasons)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Seasonal Plankton Abundance") +
  theme(legend.position = "none")`,
        "Highlight peak season": `# Highlight the peak season in the polar area chart
library(ggplot2)

# Data
seasons = c('Winter', 'Spring', 'Summer', 'Autumn')
abundances = c(30, 60, 90, 50)
colors = c('#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384')

# Create polar area chart
ggplot(df, aes(x = "", y = abundances, fill = seasons)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Seasonal Plankton Abundance") +
  theme(legend.position = "none")`,
        "Polar area animation": `# Add animation to the polar area chart
library(ggplot2)

# Data
seasons = c('Winter', 'Spring', 'Summer', 'Autumn')
abundances = c(30, 60, 90, 50)
colors = c('#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384')

# Create polar area chart
ggplot(df, aes(x = "", y = abundances, fill = seasons)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  theme_void() +
  ggtitle("Seasonal Plankton Abundance") +
  theme(legend.position = "none")`,
      },
      11: {
        "Stacked bars by debris type": `# Create a stacked bar chart for plastic debris by location
library(ggplot2)

# Data
locations = c('Beach', 'Reef', 'Open Ocean')
microplastics = c(40, 30, 20)
macroplastics = c(20, 25, 30)
fishing_gear = c(10, 15, 25)
colors = c('#4BC0C0', '#FF6384', '#FFCE56')

# Create stacked bar chart
ggplot(df, aes(x = locations, y = microplastics, fill = "Microplastics")) +
  geom_bar(stat = "identity") +
  geom_bar(aes(y = macroplastics), stat = "identity", fill = colors[1]) +
  geom_bar(aes(y = fishing_gear), stat = "identity", fill = colors[2]) +
  labs(title = "Plastic Debris by Location",
       x = "Location",
       y = "Percentage") +
  scale_fill_manual(values = c("Microplastics" = colors[0], "Macroplastics" = colors[1], "Fishing Gear" = colors[2])) +
  theme_minimal()`,
        "Color by plastic type": `# Use different colors for each plastic type
library(ggplot2)

# Data
locations = c('Beach', 'Reef', 'Open Ocean')
microplastics = c(40, 30, 20)
macroplastics = c(20, 25, 30)
fishing_gear = c(10, 15, 25)
colors = c('#4BC0C0', '#FF6384', '#FFCE56')

# Create stacked bar chart
ggplot(df, aes(x = locations, y = microplastics, fill = "Microplastics")) +
  geom_bar(stat = "identity") +
  geom_bar(aes(y = macroplastics), stat = "identity", fill = colors[1]) +
  geom_bar(aes(y = fishing_gear), stat = "identity", fill = colors[2]) +
  labs(title = "Plastic Debris by Location",
       x = "Location",
       y = "Percentage") +
  scale_fill_manual(values = c("Microplastics" = colors[0], "Macroplastics" = colors[1], "Fishing Gear" = colors[2])) +
  theme_minimal()`,
        "Show total debris": `# Add total debris to the stacked bar chart
library(ggplot2)

# Data
locations = c('Beach', 'Reef', 'Open Ocean')
microplastics = c(40, 30, 20)
macroplastics = c(20, 25, 30)
fishing_gear = c(10, 15, 25)
colors = c('#4BC0C0', '#FF6384', '#FFCE56')

# Create stacked bar chart
ggplot(df, aes(x = locations, y = microplastics, fill = "Microplastics")) +
  geom_bar(stat = "identity") +
  geom_bar(aes(y = macroplastics), stat = "identity", fill = colors[1]) +
  geom_bar(aes(y = fishing_gear), stat = "identity", fill = colors[2]) +
  labs(title = "Plastic Debris by Location",
       x = "Location",
       y = "Percentage") +
  scale_fill_manual(values = c("Microplastics" = colors[0], "Macroplastics" = colors[1], "Fishing Gear" = colors[2])) +
  theme_minimal()`,
        "Interactive legend": `# Add interactive legend to the stacked bar chart
library(ggplot2)

# Data
locations = c('Beach', 'Reef', 'Open Ocean')
microplastics = c(40, 30, 20)
macroplastics = c(20, 25, 30)
fishing_gear = c(10, 15, 25)
colors = c('#4BC0C0', '#FF6384', '#FFCE56')

# Create stacked bar chart
ggplot(df, aes(x = locations, y = microplastics, fill = "Microplastics")) +
  geom_bar(stat = "identity") +
  geom_bar(aes(y = macroplastics), stat = "identity", fill = colors[1]) +
  geom_bar(aes(y = fishing_gear), stat = "identity", fill = colors[2]) +
  labs(title = "Plastic Debris by Location",
       x = "Location",
       y = "Percentage") +
  scale_fill_manual(values = c("Microplastics" = colors[0], "Macroplastics" = colors[1], "Fishing Gear" = colors[2])) +
  theme_minimal()`,
        "Highlight most polluted location": `# Highlight the most polluted location in the stacked bar chart
library(ggplot2)

# Data
locations = c('Beach', 'Reef', 'Open Ocean')
microplastics = c(40, 30, 20)
macroplastics = c(20, 25, 30)
fishing_gear = c(10, 15, 25)
colors = c('#4BC0C0', '#FF6384', '#FFCE56')

# Create stacked bar chart
ggplot(df, aes(x = locations, y = microplastics, fill = "Microplastics")) +
  geom_bar(stat = "identity") +
  geom_bar(aes(y = macroplastics), stat = "identity", fill = colors[1]) +
  geom_bar(aes(y = fishing_gear), stat = "identity", fill = colors[2]) +
  labs(title = "Plastic Debris by Location",
       x = "Location",
       y = "Percentage") +
  scale_fill_manual(values = c("Microplastics" = colors[0], "Macroplastics" = colors[1], "Fishing Gear" = colors[2])) +
  theme_minimal()`,
      },
    };

    return likes.map((like) => codeSnippets[chartId][like]).join("\n\n");
  };

  const getAllChartCode = (chartId) => {
    const allFeatures = {
      1: [
        "Clear monthly trend visualization",
        "Interactive zoom functionality",
        "Detailed tooltips with coral cover data",
        "Smooth line transitions",
      ],
      2: [
        "Easy-to-read species distribution",
        "Interactive bar selection",
        "Colorful species categorization",
      ],
      3: ["Temperature trend visualization", "Impact analysis in tooltips"],
      4: [
        "Comparative current vs target view",
        "Interactive segment selection",
      ],
      5: [
        "Species size vs. abundance",
        "Distinct color for each species",
        "Interactive point tooltips",
        "Highlight outliers",
        "Zoom and pan scatter area",
      ],
      6: [
        "Clear habitat proportions",
        "Distinct color for each habitat",
        "Show percentage labels",
        "Interactive legend",
        "Explode largest segment",
      ],
      7: [
        "Zone-based color coding",
        "Show total protected area",
        "Interactive legend",
        "Highlight no-take zones",
        "Show percentage labels",
      ],
      8: [
        "Bubble size by threat level",
        "Interactive tooltips",
        "Highlight endangered species",
        "Zoom and pan",
        "Color by species",
      ],
      9: [
        "Horizontal bar orientation",
        "Color by threat type",
        "Show impact values",
        "Highlight top threat",
        "Interactive legend",
      ],
      10: [
        "Seasonal color palette",
        "Show abundance values",
        "Interactive legend",
        "Highlight peak season",
        "Polar area animation",
      ],
      11: [
        "Stacked bars by debris type",
        "Color by plastic type",
        "Show total debris",
        "Interactive legend",
        "Highlight most polluted location",
      ],
    };

    return selectedLanguage === "python"
      ? getPythonCode(chartId, allFeatures[chartId])
      : selectedLanguage === "r"
      ? getRCode(chartId, allFeatures[chartId])
      : getVegaLiteCode(chartId, allFeatures[chartId]);
  };

  const highlightCode = (code, feature) => {
    const featurePatterns = {
      "Clear monthly trend visualization": {
        python: ["plt.plot", "plt.fill_between"],
        r: ["geom_line", "geom_area"],
      },
      "Interactive zoom functionality": {
        python: ["SpanSelector", "zoom"],
        r: ["plot_ly", "zoom"],
      },
      "Detailed tooltips with coral cover data": {
        python: ["hovertemplate", "tooltip"],
        r: ["hovertemplate", "tooltip"],
      },
      "Smooth line transitions": {
        python: ["tension", "smooth"],
        r: ["geom_smooth", "smooth"],
      },
      "Easy-to-read species distribution": {
        python: ["plt.bar", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Interactive bar selection": {
        python: ["onClick", "selected"],
        r: ["plot_ly", "selected"],
      },
      "Colorful species categorization": {
        python: ["color=", "colors="],
        r: ["scale_fill", "scale_color"],
      },
      "Temperature trend visualization": {
        python: ["plt.plot", "temperature"],
        r: ["geom_line", "temperature"],
      },
      "Impact analysis in tooltips": {
        python: ["get_impact", "impact"],
        r: ["get_impact", "impact"],
      },
      "Comparative current vs target view": {
        python: ["current", "target"],
        r: ["current", "target"],
      },
      "Interactive segment selection": {
        python: ["onClick", "selected"],
        r: ["plot_ly", "selected"],
      },
      "Species size vs. abundance": {
        python: ["plt.scatter", "plt.title"],
        r: ["geom_point", "labs"],
      },
      "Distinct color for each species": {
        python: ["color=", "colors="],
        r: ["scale_color", "scale_fill"],
      },
      "Interactive point tooltips": {
        python: ["plt.annotate", "plt.text"],
        r: ["geom_text", "labs"],
      },
      "Highlight outliers": {
        python: ["plt.scatter", "plt.text"],
        r: ["geom_point", "geom_text"],
      },
      "Zoom and pan scatter area": {
        python: ["plt.gca", "plt.xlim", "plt.ylim"],
        r: ["scale_x_continuous", "scale_y_continuous", "theme"],
      },
      "Clear habitat proportions": {
        python: ["plt.pie", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Distinct color for each habitat": {
        python: ["plt.pie", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Show percentage labels": {
        python: ["plt.pie", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Interactive legend": {
        python: ["plt.legend", "plt.text"],
        r: ["labs", "theme"],
      },
      "Explode largest segment": {
        python: ["plt.pie", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Zone-based color coding": {
        python: ["plt.pie", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Show total protected area": {
        python: ["plt.pie", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Highlight no-take zones": {
        python: ["plt.pie", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Bubble size by threat level": {
        python: ["plt.scatter", "plt.title"],
        r: ["geom_point", "labs"],
      },
      "Highlight endangered species": {
        python: ["plt.scatter", "plt.text"],
        r: ["geom_point", "geom_text"],
      },
      "Zoom and pan": {
        python: ["plt.gca", "plt.xlim", "plt.ylim"],
        r: ["scale_x_continuous", "scale_y_continuous", "theme"],
      },
      "Color by species": {
        python: ["plt.scatter", "plt.text"],
        r: ["geom_text", "labs"],
      },
      "Horizontal bar orientation": {
        python: ["plt.barh", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Show impact values": {
        python: ["plt.barh", "plt.text"],
        r: ["geom_bar", "labs"],
      },
      "Highlight top threat": {
        python: ["plt.barh", "plt.text"],
        r: ["geom_bar", "labs"],
      },
      "Seasonal color palette": {
        python: ["plt.polar", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Show abundance values": {
        python: ["plt.polar", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Highlight peak season": {
        python: ["plt.polar", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Polar area animation": {
        python: ["plt.polar", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Stacked bars by debris type": {
        python: ["plt.bar", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Color by plastic type": {
        python: ["plt.bar", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Show total debris": {
        python: ["plt.bar", "plt.title"],
        r: ["geom_bar", "labs"],
      },
      "Highlight most polluted location": {
        python: ["plt.bar", "plt.title"],
        r: ["geom_bar", "labs"],
      },
    };

    if (!feature || !featurePatterns[feature]) return code;

    const patterns = featurePatterns[feature][selectedLanguage] || [];
    let highlightedCode = code;

    patterns.forEach((pattern) => {
      const regex = new RegExp(pattern, "g");
      highlightedCode = highlightedCode.replace(
        regex,
        (match) => `**${match}**`
      );
    });

    return highlightedCode;
  };

  const ChartPreview = ({ chartId, likes }) => {
    const [selectedFeature, setSelectedFeature] = useState(likes[0]);

    const previewComponents = {
      1: {
        "Clear monthly trend visualization": (
          <Line
            data={coralData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: { enabled: false },
                zoom: { enabled: false },
              },
              scales: {
                y: { display: false },
                x: { display: false },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
              },
              animation: { duration: 0 },
            }}
          />
        ),
        "Interactive zoom functionality": (
          <Line
            data={coralData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: { enabled: false },
                zoom: {
                  ...zoomOptions.zoom,
                  drag: { enabled: true },
                },
              },
              scales: {
                y: { display: false },
                x: { display: false },
              },
              animation: { duration: 0 },
            }}
          />
        ),
        "Detailed tooltips with coral cover data": (
          <Line
            data={coralData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: {
                  enabled: true,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  titleColor: "#fff",
                  bodyColor: "#fff",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                  padding: 10,
                  displayColors: false,
                  callbacks: {
                    label: function (context) {
                      return `Coral Cover: ${context.parsed.y}%`;
                    },
                  },
                },
              },
              scales: {
                y: { display: false },
                x: { display: false },
              },
              animation: { duration: 0 },
            }}
          />
        ),
        "Smooth line transitions": (
          <Line
            data={coralData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: { enabled: false },
              },
              scales: {
                y: { display: false },
                x: { display: false },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
              },
              animation: { duration: 0 },
            }}
          />
        ),
      },
      2: {
        "Easy-to-read species distribution": (
          <Bar
            data={speciesData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: { enabled: false },
              },
              scales: {
                y: { display: false },
                x: { display: false },
              },
              animation: { duration: 0 },
            }}
          />
        ),
        "Interactive bar selection": (
          <Bar
            data={speciesData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: { enabled: false },
              },
              scales: {
                y: { display: false },
                x: { display: false },
              },
              onClick: (event, elements) => {
                if (elements.length > 0) {
                  const index = elements[0].index;
                  setSelectedSpecies(speciesData.labels[index]);
                }
              },
              animation: { duration: 0 },
            }}
          />
        ),
        "Colorful species categorization": (
          <Bar
            data={speciesData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: { enabled: false },
              },
              scales: {
                y: { display: false },
                x: { display: false },
              },
              animation: { duration: 0 },
            }}
          />
        ),
      },
      3: {
        "Temperature trend visualization": (
          <Line
            data={temperatureData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: { enabled: false },
              },
              scales: {
                y: { display: false },
                x: { display: false },
              },
              animation: { duration: 0 },
            }}
          />
        ),
        "Impact analysis in tooltips": (
          <Line
            data={temperatureData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: {
                  enabled: true,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  titleColor: "#fff",
                  bodyColor: "#fff",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                  padding: 10,
                  callbacks: {
                    label: function (context) {
                      const temp = context.parsed.y;
                      let impact = "";
                      if (temp > 26) impact = "High stress on coral reefs";
                      else if (temp > 25.5)
                        impact = "Moderate stress on marine life";
                      else impact = "Normal conditions";
                      return [`Temperature: ${temp}°C`, `Impact: ${impact}`];
                    },
                  },
                },
              },
              scales: {
                y: { display: false },
                x: { display: false },
              },
              animation: { duration: 0 },
            }}
          />
        ),
      },
      4: {
        "Comparative current vs target view": (
          <Radar
            data={ecosystemData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: { enabled: false },
              },
              scales: {
                r: { display: false },
              },
              animation: { duration: 0 },
            }}
          />
        ),
        "Interactive segment selection": (
          <Radar
            data={ecosystemData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: { enabled: false },
              },
              scales: {
                r: { display: false },
              },
              onClick: (event, elements) => {
                if (elements.length > 0) {
                  const index = elements[0].index;
                  setEcosystemFocus(ecosystemData.labels[index]);
                }
              },
              animation: { duration: 0 },
            }}
          />
        ),
      },
      5: {
        "Species size vs. abundance": (
          <Scatter
            data={scatterData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Species Size vs. Abundance",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const d = context.raw;
                      return `${d.species}: Size ${d.x} cm, Abundance ${d.y}`;
                    },
                  },
                },
                zoom: zoomOptions.zoom,
              },
              scales: {
                x: {
                  title: { display: true, text: "Average Size (cm)" },
                  min: 0,
                  max: 8,
                },
                y: {
                  title: { display: true, text: "Abundance" },
                  min: 0,
                  max: 140,
                },
              },
              animation: {
                duration: 2000,
                easing: "easeInOutQuart",
              },
            }}
          />
        ),
        "Distinct color for each species": (
          <Scatter
            data={scatterData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Species Size vs. Abundance",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const d = context.raw;
                      return `${d.species}: Size ${d.x} cm, Abundance ${d.y}`;
                    },
                  },
                },
                zoom: zoomOptions.zoom,
              },
              scales: {
                x: {
                  title: { display: true, text: "Average Size (cm)" },
                  min: 0,
                  max: 8,
                },
                y: {
                  title: { display: true, text: "Abundance" },
                  min: 0,
                  max: 140,
                },
              },
              animation: {
                duration: 2000,
                easing: "easeInOutQuart",
              },
            }}
          />
        ),
        "Interactive point tooltips": (
          <Scatter
            data={scatterData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Species Size vs. Abundance",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const d = context.raw;
                      return `${d.species}: Size ${d.x} cm, Abundance ${d.y}`;
                    },
                  },
                },
                zoom: zoomOptions.zoom,
              },
              scales: {
                x: {
                  title: { display: true, text: "Average Size (cm)" },
                  min: 0,
                  max: 8,
                },
                y: {
                  title: { display: true, text: "Abundance" },
                  min: 0,
                  max: 140,
                },
              },
              animation: {
                duration: 2000,
                easing: "easeInOutQuart",
              },
            }}
          />
        ),
        "Highlight outliers": (
          <Scatter
            data={scatterData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Species Size vs. Abundance",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const d = context.raw;
                      return `${d.species}: Size ${d.x} cm, Abundance ${d.y}`;
                    },
                  },
                },
                zoom: zoomOptions.zoom,
              },
              scales: {
                x: {
                  title: { display: true, text: "Average Size (cm)" },
                  min: 0,
                  max: 8,
                },
                y: {
                  title: { display: true, text: "Abundance" },
                  min: 0,
                  max: 140,
                },
              },
              animation: {
                duration: 2000,
                easing: "easeInOutQuart",
              },
            }}
          />
        ),
        "Zoom and pan scatter area": (
          <Scatter
            data={scatterData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Species Size vs. Abundance",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const d = context.raw;
                      return `${d.species}: Size ${d.x} cm, Abundance ${d.y}`;
                    },
                  },
                },
                zoom: zoomOptions.zoom,
              },
              scales: {
                x: {
                  title: { display: true, text: "Average Size (cm)" },
                  min: 0,
                  max: 8,
                },
                y: {
                  title: { display: true, text: "Abundance" },
                  min: 0,
                  max: 140,
                },
              },
              animation: {
                duration: 2000,
                easing: "easeInOutQuart",
              },
            }}
          />
        ),
      },
      6: {
        "Clear habitat proportions": (
          <Pie
            data={habitatPieData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Habitat Type Proportions" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Distinct color for each habitat": (
          <Pie
            data={habitatPieData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Habitat Type Proportions" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Show percentage labels": (
          <Pie
            data={habitatPieData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Habitat Type Proportions" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Interactive legend": (
          <Pie
            data={habitatPieData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Habitat Type Proportions" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Explode largest segment": (
          <Pie
            data={habitatPieData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Habitat Type Proportions" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
      },
      7: {
        "Zone-based color coding": (
          <Doughnut
            data={mpaDoughnutData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Marine Protected Area Coverage",
                },
              },
              cutout: "70%",
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Show total protected area": (
          <Doughnut
            data={mpaDoughnutData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Marine Protected Area Coverage",
                },
              },
              cutout: "70%",
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Interactive legend": (
          <Doughnut
            data={mpaDoughnutData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Marine Protected Area Coverage",
                },
              },
              cutout: "70%",
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Highlight no-take zones": (
          <Doughnut
            data={mpaDoughnutData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Marine Protected Area Coverage",
                },
              },
              cutout: "70%",
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Show percentage labels": (
          <Doughnut
            data={mpaDoughnutData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Marine Protected Area Coverage",
                },
              },
              cutout: "70%",
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
      },
      8: {
        "Bubble size by threat level": (
          <Bubble
            data={bubbleData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Species Population & Threats" },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const d = context.raw;
                      return `${d.species}: Area ${d.x} km², Pop. ${d.y}, Threat ${d.r}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: "Area (km²)" },
                  min: 0,
                  max: 60,
                },
                y: {
                  title: { display: true, text: "Population" },
                  min: 0,
                  max: 250,
                },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Interactive tooltips": (
          <Bubble
            data={bubbleData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Species Population & Threats" },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const d = context.raw;
                      return `${d.species}: Area ${d.x} km², Pop. ${d.y}, Threat ${d.r}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: "Area (km²)" },
                  min: 0,
                  max: 60,
                },
                y: {
                  title: { display: true, text: "Population" },
                  min: 0,
                  max: 250,
                },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Highlight endangered species": (
          <Bubble
            data={bubbleData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Species Population & Threats" },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const d = context.raw;
                      return `${d.species}: Area ${d.x} km², Pop. ${d.y}, Threat ${d.r}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: "Area (km²)" },
                  min: 0,
                  max: 60,
                },
                y: {
                  title: { display: true, text: "Population" },
                  min: 0,
                  max: 250,
                },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Zoom and pan": (
          <Bubble
            data={bubbleData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Species Population & Threats" },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const d = context.raw;
                      return `${d.species}: Area ${d.x} km², Pop. ${d.y}, Threat ${d.r}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: "Area (km²)" },
                  min: 0,
                  max: 60,
                },
                y: {
                  title: { display: true, text: "Population" },
                  min: 0,
                  max: 250,
                },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Color by species": (
          <Bubble
            data={bubbleData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Species Population & Threats" },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const d = context.raw;
                      return `${d.species}: Area ${d.x} km², Pop. ${d.y}, Threat ${d.r}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: "Area (km²)" },
                  min: 0,
                  max: 60,
                },
                y: {
                  title: { display: true, text: "Population" },
                  min: 0,
                  max: 250,
                },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
      },
      9: {
        "Horizontal bar orientation": (
          <Bar
            data={threatsBarData}
            options={{
              indexAxis: "y",
              plugins: {
                legend: { display: false },
                title: { display: true, text: "Top Threats to Marine Life" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Color by threat type": (
          <Bar
            data={threatsBarData}
            options={{
              indexAxis: "y",
              plugins: {
                legend: { display: false },
                title: { display: true, text: "Top Threats to Marine Life" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Show impact values": (
          <Bar
            data={threatsBarData}
            options={{
              indexAxis: "y",
              plugins: {
                legend: { display: false },
                title: { display: true, text: "Top Threats to Marine Life" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Highlight top threat": (
          <Bar
            data={threatsBarData}
            options={{
              indexAxis: "y",
              plugins: {
                legend: { display: false },
                title: { display: true, text: "Top Threats to Marine Life" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Interactive legend": (
          <Bar
            data={threatsBarData}
            options={{
              indexAxis: "y",
              plugins: {
                legend: { display: false },
                title: { display: true, text: "Top Threats to Marine Life" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
      },
      10: {
        "Seasonal color palette": (
          <PolarArea
            data={planktonPolarData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Seasonal Plankton Abundance" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Show abundance values": (
          <PolarArea
            data={planktonPolarData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Seasonal Plankton Abundance" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Interactive legend": (
          <PolarArea
            data={planktonPolarData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Seasonal Plankton Abundance" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Highlight peak season": (
          <PolarArea
            data={planktonPolarData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Seasonal Plankton Abundance" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Polar area animation": (
          <PolarArea
            data={planktonPolarData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Seasonal Plankton Abundance" },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
      },
      11: {
        "Stacked bars by debris type": (
          <Bar
            data={plasticStackedData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Plastic Debris by Location" },
              },
              responsive: true,
              scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Color by plastic type": (
          <Bar
            data={plasticStackedData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Plastic Debris by Location" },
              },
              responsive: true,
              scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Show total debris": (
          <Bar
            data={plasticStackedData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Plastic Debris by Location" },
              },
              responsive: true,
              scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Interactive legend": (
          <Bar
            data={plasticStackedData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Plastic Debris by Location" },
              },
              responsive: true,
              scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
        "Highlight most polluted location": (
          <Bar
            data={plasticStackedData}
            options={{
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Plastic Debris by Location" },
              },
              responsive: true,
              scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true },
              },
              animation: { duration: 2000, easing: "easeInOutQuart" },
            }}
          />
        ),
      },
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {likes.map((feature) => (
            <button
              key={feature}
              onClick={() => setSelectedFeature(feature)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                feature === selectedFeature
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {feature}
            </button>
          ))}
        </div>
        <div className="h-48">
          {previewComponents[chartId][selectedFeature]}
        </div>
      </div>
    );
  };

  const CodeGenerator = () => {
    const [showCode, setShowCode] = useState(false);
    const [selectedLanguages, setSelectedLanguages] = useState(["python"]);
    const [selectedLibraries, setSelectedLibraries] = useState({
      python: "matplotlib",
      r: "ggplot2",
      "vega-lite": "vega-lite",
    });

    const pythonLibraries = [
      { value: "matplotlib", label: "matplotlib" },
      { value: "plotly", label: "plotly" },
      { value: "seaborn", label: "seaborn" },
    ];
    const rLibraries = [
      { value: "ggplot2", label: "ggplot2" },
      { value: "plotly", label: "plotly" },
      { value: "fmsb", label: "fmsb (radar)" },
    ];
    // Vega-Lite only has one main library

    const handleLibraryChange = (language, library) => {
      setSelectedLibraries((prev) => ({ ...prev, [language]: library }));
    };

    if (selectedCharts.length === 0) return null;

    const selectedChartsWithLikes = selectedCharts.map((chartId) => {
      const likes = chartLikes[chartId] || [];
      const allFeatures = {
        1: [
          "Clear monthly trend visualization",
          "Interactive zoom functionality",
          "Detailed tooltips with coral cover data",
          "Smooth line transitions",
        ],
        2: [
          "Easy-to-read species distribution",
          "Interactive bar selection",
          "Colorful species categorization",
        ],
        3: ["Temperature trend visualization", "Impact analysis in tooltips"],
        4: [
          "Comparative current vs target view",
          "Interactive segment selection",
        ],
        5: [
          "Species size vs. abundance",
          "Distinct color for each species",
          "Interactive point tooltips",
          "Highlight outliers",
          "Zoom and pan scatter area",
        ],
        6: [
          "Clear habitat proportions",
          "Distinct color for each habitat",
          "Show percentage labels",
          "Interactive legend",
          "Explode largest segment",
        ],
        7: [
          "Zone-based color coding",
          "Show total protected area",
          "Interactive legend",
          "Highlight no-take zones",
          "Show percentage labels",
        ],
        8: [
          "Bubble size by threat level",
          "Interactive tooltips",
          "Highlight endangered species",
          "Zoom and pan",
          "Color by species",
        ],
        9: [
          "Horizontal bar orientation",
          "Color by threat type",
          "Show impact values",
          "Highlight top threat",
          "Interactive legend",
        ],
        10: [
          "Seasonal color palette",
          "Show abundance values",
          "Interactive legend",
          "Highlight peak season",
          "Polar area animation",
        ],
        11: [
          "Stacked bars by debris type",
          "Color by plastic type",
          "Show total debris",
          "Interactive legend",
          "Highlight most polluted location",
        ],
      };

      return {
        id: chartId,
        likes: likes.length > 0 ? likes : allFeatures[chartId],
      };
    });

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
    };

    const toggleLanguage = (language) => {
      setSelectedLanguages((prev) => {
        if (prev.includes(language)) {
          // Don't remove if it's the last selected language
          if (prev.length === 1) return prev;
          return prev.filter((lang) => lang !== language);
        }
        return [...prev, language];
      });
    };

    const getDependencies = () => {
      const deps = new Set();
      if (selectedLanguages.includes("python")) {
        if (selectedLibraries.python === "matplotlib")
          deps.add("pip install matplotlib numpy");
        if (selectedLibraries.python === "plotly")
          deps.add("pip install plotly");
        if (selectedLibraries.python === "seaborn")
          deps.add("pip install seaborn matplotlib numpy");
      }
      if (selectedLanguages.includes("r")) {
        if (selectedLibraries.r === "ggplot2")
          deps.add('install.packages("ggplot2")');
        if (selectedLibraries.r === "plotly")
          deps.add('install.packages("plotly")');
        if (selectedLibraries.r === "fmsb")
          deps.add('install.packages("fmsb")');
      }
      if (selectedLanguages.includes("vega-lite")) {
        deps.add("npm install vega-lite vega-embed");
      }
      return Array.from(deps);
    };

    // Replace getPythonCode, getRCode, getVegaLiteCode calls with library-specific versions
    const getPythonCodeByLibrary = (chartId, likes, library) => {
      // You can expand this logic to select code snippets by library
      // For now, just call getPythonCode (matplotlib/plotly/seaborn logic can be added)
      return getPythonCode(chartId, likes, library);
    };
    const getRCodeByLibrary = (chartId, likes, library) => {
      return getRCode(chartId, likes, library);
    };
    const getVegaLiteCodeByLibrary = (chartId, likes) => {
      return getVegaLiteCode(chartId, likes);
    };

    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-800">Remix in</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleLanguage("python")}
                className={`px-4 py-2 rounded transition-colors ${
                  selectedLanguages.includes("python")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Python
              </button>
              {selectedLanguages.includes("python") && (
                <select
                  className="px-2 py-2 rounded border border-gray-300"
                  value={selectedLibraries.python}
                  onChange={(e) =>
                    handleLibraryChange("python", e.target.value)
                  }
                >
                  {pythonLibraries.map((lib) => (
                    <option key={lib.value} value={lib.value}>
                      {lib.label}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={() => toggleLanguage("r")}
                className={`px-4 py-2 rounded transition-colors ${
                  selectedLanguages.includes("r")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                R
              </button>
              {selectedLanguages.includes("r") && (
                <select
                  className="px-2 py-2 rounded border border-gray-300"
                  value={selectedLibraries.r}
                  onChange={(e) => handleLibraryChange("r", e.target.value)}
                >
                  {rLibraries.map((lib) => (
                    <option key={lib.value} value={lib.value}>
                      {lib.label}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={() => toggleLanguage("vega-lite")}
                className={`px-4 py-2 rounded transition-colors ${
                  selectedLanguages.includes("vega-lite")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Vega-Lite
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowCode(!showCode)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {showCode ? "Hide Code" : "Show Code"}
          </button>
        </div>

        {showCode && (
          <div className="space-y-8">
            {selectedChartsWithLikes.map(({ id, likes }) => (
              <div key={id} className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-medium text-gray-700 mb-4">
                  {charts.find((c) => c.id === id).title}
                </h4>
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-600 mb-2">
                    Selected Features:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {likes.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {selectedLanguages.map((language) => (
                      <div key={language} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h5 className="text-sm font-medium text-gray-600">
                            {language === "python"
                              ? `Python (${selectedLibraries.python})`
                              : language === "r"
                              ? `R (${selectedLibraries.r})`
                              : "Vega-Lite"}{" "}
                            Code
                          </h5>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                language === "python"
                                  ? getPythonCodeByLibrary(
                                      id,
                                      likes,
                                      selectedLibraries.python
                                    )
                                  : language === "r"
                                  ? getRCodeByLibrary(
                                      id,
                                      likes,
                                      selectedLibraries.r
                                    )
                                  : getVegaLiteCodeByLibrary(id, likes)
                              )
                            }
                            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                          >
                            Copy Code
                          </button>
                        </div>
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                          <code>
                            {language === "python"
                              ? getPythonCodeByLibrary(
                                  id,
                                  likes,
                                  selectedLibraries.python
                                )
                              : language === "r"
                              ? getRCodeByLibrary(
                                  id,
                                  likes,
                                  selectedLibraries.r
                                )
                              : getVegaLiteCodeByLibrary(id, likes)}
                          </code>
                        </pre>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-gray-600">
                      Chart Preview
                    </h5>
                    <ChartPreview chartId={id} likes={likes} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-600 mb-2">
                    Required Dependencies
                  </h5>
                  <div className="space-y-2">
                    {getDependencies().map((dep, index) => (
                      <pre
                        key={index}
                        className="bg-gray-100 p-2 rounded text-sm"
                      >
                        <code>{dep}</code>
                      </pre>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split("\n");
        const headers = rows[0].split(",").map((header) => header.trim());
        const data = rows.slice(1).map((row) => {
          const values = row.split(",").map((value) => value.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
          }, {});
        });
        setCsvHeaders(headers);
        setCsvData(data);

        // --- Chart selection based on shape ---
        let chartId = null;
        // Use the first data row to infer shape
        const firstRow = data[0] || {};
        const numCols = headers.length;
        const numericCols = headers.filter(
          (h) => !isNaN(parseFloat(firstRow[h]))
        );

        console.log("=== CHART DETECTION DEBUG ===");
        console.log("Headers:", headers);
        console.log("First row:", firstRow);
        console.log("Number of columns:", numCols);
        console.log("Numeric columns:", numericCols);
        console.log("Numeric column count:", numericCols.length);

        // 2 columns, one categorical, one numeric: Bar or Pie
        if (numCols === 2 && numericCols.length === 1) {
          // If values sum to ~100, likely a pie chart
          const sum = data.reduce(
            (acc, row) => acc + parseFloat(row[numericCols[0]] || 0),
            0
          );
          console.log("Sum of numeric values:", sum);
          if (sum > 95 && sum < 105) {
            chartId = 6; // Habitat Pie
            console.log("✅ Detected Pie Chart (sum:", sum, ")");
          } else {
            chartId = 2; // Species Bar
            console.log("✅ Detected Bar Chart (sum:", sum, ")");
          }
        }
        // 2 columns, both numeric: Line or Scatter
        else if (numCols === 2 && numericCols.length === 2) {
          chartId = 1; // Coral Line (time series)
          console.log("✅ Detected Line Chart");
        }
        // 3 columns, two numeric, one categorical: Bubble
        else if (numCols === 3 && numericCols.length === 2) {
          chartId = 8; // Bubble
          console.log("✅ Detected Bubble Chart");
        }
        // 3+ columns, all numeric: Stacked Bar
        else if (numCols >= 3 && numericCols.length === numCols) {
          chartId = 11; // Stacked Bar
          console.log("✅ Detected Stacked Bar Chart");
        }
        // 3+ columns, mostly numeric (like 4 cols with 3 numeric): Stacked Bar
        else if (numCols >= 3 && numericCols.length >= numCols - 1) {
          chartId = 11; // Stacked Bar
          console.log("✅ Detected Stacked Bar Chart (mostly numeric)");
        }
        // Fallback: show all
        else {
          chartId = null;
          console.log("❌ No specific chart detected, showing all");
        }

        console.log("Final chartId:", chartId);

        if (chartId) {
          // Don't set selectedCharts - show all charts
          console.log("✅ Detected best match chart ID:", chartId);
          // Reorder charts so the detected chart is first
          const reordered = [
            charts.find((c) => c.id === chartId),
            ...charts.filter((c) => c.id !== chartId),
          ];
          console.log(
            "Original charts order:",
            charts.map((c) => c.id)
          );
          console.log(
            "Reordered charts:",
            reordered.map((c) => c.id)
          );
          setCharts(reordered);
          console.log("✅ Charts reordered - best match first");
        } else {
          console.log("❌ No specific chart detected, keeping original order");
        }
        console.log("=== END DEBUG ===");
      };
      reader.readAsText(file);
    }
  };

  // Function to analyze existing code and reorder charts
  const analyzeExistingCode = (code) => {
    if (!code || !charts) return;

    console.log("=== CODE ANALYSIS DEBUG ===");
    console.log("Analyzing existing code for chart detection...");

    const codeLower = code.toLowerCase();

    // Chart detection patterns based on code content
    const codePatterns = {
      1: {
        // Line chart - look for line, plot, trend, time series
        patterns: [
          "line",
          "plot",
          "trend",
          "time",
          "series",
          "coral",
          "reef",
          "monitoring",
          "monthly",
          "annual",
          "plt.plot",
          "ggplot",
          "geom_line",
        ],
        keywords: ["coral", "reef", "health", "monitoring", "trend", "time"],
        weight: 1.0,
      },
      2: {
        // Bar chart - look for bar, column, species, diversity
        patterns: [
          "bar",
          "column",
          "species",
          "diversity",
          "count",
          "abundance",
          "plt.bar",
          "geom_bar",
          "ggplot",
          "barplot",
        ],
        keywords: [
          "species",
          "diversity",
          "count",
          "abundance",
          "distribution",
        ],
        weight: 1.0,
      },
      3: {
        // Temperature chart - look for temperature, temp, climate
        patterns: [
          "temperature",
          "temp",
          "heat",
          "climate",
          "ocean",
          "degrees",
          "celsius",
          "plt.plot",
          "ggplot",
          "geom_line",
        ],
        keywords: ["temperature", "climate", "ocean", "degrees"],
        weight: 0.9,
      },
      4: {
        // Radar chart - look for radar, polar, spider, ecosystem
        patterns: [
          "radar",
          "polar",
          "spider",
          "ecosystem",
          "health",
          "biodiversity",
          "water",
          "quality",
          "radar_chart",
          "polar_chart",
        ],
        keywords: ["ecosystem", "health", "biodiversity", "water", "quality"],
        weight: 0.9,
      },
      5: {
        // Scatter chart - look for scatter, size, abundance, correlation
        patterns: [
          "scatter",
          "size",
          "abundance",
          "relationship",
          "correlation",
          "plot",
          "plt.scatter",
          "geom_point",
          "ggplot",
        ],
        keywords: ["size", "abundance", "relationship", "correlation"],
        weight: 0.9,
      },
      6: {
        // Pie chart - look for pie, circle, proportion, percentage
        patterns: [
          "pie",
          "circle",
          "donut",
          "proportion",
          "percentage",
          "habitat",
          "zone",
          "plt.pie",
          "geom_bar",
          "coord_polar",
        ],
        keywords: ["habitat", "proportion", "percentage", "zone"],
        weight: 1.0,
      },
      7: {
        // Doughnut chart - look for doughnut, donut, mpa, protected
        patterns: [
          "doughnut",
          "donut",
          "mpa",
          "protected",
          "area",
          "zone",
          "plt.pie",
          "geom_bar",
          "coord_polar",
        ],
        keywords: ["protected", "area", "zone", "mpa"],
        weight: 0.8,
      },
      8: {
        // Bubble chart - look for bubble, population, threat
        patterns: [
          "bubble",
          "population",
          "threat",
          "size",
          "abundance",
          "plt.scatter",
          "geom_point",
          "size",
          "alpha",
        ],
        keywords: ["population", "threat", "size", "abundance"],
        weight: 0.9,
      },
      9: {
        // Horizontal bar chart - look for horizontal, threat, risk
        patterns: [
          "horizontal",
          "threat",
          "risk",
          "impact",
          "level",
          "plt.barh",
          "geom_bar",
          "coord_flip",
        ],
        keywords: ["threat", "risk", "impact", "level"],
        weight: 0.8,
      },
      10: {
        // Polar area chart - look for polar, seasonal, plankton
        patterns: [
          "polar",
          "seasonal",
          "plankton",
          "season",
          "quarter",
          "polar_area",
          "coord_polar",
          "geom_bar",
        ],
        keywords: ["seasonal", "plankton", "season"],
        weight: 0.7,
      },
      11: {
        // Stacked bar chart - look for stacked, plastic, debris
        patterns: [
          "stacked",
          "grouped",
          "plastic",
          "debris",
          "location",
          "multiple",
          "plt.bar",
          "geom_bar",
          "position_stack",
          "fill",
        ],
        keywords: ["plastic", "debris", "location", "multiple", "types"],
        weight: 1.0,
      },
    };

    // Score each chart type based on code content
    const chartScores = {};

    Object.entries(codePatterns).forEach(([chartId, config]) => {
      let score = 0;

      // Pattern matching with higher weight for exact matches
      config.patterns.forEach((pattern) => {
        if (codeLower.includes(pattern)) {
          score += config.weight * 2; // Exact pattern match
          console.log(
            `  Code pattern match for chart ${chartId}: "${pattern}"`
          );
        }
      });

      // Keyword matching with medium weight
      config.keywords.forEach((keyword) => {
        if (codeLower.includes(keyword)) {
          score += config.weight * 1.5; // Keyword match
          console.log(
            `  Code keyword match for chart ${chartId}: "${keyword}"`
          );
        }
      });

      // Special cases and context clues
      if (codeLower.includes("marine") || codeLower.includes("ocean")) {
        // Marine context gives bonus to marine-related charts
        if ([1, 2, 3, 4, 6, 8, 11].includes(parseInt(chartId))) {
          score += 0.5;
        }
      }

      if (codeLower.includes("data") || codeLower.includes("analysis")) {
        // Data/analysis context gives bonus to analytical charts
        if ([1, 2, 3, 4, 8, 11].includes(parseInt(chartId))) {
          score += 0.3;
        }
      }

      if (codeLower.includes("report") || codeLower.includes("study")) {
        // Report/study context gives bonus to comprehensive charts
        if ([4, 6, 11].includes(parseInt(chartId))) {
          score += 0.4;
        }
      }

      // Library-specific bonuses
      if (codeLower.includes("matplotlib") || codeLower.includes("plt.")) {
        // Matplotlib context
        if ([1, 2, 3, 5, 6, 8, 9, 11].includes(parseInt(chartId))) {
          score += 0.2;
        }
      }

      if (codeLower.includes("ggplot") || codeLower.includes("geom_")) {
        // ggplot context
        if ([1, 2, 3, 5, 6, 7, 8, 9, 10, 11].includes(parseInt(chartId))) {
          score += 0.2;
        }
      }

      chartScores[chartId] = score;
    });

    // Find the best match
    let bestChartId = null;
    let bestScore = 0;
    let confidence = "low";

    Object.entries(chartScores).forEach(([chartId, score]) => {
      if (score > bestScore) {
        bestScore = score;
        bestChartId = parseInt(chartId);
      }
    });

    // Determine confidence level
    if (bestScore >= 3) {
      confidence = "very high";
    } else if (bestScore >= 2) {
      confidence = "high";
    } else if (bestScore >= 1) {
      confidence = "medium";
    } else if (bestScore >= 0.5) {
      confidence = "low";
    } else {
      confidence = "none";
    }

    console.log("Code analysis scores:", chartScores);
    console.log(
      "Best match: Chart ID",
      bestChartId,
      "with score",
      bestScore,
      "and confidence:",
      confidence
    );

    // Show top 3 matches for debugging
    const sortedScores = Object.entries(chartScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    console.log(
      "Top 3 matches:",
      sortedScores.map(([id, score]) => `Chart ${id}: ${score}`)
    );

    if (bestChartId && confidence !== "none") {
      // Reorder charts so the detected chart is first
      const reordered = [
        charts.find((c) => c.id === bestChartId),
        ...charts.filter((c) => c.id !== bestChartId),
      ];
      console.log(
        "Original charts order:",
        charts.map((c) => c.id)
      );
      console.log(
        "Reordered charts:",
        reordered.map((c) => c.id)
      );
      setCharts(reordered);
      console.log("✅ Charts reordered based on code analysis");

      // Store analysis results for display
      setCodeAnalysis({
        detectedChartId: bestChartId,
        confidence: confidence,
        score: bestScore,
        hints: ["Code-based analysis", "Library detection", "Pattern matching"],
        source: "Code Analysis",
      });
    } else {
      console.log("❌ No chart reordering - insufficient confidence");
      setCodeAnalysis(null);
    }

    console.log("=== END CODE ANALYSIS DEBUG ===");
  };

  // Function to analyze image using OpenAI API
  const analyzeImageWithOpenAI = async (file) => {
    if (!openaiApiKey) {
      console.log("❌ No OpenAI API key provided");
      return null;
    }

    setIsAnalyzingImage(true);
    console.log("=== OPENAI IMAGE ANALYSIS ===");
    console.log("Analyzing image with OpenAI API...");

    try {
      // Convert image to base64
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });

      // Prepare the API request
      const requestBody = {
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this chart image and identify the chart type. Choose from these options:
                1. Line chart (trends over time, coral monitoring, temperature trends)
                2. Bar chart (species diversity, counts, distributions)
                3. Temperature chart (ocean temperature, climate data)
                4. Radar chart (ecosystem health, biodiversity metrics)
                5. Scatter chart (species size vs abundance, correlations)
                6. Pie chart (habitat proportions, percentages)
                7. Doughnut chart (marine protected areas, zones)
                8. Bubble chart (population vs threats, scatter plots)
                9. Horizontal bar chart (threat levels, risk assessment)
                10. Polar area chart (seasonal data, plankton abundance)
                11. Stacked bar chart (plastic debris, multiple categories)

                Respond with ONLY the chart ID number (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, or 11) and a confidence level (high/medium/low). Format: "ID: X, Confidence: Y"`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 50,
      };

      // Make API call
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(
          `API call failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;

      console.log("OpenAI response:", analysis);

      // Parse the response
      const idMatch = analysis.match(/ID:\s*(\d+)/i);
      const confidenceMatch = analysis.match(
        /Confidence:\s*(high|medium|low)/i
      );

      if (idMatch && confidenceMatch) {
        const detectedChartId = parseInt(idMatch[1]);
        const confidence = confidenceMatch[1].toLowerCase();

        console.log(
          "✅ OpenAI detected Chart ID:",
          detectedChartId,
          "with confidence:",
          confidence
        );

        return {
          detectedChartId,
          confidence,
          score: confidence === "high" ? 3 : confidence === "medium" ? 2 : 1,
          hints: ["AI-powered visual analysis", "Real-time image processing"],
          source: "OpenAI GPT-4 Vision",
        };
      } else {
        console.log("❌ Could not parse OpenAI response");
        return null;
      }
    } catch (error) {
      console.error("❌ OpenAI API error:", error);
      return null;
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleImageChange = async (e) => {
    console.log("=== IMAGE CHANGE TRIGGERED ===");
    const file = e.target.files[0];
    console.log("File selected:", file ? file.name : "No file");
    setSelectedImage(file);

    if (file) {
      console.log("=== IMAGE ANALYSIS DEBUG ===");
      console.log(
        "Image uploaded:",
        file.name,
        file.type,
        "Size:",
        (file.size / 1024).toFixed(1) + "KB"
      );
      console.log("OpenAI API key available:", openaiApiKey ? "Yes" : "No");
      console.log("Charts state available:", charts ? "Yes" : "No");

      // Try OpenAI analysis first if API key is available
      if (openaiApiKey) {
        console.log("🔍 Using OpenAI for image analysis...");
        const openaiResult = await analyzeImageWithOpenAI(file);

        if (openaiResult && charts) {
          // Reorder charts based on OpenAI analysis
          const reordered = [
            charts.find((c) => c.id === openaiResult.detectedChartId),
            ...charts.filter((c) => c.id !== openaiResult.detectedChartId),
          ];
          console.log(
            "Original charts order:",
            charts.map((c) => c.id)
          );
          console.log(
            "Reordered charts:",
            reordered.map((c) => c.id)
          );
          setCharts(reordered);
          setImageAnalysis(openaiResult);
          console.log("✅ Charts reordered based on OpenAI analysis");
          return;
        }
      }

      // Fallback to filename analysis if OpenAI fails or no API key
      console.log("🔍 Falling back to filename analysis...");

      // Enhanced image analysis with multiple detection methods
      const fileName = file.name.toLowerCase();
      const fileType = file.type;
      const fileSize = file.size;

      // Chart detection patterns with weighted scoring
      const chartPatterns = {
        1: {
          // Line chart - Coral monitoring trends
          patterns: [
            "line",
            "trend",
            "time",
            "series",
            "coral",
            "reef",
            "monitoring",
            "monthly",
            "annual",
          ],
          keywords: ["coral", "reef", "health", "monitoring", "trend", "time"],
          weight: 1.0,
        },
        2: {
          // Bar chart - Species diversity
          patterns: [
            "bar",
            "column",
            "species",
            "diversity",
            "count",
            "abundance",
          ],
          keywords: [
            "species",
            "diversity",
            "count",
            "abundance",
            "distribution",
          ],
          weight: 1.0,
        },
        3: {
          // Temperature chart - Ocean temperature
          patterns: [
            "temperature",
            "temp",
            "heat",
            "climate",
            "ocean",
            "degrees",
            "celsius",
          ],
          keywords: ["temperature", "climate", "ocean", "degrees"],
          weight: 0.9,
        },
        4: {
          // Radar chart - Ecosystem health
          patterns: [
            "radar",
            "polar",
            "spider",
            "ecosystem",
            "health",
            "biodiversity",
            "water",
          ],
          keywords: ["ecosystem", "health", "biodiversity", "water", "quality"],
          weight: 0.9,
        },
        5: {
          // Scatter chart - Species size vs abundance
          patterns: [
            "scatter",
            "size",
            "abundance",
            "relationship",
            "correlation",
            "plot",
          ],
          keywords: ["size", "abundance", "relationship", "correlation"],
          weight: 0.9,
        },
        6: {
          // Pie chart - Habitat proportions
          patterns: [
            "pie",
            "circle",
            "donut",
            "proportion",
            "percentage",
            "habitat",
            "zone",
          ],
          keywords: ["habitat", "proportion", "percentage", "zone"],
          weight: 1.0,
        },
        7: {
          // Doughnut chart - Marine protected areas
          patterns: ["doughnut", "donut", "mpa", "protected", "area", "zone"],
          keywords: ["protected", "area", "zone", "mpa"],
          weight: 0.8,
        },
        8: {
          // Bubble chart - Population & threats
          patterns: ["bubble", "population", "threat", "size", "abundance"],
          keywords: ["population", "threat", "size", "abundance"],
          weight: 0.9,
        },
        9: {
          // Horizontal bar chart - Threats
          patterns: ["horizontal", "threat", "risk", "impact", "level"],
          keywords: ["threat", "risk", "impact", "level"],
          weight: 0.8,
        },
        10: {
          // Polar area chart - Seasonal plankton
          patterns: ["polar", "seasonal", "plankton", "season", "quarter"],
          keywords: ["seasonal", "plankton", "season"],
          weight: 0.7,
        },
        11: {
          // Stacked bar chart - Plastic debris
          patterns: [
            "stacked",
            "grouped",
            "plastic",
            "debris",
            "location",
            "multiple",
          ],
          keywords: ["plastic", "debris", "location", "multiple", "types"],
          weight: 1.0,
        },
      };

      // Score each chart type based on filename patterns
      const chartScores = {};

      Object.entries(chartPatterns).forEach(([chartId, config]) => {
        let score = 0;

        // Pattern matching with higher weight for exact matches
        config.patterns.forEach((pattern) => {
          if (fileName.includes(pattern)) {
            score += config.weight * 2; // Exact pattern match
            console.log(`  Pattern match for chart ${chartId}: "${pattern}"`);
          }
        });

        // Keyword matching with medium weight
        config.keywords.forEach((keyword) => {
          if (fileName.includes(keyword)) {
            score += config.weight * 1.5; // Keyword match
            console.log(`  Keyword match for chart ${chartId}: "${keyword}"`);
          }
        });

        // Special cases and context clues
        if (fileName.includes("marine") || fileName.includes("ocean")) {
          // Marine context gives bonus to marine-related charts
          if ([1, 2, 3, 4, 6, 8, 11].includes(parseInt(chartId))) {
            score += 0.5;
          }
        }

        if (fileName.includes("data") || fileName.includes("analysis")) {
          // Data/analysis context gives bonus to analytical charts
          if ([1, 2, 3, 4, 8, 11].includes(parseInt(chartId))) {
            score += 0.3;
          }
        }

        if (fileName.includes("report") || fileName.includes("study")) {
          // Report/study context gives bonus to comprehensive charts
          if ([4, 6, 11].includes(parseInt(chartId))) {
            score += 0.4;
          }
        }

        chartScores[chartId] = score;
      });

      // Find the best match
      let bestChartId = null;
      let bestScore = 0;
      let confidence = "low";

      Object.entries(chartScores).forEach(([chartId, score]) => {
        if (score > bestScore) {
          bestScore = score;
          bestChartId = parseInt(chartId);
        }
      });

      // Determine confidence level
      if (bestScore >= 3) {
        confidence = "very high";
      } else if (bestScore >= 2) {
        confidence = "high";
      } else if (bestScore >= 1) {
        confidence = "medium";
      } else if (bestScore >= 0.5) {
        confidence = "low";
      } else {
        confidence = "none";
      }

      console.log("Chart scores:", chartScores);
      console.log(
        "Best match: Chart ID",
        bestChartId,
        "with score",
        bestScore,
        "and confidence:",
        confidence
      );

      // Show top 3 matches for debugging
      const sortedScores = Object.entries(chartScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
      console.log(
        "Top 3 matches:",
        sortedScores.map(([id, score]) => `Chart ${id}: ${score}`)
      );

      // Additional context analysis
      const contextHints = [];
      if (fileName.includes("_"))
        contextHints.push("Uses underscores (likely organized naming)");
      if (fileName.includes("-"))
        contextHints.push("Uses hyphens (likely web-friendly naming)");
      if (fileName.includes("chart") || fileName.includes("graph"))
        contextHints.push("Explicitly mentions chart/graph");
      if (fileName.includes("2023") || fileName.includes("2024"))
        contextHints.push("Contains year (time-series likely)");
      if (fileName.includes("data"))
        contextHints.push("Contains 'data' (analytical context)");

      if (contextHints.length > 0) {
        console.log("Context hints:", contextHints);
      }

      if (bestChartId && charts && confidence !== "none") {
        // Reorder charts so the detected chart is first
        const reordered = [
          charts.find((c) => c.id === bestChartId),
          ...charts.filter((c) => c.id !== bestChartId),
        ];
        console.log(
          "Original charts order:",
          charts.map((c) => c.id)
        );
        console.log(
          "Reordered charts:",
          reordered.map((c) => c.id)
        );
        setCharts(reordered);
        console.log("✅ Charts reordered based on filename analysis");

        // Store analysis results for display
        setImageAnalysis({
          detectedChartId: bestChartId,
          confidence: confidence,
          score: bestScore,
          hints: contextHints,
          source: "Filename Analysis",
        });
      } else {
        console.log(
          "❌ No chart reordering - insufficient confidence or charts not ready"
        );
        setImageAnalysis(null);
      }

      console.log("=== END IMAGE DEBUG ===");
    }
  };

  const handlePromptSubmit = () => {
    // Implement prompt submission logic
    console.log("Prompt submitted:", prompt);
  };

  const handleChartSelection = (chartId) => {
    console.log("handleChartSelection called with:", chartId);
    chartId = Number(chartId);
    setSelectedCharts((prevSelected) => {
      const newSelection = prevSelected.includes(chartId)
        ? prevSelected.filter((id) => id !== chartId)
        : [...prevSelected, chartId];
      console.log("New selected charts:", newSelection);
      return newSelection;
    });
  };

  // Function to filter charts based on user description
  const getFilteredCharts = () => {
    if (!userDescription.trim()) {
      return {
        charts: charts,
        matches: [],
        keywordMatches: [],
        featureMatches: [],
      }; // Show all charts if no description
    }

    const description = userDescription.toLowerCase();
    const keywords = {
      coral: [1], // Coral Reef Health Monitoring
      reef: [1], // Coral Reef Health Monitoring
      health: [1, 4], // Coral Reef Health Monitoring, Ecosystem Health
      species: [2, 5], // Marine Species Diversity, Scatterplot
      diversity: [2], // Marine Species Diversity
      marine: [1, 2, 4, 5], // All marine-related charts, Scatterplot
      temperature: [3], // Ocean Temperature Trends
      ocean: [3], // Ocean Temperature Trends
      ecosystem: [4], // Marine Ecosystem Health
      trend: [1, 3], // Charts with trends
      line: [1, 3], // Line charts
      bar: [2, 9, 11], // Bar charts
      radar: [4], // Radar chart
      monitoring: [1], // Monitoring charts
      interactive: [1, 2, 3, 4, 5], // All charts are interactive
      zoom: [1, 3, 5], // Charts with zoom functionality, Scatterplot
      tooltip: [1, 2, 3, 4, 5], // All charts have tooltips, Scatterplot
      monthly: [1], // Monthly data
      annual: [3], // Annual data
      percentage: [1], // Percentage data
      count: [2], // Count data
      degrees: [3], // Temperature data
      celsius: [3], // Temperature data
      biodiversity: [4], // Biodiversity metrics
      water: [4], // Water quality
      habitat: [4, 6], // Habitat health, new keyword
      pie: [6], // New keyword
      mpa: [7], // New keyword
      doughnut: [7], // New keyword
      protected: [7], // New keyword
      bubble: [8], // New keyword
      population: [8], // New keyword
      threat: [8, 9], // New keyword
      horizontal: [9], // New keyword
      polar: [10], // New keyword
      plankton: [10], // New keyword
      seasonal: [10], // New keyword
      plastic: [11], // New keyword
      debris: [11], // New keyword
      stacked: [11], // New keyword
      location: [11], // New keyword
    };

    const matchingChartIds = new Set();
    const keywordMatches = [];
    const featureMatches = [];

    // Check for keyword matches
    Object.entries(keywords).forEach(([keyword, chartIds]) => {
      if (description.includes(keyword)) {
        chartIds.forEach((id) => matchingChartIds.add(id));
        keywordMatches.push(keyword);
      }
    });

    // Check for chart preference/feature matches
    Object.entries(chartPreferences).forEach(([chartId, preferences]) => {
      preferences.forEach((preference) => {
        const preferenceLower = preference.toLowerCase();
        if (
          description.includes(preferenceLower) ||
          preferenceLower.includes(description) ||
          preferenceLower.split(" ").some((word) => description.includes(word))
        ) {
          matchingChartIds.add(parseInt(chartId));
          if (!featureMatches.includes(preference)) {
            featureMatches.push(preference);
          }
        }
      });
    });

    // If no keywords match, show all charts
    if (matchingChartIds.size === 0) {
      return {
        charts: charts,
        matches: [],
        keywordMatches: [],
        featureMatches: [],
      };
    }

    // Return only matching charts and the matched keywords
    return {
      charts: charts.filter((chart) => matchingChartIds.has(chart.id)),
      matches: [...keywordMatches, ...featureMatches],
      keywordMatches,
      featureMatches,
    };
  };

  const handleGenerateCharts = () => {
    // This function can be expanded to trigger more sophisticated chart generation
    // For now, it just triggers a re-render with filtered charts
    console.log("Generating charts based on:", userDescription);
  };

  const {
    charts: filteredCharts,
    matches: matchedKeywords,
    keywordMatches,
    featureMatches,
  } = getFilteredCharts();

  // Add state for collapsible section
  const [isCustomizeSectionOpen, setIsCustomizeSectionOpen] = useState(true);

  console.log("selectedCharts state:", selectedCharts);
  console.log("chartLikes:", chartLikes);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Marine Ecosystem Dashboard
          </h1>
          <a
            href="https://github.com/yourusername/marine-ecosystem-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            View on GitHub
          </a>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {selectedCharts.length > 0 && (
              <button
                onClick={() => {
                  setSelectedCharts([]);
                  setChartLikes({
                    1: [],
                    2: [],
                    3: [],
                    4: [],
                    5: [],
                    6: [],
                    7: [],
                    8: [],
                    9: [],
                    10: [],
                    11: [],
                  });
                }}
                className="fixed top-4 right-4 z-50 px-4 py-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Clear All</span>
              </button>
            )}
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
              Marine Biology Data Visualization
            </h1>

            {/* Data, Reference Image, Existing Code, and Description Preview Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">
              {/* Customize Recommended Charts Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-0">
                      Customize Recommended Charts (optional)
                    </h2>
                    <p className="text-lg text-gray-600">
                      Add your data and specify chart preferences
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCustomizeSectionOpen((open) => !open)}
                    className="ml-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={
                      isCustomizeSectionOpen
                        ? "Collapse section"
                        : "Expand section"
                    }
                  >
                    {isCustomizeSectionOpen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300 overflow-hidden ${
                  isCustomizeSectionOpen
                    ? "max-h-[2000px] opacity-100"
                    : "max-h-0 opacity-0 pointer-events-none"
                }`}
                style={{ transitionProperty: "max-height, opacity" }}
              >
                {/* Data Preview */}
                <div className="bg-gray-50 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    Upload Data
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload a CSV file of all or some of your data.
                  </p>
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <svg
                          className="h-8 w-8 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      {csvData && (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {csvHeaders.map((header, index) => (
                                  <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {csvData.slice(0, 5).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  {csvHeaders.map((header, colIndex) => (
                                    <td
                                      key={colIndex}
                                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                      {row[header]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {csvData.length > 5 && (
                            <p className="mt-2 text-sm text-gray-500 text-center">
                              Showing first 5 rows of {csvData.length} total
                              rows
                            </p>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setActiveTab("data");
                          setShowRightPanel(true);
                        }}
                        className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Full Data
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">
                        No data uploaded yet
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab("data");
                          setShowRightPanel(true);
                        }}
                        className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Upload Data
                      </button>
                    </div>
                  )}
                </div>

                {/* Reference Image Preview */}
                <div className="bg-gray-50 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    Reference Image
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload a chart or drawing.
                  </p>
                  {selectedImage ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Reference"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab("image");
                          setShowRightPanel(true);
                        }}
                        className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">
                        No reference image yet
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab("image");
                          setShowRightPanel(true);
                        }}
                        className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Upload Image
                      </button>
                    </div>
                  )}
                </div>

                {/* Existing Code Section */}
                <div className="bg-gray-50 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    Add Existing Code
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Paste any code you want to use as a starting point.
                  </p>
                  <textarea
                    value={existingCode}
                    onChange={(e) => setExistingCode(e.target.value)}
                    placeholder="Paste your code here..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
                  />
                  <button
                    onClick={() => alert("Code saved!")}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Code
                  </button>
                </div>

                {/* User Description Section */}
                <div className="bg-gray-50 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    Describe what you want
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Briefly describe the chart you want to create.
                  </p>
                  <input
                    type="text"
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    placeholder="Type your description here..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
                  />
                  <button
                    onClick={handleGenerateCharts}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Generate
                  </button>
                  {userDescription.trim() && (
                    <div className="mt-2">
                      <p className="text-sm text-blue-600">
                        Showing {filteredCharts.length} relevant chart
                        {filteredCharts.length !== 1 ? "s" : ""} based on your
                        description
                      </p>
                      {(keywordMatches.length > 0 ||
                        featureMatches.length > 0) && (
                        <div className="mt-2 space-y-2">
                          {keywordMatches.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-600">
                                General keywords matched:
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {keywordMatches.map((keyword, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {featureMatches.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-600">
                                Chart features matched:
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {featureMatches.map((feature, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedCharts.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  {selectedCharts.length} chart
                  {selectedCharts.length > 1 ? "s" : ""} selected for remixing
                </p>
              </div>
            )}

            {csvData && csvData.length > 0 && (
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium">
                  📊 Data uploaded: {csvHeaders.join(", ")}
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Showing all charts, reordered with best match first
                </p>
                {csvData && csvData.length > 0 && (
                  <p className="text-green-600 text-sm mt-1">
                    Best match: Chart ID{" "}
                    {(() => {
                      const firstRow = csvData[0] || {};
                      const numCols = csvHeaders.length;
                      const numericCols = csvHeaders.filter(
                        (h) => !isNaN(parseFloat(firstRow[h]))
                      );

                      if (numCols === 2 && numericCols.length === 1) {
                        const sum = csvData.reduce(
                          (acc, row) =>
                            acc + parseFloat(row[numericCols[0]] || 0),
                          0
                        );
                        return sum > 95 && sum < 105 ? 6 : 2;
                      } else if (numCols === 2 && numericCols.length === 2) {
                        return 1;
                      } else if (numCols === 3 && numericCols.length === 2) {
                        return 8;
                      } else if (
                        numCols >= 3 &&
                        numericCols.length >= numCols - 1
                      ) {
                        return 11;
                      }
                      return "None detected";
                    })()}
                  </p>
                )}
                <div className="mt-2 p-2 bg-yellow-100 rounded text-xs">
                  <strong>Debug:</strong> Showing all {charts.length} charts,
                  best match first (Chart ID{" "}
                  {(() => {
                    const firstRow = csvData[0] || {};
                    const numCols = csvHeaders.length;
                    const numericCols = csvHeaders.filter(
                      (h) => !isNaN(parseFloat(firstRow[h]))
                    );

                    if (numCols === 2 && numericCols.length === 1) {
                      const sum = csvData.reduce(
                        (acc, row) =>
                          acc + parseFloat(row[numericCols[0]] || 0),
                        0
                      );
                      return sum > 95 && sum < 105 ? 6 : 2;
                    } else if (numCols === 2 && numericCols.length === 2) {
                      return 1;
                    } else if (numCols === 3 && numericCols.length === 2) {
                      return 8;
                    } else if (
                      numCols >= 3 &&
                      numericCols.length >= numCols - 1
                    ) {
                      return 11;
                    }
                    return "None";
                  })()}
                  )
                </div>
              </div>
            )}

            {selectedImage && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  🖼️ Image uploaded: {selectedImage.name}
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  Charts reordered based on enhanced image analysis
                </p>
                {imageAnalysis && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 text-sm">
                        Best match: Chart ID {imageAnalysis.detectedChartId}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          imageAnalysis.confidence === "very high"
                            ? "bg-green-100 text-green-800"
                            : imageAnalysis.confidence === "high"
                            ? "bg-blue-100 text-blue-800"
                            : imageAnalysis.confidence === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {imageAnalysis.confidence} confidence
                      </span>
                    </div>
                    <div className="text-blue-600 text-sm">
                      Score: {imageAnalysis.score.toFixed(2)}
                    </div>
                    <div className="text-blue-600 text-sm font-medium">
                      Source: {imageAnalysis.source}
                    </div>
                    {imageAnalysis.hints.length > 0 && (
                      <div className="text-blue-600 text-sm">
                        Context: {imageAnalysis.hints.join(", ")}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-2 p-2 bg-yellow-100 rounded text-xs">
                  <strong>Debug:</strong> Enhanced analysis with weighted
                  scoring and context detection
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {charts ? (
                <>
                  <div className="col-span-full p-2 bg-blue-100 rounded text-xs mb-4">
                    <strong>Debug:</strong> Rendering {charts.length} charts.
                    Chart IDs: {charts.map((c) => c.id).join(", ")}
                  </div>
                  {charts.map((chart) => (
                    <div
                      key={chart.id}
                      className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl ${
                        selectedCharts.includes(chart.id)
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                          {chart.title} (ID: {chart.id})
                        </h2>
                        <p className="text-gray-600 mb-4">
                          {chart.description}
                        </p>
                        <div className="min-h-[20rem] flex flex-col">
                          <div className="flex-grow">{chart.component}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="col-span-full p-4 bg-red-100 rounded text-center">
                  No charts available
                </div>
              )}
            </div>
            <CodeGenerator />
          </main>
        </div>
      </div>

      {/* Right Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${
          showRightPanel ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "400px", zIndex: 50 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              {activeTab === "data" && "Upload Data"}
              {activeTab === "prompt" && "Code Analysis & Chart Description"}
              {activeTab === "image" && "Reference Image"}
            </h2>
            <button
              onClick={() => setShowRightPanel(false)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close panel</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {activeTab === "data" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload File
                </label>
              </div>
            </div>
          )}

          {activeTab === "prompt" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Existing Code Analysis
                </label>
                <textarea
                  value={existingCode}
                  onChange={(e) => {
                    setExistingCode(e.target.value);
                    // Auto-analyze code when it changes
                    if (e.target.value.trim()) {
                      setTimeout(
                        () => analyzeExistingCode(e.target.value),
                        500
                      );
                    }
                  }}
                  placeholder="Paste your existing chart code here (Python, R, etc.)..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => analyzeExistingCode(existingCode)}
                  className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Analyze Code & Reorder Charts
                </button>
              </div>

              {codeAnalysis && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-sm">
                      Best match: Chart ID {codeAnalysis.detectedChartId}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        codeAnalysis.confidence === "very high"
                          ? "bg-green-100 text-green-800"
                          : codeAnalysis.confidence === "high"
                          ? "bg-blue-100 text-blue-800"
                          : codeAnalysis.confidence === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {codeAnalysis.confidence} confidence
                    </span>
                  </div>
                  <div className="text-green-600 text-sm">
                    Score: {codeAnalysis.score.toFixed(2)}
                  </div>
                  <div className="text-green-600 text-sm font-medium">
                    Source: {codeAnalysis.source}
                  </div>
                  {codeAnalysis.hints.length > 0 && (
                    <div className="text-green-600 text-sm">
                      Analysis: {codeAnalysis.hints.join(", ")}
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart Description
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the chart you want to create..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
                />
                <button
                  onClick={handlePromptSubmit}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {activeTab === "image" && (
            <div className="space-y-4">
              {/* Debug Info */}
              <div className="p-2 bg-blue-100 rounded text-xs">
                <strong>Debug:</strong> Image tab active, openaiApiKey length:{" "}
                {openaiApiKey.length}
              </div>

              {/* OpenAI API Key Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key (for AI-powered image analysis)
                </label>
                <input
                  type="password"
                  value={openaiApiKey}
                  onChange={(e) => {
                    console.log(
                      "API key changed, new length:",
                      e.target.value.length
                    );
                    setOpenaiApiKey(e.target.value);
                  }}
                  placeholder="sk-..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Provide your OpenAI API key for advanced AI-powered
                  chart detection
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isAnalyzingImage ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    "Upload Image"
                  )}
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;
