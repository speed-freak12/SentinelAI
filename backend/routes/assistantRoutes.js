const express = require("express");

const {
    askAssistant,
} = require(
    "../controllers/assistantController"
);

const router = express.Router();

router.post(
    "/",
    askAssistant
);

module.exports = router;