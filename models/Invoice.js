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

module.exports = Invoice;