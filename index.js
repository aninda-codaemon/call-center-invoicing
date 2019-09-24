const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(cors());
dotenv.config();

// Init body parsor
app.use(express.json({ extended: true }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/order', require('./routes/invoice'));
app.use('/payment', require('./routes/payment'));


if (process.env.PLATENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));