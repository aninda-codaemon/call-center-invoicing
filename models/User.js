const pool = require('../config/database');

const User = {};

User.getUserByEmail = async (email) => {
  let response = {};
  try {
    const [result, fields] = await pool.query(`SELECT id, role_id, first_name, last_name, email_id, contact_no, password FROM user WHERE email_id=?`, [email]);
    console.log(result);
    response.result = result;
    return response;
  } catch (error) {
    console.log(`Error: ${error.sqlMessage}`);
    response.error = error.sqlMessage;
    return response;
  }
}

User.saveUser = async (user) => {
  let response = {};
  try {
    const [result, fields] = await pool.query('INSERT INTO `user` SET name=?, email=?, password=?', [user.name, user.email, user.password]);
    console.log(result);
    user.id = result.insertId;
    response.result = user;
    return response;
  } catch (error) {
    console.log(`Error: ${error.sqlMessage}`);
    response.error = error.sqlMessage;
    return response;
  }
};

User.getUserById = async (id) => {
  let response = {};
  try {
    const [result, fields] = await pool.query('SELECT id, role_id, first_name, last_name, email_id, contact_no FROM `user` WHERE `id`=?', [id]);        
    console.log(result);
    response.result = result;
    return response;
  } catch (error) {
    console.log(`Error: ${error.sqlMessage}`);
    response.error = error.sqlMessage;
    return response;
  }
};

module.exports = User;