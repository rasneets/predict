import express from 'express';
import auth from '../middleware/auth.js';
import Prediction from '../models/Prediction.js';

const router = express.Router();

// Get all predictions for a user
router.get('/', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user.id })
      .sort({ date: -1 });
    res.json(predictions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new prediction
router.post('/', auth, async (req, res) => {
  try {
    const { stockSymbol, stockPrice, priceRange, modelUsed, predictedValue, r2Score } = req.body;

    const newPrediction = new Prediction({
      user: req.user.id,
      stockSymbol,
      stockPrice,
      priceRange,
      modelUsed,
      predictedValue,
      r2Score
    });

    const prediction = await newPrediction.save();
    res.json(prediction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;