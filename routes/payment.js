const express = require('express');
const InvoiceModel = require('../models/Invoice');
const PaymentModel = require('../models/Payment');
const UserModel = require('../models/User');
const fetch = require('node-fetch');
var md5 = require('md5');
const router = express.Router();
const date = require('date-and-time');
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { sendSMS, sendEmail } = require('../helpers/helpers');

const invoice = {
    shipping: {
        name: "John Doe",
        address: "1234 Main Street",
        city: "San Francisco",
        state: "CA",
        country: "US",
        postal_code: 94111
    },
    items: [
        {
            item: "TC 100",
            description: "Toner Cartridge",
            quantity: 2,
            amount: 6000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        }
    ],
    subtotal: 8000,
    paid: 0,
    invoice_nr: 1234
};

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

    if (paymentResponseStored.result.length == 0) {
        //const payment = await PaymentModel.savePaymentResponse(newPaymentResponse);
        var phraseResponseText = approval_code;
        var responsePhrase = phraseResponseText.indexOf('OK') !== -1 ? true : false;

        if (responsePhrase && (response_code == 'A' || response_code == 'E')) {

            // Update Invoice table after successfull payment
            const status = 'Paid';
            let updateInvoice = { invoice_id, status };
            const invoicePaymentSatus = await InvoiceModel.updateInvoicePaymentStatus(updateInvoice);
            const invoiceDataReceipt = await InvoiceModel.getInvoiceByInvoiceId(invoice_id);
            //console.log(JSON.stringify(invoiceDataReceipt.result));
            const pdfPath = './receiptpdf/receipt_' + invoice_id + '.pdf';
            createInvoice(invoiceDataReceipt.result, pdfPath);
            
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
        const AMOUNT = amount;
        const DATETIME = date.format(response.result[0].date_edit_timestamp, 'DD-MM-YYYY:HH:MM:SS:SSS');
        const RECEIPTPAGEURL = 'http://ec2-18-217-104-6.us-east-2.compute.amazonaws.com/payment/payment-status/';
        const HASH = md5(TERMINALID + ORDERID + AMOUNT + DATETIME + RECEIPTPAGEURL + secret);

        if (response.error) {
            return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
        }
        else if (time_differ > 10) {
            res.render('payment/expired', { time_differ, invoice_number });
        }
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
    } else {
        return res.status(500).json({ errors: [{ msg: 'Invoice Number does not exists!' }] });
    }
});

function diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}

function createInvoice(invoice, pdfPath) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });
    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(pdfPath));
}

function generateHeader(doc) {
    doc
        .image("./public/images/logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("Roadside Assistance", 110, 57)
        .fontSize(10)
        .text("Roadside Assistance", 200, 50, { align: "right" })
        .text("123 Main Street", 200, 65, { align: "right" })
        .text("New York, NY, 10025", 200, 80, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice Receipt", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Receipt Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice[0].invoice_id, 150, customerInformationTop)
        .font("Helvetica")
        .text("Receipt Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Total Amount Paid:", 50, customerInformationTop + 30)
        .text(
            formatCurrency(invoice[0].amount),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(invoice[0].first_name + " " + invoice[0].last_name, 300, customerInformationTop)
        .font("Helvetica")
        .text("Phone: " + invoice[0].phone_number, 300, customerInformationTop + 15)
        .text("Email: " + invoice[0].payment_email)
        .moveDown();

    generateHr(doc, 252);
}



function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Payment is due within 15 days. Thank you for your business.",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;
    const serviceCharge = (invoice[0].amount * 3.5) / 100;
    const subTotal = (invoice[0].amount - serviceCharge);
    const netTotal = invoice[0].amount;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Service",
        "Description",
        "Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");


    const position = invoiceTableTop + 1 * 30;
    generateTableRow(
        doc,
        position,
        invoice[0].service_type,
        invoice[0].problem_type,
        formatCurrency(subTotal)
    );

    generateHr(doc, position + 20);


    const subtotalPosition = invoiceTableTop + 2 * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "Service Charge :",
        "",
        formatCurrency(serviceCharge)
    );

    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        paidToDatePosition,
        "Total :",
        "",
        formatCurrency(netTotal)
    );


    doc.font("Helvetica");
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Thank you for your payment.",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateTableRow(doc, y, item, description, lineTotal) {
    console.log(y);
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(cents) {
    return "$" + cents;
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}

module.exports = router;
