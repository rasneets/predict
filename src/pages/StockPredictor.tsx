import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Calendar, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import PredictionChart from '../components/PredictionChart';
import LoadingAnimation from '../components/LoadingAnimation';

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

const API_URL = import.meta.env.VITE_API_URL;

const StockPredictor: React.FC = () => {
  const [stockSymbol, setStockSymbol] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const handleNextDayPredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setFetchError('');
    setLoading(true);

    try {
      if (!stockSymbol) {
        throw new Error('Please provide a valid stock symbol');
      }

      const response = await axios.post(`${API_URL}/api/stocks/predict`, {
        stockSymbol,
        currentPrice: 100 // Using a default value since we're removing the input
      });

      setPrediction(response.data);
    } catch (err: any) {
      setFetchError(err.message || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleRangePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setFetchError('');
    setLoading(true);

    try {
      if (!stockSymbol || !startDate || !endDate) {
        throw new Error('Please provide all required fields');
      }

      const response = await axios.post(`${API_URL}/api/stocks/predict-range`, {
        stockSymbol,
        startDate,
        endDate
      });

      setPrediction(response.data);
    } catch (err: any) {
      setFetchError(err.message || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setFetchError('');
    setPrediction(null);
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-2">Stock Predictor ML</h1>
      <p className="text-gray-400 mb-8">Advanced stock prediction using machine learning models</p>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <Tabs defaultValue="single" onValueChange={handleTabChange}>
          <TabsList className="mb-6 inline-flex">
            <TabsTrigger value="single">Next Day Prediction</TabsTrigger>
            <TabsTrigger value="range">Date Range Prediction</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <form onSubmit={handleNextDayPredict} className="max-w-md mx-auto space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Stock Symbol (e.g., AAPL)"
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <span className="flex items-center">
                    Get Prediction
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </form>
          </TabsContent>

          <TabsContent value="range">
            <form onSubmit={handleRangePredict} className="max-w-md mx-auto space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Stock Symbol (e.g., AAPL)"
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <span className="flex items-center">
                    Get Prediction
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </form>
          </TabsContent>

          {fetchError && (
            <div className="mt-6 bg-red-900/30 text-red-400 p-3 rounded-md text-sm max-w-md mx-auto">
              {fetchError}
            </div>
          )}

          {loading ? (
            <LoadingAnimation />
          ) : prediction && (
            <div className="mt-8 p-6 bg-gray-700/20 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Prediction Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 max-w-2xl mx-auto">
                <div className="p-4 bg-gray-700/30 rounded-lg">
                  <p className="text-sm text-gray-400">Current Price</p>
                  <p className="text-2xl font-bold">${prediction.currentPrice.toFixed(2)}</p>
                </div>
                
                <div className={`p-4 rounded-lg ${prediction.predictedMovement === 'up' ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                  <div className="flex justify-center items-center mb-2">
                    {prediction.predictedMovement === 'up' ? (
                      <TrendingUp className="h-6 w-6 text-green-400" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400">Predicted Price</p>
                  <p className="text-2xl font-bold">${prediction.predictedValue.toFixed(2)}</p>
                  <p className={`text-sm ${prediction.predictedMovement === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {prediction.predictedMovement === 'up' ? '+' : ''}{prediction.percentChange.toFixed(2)}%
                  </p>
                </div>
              </div>

              <PredictionChart
                currentPrice={prediction.currentPrice}
                predictedPrice={prediction.predictedValue}
                predictedMovement={prediction.predictedMovement}
              />

              <div className="mt-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prediction.models.map((model, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg ${
                        model.name === prediction.modelUsed 
                          ? 'bg-blue-900/20 border border-blue-800' 
                          : 'bg-gray-700/20'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">{model.name}</p>
                        <p className="text-sm">{model.r2Score.toFixed(4)}</p>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${model.r2Score * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default StockPredictor;