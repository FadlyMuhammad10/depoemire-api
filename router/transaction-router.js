const express = require("express");
const { webhook } = require("../controller/transaction-controller");

const router = express.Router();

router.post("/api/webhook", webhook);

module.exports = router;
