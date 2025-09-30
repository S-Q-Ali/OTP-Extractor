const cors = require("cors");

const corsMiddleware = cors({
  origin: ["https://otp-extractor.vercel.app/","http://localhost:5173/"],
});

module.exports = corsMiddleware;
