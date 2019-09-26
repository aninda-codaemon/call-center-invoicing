const express = require('express');
const InvoiceModel = require('../models/Invoice');
const PaymentModel = require('../models/Payment');
const UserModel = require('../models/User');
const fetch = require('node-fetch');
var md5 = require('md5');
const router = express.Router();
const date = require('date-and-time');

// Payment Gareway Anywhere Commerce Params
const TERMINALID = process.env.TERMINALID;
const secret = process.env.secret;

router.get('/payment-status', async (req, res) => {
    // Get parameters from payment status redirect url
    const dl_number = req.query.DL_NUMBER;
    const dl_state = req.query.DL_STATEken;
    const post_code = req.query.POSTCODE;
    const state = req.query.STATE;
    const invoice_id = req.query.ORDERID;  // Invoice Id send with Payment
    const amount = req.query.AMOUNT;
    const region = req.query.REGION;
    const terminal_id = req.query.TERMINALID;
    const city = req.query.CITY;
    const response_text = req.query.RESPONSETEXT;
    const response_code = req.query.RESPONSECODE;
    const approval_code = req.query.APPROVALCODE;
    const avs_response = req.query.AVSRESPONSE;
    const cvv_response = req.query.CVVRESPONSE;
    const date_time = req.query.DATETIME;
    const unique_ref = req.query.UNIQUEREF;
    const email = req.query.EMAIL;
    const card_number = req.query.CARDNUMBER;
    const hash = req.query.HASH;
    const total_response = req.protocol + '://' + req.get('host') + req.originalUrl;
    //console.log(total_response);
    var contextFlag = 0;
    var responseText = ''

    let newPaymentResponse = {
        invoice_id, dl_number, dl_state, post_code, state, region, amount, terminal_id, city,
        response_text, response_code, approval_code, avs_response, cvv_response,
        unique_ref, email, card_number, hash, total_response, date_time
    };

    const paymentResponseStored = await PaymentModel.getPaymentResponseExists(invoice_id, unique_ref);
    //console.log(paymentResponseStored.result);
    if (paymentResponseStored.result.length == 0) {
        const payment = await PaymentModel.savePaymentResponse(newPaymentResponse);
        console.log(payment.result);
        if (response_text.length == 6 && response_code == 'A' ) {
            contextFlag = 1;
             responseText = "Payment Successfully Complete";
        } else {
            contextFlag = 2;
            responseText = "Payment Failed";
        }
        res.render('payment/payment-response', { responseText, contextFlag });

    } else {
        contextFlag = 3;
        responseText = "Payment already processed";
        res.render('payment/payment-response', { responseText, contextFlag });
    }
});

router.get('/:invoicenumber', async (req, res) => {
    const invoice_number = req.params.invoicenumber;
    if (invoice_number != 0 && invoice_number != '' && invoice_number < 1011290101) {
        const invalidInvoice = "Invalid Invoice Number";
        res.render('payment/invoice-not-found', { invalidInvoice });
    }
    const isResponse = await InvoiceModel.getInvoiceById(invoice_number);
    const timeNow = new Date();
    if (isResponse.error) {
        return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
    } else if (isResponse.result && isResponse.result.length > 0) {

        const response = await InvoiceModel.getInvoiceByInvoiceId(invoice_number);

        const time_differ = diff_minutes(response.result[0].date_edit_timestamp, timeNow);
        const amount = Number(response.result[0].amount).toFixed(2);
        const conv_amount = 3.5;
        const sub_total_deduct = Number((response.result[0].amount * conv_amount) / 100).toFixed(2);
        const sub_total = Number(amount - sub_total_deduct);

        // Anywherecommerce payment parameters
        const CURRENCY = 'USD';
        const ORDERID = invoice_number;
        const AMOUNT = '01';//amount;
        const AUTOREADY = 'Y';
        const DATETIME = date.format(response.result[0].date_edit_timestamp, 'DD-MM-YYYY:HH:MM:SS:SSS');
        const RECEIPTPAGEURL = 'http://ec2-18-217-104-6.us-east-2.compute.amazonaws.com/payment/payment-status';
        const HASH = md5(TERMINALID + ORDERID + AMOUNT + DATETIME + RECEIPTPAGEURL + secret);

        if (response.error) {
            return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
        }
        //  else if (time_differ > 10) {
        //      res.render('payment/expired', { time_differ, invoice_number });
        //  } 
        else {
            res.render('payment/index',
                {
                    response: response.result,
                    sub_total_deduct,
                    sub_total, HASH,
                    DATETIME,
                    AMOUNT,
                    RECEIPTPAGEURL
                });
        }
    }
});

function diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}

module.exports = router;
