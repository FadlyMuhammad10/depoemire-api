const express = require("express");

const auth = require("../middleware/auth");
const admin = require("../middleware/authorization");

const {
  create,
  getAll,
  getOne,
  update,
  destroy,
  change,
} = require("../controller/product-controller");

const router = express.Router();

router.post("/api/product/create", auth, admin, create);
router.get("/api/products", auth, admin, getAll);
router.get("/api/product/:id", auth, admin, getOne);
router.put("/api/product/update/:id", auth, admin, update);
router.put("/api/product/change/:id", auth, admin, change);
router.delete("/api/product/destroy/:id", auth, admin, destroy);

module.exports = router;
