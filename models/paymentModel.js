import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jamiyaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jamiya', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  sessionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PaymentModel = mongoose.model('Payment', PaymentSchema);
export default PaymentModel;