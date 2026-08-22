const express = require("express");

const {
    getIntelligence,
} = require(
    "../controllers/intelligenceController"
);

const router = express.Router();

router.get(
    "/",
    getIntelligence
);

module.exports = router;