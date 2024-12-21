import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  winner: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const ResultModel = mongoose.model('Result', resultSchema);

export default ResultModel;