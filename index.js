const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

app.use(cors());
dotenv.config();

// Init body parsor
app.use(express.json({ extended: true }));

app.get('/', (req, res) => res.json({msg: 'Welcome to call center invoicing'}));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/order', require('./routes/invoice'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));