import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  preferences: {
    theme: {
      type: String,
      default: 'dark'
    },
    defaultStocks: {
      type: [String],
      default: ['AAPL', 'MSFT', 'AMZN', 'GOOGL']
    }
  }
});

const User = mongoose.model('user', UserSchema);

export default User;