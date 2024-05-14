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
  const handleDrawImage = (chart) => {
    const { ctx } = chart;
    const image = new Image();
    image.src = "https://www.chartjs.org/docs/latest/favicon.ico";
    const datasetMeta = chart.getDatasetMeta(0);

    datasetMeta.data.forEach((point, index) => {
      const xPos = point.x;
      const yPos = point.y;
      if (index < 5) {
        ctx.drawImage(image, xPos - 35, yPos - 100);

        // Añade un cuadro de texto debajo de cada punto
        ctx.font = `${width > 600 ? width * 0.025 : width * 0.03}px Arial`;
        ctx.fillStyle = "black";
        ctx.fillText(
          `Punto ${index + 1}`,
          xPos + 20,
          yPos + (width > 600 ? 50 : 20)
        );
      }
    });
  };

  const getPointStyle = (datapoint) => {
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

  return (
    <>
      <div style={{ height: "500px", width: width }}>
        <Line
          data={{
            labels: data.map((data) => data.label),
            datasets: [
              {
                label: "Test",
                data: data.map((data) => data.revenue),
                backgroundColor: "#848484",
                borderColor: "#848484",
                tension: 0.3,
                // pointRadius: 15
                pointRadius: width * 0.014,
                // pointStyle: "triangle",
                pointBackgroundColor: data.map((data) => {
                  if (data.value === "true") {
                    return "red";
                  } else {
                    return "#848484";
                  }
                }),
              },
            ],
          }}
          options={{
            scales: {
              y: {
                display: false,
                suggestedMax: 50,
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
            },
            elements: {
              point: {
                pointStyle: getPointStyle,
              },
            },
          }}
          plugins={[
            {
              beforeDraw: (chart) => handleDrawImage(chart),
              resize: (chart) => handleDrawImage(chart),
            },
          ]}
        />
      </div>
    </>
  );
};

export default App;
