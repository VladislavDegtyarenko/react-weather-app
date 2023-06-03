// ChartJS
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  BarController,
  LineElement,
  PointElement,
  LinearScale,
  Filler,
  Title,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  BarController,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  ChartDataLabels,
  Filler
);

// MUI
import { useTheme } from "@mui/material/styles";

// Icons
import convertReactIconToDataImage from "../../functions/convertReactIconToDataImage";

import { WiRaindrop } from "react-icons/wi";
const RainDropDataIcon = convertReactIconToDataImage(<WiRaindrop color="#888888" />);

// Functions
import addTimeSuffix from "../../functions/addTimeSuffix";
import getWeekdayString from "../../functions/getWeekdayString";
import getWeatherIconById from "../../functions/getIconNameById";

// Types
import type { Chart, ChartOptions } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ForecastData } from "../../types/types";

const ForecastChart = ({ forecastData }: { forecastData: ForecastData }) => {
  const { palette, breakpoints } = useTheme();

  const labels = forecastData.map((item) => addTimeSuffix(item.dt));

  // Add empty first and last X-axis labels
  labels.unshift("");
  labels.push("");

  const temperatureData = forecastData
    ? forecastData.map((item) => Math.round(item.main.temp))
    : [];

  // Duplicate first and last item
  temperatureData.unshift(temperatureData[0]);
  temperatureData.push(temperatureData[temperatureData.length - 1]);

  const temperatureDataset = {
    labels,
    data: temperatureData,
    backgroundColor: palette.divider,
    borderColor: palette.text.secondary,
    borderWidth: 1,
    box: [2, 4],
    tension: 0.34,
    fill: true,
    datalabels: {
      formatter: (value: string, context: Context) => {
        // Hide data label for first item
        if (context.dataIndex === 0) return "";

        // Hide data label for last item
        if (context.dataIndex === temperatureData.length - 1) return "";

        return value + "°";
      },
    },
  };

  const addWeatherIcons = {
    id: "addWeatherIcons",
    afterDatasetsDraw: (chart: Chart) => {
      const {
        ctx,
        chartArea: { bottom, left, right },
        scales: { x },
      } = chart;

      const xs = window.innerWidth < breakpoints.values.sm;

      const iconSize = xs ? 24 : 32;

      // Dashed line
      ctx.beginPath();
      ctx.strokeStyle = palette.action.disabled;
      ctx.setLineDash([5, 2]);
      ctx.lineWidth = 1;
      ctx.moveTo(left, bottom - iconSize * 1.5);
      ctx.lineTo(right, bottom - iconSize * 1.5);
      ctx.stroke();

      // Draw Icons
      let prevIcon: number | null = null;

      forecastData.forEach((currentWeather, index) => {
        const currentIcon = currentWeather.weather[0].id;
        const iconName = getWeatherIconById(currentIcon);

        if (index === 0 || index === forecastData.length - 1) return;

        if (currentIcon === prevIcon) return;

        const icon = new Image();
        icon.src = `assets/weatherConditionIcons/${iconName}.svg`;
        // icon.src = `https://openweathermap.org/img/wn/${currentWeather.icon}.png`;

        ctx.drawImage(
          icon,
          x.getPixelForValue(index) - iconSize / 2,
          bottom - iconSize * 2,
          iconSize,
          iconSize
        );

        prevIcon = currentIcon;
      });
    },
  };

  const addHumidityInfo = {
    id: "addHumidityInfo",
    afterDatasetsDraw: (chart: Chart) => {
      const {
        ctx,
        chartArea: { bottom },
        scales: { x },
      } = chart;

      if (!forecastData) return;

      forecastData.forEach((currentWeather, index) => {
        // Draw Icon
        const icon = new Image();
        icon.src = RainDropDataIcon;
        ctx.drawImage(icon, x.getPixelForValue(index) - 14, bottom - 22, 16, 16);

        // Place text "N%" right after the icon
        ctx.font = "12px sans-serif";
        ctx.fillStyle = palette.text.secondary;
        ctx.textAlign = "left";
        const text = currentWeather.main.humidity + "%";
        ctx.fillText(text, x.getPixelForValue(index), bottom - 10);
      });
    },
  };

  const midnightLabels = {
    id: "midnightLabels",
    afterDatasetsDraw: (chart: Chart) => {
      const {
        ctx,
        chartArea: { top, bottom, height },
        scales: { x },
      } = chart;

      // Draw Line
      ctx.beginPath();
      ctx.strokeStyle = palette.action.disabled;
      ctx.setLineDash([5, 2]);
      ctx.lineWidth = 1;
      ctx.moveTo(x.getPixelForValue("0h" as any), top);
      ctx.lineTo(x.getPixelForValue("0h" as any), bottom);
      ctx.stroke();

      // Add Before Tonight  Text
      ctx.font = "12px sans-serif";
      ctx.fillStyle = palette.text.secondary;
      ctx.textAlign = "right";
      const weekdayToday = new Date().getDay();
      const weekdayTodayStr = getWeekdayString(weekdayToday);
      ctx.fillText(weekdayTodayStr, x.getPixelForValue("0h" as any) - 10, bottom - 10);

      // Add Tomorrow Date Text
      ctx.font = "12px sans-serif";
      ctx.fillStyle = palette.text.secondary;
      ctx.textAlign = "left";
      const weekdayTomorrowStr = getWeekdayString((weekdayToday + 1) % 7);
      ctx.fillText(weekdayTomorrowStr, x.getPixelForValue("0h" as any) + 10, bottom - 10);
    },
  };

  const data = {
    datasets: [temperatureDataset],
  };

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        type: "category",
        labels,
        ticks: {
          color: palette.text.secondary,
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        title: {
          display: false,
          text: "Temperature",
          color: palette.text.secondary,
        },
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        min: Math.min(...temperatureData) - 8,
        max: Math.max(...temperatureData) + 4,
      },
    },
    plugins: {
      title: {
        display: false,
        text: "Today Weather Forecast",
      },
      datalabels: {
        align: "top",
        color: palette.text.primary,
        labels: {
          title: {
            font: {
              weight: 400,
            },
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    onResize(chart) {
      chart.update();
    },
  };

  return (
    <Line data={data} options={options} plugins={[addWeatherIcons, midnightLabels]} />
  );
};

export default ForecastChart;
