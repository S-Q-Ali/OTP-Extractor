const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController.js");
const sharedKeyAuth=require("../middlewares/sharedKeyAuth.js");

// Define GET routes
router.post("/register",sharedKeyAuth, authController.register);
router.post("/login",sharedKeyAuth, authController.login);
router.post("/verify-otp",sharedKeyAuth, authController.verifyTotp);
router.get("/cache-diagnosis",sharedKeyAuth, authController.cacheDiagnostics   );

module.exports = router;
