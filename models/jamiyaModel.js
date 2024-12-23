import mongoose from 'mongoose';

const JamiyaSchema = new mongoose.Schema({
  jcode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: { type: String },
  description: { type: String, required: true },
  noMonths: { type: Number, required: true },
  startDay: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
        shares: { type: Number },
        shareNumbers: { type: [Number], default: [] },
        paymentStatus: [
          {
            turn: { type: Number, required: true },
            status: { type: String, enum: ['paid', 'not_paid'], default: 'not_paid' },
            paymentDate: { type: Date },
          },
        ],
      },
    ],
    default: [], // Start with no participants
  },
  totalShares: { type: Number, default: 0 },
  wheelHistory: {
    type: [
      {
        turn: { type: Number, required: true },
        winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [], // Start with no history
  },
},
{ timestamps: { createdAt: true, updatedAt: false } });

const JamiyaModel = mongoose.model('Jamiya', JamiyaSchema);
export default JamiyaModel;