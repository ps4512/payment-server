const express = require('express');
const cors = require('cors');
const { Client, CheckoutAPI } = require('@adyen/api-library');
const { hmacValidator } = require('@adyen/api-library');
const { ThreeDS2RequestData } = require('@adyen/api-library/lib/src/typings/checkout/threeDS2RequestData');


const app = express();
const port = 5002;

const API_KEY = 'AQEyhmfxL4vNaxJBw0m/n3Q5qf3VaY9UCJ1+XWZe9W27jmlZinc+0PZFlKmC3gqzZnN3pIEQwV1bDb7kfNy1WIxIIkxgBw==-kQxJKSHpH1fGBAcfmWTwfVxiot10UVHO1+09k1QJvxA=-i1i5=5qbaFP68g>2gCD';

app.use(cors()); // Allow all origins temporarily
app.use(express.json());

app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200); // Respond with 200 OK
});

app.post('/sessions', async (req, res) => {
  // For the live environment, additionally include your liveEndpointUrlPrefix.
const client = new Client({apiKey: API_KEY, environment: "TEST"});
 
// Create the request object(s)
const createCheckoutSessionRequest = {
  merchantAccount: "AdyenTechSupport_PengAfPMarketplace_TEST",
  amount: {
    value: 100,
    currency: "EUR"
  },
  returnUrl: "https://google.com",
  reference: "YOUR_PAYMENT_REFERENCE",
  countryCode: "NL",
  shopperReference: "YOUR_SHOPPER_REFERENCE",
  storePaymentMethodMode: "enabled",
  shopperInteraction: "Ecommerce",
  recurringProcessingModel: "CardOnFile",
  // authenticationData: {
  //   threeDSRequestData: {
  //     nativeThreeDS: "preferred"
  //   }
  // }
}
 
// Send the request
const checkoutAPI = new CheckoutAPI(client);
const response = checkoutAPI.PaymentsApi.sessions(createCheckoutSessionRequest);
const session = await response
res.json(session);

})

app.post('/payment-methods', async (req, res) => {
  try {
    const client = new Client({ apiKey: API_KEY, environment: "TEST" });
    
    const paymentMethodsRequest = {
      merchantAccount: "AdyenTechSupport_PengAfPMarketplace_TEST",
      countryCode: "DE",
      amount: { currency: "EUR", value: 100 },
      channel: "Web",
      shopperLocale: "nl-NL",
      shopperReference: "Peng_Shao_Shopper_Reference_New",
      additionalData: {
        authorisationType: "PreAuth"
     }
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
    console.log(1);
    // For the live environment, additionally include your liveEndpointUrlPrefix.
    const client = new Client({apiKey: API_KEY, environment: "TEST"});
    console.log(2);
    // Send the request
    const checkoutAPI = new CheckoutAPI(client);
    console.log(3);
    const response = await checkoutAPI.PaymentsApi.payments(req.body);
    console.log(4);
    console.log(new Date().toLocaleTimeString());
    console.log(response);
    res.json(response);

  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(error.response ? error.response.status : 500).json({ error: error.response ? error.response.data : 'Internal Server Error' });
  }
});

app.post('/payment-details', async (req, res) => {
  try {
    const client = new Client({apiKey: API_KEY, environment: "TEST"});
    console.log(new Date().toLocaleTimeString());
    console.log("redirect result is: " + JSON.stringify(req.body.redirectResult))
 
     
    // Send the request
    const checkoutAPI = new CheckoutAPI(client);
    const response = await checkoutAPI.PaymentsApi.paymentsDetails(req.body.redirectResult);
    console.log(response)
    res.json(response);    

  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(error.response ? error.response.status : 500).json({ error: error.response ? error.response.data : 'Internal Server Error' });
  }
});

app.post('/webhook', async (req, res) => {
  try {
      // YOUR_HMAC_KEY from the Customer Area
      //const hmacKey = "9B3A27ACBC7D081A15EAB91C71898E166A81321D82705AC24632CC644EA2E01F";
      //const validator = new hmacValidator()
      // Notification Request JSON
      const notificationRequest = req.body;
      const notificationRequestItems = notificationRequest.notificationItems
      // Handling multiple notificationRequests
      notificationRequestItems.forEach(function(notificationRequestItem) {
        console.log(new Date().toLocaleTimeString());
        console.log(notificationRequestItem); 
          // Handle the notification
          //if( validator.validateHMAC(notificationRequestItem, hmacKey) ) {
              // Process the notification based on the eventCode
            //  res.sendStatus(200);        
            // } else {
              // Non valid NotificationRequest
             // console.log("Non valid NotificationRequest");
             // res.sendStatus(403);
         // }
      });
  } catch (error) {
    console.error('Error receiving webhook:', error);
    res.status(error.response ? error.response.status : 500).json('Internal Server Error' );
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
