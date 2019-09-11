const express = require('express');
const { check, validationResult } = require('express-validator');
const { sendSMS } = require('../helpers/helpers');
const authMiddleware = require('../middleware/auth');
const UserModel = require('../models/User');
const InvoiceModel = require('../models/Invoice');
var shortUrl = require('node-url-shortener');

const router = express.Router();

// @route     GET /api/order/send-sms
// @desc      Dummy send SMS
// @access    Public
router.get('/send-sms', async (req, res) => {
  sendSMS('From TWILIO account test for SMS!');
  res.send('SMS Twilio');
});

// @route     POST /api/order/pricing
// @desc      Get total pricing
// @access    Private
router.post('/pricing', authMiddleware, async (req, res) => {
  const origin_zipcode = req.body.ozip;
  const total_distance = req.body.tmiles;
  const destination_zipcode = req.body.dzip;
  const service_type = req.body.servicetype;
  const additional_charges = req.body.addlcharges || 0.00;
  const timestamp = req.body.timestamp;

  const msa = await InvoiceModel.getMsaFromZip(origin_zipcode);

  if (msa.error) {
    return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
  } else {
    const msa_price = await InvoiceModel.getPriceForMSA(msa.result[0]['msa_id']);

    if (msa_price.error) {
      return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
    } else {
      const pricing = msa_price.result[0];
      const over_miles_price = parseFloat(pricing['per_mile_rate_over_ten_miles'].replace('$', ''));
      const chargable_miles = total_distance - 10;
      const service_charges = 3.5 / 100;
      let base_price = 0.00;
      let net_price = 0.00;
      let total_price = 0.00;

      if (service_type === 'towing') {
        // Base rate calculation on location timestamp pending. 
        base_price = parseFloat(pricing['retail_tow_rate'].replace('$', ''));

        // Price calculation
        if (total_distance > 10) {
          net_price = base_price + ((total_distance - 10) * over_miles_price);
        } else {
          net_price = base_price;
        }
      } else {
        // Base rate calculation on location timestamp pending.
        base_price = parseFloat(pricing['retail_light_service_rate'].replace('$', ''));
        net_price = base_price;
      }

      net_price = net_price + additional_charges;
      total_price = parseFloat(net_price + (net_price * service_charges), 2).toFixed(2);

      return res.status(200).json({
        errors: [], data: {
          msg: 'Total price',
          base_price,
          total_price,
          net_price,
          service_charges,
          system: pricing['system']
        }
      });
    }
  }
});

// @route     POST /api/order/getInvoiceNumber
// @desc      Get new invoice number
// @access    Private
router.get('/getInvoiceNumber', authMiddleware, async (req, res) => {
  const initialInvoiceId = 1011290101;
  const lastInvoice_Id = await InvoiceModel.getLastInvoiceNumber();
  let lastInvoiceId, newInvoiceId;
  if (lastInvoice_Id == null) {
    newInvoiceId = await InvoiceModel.getNewInvoiceNumber(initialInvoiceId);
  } else {
    lastInvoiceId = parseInt(lastInvoice_Id.result[0].invoice_id);
    newInvoiceId = await InvoiceModel.getNewInvoiceNumber(lastInvoiceId + 1);
  }
  return res.status(200).json({
    errors: [], data: {
      msg: 'Invoice id',
      newInvoiceId
    }
  });
});


// @route     POST /api/order/saveinvoice
// @desc      save invoice details
// @access    Private
router.post('/saveinvoice', [authMiddleware, [
  check('invoicenumber', 'Invalid invoice number').not().isEmpty(),
  check('fname', 'Invalid first name').not().isEmpty(),
  check('lname', 'Invalid last name').not().isEmpty(),
  check('phone', 'Invalid phone number').not().isEmpty(),
  check('year', 'Invalid car year').not().isEmpty(),
  check('make', 'Invalid car make').not().isEmpty(),
  check('model', 'Invalid car make').not().isEmpty(),
  check('color', 'Invalid car color').not().isEmpty(),
  check('servicetype', 'Invalid service type').not().isEmpty(),
  check('problemtype', 'Invalid problem type').not().isEmpty(),
  check('anyonewithvehicle', 'Invalid anyone with the vehicle data').not().isEmpty(),
  check('keysforvehicle', 'Invalid keys for vehicle data').not().isEmpty(),
  check('fourwheelsturn', 'Invalid is four wheel turn data').not().isEmpty(),
  check('frontwheelsturn', 'Invalid is front wheel turn data').not().isEmpty(),
  check('backwheelsturn', 'Invalid is back wheel turn data').not().isEmpty(),
  check('neutral', 'Invalid is in nutral data').not().isEmpty(),
  check('fueltype', 'Invalid fuel type entry').not().isEmpty(),
  check('pickuplocation', 'Invalid pickup location').not().isEmpty(),
  check('pickupnotes', 'Invalid pickup notes').not().isEmpty(),
  check('originzipcode', 'Invalid origin zipcode').not().isEmpty(),
  check('destinationzipcode', 'Invalid destination zipcode').not().isEmpty(),
  check('totaldistance', 'Invalid total distance').not().isEmpty(),
  check('calculatedcost', 'Invalid calculated cost').not().isEmpty(),
  check('baseprice', 'Invalid base price').not().isEmpty(),
  check('additionalprice', 'Invalid additional charges').not().isEmpty(),
  check('paymentamount', 'Invalid payment amount').not().isEmpty(),
  check('paymenttotalamount', 'Invalid payment total amount').not().isEmpty(),
  check('paymentemail', 'Invalid payment email').isEmail(),
  check('sendpaymentto', 'Invalid send payment link send type').not().isEmpty(),
  //check('timestamp', 'Invalid time stamp').isEmpty()
]], async (req, res) => {

  const invoice_number = req.body.invoicenumber;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { invoicenumber, fname, lname, phone, year, make, model, color, servicetype, problemtype,
    anyonewithvehicle, keysforvehicle, fourwheelsturn, frontwheelsturn, backwheelsturn,
    neutral, fueltype, pickuplocation, pickupnotes, originzipcode, destinationzipcode, totaldistance,
    calculatedcost, baseprice, additionalprice, paymentamount, paymenttotalamount, paymentemail, sendpaymentto } = req.body;

  const response = await InvoiceModel.getInvoiceById(invoice_number);

  if (response.error) {
    return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
  } else if (response.result && response.result.length > 0) {
    let newInvoice = {
      invoicenumber, fname, lname, phone, year, make, model, color, servicetype, problemtype,
      anyonewithvehicle, keysforvehicle, fourwheelsturn, frontwheelsturn, backwheelsturn,
      neutral, fueltype, pickuplocation, pickupnotes, originzipcode, destinationzipcode, totaldistance,
      calculatedcost, baseprice, additionalprice, paymentamount, paymenttotalamount, paymentemail, sendpaymentto
    };

    // Create payment short url
    const paymentUrl = getShortUrl(paymenttotalamount);

    if (sendpaymentto == "phone") {
      // SMS send process here
      sendSMS('Complete your payment ' + paymentUrl);
    } else {
      // Email sent process here
    }

    const invoice = await InvoiceModel.saveInvoice(newInvoice);

    if (invoice.error) {
      return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
    } else {
      return res.status(200).json({ errors: [], data: { msg: 'Invoice details successfully saved', invoice: invoice.result } });
    }
  }


});


function getShortUrl(urlParam) {
  shortUrl.short('https://www.paypal.com/in/home/'.urlParam, function (err, url) {
    return url;
  });
}


module.exports = router;