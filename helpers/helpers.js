const dotenv = require('dotenv');

const accountSid = process.env.TWILIOSID;
const authToken = process.env.TWILIOAUTH;

const twilio = require('twilio')(accountSid, authToken);

const sendSMS = async (message, receiver='+919874259153') => {
  console.log('Send SMS Twilio');
  const msg_body = message;
  const msg_sender = '+16827171861';
  const msg_receiver = receiver;

  try {
    const sms_response = await twilio.messages
      .create({
        body: msg_body,
        from: msg_sender,
        to: msg_receiver      
      });
    console.log('SMS Sent');    
  } catch (error) {
    console.log('SMS send error');
    console.log(error);
  }  
}

module.exports = { sendSMS };