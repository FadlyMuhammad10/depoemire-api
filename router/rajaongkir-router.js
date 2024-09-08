const express = require("express");

const {
  province,
  city,
  shippingCost,
} = require("../controller/rajaongkir-controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/api/rajaongkir/province", auth, province);
router.get("/api/rajaongkir/city", auth, city);

router.post("/api/rajaongkir/shipping-cost", auth, shippingCost);

module.exports = router;
