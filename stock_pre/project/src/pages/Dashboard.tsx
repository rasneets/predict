import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';
import PredictionHistory from '../components/PredictionHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

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

interface PredictionHistoryItem {
  _id: string;
  stockSymbol: string;
  stockPrice: number;
  priceRange: string;
  modelUsed: string;
  predictedValue: number;
  r2Score: number;
  date: string;
}

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const handlePredict = async (stockSymbol: string, currentPrice: number) => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/stocks/predict',
        { stockSymbol, currentPrice },
        { headers: { 'x-auth-token': token } }
      );
      setPrediction(res.data);
      
      // Save prediction to history
      await axios.post(
        'http://localhost:5000/api/predictions',
        { 
          stockSymbol: res.data.stockSymbol,
          stockPrice: res.data.currentPrice,
          priceRange: res.data.priceRange,
          modelUsed: res.data.modelUsed,
          predictedValue: res.data.predictedValue,
          r2Score: res.data.r2Score
        },
        { headers: { 'x-auth-token': token } }
      );
      
      // Refresh history
      fetchHistory();
    } catch (error) {
      console.error('Error making prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/predictions', {
        headers: { 'x-auth-token': token }
      });
      setHistory(res.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Stock Prediction Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Make a Prediction</h2>
            <PredictionForm onPredict={handlePredict} loading={loading} />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            {prediction ? (
              <PredictionResult prediction={prediction} />
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Enter a stock symbol and price to get prediction</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <Tabs defaultValue="history">
            <TabsList className="mb-6">
              <TabsTrigger value="history">Prediction History</TabsTrigger>
              <TabsTrigger value="performance">Model Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              <PredictionHistory history={history} loading={historyLoading} />
            </TabsContent>
            
            <TabsContent value="performance">
              <div className="text-center py-8 text-gray-400">
                <p>Model performance analytics will be available soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;