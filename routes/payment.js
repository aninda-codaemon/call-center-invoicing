const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const InvoiceModel = require('../models/Invoice');
const authMiddleware = require('../middleware/auth');
const UserModel = require('../models/User');

const router = express.Router();

router.get('/:invoiceid', async (req, res) => {
    const invoice_number = req.params.invoicenumber || '1011290101';
    const isResponse = await InvoiceModel.getInvoiceById(invoice_number);
    if (isResponse.error) {
        return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
    } else if (isResponse.result && isResponse.result.length > 0) {
        const response = await InvoiceModel.getInvoiceByInvoiceId(invoice_number);

        if (response.error) {
            return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
        } else {
            res.render('payment/index', { response: response.result });
            //return res.status(200).json({ errors: [], data: { msg: 'Invoice details', response: response.result } });
        }
    }
});

module.exports = router;