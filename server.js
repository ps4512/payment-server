const express = require('express');
const cors = require('cors');
// Require the parts of the module you want to use
const { Client, CheckoutAPI } = require('@adyen/api-library');

const app = express();
const port = 5002;

const API_KEY = 'AQEyhmfxJ4zKYhZGw0m/n3Q5qf3VaY9UCJ1+XWZe9W27jmlZip5TikRFk3cZ+20K9+E1S5MQwV1bDb7kfNy1WIxIIkxgBw==-ccCh0rfAJNX1LFcGi/K2q/jAc3mCwtjsaCMlgscRjuo=-i1iy~5fdmv?@)XSsy%A'; 

app.use(cors({
  origin: 'https://3000-ps4512-paymentpage-n19h2oaqgu9.ws-us116.gitpod.io' // Allow your frontend's origin
}));

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
    const response = checkoutAPI.PaymentsApi.paymentMethods(paymentMethodsRequest);
    console.log(await response)
  } catch (error) {
    console.error('Error creating payment session:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: error.response ? error.response.data : 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




