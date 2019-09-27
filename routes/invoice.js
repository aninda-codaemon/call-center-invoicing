const express = require('express');
const moment = require('moment');
const { check, validationResult } = require('express-validator');
const shortUrl = require('node-url-shortener');
const json2csv = require('json2csv').parse;
const fs = require('fs');

const { sendSMS, sendEmail, checkLocalTime, calculateDistance } = require('../helpers/helpers');

const authMiddleware = require('../middleware/auth');
const UserModel = require('../models/User');
const InvoiceModel = require('../models/Invoice');

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
router.get('/send-mail', async (req, res) => {
	const receiver = req.param.receiver;
	const mail_subject = 'Reg. Link to pay for your Service Request';
	var mail_message = 'Test Body Message';
	console.log('mail body' + mail_message);
	sendEmail(receiver, mail_subject, mail_message, mail_subject);
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
	const origin = req.body.oaddress.toString() || '';
	const destination = req.body.daddress.toString() || '';
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
						const chargable_miles = Math.ceil(total_distance - 10);
						net_price = base_price + (chargable_miles * over_miles_price);
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
						night_charges,
						mileage: parseFloat((total_distance - 10).toFixed(2)),
						mileage_charges: over_miles_price
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
	const timeNow = new Date();

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
			calculatedcost, baseprice, additionalprice, paymentamount, paymenttotalamount, paymentemail, sendpaymentto, timeNow, userid,
		};

		// Create payment short url
		shortUrl.short('http://ec2-18-217-104-6.us-east-2.compute.amazonaws.com/payment/' + invoice_number, function (err, paymentUrl) {
			if (mode == 'add') {
				if (sendpaymentto == "phone") {
					// SMS send process here
					sendSMS('You can pay for your ' + servicetype + ' @ this link: ' + paymentUrl);
				} else {

					const mail_subject = 'Reg. Link to pay for your Service Request';

					const mail_message = `
                      <html>
                      <head>
                        <title>Forget Password</title>
                      </head>
                      <body>
                          <table>
                              <tr>
                                  <td>
                                    <table>
                                      <tr>                                
                                        <td>Hello ${fname},</td>                                  
                                      </tr>
                                      <tr>                                  
											<td>
												<p>
													<b>Invoice Number:</b> ${invoice_number}
												</p>
		                                         <p>
													<b>You can pay for your Tow @ this link: ${paymentUrl}</b>
												</p>
												<p>
													<b>Service Type:</b> ${servicetype}
												</p>
												<p>
													<b>Amount:</b> ${paymentamount}
												</p>
                                        </td>
                                      </tr>                                  
                                      <tr>
                                        <td><hr /></td>
                                      </tr>
                                      <tr>
                                        <td>Thank you</td>
                                      </tr>
                                    </table>
                                  </td>
                              </tr>
                          </table>
                      </body>
                    </html>
				`;
					sendEmail(paymentemail, mail_subject, mail_message, mail_subject);
				}
			}
		});


		const invoice = await InvoiceModel.saveInvoice(newInvoice);

		if (invoice.error) {
			return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
		} else {
			return res.status(200).json({ errors: [], data: { msg: 'Invoice details successfully saved', invoice: invoice.result } });
		}
	} else {
		return res.status(500).json({ errors: [{ msg: 'Invoice Number does not exists!' }] });
	}
});

// @route     POST /api/order/updateinvoice
// @desc      Update invoice details
// @access    Private
router.post('/updateinvoice', [authMiddleware, [
	check('invoice_id', 'Invalid invoice id').not().isEmpty(),
	check('first_name', 'Invalid first name').not().isEmpty(),
	check('last_name', 'Invalid last name').not().isEmpty(),
	check('phone_number', 'Invalid phone number').not().isEmpty(),
	check('year', 'Invalid car year').not().isEmpty(),
	check('make', 'Invalid car make').not().isEmpty(),
	check('model', 'Invalid car make').not().isEmpty(),
	check('color', 'Invalid car color').not().isEmpty(),
	check('status', 'Invalid status').not().isEmpty(),
	check('pickup_location', 'Invalid pickup location').not().isEmpty(),
	// check('pickup_notes', 'Invalid pickup notes').not().isEmpty(),
	// check('notes', 'Invalid notes').not().isEmpty(),
	check('amount', 'Invalid total amount').not().isEmpty(),
	check('payment_email', 'Invalid payment email').isEmail(),
	check('send_payment_to', 'Invalid send payment link send type').not().isEmpty()
]], async (req, res) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const {
		invoice_id,
		first_name,
		last_name,
		phone_number,
		year,
		make,
		model,
		color,
		status,
		pickup_location,
		pickup_notes,
		notes,
		amount,
		payment_email,
		send_payment_to
	} = req.body;

	const response = await InvoiceModel.getInvoiceById(invoice_id);

	if (response.error) {
		return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
	} else if (response.result && response.result.length > 0) {
		const formData = {
			invoice_id,
			first_name,
			last_name,
			phone_number,
			year,
			make,
			model,
			color,
			status,
			pickup_location,
			pickup_notes,
			notes,
			amount,
			payment_email,
			send_payment_to
		};

		const invoice = await InvoiceModel.updateInvoice(formData);

		if (invoice.error) {
			return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
		} else {
			return res.status(200).json({ errors: [], data: { msg: 'Invoice details successfully updated', invoice: invoice.result } });
		}
	}
});

// @route     POST /api/order/resendlink
// @desc      Re-send payment details
// @access    Private
router.post('/resendlink', [authMiddleware, [
	check('invoice_id', 'Invalid invoice id').not().isEmpty(),
	check('phone_number', 'Invalid phone number').not().isEmpty(),
	check('payment_email', 'Invalid payment email').isEmail(),
	check('send_payment_to', 'Invalid send payment link send type').not().isEmpty()
]], async (req, res) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { invoice_id, phone_number, payment_email, send_payment_to } = req.body;

	const response = await InvoiceModel.getInvoiceById(invoice_id);

	if (response.error) {
		return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
	} else if (response.result && response.result.length > 0) {
		console.log('Invoice Info');
		console.log(response.result[0]);
		const update = await InvoiceModel.updateLinkDate({ invoice_id, send_payment_to });

		const invoiceinfo = await InvoiceModel.getInvoiceByInvoiceId(invoice_id);

		if (invoiceinfo.error) {
			return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
		} else {
			const invoice = invoiceinfo.result[0];
			const date_opened = moment(invoice.date_opened_timestamp).format('ddd MMM D YYYY kk:mm:ss') + ' GMT ' + moment().format('Z');
			const date_first_link_send = moment(invoice.date_opened_timestamp).format('ddd MMM D YYYY kk:mm:ss') + ' GMT ' + moment().format('Z');
			const data_last_link_send = (invoice.date_edit_timestamp) ? moment(invoice.date_edit_timestamp).format('ddd MMM D YYYY kk:mm:ss') + ' GMT ' + moment().format('Z') : '';
			const data_payment_done = (invoice.date_payment) ? moment(invoice.date_payment).format('ddd MMM D YYYY kk:mm:ss') + ' GMT ' + moment().format('Z') : '';

			invoice.date_opened = date_opened;
			invoice.date_first_link_send = date_first_link_send;
			invoice.data_last_link_send = data_last_link_send;
			invoice.data_payment_done = data_payment_done;

			if (send_payment_to === 'Email') {				
				const emailTemplate = `
							<html>
							<head>
								<title>Forget Password</title>
							</head>
							<body>
									<table>
											<tr>
													<td>
														<table>
															<tr>                                
																<td>Hello ${invoice['first_name']},</td>                                  
															</tr>
															<tr>                                  
																<td>
																	<p>
																		<b>Invoice Number:</b> ${invoice_id}
																	</p>
																	<p>
																		<b>You can pay for your Tow @ this link: http://ec2-18-217-104-6.us-east-2.compute.amazonaws.com/payment/${invoice_id}</b>
																	</p>
																	<p>
																		<b>Service Type:</b> ${invoice.service_type}
																	</p>
																	<p>
																		<b>Amount:</b> ${invoice.amount}
																	</p>
																</td>
															</tr>                                  
															<tr>
																<td><hr /></td>
															</tr>
															<tr>
																<td>Thank you</td>
															</tr>
														</table>
													</td>
											</tr>
									</table>
							</body>
						</html>
				`;
				const isSend = await sendEmail('aninda.kar@codaemonsoftwares.com', 'Reg. resend details for your Tow', emailTemplate, 'Reg. resend details for your Tow');
				if (isSend) {
					return res.status(200).json({ errors: [], data: { msg: 'Payment link send again', invoice } });
				} else {
					return res.status(500).json({ errors: [], data: { msg: 'Payment link could not be send again', invoice } });
				}
			} else {
				// Send SMS
				const sms_content = `You can pay for your Tow @ this link: http://ec2-18-217-104-6.us-east-2.compute.amazonaws.com/payment/${invoice_id}`;
				const isSend = await sendSMS(sms_content);
				if (isSend) {
					return res.status(200).json({ errors: [], data: { msg: 'Payment link send again', invoice } });
				} else {
					return res.status(500).json({ errors: [], data: { msg: 'Payment link could not be send again', invoice } });
				}
			}

		}
	}
});

// @route     GET /api/order/:invoice id
// @desc      Get invoice information
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
			const invoice = response.result[0];

			const date_opened = moment(invoice.date_opened_timestamp).format('ddd MMM D YYYY kk:mm:ss') + ' GMT ' + moment().format('Z');
			const date_first_link_send = moment(invoice.date_opened_timestamp).format('ddd MMM D YYYY kk:mm:ss') + ' GMT ' + moment().format('Z');
			const data_last_link_send = (invoice.date_edit_timestamp) ? moment(invoice.date_edit_timestamp).format('ddd MMM D YYYY kk:mm:ss') + ' GMT ' + moment().format('Z') : '';
			const data_payment_done = (invoice.date_payment) ? moment(invoice.date_payment).format('ddd MMM D YYYY kk:mm:ss') + ' GMT ' + moment().format('Z') : '';

			invoice.date_opened = date_opened;
			invoice.date_first_link_send = date_first_link_send;
			invoice.data_last_link_send = data_last_link_send;
			invoice.data_payment_done = data_payment_done;
			return res.status(200).json({ errors: [], data: { msg: 'Invoice details', invoice } });
		}
	}
});


// @route     GET /api/order
// @desc      Get user list/by param order
// @access    Private
router.post('/', authMiddleware, async (req, res) => {
	const user_id = req.user.id;

	// Pagination
	const sortBy = req.body.sort_by || 'invoice_id';
	const sortOrder = req.body.sort_order || 'ASC';
	const searchTerm = req.body.search_term || '';
	const fetchPage = req.body.fetch_page || 1;
	const perPage = req.body.per_page || 10;
	let searchQuery = '';

	if (searchTerm !== '') {
		searchQuery = `AND (first_name LIKE "%${searchTerm.toLowerCase()}%" 
		OR last_name LIKE "%${searchTerm.toLowerCase()}%"
		OR  invoice_id LIKE "%${searchTerm.toLowerCase()}%" 
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

	const sql_query = `SELECT * FROM user_invoice WHERE 1 ${searchQuery} ORDER BY ${sortBy} ${sortOrder}`;
	console.log(sql_query);
	const dataArray = await InvoiceModel.getSortedInvoices(sql_query); // perPage, start_page

	if (dataArray.error) {
		return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
	} else {

		const csvFields = [
			'Invoice Number', 'First Name', 'Last Name', 'Payment Email', 'Phone Number', 'Service Type', 'Problem Type',
			'Total Amount', 'Total Distance', 'Payment Status', 'Start Address', 'End Address', 'Origin Zip', 'Destination Zip', 'Sms Sent', 'Email Sent',
			'Pickup Location', 'Car Model', 'Car Color', 'Car Make', 'Car Year', 'Anyone With Vehicle', 'Keys Available', 'Four Wheels Turn',
			'Back Wheels Turn', 'Front Wheels Turn', 'Is InNeutral', 'Fuel Type', 'Pick Notes', 'Date Open Fulled', 'Date Opened Timestamp',
			'Date Edit Timestamp', 'User Id', 'MSA System', 'Dispatcher System', 'Payment Link Sent To'];

		const csv = json2csv(dataArray.result, { csvFields });
		console.log('CSV');
		console.log(csv);
		total_invoices = dataArray.result.length;
		total_pages = parseInt(Math.ceil(total_invoices / perPage));
		start_page = (perPage * (fetchPage - 1));
		next_start = (perPage * fetchPage);
		next_page = 0; // Count for next page records
		
		const sql_limit_query = `SELECT * FROM user_invoice WHERE 1 ${searchQuery} ORDER BY ${sortBy} ${sortOrder} LIMIT ${start_page},${perPage}`;
		console.log(sql_limit_query);
		const resultArray = await InvoiceModel.getSortedInvoices(sql_limit_query); // perPage, start_page

		if (resultArray.error) {
			return res.status(500).json({ errors: [{ msg: 'Internal server error!' }] });
		} else {
			return res.status(200).json({
				errors: [], data: {
					msg: 'Invoice List',
					invoices: resultArray.result,
					total_invoices,
					fetchPage,
					perPage,
					start_page,
					next_start,
					next_page,
					total_pages,
					csv
				}
			});
		}
	}
});


// @route     GET /api/order/export
// @desc      Get user list/by param order
// @access    Private
router.get('/export', authMiddleware, async (req, res) => {
	let csv;
	const csvFilePath = './csvdownload/invoice_' + Date.now() + '.csv';
	const csvFields = [
		'Invoice Number', 'First Name', 'Last Name', 'Payment Email', 'Phone Number', 'Service Type', 'Problem Type',
		'Total Amount', 'Total Distance', 'Payment Status', 'Start Address', 'End Address', 'Origin Zip', 'Destination Zip', 'Sms Sent', 'Email Sent',
		'Pickup Location', 'Car Model', 'Car Color', 'Car Make', 'Car Year', 'Anyone With Vehicle', 'Keys Available', 'Four Wheels Turn',
		'Back Wheels Turn', 'Front Wheels Turn', 'Is InNeutral', 'Fuel Type', 'Pick Notes', 'Date Open Fulled', 'Date Opened Timestamp',
		'Date Edit Timestamp', 'User Id', 'MSA System', 'Dispatcher System', 'Payment Link Sent To'];

	const user_id = req.query.userid;
	// Pagination
	const sortBy = req.query.sort_by || 'invoice_id';
	const sortOrder = req.query.sort_order || 'ASC';
	const searchTerm = req.query.search_term || '';
	const fetchPage = req.query.fetch_page || 1;
	const perPage = req.query.per_page || 10;
	const is_export = req.query.isexport || 0;
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
				msg: 'Invoice List Downloaded',
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