const express = require("express");

const {
  province,
  city,
  shippingCost,
  cityDetail,
} = require("../controller/rajaongkir-controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/api/rajaongkir/province", auth, province);
router.get("/api/rajaongkir/city/:provinceId", auth, city);
router.get("/api/rajaongkir/city-detail/:cityId", auth, cityDetail);

router.post("/api/rajaongkir/shipping-cost", auth, shippingCost);

module.exports = router;
