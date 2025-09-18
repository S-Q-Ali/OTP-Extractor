const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController.js");

// Define GET routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyTotp);
router.post("/get-secret", authController.getSecret);

module.exports = router;
