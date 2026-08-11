const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  verifyOTP,
  resendOTP,
  googleLogin,
} = require("../controllers/authController");

router.post("/signup", signup);

router.post("/login", login);

router.post("/verify-otp", verifyOTP);

router.post("/resend-otp", resendOTP);

// Google Login
router.post("/google-login", googleLogin);

module.exports = router;