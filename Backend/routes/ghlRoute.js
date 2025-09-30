const express = require("express");
const router = express.Router();
const { getGhlOtp } = require("../controllers/ghlController");
const sharedKeyAuth=require("../middlewares/sharedKeyAuth")

// POST /get-ghl-otp
router.post("/get-ghl-otp",sharedKeyAuth, getGhlOtp);

module.exports = router;
