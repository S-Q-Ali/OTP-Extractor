const express = require("express");
const router = express.Router();
const { getGhlOtp } = require("../controllers/ghlController");

// POST /get-ghl-otp
router.post("/get-ghl-otp", getGhlOtp);

module.exports = router;
