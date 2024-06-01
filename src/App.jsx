import useScreenSize from "./hooks/useSreenSize";
import { Line } from "react-chartjs-2";
import data from "./data/data.json";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
const App = () => {
  const size = useScreenSize();
  let width = size.width;

  const handleDrawElements = (chart) => {
    const { ctx } = chart;
    const chartImage = new Image();
    chartImage.src = "https://www.chartjs.org/docs/latest/favicon.ico";
    // chartImage.src = "https://cdn-icons-png.flaticon.com/512/73/73775.png";
    const datasetMeta = chart.getDatasetMeta(0);

    ctx.save();

    datasetMeta.data.forEach((point, index) => {
      const xPos = point.x;
      const yPos = point.y;
      if (index < 5) {
        ctx.drawImage(
          chartImage,
          width > 600 ? xPos - width * 0.035 : xPos - width * 0.06,
          width > 600 ? yPos - width * 0.12 : yPos - width * 0.16,
          width > 600 ? width * 0.08 : width * 0.1,
          width > 600 ? width * 0.08 : width * 0.1
        );

        // Añade un cuadro de texto debajo de cada punto
        ctx.font = `${width > 600 ? width * 0.025 : width * 0.025}px Arial`;
        ctx.fillStyle = "black";
        ctx.fillText(
          `Punto ${index + 1}`,
          xPos + (width > 600 ? 30 : 0),
          yPos + (width > 600 ? 50 : width * 0.07)
        );
        ctx.restore();
      }
    });
  };

  const handlePointStyle = (datapoint) => {
    const datasetLength = datapoint.chart.data.labels.length - 1;

    const arrowImage = new Image();
    arrowImage.src = "./gray_arrow.png";
    arrowImage.width = width * 0.035;
    arrowImage.height = width * 0.05;

    const stylePointArray = [];
    for (let i = 0; i < datasetLength; i++) {
      stylePointArray.push("circle");
    }
    stylePointArray.push(arrowImage);

    return stylePointArray;
  };

  const options = {
    scales: {
      y: {
        display: false,
        suggestedMax: width > 600 ? 50 : 70,
        suggestedMin: -10,
      },
      x: {
        display: false,
        suggestedMax: data.length + 100,
      },
    },
    layout: {
      padding: {
        right: 0,
        left: 50,
        bottom: 1,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      point: {
        pointStyle: handlePointStyle,
      },
    },
  };

  const datasets = [
    {
      label: "Test",
      data: data.map((data) => data.revenue),
      backgroundColor: "#848484",
      borderColor: "#848484",
      tension: 0.3,
      pointRadius: width > 600 ? width * 0.015 : width * 0.025,
      pointBackgroundColor: data.map((data) => {
        if (data.value === "true") {
          return "red";
        } else {
          return "#848484";
        }
      }),
    },
  ];

  return (
    <>
      <div
        style={{
          height: width * 1.5,
          width: width * 0.85,
          paddingTop: width * 0.01,
          paddingLeft: width * 0.01,
        }}
      >
        <Line
          data={{
            labels: data.map((data) => data.label),
            datasets: datasets,
          }}
          options={options}
          plugins={[
            {
              beforeDraw: (chart) => handleDrawElements(chart),
              resize: (chart) => handleDrawElements(chart),
            },
          ]}
        />
      </div>
    </>
  );
};

export default App;
