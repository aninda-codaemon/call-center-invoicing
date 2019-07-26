const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

// Init body parsor
app.use(express.json({ extended: true }));

app.get('/', (req, res) => res.json({msg: 'Welcome to call center invoicing'}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));