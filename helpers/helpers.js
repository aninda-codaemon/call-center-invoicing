const dotenv = require('dotenv');
const request = require('request-promise');
const moment = require('moment');

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
    return sms_response ? true : false;    
  } catch (error) {
    console.log('SMS send error');
    console.log(error);
    return false;
  }  
}

const sendPaymentLinkSMS = async (invoice_id) => {
  const InvoiceModel = require('../models/Invoice');

  try {
    const response = await InvoiceModel.getInvoiceById(invoice_id);
    console.log(response.result[0].invoice_id);
    if (response.result.length <= 0) {
      return false;
    } else {
      // Get the invoice details
      const info = await InvoiceModel.getInvoiceByInvoiceId(invoice_id);

      if (info.result.length <= 0) {
        return false;
      } else {
        const { status, payment_email, first_name, last_name, phone_number, service_type, model, color, make, year, start_address, end_address, amount, date_payment } = info.result[0];
        const paymentUrl = `${process.env.PAYMENTLINK}payment/${invoice_id}`;
        const sms_content = `
        Roadside Assistance: \n
        Hi ${first_name},\n
        You can pay for your service using the following link: ${paymentUrl}
        `;        
        return await sendSMS(sms_content);
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

const sendEmail = async (receiver ='aninda.kar@codaemonsoftwares.com', mail_subject, mail_message, mail_text='Send mail test dummy') => {
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
    return mail ? true : false;
  } catch (error) {
    console.log('Email send error');
    console.log(error);
    return false;
  }  
}

const sendPaymentConfirmationEmail = async (invoice_id) => {
  const InvoiceModel = require('../models/Invoice');

  try {
    const response = await InvoiceModel.getInvoiceById(invoice_id);
    console.log(response.result[0].invoice_id);
    if (response.result.length <= 0) {
      return false;
    } else {
      // Get the invoice details
      const info = await InvoiceModel.getInvoiceByInvoiceId(invoice_id);

      if (info.result.length <= 0) {
        return false;
      } else {
        const { status, payment_email, first_name, last_name, phone_number, service_type, model, color, make, year, start_address, end_address, amount, date_payment } = info.result[0];
        const date_paid = moment(date_payment).format('ddd MMM D YYYY kk:mm:ss') + ' GMT ' + moment().format('Z');
        const mail_subject = 'Roadside Assistance Payment Confirmation';
        const mail_message = `
                    <html>
                    <head>
                      <title>Roadside Assistance Payment Confirmation</title>
                    </head>
                    <body>
                        <table>
                            <tr>
                                <td>
                                  <table>
                                    <tr>                                
                                      <td>Hello ${first_name},</td>                                  
                                    </tr>
                                    <tr>                                  
                                      <td>
                                        <p>Below is the payment confirmation for your roadside assistance service:</p>
                                        <p>
                                          <b>Invoice Number:</b> ${invoice_id} <br/>                                         
                                          <b>Customer Name:</b> ${first_name} ${last_name} <br/>
                                          <b>Telephone Number:</b> ${phone_number} <br/>
                                          <b>Vehicle Year:</b> ${year} <br/>
                                          <b>Vehicle Make:</b> ${make} <br/>
                                          <b>Vehicle Model:</b> ${model} <br/>
                                          <b>Vehicle Color:</b> ${color} <br/>
                                          <b>Service Type:</b> ${service_type} <br/>
                                          <b>Location Origin:</b> ${start_address} <br/>
                                          <b>Location Destination:</b> ${end_address} <br/>
                                          <b>Amount:</b> $ ${amount} <br/>
                                          <b>Time of Payment:</b> ${date_paid} (Central Daylight Time)<br/>
                                          <b>VIN:</b> Not Provided <br/>
                                        </p>                                        
                                      </td>
                                    </tr>                                    
                                    <tr>
                                      <td>
                                        <p>Thank you <br/>Dispatch Team</p>                                        
                                        <p>
                                          Roadside Assistance Limited <br/>
                                          3753 Howard Hughes Parkway <br/>
                                          Suite 200 <br/>
                                          Las Vegas, NV 89169 <br/>
                                          <img src="${process.env.PAYMENTLINK}images/logo.png" height="65" width="90" />
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                  </html>
        `;

        if (status === 'Paid') {
          return await sendEmail(payment_email, mail_subject, mail_message, mail_subject);          
        } else {
          console.log('Customer has not paid yet!');
          return false;
        }        
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }

}

const sendPaymentLinkEmail = async (invoice_id) => {
  const InvoiceModel = require('../models/Invoice');

  try {
    const response = await InvoiceModel.getInvoiceById(invoice_id);
    console.log(response.result[0].invoice_id);
    if (response.result.length <= 0) {
      return false;
    } else {
      // Get the invoice details
      const info = await InvoiceModel.getInvoiceByInvoiceId(invoice_id);

      if (info.result.length <= 0) {
        return false;
      } else {
        const { status, payment_email, first_name, last_name, phone_number, service_type, model, color, make, year, start_address, end_address, amount, date_payment } = info.result[0];
        const paymentUrl = `${process.env.PAYMENTLINK}payment/${invoice_id}`;
        const mail_subject = 'Payment Link For Roadside Assistance';
        const mail_message = `
                    <html>
                    <head>
                      <title>Payment Link For Roadside Assistance</title>
                    </head>
                    <body>
                        <table>
                            <tr>
                                <td>
                                  <table>
                                    <tr>                                
                                      <td>Hello ${first_name},</td>                                  
                                    </tr>
                                    <tr>                                  
                                      <td>
                                      <p>
                                      <b>Invoice Number:</b> ${invoice_id} <br/>                                         
                                      <b>You can pay for your Tow @ this link:</b> ${paymentUrl} <br/>
                                      <b>Service Type:</b> ${service_type} <br/>                                      
                                      <b>Amount:</b> $ ${amount} <br/>                                      
                                    </p>
                                      </td>
                                    </tr>                                    
                                    <tr>
                                      <td>
                                        <p>Thank you <br/>Dispatch Team</p>                                        
                                        <p>
                                          Roadside Assistance Limited <br/>
                                          3753 Howard Hughes Parkway <br/>
                                          Suite 200 <br/>
                                          Las Vegas, NV 89169 <br/>
                                          <img src="${process.env.PAYMENTLINK}images/logo.png" height="65" width="90" />
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                  </html>
        `;
        return await sendEmail(payment_email, mail_subject, mail_message, mail_subject);        
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

const resendPaymentLinkEmail = async (invoice_id) => {
  const InvoiceModel = require('../models/Invoice');

  try {
    const response = await InvoiceModel.getInvoiceById(invoice_id);
    console.log(response.result[0].invoice_id);
    if (response.result.length <= 0) {
      return false;
    } else {
      // Get the invoice details
      const info = await InvoiceModel.getInvoiceByInvoiceId(invoice_id);

      if (info.result.length <= 0) {
        return false;
      } else {
        const { status, payment_email, first_name, last_name, phone_number, service_type, model, color, make, year, start_address, end_address, amount, date_payment } = info.result[0];
        const paymentUrl = `${process.env.PAYMENTLINK}payment/${invoice_id}`;
        const mail_subject = 'Payment Link For Roadside Assistance';
        const mail_message = `
                    <html>
                    <head>
                      <title>Payment Link For Roadside Assistance</title>
                    </head>
                    <body>
                        <table>
                            <tr>
                                <td>
                                  <table>
                                    <tr>                                
                                      <td>Hello ${first_name},</td>                                  
                                    </tr>
                                    <tr>                                  
                                      <td>
                                        <p><b>You can pay for your service using the following link:</b> ${paymentUrl}</p>                                                                               
                                      </td>
                                    </tr>                                    
                                    <tr>
                                      <td>
                                        <p>Thank you <br/>Dispatch Team</p>                                        
                                        <p>
                                          Roadside Assistance Limited <br/>
                                          3753 Howard Hughes Parkway <br/>
                                          Suite 200 <br/>
                                          Las Vegas, NV 89169 <br/>
                                          <img src="${process.env.PAYMENTLINK}images/logo.png" height="65" width="90" />
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                  </html>
        `;
        return await sendEmail(payment_email, mail_subject, mail_message, mail_subject);        
      }
    }
  } catch (error) {
    console.log(error);
    return false;
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
    let response = await request(apicall);
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

module.exports = { 
                    sendSMS, 
                    sendEmail, 
                    checkLocalTime, 
                    calculateDistance, 
                    sendPaymentConfirmationEmail,
                    sendPaymentLinkEmail,
                    resendPaymentLinkEmail,
                    sendPaymentLinkSMS 
                  };