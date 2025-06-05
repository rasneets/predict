import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface PredictionFormProps {
  onPredict: (stockSymbol: string, currentPrice: number) => void;
  loading: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict, loading }) => {
  const [stockSymbol, setStockSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!stockSymbol.trim()) {
      return setError('Stock symbol is required');
    }
    
    const price = parseFloat(currentPrice);
    if (isNaN(price) || price <= 0) {
      return setError('Please enter a valid price');
    }
    
    onPredict(stockSymbol.toUpperCase(), price);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 bg-red-900/30 text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="stockSymbol" className="block text-sm font-medium text-gray-300 mb-1">
          Stock Symbol
        </label>
        <input
          id="stockSymbol"
          type="text"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value)}
          placeholder="e.g. AAPL"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-300 mb-1">
          Current Price ($)
        </label>
        <input
          id="currentPrice"
          type="number"
          step="0.01"
          min="0"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
          placeholder="e.g. 150.75"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
              <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            Get Prediction
            <ArrowRight className="ml-2 h-4 w-4 transition duration-150 ease-in-out group-hover:translate-x-1" />
          </span>
        )}
      </button>
    </form>
  );
};

export default PredictionForm;