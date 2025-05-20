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
        categoryPercentage: 0.9,
        animation: {
          duration: 2000,
          easing: "easeInOutQuart",
        },
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

  // Add state for selected charts
  const [selectedCharts, setSelectedCharts] = useState([]);

  const handleChartSelection = (chartId) => {
    setSelectedCharts((prev) => {
      if (prev.includes(chartId)) {
        return prev.filter((id) => id !== chartId);
      } else {
        return [...prev, chartId];
      }
    });
  };

  // Update annotation state to be simpler
  const [chartLikes, setChartLikes] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
  });

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
  };

  const handleLikeToggle = (chartId, preference) => {
    setChartLikes((prev) => ({
      ...prev,
      [chartId]: prev[chartId].includes(preference)
        ? prev[chartId].filter((p) => p !== preference)
        : [...prev[chartId], preference],
    }));
  };

  const PreferenceSelector = ({ chartId }) => (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 mb-2">
        What do you like about this chart?
      </h4>
      <div className="space-y-2">
        {chartPreferences[chartId].map((preference) => (
          <label key={preference} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={chartLikes[chartId].includes(preference)}
              onChange={() => handleLikeToggle(chartId, preference)}
              className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">{preference}</span>
          </label>
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
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedCharts.includes(chartId)}
            onChange={() => handleChartSelection(chartId)}
            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Select for remix
          </span>
        </label>
      </div>
    </div>
  );

  const charts = [
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
                zoom: {
                  ...zoomOptions.zoom,
                  onZoom: () => {
                    if (speciesChartRef.current) {
                      setSpeciesZoomLevel(
                        speciesChartRef.current.getZoomLevel()
                      );
                    }
                  },
                },
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
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Marine Biology Data Visualization
        </h1>
        {selectedCharts.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              {selectedCharts.length} chart
              {selectedCharts.length > 1 ? "s" : ""} selected for remixing
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {charts.map((chart) => (
            <div
              key={chart.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl ${
                selectedCharts.includes(chart.id) ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {chart.title}
                </h2>
                <p className="text-gray-600 mb-4">{chart.description}</p>
                <div className="min-h-[20rem] flex flex-col">
                  <div className="flex-grow">{chart.component}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
