import React from 'react';
import StockPredictor from './pages/StockPredictor';
import { BarChart3 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold">StockPredictor ML</span>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <StockPredictor />
      </div>
    </div>
  );
}

export default App;