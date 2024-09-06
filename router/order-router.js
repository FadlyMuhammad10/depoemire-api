const express = require("express");

const auth = require("../middleware/auth");
const admin = require("../middleware/authorization");

const { get, update } = require("../controller/order-controller");

const router = express.Router();

router.get("/api/orders", auth, admin, get);

router.put("/api/order/update/:id", auth, admin, update);

module.exports = router;
