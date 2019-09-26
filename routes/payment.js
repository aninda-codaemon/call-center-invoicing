const express = require('express');
const InvoiceModel = require('../models/Invoice');
const UserModel = require('../models/User');
const fetch = require('node-fetch');
var md5 = require('md5');
const router = express.Router();
const date = require('date-and-time');

router.get('/:invoiceid', async (req, res) => {
    const invoice_number = req.query.invoicenumber;
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
        const TERMINALID = '2994001';
        const CURRENCY = 'USD';
        const ORDERID = invoice_number;
        const AMOUNT = '01';//amount;
        const AUTOREADY = 'Y';
        const DATETIME = date.format(response.result[0].date_edit_timestamp, 'DD-MM-YYYY:HH:MM:SS:SSS');
        const RECEIPTPAGEURL = 'http://18.217.104.6/payment/payment_status';
        const secret = 'password';
        const HASH = md5(TERMINALID + ORDERID + AMOUNT + DATETIME + RECEIPTPAGEURL + secret);
        //console.log(HASH);
        //console.log(DATETIME);

        if (response.error) {
            return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
        }
        // else if (time_differ > 10) {
        //     res.render('payment/expired', { time_differ, invoice_number });
        // } 
        else {
            res.render('payment/index', 
            { response: response.result, 
                sub_total_deduct, 
                sub_total, HASH, 
                DATETIME,
                AMOUNT,
                RECEIPTPAGEURL });
            }
    }
});

function diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}

router.get('/payment_status',  (req, res) => {
    console.log('Payment status page');
    res.render('payment/payment_status'); 
});

router.get('/pay_dummy', (req, res) => {
  res.send('Pay dummy page');
});

module.exports = router;

