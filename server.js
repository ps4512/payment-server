const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
// Require the parts of the module you want to use
const { Client, CheckoutAPI } = require('@adyen/api-library');

const app = express();
const port = 5002;

const API_KEY = 'AQEyhmfxJ4zKYhZGw0m/n3Q5qf3VaY9UCJ1+XWZe9W27jmlZip5TikRFk3cZ+20K9+E1S5MQwV1bDb7kfNy1WIxIIkxgBw==-ccCh0rfAJNX1LFcGi/K2q/jAc3mCwtjsaCMlgscRjuo=-i1iy~5fdmv?@)XSsy%A'; 

let paymentStatus = 'Pending...';

const corsOptions = {
  origin: 'https://3000-ps4512-paymentpage-n19h2oaqgu9.ws-us116.gitpod.io/',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post('/payment-methods', async (req, res) => {
  try {

    console.log("hello there")
    // Initialize the client object
    // For the live environment, additionally include your liveEndpointUrlPrefix.
    const client = new Client({apiKey: API_KEY, environment: "TEST"});

    // Create the request object(s)
    const paymentMethodsRequest = {
      merchantAccount: "AdyenTechSupport_PengShao_TEST",
      countryCode: "NL",
      amount: {
        currency: "EUR",
        value: 1000
      },
      channel: "Web",
      shopperLocale: "nl-NL"
    }
    // Send the request
    const checkoutAPI = new CheckoutAPI(client);
    const response = checkoutAPI.PaymentsApi.paymentMethods(paymentMethodsRequest, { idempotencyKey: "UUID" });
    console.log(await response)
  } catch (error) {
    console.error('Error creating payment session:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: error.response ? error.response.data : 'Internal Server Error' });
  }
});

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
        // '3ds': { enabled: true } // Enable 3DS
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

app.post('/clear-payment-status', (req, res) => {
  try {
    paymentStatus = 'Pending';
    res.status(200).json('clear payment status successful')
  } catch (error) {
    console.error('clearing payment status failed');
    res.status(error.response ? error.response.status : 500).json({ error: error.response ? error.response.data : 'Internal Server Error' });
  }
});

app.post('/webhook', (req, res) => {
  const event = req.body;
  console.log('Webhook event received:', event);
  if (paymentStatus === 'payment_captured' || paymentStatus === 'payment_declined') {
    console.log("reached terminal state already: " + event.type);
  } else {
    paymentStatus = event.type;
  }
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




