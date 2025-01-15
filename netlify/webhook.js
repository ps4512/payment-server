export default async function handler(req, res) {
    // Log the webhook payload to the console
    console.log('Received Webhook:', JSON.stringify(req.body, null, 2));
  
    // You can log more specific parts if needed:
    // console.log('Webhook Payload:', req.body);
  
    // Respond with a success message
    res.status(200).json({ message: 'Webhook received successfully!' });
  }