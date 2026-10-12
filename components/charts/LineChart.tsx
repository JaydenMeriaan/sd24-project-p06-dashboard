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
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? "y" : "x",
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white",
             },
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!data.datasets.length || !data.labels.length) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <Line options={options} data={data} />
    </div>
  );
}
