const express = require('express');
const cors = require('cors');
const { Client, CheckoutAPI } = require('@adyen/api-library');

const app = express();
const port = 5002;

const API_KEY = 'AQEyhmfxJ4zKYhZGw0m/n3Q5qf3VaY9UCJ1+XWZe9W27jmlZip5TikRFk3cZ+20K9+E1S5MQwV1bDb7kfNy1WIxIIkxgBw==-sAIyvIubQ7qhOdD4/IAtYSzq9BylzjOEg3aspmb1Q9g=-i1iawJ]jGT,74P(sYW8';

app.use(cors()); // Allow all origins temporarily
app.use(express.json());

app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200); // Respond with 200 OK
});

app.post('/payment-methods', async (req, res) => {
  try {
    const client = new Client({ apiKey: API_KEY, environment: "TEST" });
    
    const paymentMethodsRequest = {
      merchantAccount: "AdyenTechSupport_PengShao_TEST",
      countryCode: "NL",
      amount: { currency: "EUR", value: 1000 },
      channel: "Web",
      shopperLocale: "nl-NL"
    };

    const checkoutAPI = new CheckoutAPI(client);
    const response = await checkoutAPI.PaymentsApi.paymentMethods(paymentMethodsRequest);
    
    res.json(response);
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(error.response ? error.response.status : 500).json({ error: error.response ? error.response.data : 'Internal Server Error' });
  }
});

app.post('/payments', async (req, res) => {
  try {
    // For the live environment, additionally include your liveEndpointUrlPrefix.
    const client = new Client({apiKey: API_KEY, environment: "TEST"});
    
    // Create the request object(s)
    const paymentRequest = {
      amount: {
        currency: "EUR",
        value: 1000
      },
      reference: "Your order number",
      paymentMethod: {
        type: "scheme",
        number: "4111111111111111",
        expiryMonth: "03",
        expiryYear: "2030",
        cvc: "737"
      },
      "returnUrl": "https://your-company.com/...",
      "merchantAccount": "AdyenTechSupport_PengShao_TEST"
     }
    
    // Send the request
    const checkoutAPI = new CheckoutAPI(client);
    const response = checkoutAPI.PaymentsApi.payments(paymentRequest);
    res.json(response);

  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(error.response ? error.response.status : 500).json({ error: error.response ? error.response.data : 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
