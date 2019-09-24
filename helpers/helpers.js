const dotenv = require('dotenv');
const request = require('request-promise');

const accountSid = process.env.TWILIOSID;
const authToken = process.env.TWILIOAUTH;

const twilio = require('twilio')(accountSid, authToken);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRIDKEY);

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

const sendEmail = async (receiver='aninda.kar@codaemonsoftwares.com', mail_subject, mail_message, mail_text='Send mail test dummy') => {
  console.log('Send Email Sendgrid');
  const msg = {
    to: receiver,
    from: 'info@eastindiatrading.co',
    subject: mail_subject,
    text: mail_text,
    html: mail_message,
  };

  try {
    const mail = await sgMail.send(msg);
    console.log('Mail Send');
  } catch (error) {
    console.log('Email send error');
    console.log(error);
  }  
}

const checkLocalTime = async (lat, lng) => {
  const loc = `${lat},${lng}`; // Tokyo expressed as lat,lng tuple
  const targetDate = new Date(); // Current date/time of user computer
  const timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60; // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
  const apikey = process.env.GOOGLEAPIKEY;
  const apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc + '&timestamp=' + timestamp + '&key=' + apikey;

  try {
    console.log('Timezone API call');
    let response = await request.get(apicall);
    response = JSON.parse(response);
    console.log('Response');
    console.log(response);

    if (response.status == 'OK'){
      console.log(response.status);
      const offsets = response.dstOffset * 1000 + response.rawOffset * 1000; // get DST and time zone offsets in milliseconds
      const localdate = new Date(timestamp * 1000 + offsets); // Date object containing current time of Tokyo (timestamp + dstOffset + rawOffset)
      console.log(`Current time: ${localdate.getHours()} Hrs ${localdate.getMinutes()} mins`);
      return {
        'hour': localdate.getHours(),
        'min': localdate.getMinutes()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.log('Timezone API error');
    console.log(error);
  }  
}

const calculateDistance = async (origin, destination) => {
  const apikey = process.env.GOOGLEAPIKEY;
  const apicall = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=` + apikey;

  try {
    console.log('Distance API call');
    let response = await request.get(apicall);
    response = JSON.parse(response);
    console.log('Response');
    console.log(response);

    if (response.status == 'OK'){
      console.log(response.status);      
    } else {
      return null;
    }
  } catch (error) {
    console.log('Distance API error');
    console.log(error);
  } 
}

module.exports = { sendSMS, sendEmail, checkLocalTime, calculateDistance };