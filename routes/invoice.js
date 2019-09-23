const express = require('express');
const { check, validationResult } = require('express-validator');
const { sendSMS, sendEmail, checkLocalTime } = require('../helpers/helpers');
const authMiddleware = require('../middleware/auth');
const UserModel = require('../models/User');
const InvoiceModel = require('../models/Invoice');
var shortUrl = require('node-url-shortener');
const json2csv = require('json2csv').parse;
var fs = require('fs');

const router = express.Router();

// @route     GET /api/order/send-sms
// @desc      Dummy send SMS
// @access    Public
router.get('/send-sms', async (req, res) => {
	sendSMS('From TWILIO account test for SMS!');
	res.send('SMS Twilio');
});

// @route     GET /api/order/send-mail
// @desc      Dummy send Mail
// @access    Public
router.get('/sendEmail', async (req, res) => {
	const payment_email = req.body.paymentemail;
	const first_name = req.body.fname;
	const service_type = req.body.servicetype;

	const receiver = payment_email;
	const mail_subject = 'Reg. Link to pay for your Service Request';
	const mail_message = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
	<meta charset="utf-8"> <!-- utf-8 works for most cases -->
	<meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
	<meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->
	<title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->

	<link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">
	<!-- CSS Reset : BEGIN -->
	<style>
		/* What it does: Remove spaces around the email design added by some email clients. */
		/* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
		html,
		body {
			margin: 0 auto !important;
			padding: 0 !important;
			height: 100% !important;
			width: 100% !important;
			background: #f1f1f1;
		}

		/* What it does: Stops email clients resizing small text. */
		* {
			-ms-text-size-adjust: 100%;
			-webkit-text-size-adjust: 100%;
		}

		/* What it does: Centers email on Android 4.4 */
		div[style*="margin: 16px 0"] {
			margin: 0 !important;
		}

		/* What it does: Stops Outlook from adding extra spacing to tables. */
		table,
		td {
			mso-table-lspace: 0pt !important;
			mso-table-rspace: 0pt !important;
		}

		/* What it does: Fixes webkit padding issue. */
		table {
			border-spacing: 0 !important;
			border-collapse: collapse !important;
			table-layout: fixed !important;
			margin: 0 auto !important;
		}

		/* What it does: Uses a better rendering method when resizing images in IE. */
		img {
			-ms-interpolation-mode: bicubic;
		}

		/* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
		a {
			text-decoration: none;
		}

		/* What it does: A work-around for email clients meddling in triggered links. */
		*[x-apple-data-detectors],
		/* iOS */
		.unstyle-auto-detected-links *,
		.aBn {
			border-bottom: 0 !important;
			cursor: default !important;
			color: inherit !important;
			text-decoration: none !important;
			font-size: inherit !important;
			font-family: inherit !important;
			font-weight: inherit !important;
			line-height: inherit !important;
		}

		/* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
		.a6S {
			display: none !important;
			opacity: 0.01 !important;
		}

		/* What it does: Prevents Gmail from changing the text color in conversation threads. */
		.im {
			color: inherit !important;
		}

		/* If the above doesn't work, add a .g-img class to any image in question. */
		img.g-img+div {
			display: none !important;
		}

		/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
		/* Create one of these media queries for each additional viewport size you'd like to fix */

		/* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
		@media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
			u~div .email-container {
				min-width: 320px !important;
			}
		}

		/* iPhone 6, 6S, 7, 8, and X */
		@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
			u~div .email-container {
				min-width: 375px !important;
			}
		}

		/* iPhone 6+, 7+, and 8+ */
		@media only screen and (min-device-width: 414px) {
			u~div .email-container {
				min-width: 414px !important;
			}
		}
	</style>
	<!-- CSS Reset : END -->
	<!-- Progressive Enhancements : BEGIN -->
	<style>
		.primary {
			background: #30e3ca;
		}

		.bg_white {
			background: #ffffff;
		}

		.bg_light {
			background: #fafafa;
		}

		.bg_black {
			background: #000000;
		}

		.bg_dark {
			background: rgba(0, 0, 0, .8);
		}

		.email-section {
			padding: 2.5em;
		}

		/*BUTTON*/
		.btn {
			padding: 10px 15px;
			display: inline-block;
		}

		.btn.btn-primary {
			border-radius: 5px;
			background: #30e3ca;
			color: #ffffff;
		}

		.btn.btn-white {
			border-radius: 5px;
			background: #ffffff;
			color: #000000;
		}

		.btn.btn-white-outline {
			border-radius: 5px;
			background: transparent;
			border: 1px solid #fff;
			color: #fff;
		}

		.btn.btn-black-outline {
			border-radius: 0px;
			background: transparent;
			border: 2px solid #000;
			color: #000;
			font-weight: 700;
		}

		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			font-family: 'Lato', sans-serif;
			color: #000000;
			margin-top: 0;
			font-weight: 400;
		}

		body {
			font-family: 'Lato', sans-serif;
			font-weight: 400;
			font-size: 15px;
			line-height: 1.8;
			color: rgba(0, 0, 0, .4);
		}

		a {
			color: #30e3ca;
		}

		table {}

		/*LOGO*/

		.logo h1 {
			margin: 0;
		}

		.logo h1 a {
			color: #30e3ca;
			font-size: 24px;
			font-weight: 700;
			font-family: 'Lato', sans-serif;
		}

		/*HERO*/
		.hero {
			position: relative;
			z-index: 0;
		}

		.hero .text {
			color: rgba(0, 0, 0, .3);
		}

		.hero .text h2 {
			color: #000;
			font-size: 40px;
			margin-bottom: 0;
			font-weight: 400;
			line-height: 1.4;
		}

		.hero .text h3 {
			font-size: 24px;
			font-weight: 300;
		}

		.hero .text h2 span {
			font-weight: 600;
			color: #30e3ca;
		}


		/*HEADING SECTION*/
		.heading-section {}

		.heading-section h2 {
			color: #000000;
			font-size: 28px;
			margin-top: 0;
			line-height: 1.4;
			font-weight: 400;
		}

		.heading-section .subheading {
			margin-bottom: 20px !important;
			display: inline-block;
			font-size: 13px;
			text-transform: uppercase;
			letter-spacing: 2px;
			color: rgba(0, 0, 0, .4);
			position: relative;
		}

		.heading-section .subheading::after {
			position: absolute;
			left: 0;
			right: 0;
			bottom: -10px;
			content: '';
			width: 100%;
			height: 2px;
			background: #30e3ca;
			margin: 0 auto;
		}

		.heading-section-white {
			color: rgba(255, 255, 255, .8);
		}

		.heading-section-white h2 {
			font-family:
				line-height: 1;
			padding-bottom: 0;
		}

		.heading-section-white h2 {
			color: #ffffff;
		}

		.heading-section-white .subheading {
			margin-bottom: 0;
			display: inline-block;
			font-size: 13px;
			text-transform: uppercase;
			letter-spacing: 2px;
			color: rgba(255, 255, 255, .4);
		}


		ul.social {
			padding: 0;
		}

		ul.social li {
			display: inline-block;
			margin-right: 10px;
		}

		/*FOOTER*/

		.footer {
			border-top: 1px solid rgba(0, 0, 0, .05);
			color: rgba(0, 0, 0, .5);
		}

		.footer .heading {
			color: #000;
			font-size: 20px;
		}

		.footer ul {
			margin: 0;
			padding: 0;
		}

		.footer ul li {
			list-style: none;
			margin-bottom: 10px;
		}

		.footer ul li a {
			color: rgba(0, 0, 0, 1);
		}


		@media screen and (max-width: 500px) {}
	</style>
</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
	<center style="width: 100%; background-color: #f1f1f1;">
		<div
			style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
			&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
		</div>
		<div style="max-width: 600px; margin: 0 auto;" class="email-container">
			<!-- BEGIN BODY -->
			<table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
				style="margin: auto;">
				<tr>
					<td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;">
						<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td class="logo" style="text-align: center;">
									<h1><a href="#">e-Payment</a></h1>
								</td>
							</tr>
						</table>
					</td>
				</tr><!-- end tr -->
				<tr>
					<td valign="left" class="hero bg_white" style="padding: 2em 0 4em 0;">
						<table>
							<tr>
								<td>
									<div class="text" style="padding: 0 2.5em; text-align: center;">
										<p>Hello Test Demo,</p>
										<p>You can pay for your Tow @ this link:</p>
										<p>Service Type: Fuel/Fluids</p>
										<p><b>Amount: $ 0.01</b></p>
										<h2>Invoice Number: 974790286</h2>
										<h3>https://paymenttest.towpanda.com/pay?invoice=974790286</h3>
										<p><a href="https://paymenttest.towpanda.com/pay?invoice=974790286"
												target="_blank" class="btn btn-primary">Pay Now!
											</a></p>
									</div>
								</td>
							</tr>
						</table>
					</td>
				</tr><!-- end tr -->
				<tr>
					<td valign="left" class="hero bg_white" style="padding: 3em 0 2em 0;">
						<img src="../client/src/assets/img/logo.png" alt=""
							style="width: 300px; max-width: 600px; height: auto; margin: auto; display: block;">
					</td>
				</tr><!-- end tr -->

				<!-- 1 Column Text + Button : END -->
			</table>
			<table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
				style="margin: auto;">
				<tr>
					<td valign="middle" class="bg_light footer email-section">
						<p>Thank you.</p>
						<p>Regards</p>
						<p>Roadside Assistance.</p>
					</td>
				</tr><!-- end: tr -->
				<tr>
					<td class="bg_light" style="text-align: center;">
						<p>Footer Copy Right Text<a href="#" style="color: rgba(0,0,0,.8);">Link</a></p>
					</td>
				</tr>
			</table>

		</div>
	</center>
</body>

</html>`;
	sendEmail(receiver, mail_subject, mail_message);
	res.send('Mail Sendgrid');
});

// @route     POST /api/order/pricing
// @desc      Get total pricing
// @access    Private
router.post('/pricing', [authMiddleware, [
	check('ozip', 'Please enter a valid origin zipcode').not().isEmpty(),
	check('servicetype', 'Please enter service type').not().isEmpty(),
	check('lat', 'Please enter origin latitude').not().isEmpty(),
	check('lng', 'Please enter origin longitude').not().isEmpty()
]], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const origin_zipcode = req.body.ozip.toString();
	const total_distance = parseFloat(req.body.tmiles) || 0.00;
	const destination_zipcode = req.body.dzip.toString();
	const service_type = req.body.servicetype.toString();
	const additional_charges = parseFloat(req.body.addlcharges) || 0.00;
	const lat = req.body.lat.toString() || '40.7176546';
	const lng = req.body.lng.toString() || '-73.7197139';
	const timestamp = req.body.timestamp;
	const msa = await InvoiceModel.getMsaFromZip(origin_zipcode);

	if (msa.error) {
		return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
	} else {
		if (msa.result.length > 0) {
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
				let hour = 0;
				let min = 0;
				let night_charges = 0.00;

				// Check local time
				const local_time = await checkLocalTime(lat, lng);

				if (local_time !== null) {
					console.log(`Local time is: ${local_time.hour}:${local_time.min}`);
					hour = parseInt(local_time.hour);
					min = parseInt(local_time.min);
				} else {
					hour = 7;
					min = 0;
				}

				// Calculate night time charges
				if (hour >= 20 && hour <= 23) {
					night_charges = 9.00;
				} else if (hour >= 0 && hour < 7) {
					night_charges = 13.00;
				} else {
					night_charges = 0.00;
				}

				if (service_type === 'towing') {
					// Base rate calculation on location timestamp pending. 
					base_price = parseFloat((parseFloat(pricing['retail_tow_rate'].replace('$', '')) + night_charges).toFixed(2));

					// Price calculation
					if (total_distance > 10) {
						net_price = base_price + ((total_distance - 10) * over_miles_price);
					} else {
						net_price = base_price;
					}
				} else {
					// Base rate calculation on location timestamp pending.
					base_price = parseFloat(pricing['retail_light_service_rate'].replace('$', '')) + night_charges;
					net_price = base_price;
				}

				net_price = parseFloat((net_price + additional_charges).toFixed(2));
				total_price = parseFloat((net_price + (net_price * service_charges)).toFixed(2));

				return res.status(200).json({
					errors: [], data: {
						msg: 'Total price',
						base_price,
						total_price,
						net_price,
						service_charges,
						system: pricing['system'],
						night_charges
					}
				});
			}
		} else {
			return res.status(400).json({ errors: [{ msg: 'No service for this location' }] });
		}
	}
});

// @route     GET /api/order/getInvoiceNumber
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
	check('userid', 'Invalid user/agent').not().isEmpty(),
	//check('timestamp', 'Invalid time stamp').isEmpty()
]], async (req, res) => {

	const mode = req.body.mode;
	const invoice_number = req.body.invoicenumber;
	const errors = validationResult(req);
    const timeNow = new Date(); // Future scopre param

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { invoicenumber, fname, lname, phone, year, make, model, color, servicetype, problemtype,
		anyonewithvehicle, keysforvehicle, fourwheelsturn, frontwheelsturn, backwheelsturn,
		neutral, fueltype, pickuplocation, pickupnotes, originzipcode, destinationzipcode, totaldistance,
		calculatedcost, baseprice, additionalprice, paymentamount, paymenttotalamount, paymentemail, sendpaymentto, userid } = req.body;

	const response = await InvoiceModel.getInvoiceById(invoice_number);

	if (response.error) {
		return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
	} else if (response.result && response.result.length > 0) {
		let newInvoice = {
			invoicenumber, fname, lname, phone, year, make, model, color, servicetype, problemtype,
			anyonewithvehicle, keysforvehicle, fourwheelsturn, frontwheelsturn, backwheelsturn,
			neutral, fueltype, pickuplocation, pickupnotes, originzipcode, destinationzipcode, totaldistance,
			calculatedcost, baseprice, additionalprice, paymentamount, paymenttotalamount, paymentemail, sendpaymentto, userid
		};

		// Create payment short url
		const paymentUrl = getShortUrl(paymenttotalamount);
        if(mode == 'add'){
			if (sendpaymentto == "phone") {
				// SMS send process here
				sendSMS('Complete your payment ' + paymentUrl);
			} else {
				// Email sent process here
				sendEmail(paymentemail, fname, servicetype);
			}
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


// @route     GET /api/order/:invoice id
// @desc      Get new invoice number
// @access    Private
router.get('/:invoicenumber', authMiddleware, async (req, res) => {
	const invoice_number = req.params.invoicenumber;
	const isResponse = await InvoiceModel.getInvoiceById(invoice_number);
	if (isResponse.error) {
		return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
	} else if (isResponse.result && isResponse.result.length > 0) {
		const response = await InvoiceModel.getInvoiceByInvoiceId(invoice_number);

		if (response.error) {
			return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
		} else {
			return res.status(200).json({ errors: [], data: { msg: 'Invoice details', response: response.result } });
		}
	}
});


// @route     GET /api/order
// @desc      Get user list/by param order
// @access    Private
router.get('/', authMiddleware, async (req, res) => {
	let csv;
	const csvFilePath = './csvdownload/invoice_' + Date.now() + '.csv';
	const csvFields = [
		'Invoice Number', 'First Name', 'Last Name', 'Payment Email', 'Phone Number', 'Service Type', 'Problem Type',
		'Total Amount', 'Total Distance', 'Payment Status', 'Start Address', 'End Address', 'Origin Zip', 'Destination Zip', 'Sms Sent', 'Email Sent',
		'Pickup Location', 'Car Model', 'Car Color', 'Car Make', 'Car Year', 'Anyone With Vehicle', 'Keys Available', 'Four Wheels Turn',
		'Back Wheels Turn', 'Front Wheels Turn', 'Is InNeutral', 'Fuel Type', 'Pick Notes', 'Date Open Fulled', 'Date Opened Timestamp',
		'Date Edit Timestamp', 'User Id', 'MSA System', 'Dispatcher System', 'Payment Link Sent To'];

	const user_id = req.body.userid || 2;
	// Pagination
	const sortBy = req.body.sort_by || 'invoice_id';
	const sortOrder = req.body.sort_order || 'ASC';
	const searchTerm = req.body.search_term || '';
	const fetchPage = req.body.fetch_page || 1;
	const perPage = req.body.per_page || 10;
	const is_export = req.body.isexport || 0;
	let searchQuery = '';

	const invoices = await InvoiceModel.getAllInvoice(user_id);
	total_invoices = invoices.result.length;
	total_pages = parseInt(Math.ceil(total_invoices / perPage));
	start_page = (perPage * (fetchPage - 1));
	next_start = (perPage * fetchPage);
	next_page = 0; // Count for next page records

	if (searchTerm !== '') {
		searchQuery = `AND (first_name LIKE "%${searchTerm.toLowerCase()}%" 
    OR last_name LIKE "%${searchTerm.toLowerCase()}%" 
    OR payment_email LIKE "%${searchTerm.toLowerCase()}%"
    OR phone_number LIKE "%${searchTerm.toLowerCase()}%"
    OR year LIKE "%${searchTerm.toLowerCase()}%"
    OR make LIKE "%${searchTerm.toLowerCase()}%"
    OR model LIKE "%${searchTerm.toLowerCase()}%"
    OR color LIKE "%${searchTerm.toLowerCase()}%"
    OR service_type LIKE "%${searchTerm.toLowerCase()}%"
    OR problem_type LIKE "%${searchTerm.toLowerCase()}%"
    OR status LIKE "%${searchTerm.toLowerCase()}%"
    OR dispatcher_system LIKE "%${searchTerm.toLowerCase()}%"
    OR pickup_location LIKE "%${searchTerm.toLowerCase()}%"
    OR pickup_location LIKE "%${searchTerm.toLowerCase()}%"
    OR anyone_with_vehicle LIKE "%${searchTerm.toLowerCase()}%"
    OR keys_for_vehicle LIKE "%${searchTerm.toLowerCase()}%"
    OR four_wheels_turn LIKE "%${searchTerm.toLowerCase()}%" 
    OR front_wheels_turn LIKE "%${searchTerm.toLowerCase()}%"
    OR back_wheels_turn LIKE "%${searchTerm.toLowerCase()}%"
    OR is_neutral LIKE "%${searchTerm.toLowerCase()}%"
    OR fuel_type LIKE "%${searchTerm.toLowerCase()}%"
    OR pickup_notes LIKE "%${searchTerm.toLowerCase()}%" 
    OR start_address LIKE "%${searchTerm.toLowerCase()}%"
    OR end_address LIKE "%${searchTerm.toLowerCase()}%"
    OR origin_zipcode LIKE "%${searchTerm.toLowerCase()}%"
    OR destination_zipcode LIKE "%${searchTerm.toLowerCase()}%"
    OR amount LIKE "%${searchTerm.toLowerCase()}%"
    OR distance LIKE "%${searchTerm.toLowerCase()}%")`;
	}
	const sql_query = `SELECT * FROM user_invoice WHERE user_id=${user_id} ${searchQuery} ORDER BY ${sortBy} ${sortOrder} LIMIT ${start_page},${perPage}`;
	console.log(sql_query);
	dataArray = await InvoiceModel.getSortedInvoices(sql_query); // perPage, start_page

	if (invoices.error) {
		return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
	} else {
		if (is_export) {
			try {
				csv = json2csv(dataArray.result, { csvFields });
			} catch (err) {
				return res.status(500).json({ err });
			}

			// Write .csv file inside csvdownload folder
			fs.writeFile(csvFilePath, csv, function (err) {
				if (err) {
					return res.json(err).status(500);
				}
				else {
					setTimeout(function () {
						fs.unlink(csvFilePath, function (err) { // delete file after 30 sec
							if (err) {
								console.error(err);
							}
							console.log('File has been Deleted');
						});

					}, 30000);
					res.download(csvFilePath);
				}
			})
		}
		return res.status(200).json({
			errors: [], data: {
				msg: 'Invoice List',
				invoices: dataArray.result,
				total_invoices,
				fetchPage,
				perPage,
				start_page,
				next_start,
				next_page
			}
		});
	}
});

module.exports = router;