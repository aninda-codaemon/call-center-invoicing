const pool = require('../config/database');

const Invoice = {};

Invoice.getMsaFromZip = async (zipcode) => {
  let response = {};
  try {
    const [result, fields] = await pool.query('SELECT id, zip_code, msa_id FROM `zip_msa_id` WHERE zip_code=?', [zipcode]);
    console.log(result);
    response.result = result;
    return response;
  } catch (error) {
    console.log(`Error: ${error.sqlMessage}`);
    response.error = error.sqlMessage;
    return response;
  }
};

Invoice.getPriceForMSA = async (msa_id) => {
  let response = {};
  try {
    const [result, fields] = await pool.query('SELECT id, msa, msa_id, retail_tow_rate, retail_light_service_rate, per_mile_rate_over_ten_miles, system_for_towing, system_for_light_service, system FROM `price_lookup_msa` WHERE msa_id=?', [msa_id]);
    console.log(result);
    response.result = result;
    return response;
  } catch (error) {
    console.log(`Error: ${error.sqlMessage}`);
    response.error = error.sqlMessage;
    return response;
  }
};

Invoice.getLastInvoiceNumber = async () => {
  let response = {};
  try {
    const [result, fields] = await pool.query('SELECT id, invoice_id FROM `user_invoice` ORDER BY id DESC LIMIT 1;');
    console.log(result);
    if (result.length > 0) {
      response.result = result;
      return response;
    } else {
      return null;
    }
  } catch (error) {
    console.log(`Error: ${error.sqlMessage}`);
    response.error = error.sqlMessage;
    return response;
  }
};

Invoice.getNewInvoiceNumber = async (newInvoiceId) => {
  let response = {};
  try {
    const [resultInsert, fieldsInsert] = await pool.query('INSERT INTO `user_invoice` SET invoice_id=?', [newInvoiceId]);
    const [result, fields] = await pool.query('SELECT invoice_id FROM `user_invoice` ORDER BY id DESC LIMIT 1;');
    response.result = result;
    return response;
  } catch (error) {
    console.log(`Error: ${error.sqlMessage}`);
    response.error = error.sqlMessage;
    return response;
  }
};

Invoice.getInvoiceById = async (invoice_number) => {
  let response = {};
  try {
    const [result, fields] = await pool.query(`SELECT invoice_id FROM user_invoice WHERE invoice_id=?`, [invoice_number]);
    console.log(result);
    response.result = result;
    return response;
  } catch (error) {
    console.log(`Error: ${error.sqlMessage}`);
    response.error = error.sqlMessage;
    return response;
  }
}

Invoice.saveInvoice = async (invoice) => {
  let response = {};
  try {
    const [result, fields] =
      await pool.query(`UPDATE user_invoice SET first_name=?,last_name=?,phone_number=?,year=?,make=?,model=?,
      color=?,service_type=?,problem_type=?,anyone_with_vehicle=?,keys_for_vehicle=?,	four_wheels_turn=?,
      front_wheels_turn=?,back_wheels_turn=?,is_neutral=?,fuel_type=?,pickup_location=?,pickup_notes=?,origin_zipcode=?,
      destination_zipcode=?,distance=?,amount=?,payment_email=?,send_payment_to=?,date_edit_timestamp=?,user_id=? WHERE invoice_id=?`,
        [invoice.fname, invoice.lname, invoice.phone, invoice.year, invoice.make, invoice.model, invoice.color,
        invoice.servicetype, invoice.problemtype, invoice.anyonewithvehicle, invoice.keysforvehicle, invoice.fourwheelsturn, invoice.frontwheelsturn,
        invoice.backwheelsturn, invoice.neutral, invoice.fueltype, invoice.pickuplocation, invoice.pickupnotes, invoice.originzipcode,
          invoice.destinationzipcode, invoice.totaldistance, invoice.paymenttotalamount, invoice.paymentemail, invoice.sendpaymentto, invoice.timeNow, invoice.userid,  invoice.invoicenumber]);
    console.log(result);
    response.result = invoice;
    return response;
  } catch (error) {
    console.log(`Error: ${error.sqlMessage}`);
    response.error = error.sqlMessage;
    return response;
  }
};

Invoice.getInvoiceByInvoiceId = async (invoice_number) => {
  let response = {};
  try {
    const [result, fields] = await pool.query(`SELECT * FROM user_invoice WHERE invoice_id=?`, [invoice_number]);
    console.log(result);
    response.result = result;
    return response;
  } catch (error) {
    console.log(`Error: ${error.sqlMessage}`);
    response.error = error.sqlMessage;
    return response;
  }
};

Invoice.getSortedInvoices = async (sqlQuery) => {
  let response = {};
  try {
    const [result, fields] = await pool.query(sqlQuery);
    console.log(result);
    response.result = result;
    return response;
  } catch (error) {
    console.log(`Error: ${error.sqlMessage}`);
    response.error = error.sqlMessage;
    return response;
  }
};

Invoice.getAllInvoice = async (user_id) => {
  let response = {};
  try {
    const [result, fields] = await pool.query('SELECT * FROM `user_invoice` WHERE user_id=? ORDER BY invoice_id ASC', [user_id]);
    console.log(result);
    response.result = result;
    return response;
  } catch (error) {
    console.log(`Error: ${error.sqlMessage}`);
    response.error = error.sqlMessage;
    return response;
  }
};

module.exports = Invoice;