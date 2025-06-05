import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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

const PredictionChart = ({ currentPrice, predictedPrice, predictedMovement }) => {
  const data = {
    labels: ['Current', 'Predicted'],
    datasets: [
      {
        label: 'Stock Price',
        data: [currentPrice, predictedPrice],
        borderColor: predictedMovement === 'up' ? '#4ade80' : '#f43f5e',
        backgroundColor: predictedMovement === 'up' 
          ? 'rgba(74, 222, 128, 0.2)' 
          : 'rgba(244, 63, 94, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: '#4b5563',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => `$${context.parsed.y.toFixed(2)}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#9ca3af',
          callback: (value) => `$${value}`
        }
      }
    }
  };

  return (
    <div className="h-64 mt-6">
      <Line data={data} options={options} />
    </div>
  );
};

export default PredictionChart;