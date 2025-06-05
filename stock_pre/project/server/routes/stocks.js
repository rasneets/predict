import express from 'express';
const router = express.Router();

// Mock function to simulate ML model prediction
const getPrediction = (stockSymbol, currentPrice) => {
  // Determine price range
  let priceRange;
  if (currentPrice < 50) {
    priceRange = 'low';
  } else if (currentPrice < 200) {
    priceRange = 'mid';
  } else {
    priceRange = 'high';
  }

  // Simulate 4 models with different R2 scores
  const models = [
    { name: `${priceRange}_model_1`, r2Score: Math.random() * 0.5 + 0.5 },
    { name: `${priceRange}_model_2`, r2Score: Math.random() * 0.5 + 0.5 },
    { name: `${priceRange}_model_3`, r2Score: Math.random() * 0.5 + 0.5 },
    { name: `${priceRange}_model_4`, r2Score: Math.random() * 0.5 + 0.5 }
  ];

  // Select best model based on R2 score
  models.sort((a, b) => b.r2Score - a.r2Score);
  const bestModel = models[0];

  // Generate a random prediction (up or down by 0-5%)
  const movement = (Math.random() * 10 - 5) / 100;
  const predictedValue = currentPrice * (1 + movement);

  return {
    stockSymbol,
    currentPrice,
    priceRange,
    modelUsed: bestModel.name,
    predictedValue: parseFloat(predictedValue.toFixed(2)),
    r2Score: parseFloat(bestModel.r2Score.toFixed(4)),
    predictedMovement: movement > 0 ? 'up' : 'down',
    percentChange: parseFloat((movement * 100).toFixed(2)),
    models: models.map(model => ({
      name: model.name,
      r2Score: parseFloat(model.r2Score.toFixed(4))
    }))
  };
};

// Get prediction for next day
router.post('/predict', async (req, res) => {
  try {
    const { stockSymbol, currentPrice } = req.body;
    
    if (!stockSymbol || !currentPrice) {
      return res.status(400).json({ message: 'Please provide stock symbol and current price' });
    }

    const prediction = getPrediction(stockSymbol, currentPrice);
    res.json(prediction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get predictions for date range
router.post('/predict-range', async (req, res) => {
  try {
    const { stockSymbol, startDate, endDate } = req.body;
    
    if (!stockSymbol || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide stock symbol and date range' });
    }

    // Mock current price for demonstration
    const currentPrice = Math.random() * 300 + 50;
    const prediction = getPrediction(stockSymbol, currentPrice);
    
    res.json(prediction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;