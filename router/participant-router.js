const express = require("express");

const auth = require("../middleware/auth");
const {
  show,
  showDetail,
  add,
  showCartProduct,
  deleteCartProduct,
  order,
} = require("../controller/participant-controller");

const router = express.Router();

router.get("/api/participant/products", show);
router.get("/api/participant/product/:id", showDetail);

router.post("/api/participant/cart", auth, add);
router.get("/api/participant/carts", auth, showCartProduct);
router.delete("/api/participant/cart/delete/:id", auth, deleteCartProduct);

router.post("/api/participant/order/create", auth, order);
module.exports = router;
