const express = require('express');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');

const authMiddleware = require('../middleware/auth');
const UserModel = require('../models/User');

const router = express.Router();

// @route     GET /api/users
// @desc      Get user list
// @access    Private
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const roleId = req.body.role_id || 2;

  // Pagination
  const sortBy = req.body.sort_by || 'first_name';
  const sortOrder = req.body.sort_order || 'ASC';
  const searchTerm = req.body.search_term || '';
  const fetchPage = req.body.fetch_page || 1;
  const perPage = req.body.per_page || 3;
  let searchQuery = '';

  const users = await UserModel.getUsers(roleId);
  total_users = users.result.length;
  total_pages = parseInt(Math.ceil(total_users/perPage));
  start_page = (perPage * (fetchPage - 1));
  next_start = (perPage * fetchPage);
  next_page = 0; // Count for next page records

  if (searchTerm !== '') {
    searchQuery = `AND (first_name LIKE "%${searchTerm.toLowerCase()}%" OR last_name LIKE "%${searchTerm.toLowerCase()}%" OR email_id LIKE "%${searchTerm.toLowerCase()}%")`;
  }
  const sql_query = `SELECT id, role_id, first_name, last_name, email_id, contact_no, status FROM user WHERE role_id=${roleId} ${searchQuery} ORDER BY ${sortBy} ${sortOrder} LIMIT ${start_page},${perPage}`;
  console.log(sql_query);
  dataArray = await UserModel.getSortedUsers(sql_query); // perPage, start_page
  
  if (users.error) {
    return res.status(500).json({ errors: [{msg: 'Internal server error!'}] });
  } else {
    return res.status(200).json({ errors: [], data: {
      msg: 'Users listed', 
      users: dataArray.result,
      total_users,
      fetchPage, 
      perPage,
      start_page,
      next_start,
      next_page
    }});
  }  
});

// @route     POST /api/users
// @desc      Create user agents
// @access    Public
router.post('/', [authMiddleware, [
    check('first_name', 'Please enter a valid first name').not().isEmpty(),
    check('last_name', 'Please enter a valid last name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('user_role', 'Please select the user role').not().isEmpty(),
    check('password', 'Please enter a password with min 6 characters').isLength({ min: 6 })
  ]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, phone, user_role, password } = req.body;
    const response = await UserModel.getUserByEmail(email);

    if (response.error) {
      return res.status(500).json({ errors: [{msg: 'Internal server error!'}] });
    } else if (response.result && response.result.length > 0) {
      return res.status(400).json({ errors: [{msg: 'Email id is already registered!'}]});
    } else {
      let newUser = { first_name, last_name, email, phone, user_role, password };
      
      // Encrypt password using bcrypt
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      newUser.user_role = parseInt(newUser.user_role);
      
      const user = await UserModel.saveUser(newUser);

      if (user.error) {
        return res.status(500).json({ errors: [{msg: 'Internal server error!'}] });
      } else {        
        delete user.result.password;        
        return res.status(200).json({ errors: [], data: {msg: 'User registered successfully', user: user.result}});
      }
    }    
});

// @route     PUT /api/users/:id
// @desc      Update a user agent
// @access    Private
router.put('/:id', authMiddleware, async (req, res) => {  
  const id = req.params.id;
  const { password } = req.body;

  if (password.length < 6) {
    return res.status(400).json({ 
      errors: [
        {
          "value": "",
          "msg": "Please enter a password with min 6 characters",
          "param": "password",
          "location": "body"
        }
      ] 
    });
  }

  // Check if user exists
  const user = await UserModel.getUserById(id);
  if (user.error) {
    return res.status(500).json({ errors: [{msg: 'Internal server error!'}] });
  } else if (user.result.length < 1) {
    return res.status(404).json({ errors: [{msg: 'User not found!'}] });
  } else {
    const newUser = { id, password };

    // Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    const response = await UserModel.updateUser(newUser);
    if (response.error) {
      return res.status(500).json({ errors: [{msg: 'Internal server error!'}] });
    } else {
      return res.status(200).json({ errors: [], data: {msg: 'User profile updated' }});
    }
  }    
});

// @route     DELETE /api/users/:id
// @desc      Block a user agent
// @access    Private
router.delete('/:id', [authMiddleware, [
  check('status', 'Please enter a valid user status').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const id = req.params.id;  
  const { status } = req.body;
  
  // Check if user exists
  const user = await UserModel.getUserById(id);
  if (user.error) {
    return res.status(500).json({ errors: [{msg: 'Internal server error!'}] });
  } else if (user.result.length < 1) {
    return res.status(404).json({ errors: [{msg: 'User not found!'}] });
  } else {
    const newUser = { id, status };    
    const response = await UserModel.updateUserStatus(newUser);
    if (response.error) {
      return res.status(500).json({ errors: [{msg: 'Internal server error!'}] });
    } else {
      return res.status(200).json({ errors: [], data: {msg: 'User status updated' }});
    }
  }    
});

module.exports = router;