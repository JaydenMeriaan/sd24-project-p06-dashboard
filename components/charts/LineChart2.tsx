"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }>;
  };
  title?: string;
  loading?: boolean;
  error?: string;
  height?: number;
  horizontal?: boolean;
}

export function LineChart({
  data,
  title,
  loading,
  error,
  height = 300,
  horizontal = false,
}: LineChartProps) {
  const styledData = {
    ...data,
    datasets: data.datasets.map((ds) => ({
      ...ds,
      borderColor: ds.borderColor ?? "#22c55e", // emerald-500
      backgroundColor:
        ds.backgroundColor ?? "rgba(34,197,94,0.2)",
      pointBackgroundColor: "#22c55e",
      pointBorderColor: "#22c55e",
      borderWidth: ds.borderWidth ?? 2,
      tension: 0.4,
    })),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? "y" : "x",
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
      title: {
        display: !!title,
        text: title,
        color: "white",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(206, 34, 34, 0.1)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(56, 45, 204, 0.1)",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!data.datasets.length || !data.labels.length) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-400">No data available</div>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <Line options={options} data={styledData} />
    </div>
  );
}
