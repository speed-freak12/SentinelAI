const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  verifyOTP,
  resendOTP,
} = require("../controllers/authController");

router.post("/signup", signup);

router.post("/login", login);

router.post("/verify-otp", verifyOTP);

router.post("/resend-otp", resendOTP);

module.exports = router;