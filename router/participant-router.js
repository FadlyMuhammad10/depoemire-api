const express = require("express");

const auth = require("../middleware/auth");
const {
  show,
  showDetail,
  add,
  showCartProduct,
  deleteCartProduct,
  order,
  showOrderProduct,
  completeShipping,
  showDetailOrderProduct,
} = require("../controller/participant-controller");

const router = express.Router();

router.get("/api/participant/products", show);
router.get("/api/participant/product/:id", showDetail);

router.post("/api/participant/cart", auth, add);
router.get("/api/participant/carts", auth, showCartProduct);
router.delete("/api/participant/cart/delete/:id", auth, deleteCartProduct);

router.post("/api/participant/order/create", auth, order);
router.get("/api/participant/orders", auth, showOrderProduct);

router.get("/api/participant/order/detail/:id", auth, showDetailOrderProduct);

router.put("/api/participant/order/complete/:id", auth, completeShipping);
module.exports = router;
