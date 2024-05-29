const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');


const app = express();
const port = 5002;

const CHECKOUT_API_URL = 'https://api.sandbox.checkout.com';
const CHECKOUT_SECRET_KEY = 'sk_sbox_3g2rgzrnw5p6nnwmywuyr5bknyu'; // Ensure this is your correct secret key
const WEBHOOK_URL = 'https://4fa4-183-247-7-131.ngrok-free.app/webhook'; // Use your ngrok URL

let paymentStatus = { status: 'Pending' };

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const server = http.createServer(app);


app.post('/create-payment-session', async (req, res) => {
  try {
    const { amount, currency, reference, processing_channel_id, billing, customer, success_url, failure_url } = req.body;

    const response = await axios.post(
      `${CHECKOUT_API_URL}/payment-sessions`,
      {
        amount,
        currency,
        reference,
        processing_channel_id,
        billing,
        customer,
        success_url,
        failure_url,
        '3ds': { enabled: true } // Enable 3DS
      },
      {
        headers: {
          'Authorization': `Bearer ${CHECKOUT_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error creating payment session:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: error.response ? error.response.data : 'Internal Server Error' });
  }
});

app.get('/payment-details/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    const response = await axios.get(
      `${CHECKOUT_API_URL}/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${CHECKOUT_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching payment details:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: error.response ? error.response.data : 'Internal Server Error' });
  }
});

app.get('/payment-status', (req, res) => {
  try {
    res.json(paymentStatus);
  } catch (error) {
    console.error('Error fetching payment details:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: error.response ? error.response.data : 'Internal Server Error' });
  }
});



app.post('/webhook', (req, res) => {
  const event = req.body;
  console.log('Webhook event received:', event);
  paymentStatus = event.type;

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




