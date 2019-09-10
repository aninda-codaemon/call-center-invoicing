const accountSid = 'ACad16c3eed7ad5a9c907c189b548cd75f';
const authToken = '98c44979d6d15a7e39da6812cd1666ac';

const twilio = require('twilio')(accountSid, authToken);

const sendSMS = async () => {
  console.log('Send SMS Twilio');
  twilio.messages
    .create({
      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
      from: '+16827171861',
      to: '+919874259153'
    }, (error, response) => {
      if (error) {
        console.log('SMS sending error');
        console.log(error);
      } else {
        console.log('SMS Sent');
        console.log(response);
      }
    });
    // .then(message => {
    //   console.log('Message sent');
    //   console.log(message);
    // })
    // .done();
}

sendSMS();

// module.exports = { sendSMS };