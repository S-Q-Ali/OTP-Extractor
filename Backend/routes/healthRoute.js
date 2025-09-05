const express = require("express");
const router = express.Router();

const healthController = require("../controllers/healthController.js");

router.get("/", healthController);

module.exports = router;
