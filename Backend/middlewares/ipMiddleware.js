// middlewares/ipMiddleware.js
function ipMiddleware(req, res, next) {
  // Get client IP
  req.clientIp =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  // Remove IPv6 prefix if present
  if (req.clientIp && req.clientIp.substring(0, 7) === "::ffff:") {
    req.clientIp = req.clientIp.substring(7);
  }

  next();
}

module.exports = ipMiddleware;
