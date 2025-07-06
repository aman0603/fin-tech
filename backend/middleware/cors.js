const cors = require('cors');
dotenv = require('dotenv');
dotenv.config();

// const allowedOrigins = process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : ['http://localhost:3000'];
module.exports = cors({
  origin: ['http://localhost:3000',                      // local dev
    'https://finance-tracker-alpha-pearl.vercel.app' ], // your deployed frontend,
  credentials: true,
});
