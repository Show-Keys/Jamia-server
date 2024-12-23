import axios from 'axios';
import PaymentModel from '../models/paymentModel.js';
import jamiyaModel from '../models/jamiyaModel.js';
import userModel from '../models/UserModel.js';

export const initiatePayment = async (req, res) => {
  const { userId, jamiyaId, amount } = req.body;

  try {
    const user = await userModel.findById(userId);
    const jamiya = await jamiyaModel.findById(jamiyaId);

    if (!user || !jamiya) {
      return res.status(404).json({ error: 'User or Jamiya not found' });
    }

    const response = await axios.post(
      'https://uatcheckout.thawani.om/api/v1/checkout/session',
      {
        client_reference_id: userId,
        products: [
          {
            name: `Payment for Jamiya ${jamiya.jcode}`,
            unit_amount: amount,
            quantity: 1,
          },
        ],
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'thawani-api-key': process.env.THAWANI_API_KEY,
        },
      }
    );

    const sessionId = response.data.data.session_id;

    const newPayment = new PaymentModel({
      userId,
      jamiyaId,
      amount,
      sessionId,
      status: 'pending',
    });

    await newPayment.save();

    const checkoutUrl = `https://uatcheckout.thawani.om/pay/${sessionId}?key=${process.env.PUBLISHABLE_KEY}`;
    res.status(200).json({ checkoutUrl });
  } catch (error) {
    console.error('Error during Thawani API request:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || 'Payment initiation failed' });
  }
};