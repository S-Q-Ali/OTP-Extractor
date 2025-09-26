export const getClientIp = (req) => {
  return (
    req.clientIp ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : "unknown")
  );
};
