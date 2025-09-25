const fetch = require("node-fetch");
require('dotenv').config();

const GHL_OTP_SCRIPT_URL = process.env.GHL_OTP;
exports.getGhlOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const response = await fetch(GHL_OTP_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!data.success) {
      return res
        .status(404)
        .json({ success: false, message: data.message || "OTP not found" });
    }

    res.json({
      success: true,
      otp: data.otp,
      timestamp: data.timestamp,
    });
  } catch (err) {
    console.error("Error in getGhlOtp:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
