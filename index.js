const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const cron = require('node-cron');

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(cors());
app.use(helmet());
dotenv.config();

// Init body parsor
app.use(express.json({ extended: true }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/order', require('./routes/invoice'));
app.use('/payment', require('./routes/payment'));
app.use('/receipt', require('./routes/receipt'));

if (process.env.PLATENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Setting up cron scheduler for cleaning abandoned records
cron.schedule('59 17 * * *', () => {
  // var d = new Date().toLocaleString('en-US', {timeZone: 'America/Chicago'});
  var d = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
  const { getAbandonedEntries } = require('./helpers/helpers');
  const output = getAbandonedEntries();
  
  console.log(`running a task on ${d}`);
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata'
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));