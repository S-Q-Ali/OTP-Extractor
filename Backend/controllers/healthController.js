function healthController(req, res) {
  res.status(200).json({ message: "Server is running fine!" });
}

module.exports = healthController;
