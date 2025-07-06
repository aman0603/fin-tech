// File: backend/server.js
require('dotenv').config();
const mongoose = require('./utils/database');
const app = require('./app');

const PORT = process.env.PORT || 4000 ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});