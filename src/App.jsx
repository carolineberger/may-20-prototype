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

  const handleLikeToggle = (chartId, preference) => {
    setChartLikes((prev) => ({
      ...prev,
      [chartId]: prev[chartId].includes(preference)
        ? prev[chartId].filter((p) => p !== preference)
        : [...prev[chartId], preference],
    }));
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
    }

    return annotations;
  };

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
                annotation: {
                  annotations: getChartAnnotations(3),
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
    };

    return likes.map((like) => codeSnippets[chartId][like]).join("\n\n");
  };

  const getVegaLiteCode = (chartId, likes) => {
    const codeSnippets = {
      1: {
        "Clear monthly trend visualization": `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"month": "Jan", "cover": 45},
      {"month": "Feb", "cover": 43},
      {"month": "Mar", "cover": 42},
      {"month": "Apr", "cover": 41},
      {"month": "May", "cover": 40},
      {"month": "Jun", "cover": 39},
      {"month": "Jul", "cover": 38},
      {"month": "Aug", "cover": 37},
      {"month": "Sep", "cover": 36},
      {"month": "Oct", "cover": 35},
      {"month": "Nov", "cover": 34},
      {"month": "Dec", "cover": 33}
    ]
  },
  "mark": {
    "type": "line",
    "point": true,
    "interpolate": "monotone"
  },
  "encoding": {
    "x": {"field": "month", "type": "ordinal"},
    "y": {
      "field": "cover",
      "type": "quantitative",
      "title": "Coral Cover (%)"
    },
    "color": {"value": "#4BC0C0"}
  }
}`,
        "Interactive zoom functionality": `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"month": "Jan", "cover": 45},
      {"month": "Feb", "cover": 43},
      {"month": "Mar", "cover": 42},
      {"month": "Apr", "cover": 41},
      {"month": "May", "cover": 40},
      {"month": "Jun", "cover": 39},
      {"month": "Jul", "cover": 38},
      {"month": "Aug", "cover": 37},
      {"month": "Sep", "cover": 36},
      {"month": "Oct", "cover": 35},
      {"month": "Nov", "cover": 34},
      {"month": "Dec", "cover": 33}
    ]
  },
  "mark": {
    "type": "line",
    "point": true
  },
  "encoding": {
    "x": {"field": "month", "type": "ordinal"},
    "y": {
      "field": "cover",
      "type": "quantitative",
      "title": "Coral Cover (%)"
    }
  },
  "selection": {
    "brush": {
      "type": "interval",
      "encodings": ["x"]
    }
  }
}`,
        "Detailed tooltips with coral cover data": `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"month": "Jan", "cover": 45},
      {"month": "Feb", "cover": 43},
      {"month": "Mar", "cover": 42},
      {"month": "Apr", "cover": 41},
      {"month": "May", "cover": 40},
      {"month": "Jun", "cover": 39},
      {"month": "Jul", "cover": 38},
      {"month": "Aug", "cover": 37},
      {"month": "Sep", "cover": 36},
      {"month": "Oct", "cover": 35},
      {"month": "Nov", "cover": 34},
      {"month": "Dec", "cover": 33}
    ]
  },
  "mark": {
    "type": "line",
    "point": true
  },
  "encoding": {
    "x": {"field": "month", "type": "ordinal"},
    "y": {
      "field": "cover",
      "type": "quantitative",
      "title": "Coral Cover (%)"
    },
    "tooltip": [
      {"field": "month", "type": "ordinal"},
      {"field": "cover", "type": "quantitative", "format": ".1f"}
    ]
  }
}`,
        "Smooth line transitions": `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"month": "Jan", "cover": 45},
      {"month": "Feb", "cover": 43},
      {"month": "Mar", "cover": 42},
      {"month": "Apr", "cover": 41},
      {"month": "May", "cover": 40},
      {"month": "Jun", "cover": 39},
      {"month": "Jul", "cover": 38},
      {"month": "Aug", "cover": 37},
      {"month": "Sep", "cover": 36},
      {"month": "Oct", "cover": 35},
      {"month": "Nov", "cover": 34},
      {"month": "Dec", "cover": 33}
    ]
  },
  "mark": {
    "type": "line",
    "point": true,
    "interpolate": "basis"
  },
  "encoding": {
    "x": {"field": "month", "type": "ordinal"},
    "y": {
      "field": "cover",
      "type": "quantitative",
      "title": "Coral Cover (%)"
    }
  }
}`,
      },
      2: {
        "Easy-to-read species distribution": `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"species": "Coral", "count": 120},
      {"species": "Fish", "count": 85},
      {"species": "Crustaceans", "count": 65},
      {"species": "Mollusks", "count": 45},
      {"species": "Echinoderms", "count": 30}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "species", "type": "nominal"},
    "y": {
      "field": "count",
      "type": "quantitative",
      "title": "Species Count"
    },
    "color": {"field": "species", "type": "nominal"}
  }
}`,
        "Interactive bar selection": `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"species": "Coral", "count": 120},
      {"species": "Fish", "count": 85},
      {"species": "Crustaceans", "count": 65},
      {"species": "Mollusks", "count": 45},
      {"species": "Echinoderms", "count": 30}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "species", "type": "nominal"},
    "y": {
      "field": "count",
      "type": "quantitative",
      "title": "Species Count"
    },
    "color": {
      "condition": {
        "selection": "select",
        "value": "#4BC0C0"
      },
      "value": "#999"
    }
  },
  "selection": {
    "select": {"type": "single"}
  }
}`,
        "Colorful species categorization": `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"species": "Coral", "count": 120},
      {"species": "Fish", "count": 85},
      {"species": "Crustaceans", "count": 65},
      {"species": "Mollusks", "count": 45},
      {"species": "Echinoderms", "count": 30}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "species", "type": "nominal"},
    "y": {
      "field": "count",
      "type": "quantitative",
      "title": "Species Count"
    },
    "color": {
      "field": "species",
      "type": "nominal",
      "scale": {
        "range": ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
      }
    }
  }
}`,
      },
      3: {
        "Temperature trend visualization": `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"year": "2018", "temp": 24.5},
      {"year": "2019", "temp": 24.8},
      {"year": "2020", "temp": 25.2},
      {"year": "2021", "temp": 25.5},
      {"year": "2022", "temp": 25.9},
      {"year": "2023", "temp": 26.2},
      {"year": "2024", "temp": 26.5}
    ]
  },
  "mark": {
    "type": "line",
    "point": true
  },
  "encoding": {
    "x": {"field": "year", "type": "ordinal"},
    "y": {
      "field": "temp",
      "type": "quantitative",
      "title": "Temperature (°C)"
    }
  }
}`,
        "Impact analysis in tooltips": `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"year": "2018", "temp": 24.5, "impact": "Normal conditions"},
      {"year": "2019", "temp": 24.8, "impact": "Normal conditions"},
      {"year": "2020", "temp": 25.2, "impact": "Normal conditions"},
      {"year": "2021", "temp": 25.5, "impact": "Moderate stress"},
      {"year": "2022", "temp": 25.9, "impact": "Moderate stress"},
      {"year": "2023", "temp": 26.2, "impact": "High stress"},
      {"year": "2024", "temp": 26.5, "impact": "High stress"}
    ]
  },
  "mark": {
    "type": "line",
    "point": true
  },
  "encoding": {
    "x": {"field": "year", "type": "ordinal"},
    "y": {
      "field": "temp",
      "type": "quantitative",
      "title": "Temperature (°C)"
    },
    "tooltip": [
      {"field": "year", "type": "ordinal"},
      {"field": "temp", "type": "quantitative", "format": ".1f"},
      {"field": "impact", "type": "nominal"}
    ]
  }
}`,
      },
      4: {
        "Comparative current vs target view": `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"metric": "Biodiversity", "value": 75, "type": "Current"},
      {"metric": "Water Quality", "value": 82, "type": "Current"},
      {"metric": "Habitat Health", "value": 68, "type": "Current"},
      {"metric": "Species Richness", "value": 70, "type": "Current"},
      {"metric": "Coral Cover", "value": 65, "type": "Current"},
      {"metric": "Biodiversity", "value": 90, "type": "Target"},
      {"metric": "Water Quality", "value": 90, "type": "Target"},
      {"metric": "Habitat Health", "value": 85, "type": "Target"},
      {"metric": "Species Richness", "value": 85, "type": "Target"},
      {"metric": "Coral Cover", "value": 80, "type": "Target"}
    ]
  },
  "mark": {
    "type": "line",
    "point": true
  },
  "encoding": {
    "theta": {"field": "metric", "type": "nominal"},
    "radius": {
      "field": "value",
      "type": "quantitative",
      "scale": {"domain": [0, 100]}
    },
    "color": {"field": "type", "type": "nominal"}
  },
  "view": {"stroke": null}
}`,
        "Interactive segment selection": `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"metric": "Biodiversity", "value": 75, "type": "Current"},
      {"metric": "Water Quality", "value": 82, "type": "Current"},
      {"metric": "Habitat Health", "value": 68, "type": "Current"},
      {"metric": "Species Richness", "value": 70, "type": "Current"},
      {"metric": "Coral Cover", "value": 65, "type": "Current"},
      {"metric": "Biodiversity", "value": 90, "type": "Target"},
      {"metric": "Water Quality", "value": 90, "type": "Target"},
      {"metric": "Habitat Health", "value": 85, "type": "Target"},
      {"metric": "Species Richness", "value": 85, "type": "Target"},
      {"metric": "Coral Cover", "value": 80, "type": "Target"}
    ]
  },
  "mark": {
    "type": "line",
    "point": true
  },
  "encoding": {
    "theta": {"field": "metric", "type": "nominal"},
    "radius": {
      "field": "value",
      "type": "quantitative",
      "scale": {"domain": [0, 100]}
    },
    "color": {"field": "type", "type": "nominal"},
    "opacity": {
      "condition": {
        "selection": "select",
        "value": 1
      },
      "value": 0.3
    }
  },
  "selection": {
    "select": {"type": "single", "fields": ["metric"]}
  },
  "view": {"stroke": null}
}`,
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
    const [selectedLanguage, setSelectedLanguage] = useState("python");

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
      };

      return {
        id: chartId,
        likes: likes.length > 0 ? likes : allFeatures[chartId],
      };
    });

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
    };

    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-800">Remix in</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedLanguage("python")}
                className={`px-4 py-2 rounded transition-colors ${
                  selectedLanguage === "python"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setSelectedLanguage("r")}
                className={`px-4 py-2 rounded transition-colors ${
                  selectedLanguage === "r"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                R
              </button>
              <button
                onClick={() => setSelectedLanguage("vega-lite")}
                className={`px-4 py-2 rounded transition-colors ${
                  selectedLanguage === "vega-lite"
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
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-medium text-gray-600">
                        {selectedLanguage === "python"
                          ? "Python"
                          : selectedLanguage === "r"
                          ? "R"
                          : "Vega-Lite"}{" "}
                        Code
                      </h5>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            selectedLanguage === "python"
                              ? getPythonCode(id, likes)
                              : selectedLanguage === "r"
                              ? getRCode(id, likes)
                              : getVegaLiteCode(id, likes)
                          )
                        }
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        Copy Code
                      </button>
                    </div>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>
                        {selectedLanguage === "python"
                          ? getPythonCode(id, likes)
                          : selectedLanguage === "r"
                          ? getRCode(id, likes)
                          : getVegaLiteCode(id, likes)}
                      </code>
                    </pre>
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
                  <pre className="bg-gray-100 p-2 rounded text-sm">
                    <code>
                      {selectedLanguage === "python"
                        ? "pip install matplotlib numpy plotly seaborn scipy"
                        : selectedLanguage === "r"
                        ? 'install.packages(c("ggplot2", "plotly", "fmsb"))'
                        : "npm install vega-lite vega-embed"}
                    </code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {selectedCharts.length > 0 && (
          <button
            onClick={() => {
              setSelectedCharts([]);
              setChartLikes({
                1: [],
                2: [],
                3: [],
                4: [],
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
        <CodeGenerator />
      </div>
    </div>
  );
}

export default App;
