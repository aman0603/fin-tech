const cors = require('cors');
dotenv = require('dotenv');
dotenv.config();

const allowedOrigins = process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : ['http://localhost:8080'];
module.exports = cors({
  origin: allowedOrigins,
  credentials: true,
});
