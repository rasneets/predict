import mongoose from 'mongoose';

const PredictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  stockSymbol: {
    type: String,
    required: true
  },
  stockPrice: {
    type: Number,
    required: true
  },
  priceRange: {
    type: String,
    enum: ['low', 'mid', 'high'],
    required: true
  },
  modelUsed: {
    type: String,
    required: true
  },
  predictedValue: {
    type: Number,
    required: true
  },
  r2Score: {
    type: Number,
    required: true
  },
  actualValue: {
    type: Number
  },
  accuracy: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Prediction = mongoose.model('prediction', PredictionSchema);

export default Prediction;