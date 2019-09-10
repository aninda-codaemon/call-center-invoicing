const express = require('express');

const { sendSMS } = require('../helpers/helpers');

const authMiddleware = require('../middleware/auth');
const UserModel = require('../models/User');
const InvoiceModel = require('../models/Invoice');

const router = express.Router();

// @route     GET /api/order/send-sms
// @desc      Dummy send SMS
// @access    Public
router.get('/send-sms', async (req, res) => {
  sendSMS();
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
    return res.status(500).json({ errors: [{msg: 'Internal server error!'}] });
  } else {
    const msa_price = await InvoiceModel.getPriceForMSA(msa.result[0]['msa_id']);

    if (msa_price.error) {
      return res.status(500).json({ errors: [{msg: 'Internal server error!'}] });
    } else {
      const pricing = msa_price.result[0];
      const over_miles_price = parseFloat(pricing['per_mile_rate_over_ten_miles'].replace('$', ''));
      const chargable_miles = total_distance - 10;
      const service_charges = 3.5/100;
      let base_price = 0.00;
      let net_price = 0.00;
      let total_price = 0.00;

      if (service_type === 'towing') {
        base_price = parseFloat(pricing['retail_tow_rate'].replace('$', ''));

        // Price calculation
        if (total_distance > 10) {
          net_price = base_price + ((total_distance - 10) * over_miles_price);
        } else {
          net_price = base_price;
        }
      } else {
        base_price = parseFloat(pricing['retail_light_service_rate'].replace('$', ''));
        net_price = base_price;
      }

      net_price = net_price + additional_charges;
      total_price = parseFloat(net_price + (net_price * service_charges), 2).toFixed(2);

      return res.status(200).json({ errors: [], data: {
        msg: 'Total price',
        base_price,
        total_price,
        net_price,        
        service_charges,
        system: pricing['system']
      }});
    }    
  }
});

module.exports = router;