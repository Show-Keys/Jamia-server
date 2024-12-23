
 import mongoose from 'mongoose';
// const jamiyaSchema = new mongoose.Schema({
//     jcode: { type: String, required: true },
//     noMembers: { type: Number, required: true },
//     noMonths: { type: Number, required: true },
//     startDay: { type: Date, required: true },
//     endDate: { type: Date, required: true },
//     description: { type: String, required: true },
//     participants: [
//       {
//         userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//         status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
//         shares: { type: Number, required: true }  // Number of shares the user has selected
//       }
//     ],
//     totalShares: { type: Number, default: 0 }  // Total shares selected by all participants
//   },
// {timestamps :{createdAt: true, updatedAt :false}});
// // create true when we create new post update ture when we update 
// const jamiyaModel=mongoose.model("Jamiyas", JamiyaSchema);
// export default jamiyaModel;
const JamiyaSchema = new mongoose.Schema({
  jcode: { type: String, required: true, unique: true },
  noMonths: { type: Number, required: true },
  startDay: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, required: true },
  participants: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
        shares: { type: Number },
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
        winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [], // Start with no history
  },
},
{ timestamps: { createdAt: true, updatedAt: false } });

const jamiyaModel = mongoose.model('Jamiyas', JamiyaSchema);
export default jamiyaModel;
