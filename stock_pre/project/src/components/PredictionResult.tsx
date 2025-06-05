import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Prediction {
  stockSymbol: string;
  currentPrice: number;
  priceRange: string;
  modelUsed: string;
  predictedValue: number;
  r2Score: number;
  predictedMovement: string;
  percentChange: number;
  models: { name: string; r2Score: number }[];
}

interface PredictionResultProps {
  prediction: Prediction;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction }) => {
  const isPositive = prediction.predictedMovement === 'up';
  
  // Generate some fake historical data for the chart
  const generateHistoricalData = () => {
    const currentPrice = prediction.currentPrice;
    const data = [];
    const labels = [];
    
    // Generate past data (slightly random)
    for (let i = 14; i >= 0; i--) {
      const day = i === 0 ? 'Today' : `${i}d ago`;
      labels.push(day);
      
      // Add some randomness but keep a general trend
      const randomFactor = 0.02; // 2% max random change
      const trendFactor = 0.005 * i; // Small trend over time
      const price = i === 0 
        ? currentPrice 
        : currentPrice * (1 - trendFactor + (Math.random() * randomFactor * 2 - randomFactor));
        
      data.push(parseFloat(price.toFixed(2)));
    }
    
    // Add predicted value
    labels.push('Prediction');
    data.push(prediction.predictedValue);
    
    return { labels, data };
  };
  
  const { labels, data } = generateHistoricalData();
  
  const chartData = {
    labels,
    datasets: [
      {
        label: prediction.stockSymbol,
        data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        pointRadius: (ctx) => {
          const index = ctx.dataIndex;
          // Make 'Today' and 'Prediction' points larger
          return index === labels.length - 2 || index === labels.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: (ctx) => {
          const index = ctx.dataIndex;
          // Different colors for 'Today' and 'Prediction'
          if (index === labels.length - 2) return '#3B82F6';
          if (index === labels.length - 1) return isPositive ? '#4CB944' : '#FF5A5F';
          return '#3B82F6';
        },
        tension: 0.2
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#CBD5E1'
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#4B5563',
        borderWidth: 1,
        padding: 10,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#CBD5E1'
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#CBD5E1',
          callback: (value: number) => `$${value}`
        }
      }
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={`p-4 rounded-lg flex items-center ${isPositive ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
          <div className={`flex items-center justify-center p-3 rounded-full ${isPositive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            {isPositive ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-400">Predicted Movement</p>
            <p className={`text-2xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{prediction.percentChange}%
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-700/20 rounded-lg flex items-center">
          <div className="flex items-center justify-center p-3 rounded-full bg-blue-900/30 text-blue-400">
            <BarChart3 size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-400">Price Prediction</p>
            <p className="text-2xl font-bold">${prediction.predictedValue.toFixed(2)}</p>
            <p className="text-xs text-gray-400">Current: ${prediction.currentPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gray-700/20 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Model Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Price Range</p>
            <p className="font-medium">
              {prediction.priceRange.charAt(0).toUpperCase() + prediction.priceRange.slice(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Selected Model</p>
            <p className="font-medium">{prediction.modelUsed}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">R² Score</p>
            <p className="font-medium">{prediction.r2Score.toFixed(4)}</p>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">All Models R² Scores</h3>
        <div className="grid grid-cols-2 gap-4">
          {prediction.models.map((model, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg ${model.name === prediction.modelUsed ? 'bg-blue-900/20 border border-blue-800' : 'bg-gray-700/20'}`}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{model.name}</p>
                <p className="text-sm">{model.r2Score.toFixed(4)}</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(model.r2Score * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;