const cors = require("cors");

const corsMiddleware = cors({
  origin: "*",
});

module.exports = corsMiddleware;
