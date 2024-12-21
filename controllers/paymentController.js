import axios from 'axios';

export const initiatePayment = async (req, res) => {
  const { clientId, productName, amount, quantity, successUrl, cancelUrl } = req.body;

  try {
    const response = await axios.post(
      'https://uatcheckout.thawani.om/api/v1/checkout/session',
      {
        client_reference_id: clientId,
        products: [
          {
            name: productName,
            unit_amount: amount,
            quantity: quantity,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
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
    const checkoutUrl = `https://uatcheckout.thawani.om/pay/${sessionId}?key=${process.env.PUBLISHABLE_KEY}`;
    res.status(200).json({ checkoutUrl });
  } catch (error) {
    console.error('Error during Thawani API request:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || 'Payment initiation failed' });
  }
};