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

module.exports = Invoice;