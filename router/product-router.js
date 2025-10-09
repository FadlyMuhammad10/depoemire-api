const express = require("express");

const auth = require("../middleware/auth");
const admin = require("../middleware/authorization");
const upload = require("../middleware/multer");

const {
  create,
  getAll,
  getOne,
  update,
  destroy,
} = require("../controller/product-controller");

const router = express.Router();

router.post(
  "/api/product/create",
  upload.array("images", 5),
  auth,
  admin,
  create
);
router.get("/api/products", auth, admin, getAll);
router.get("/api/product/:id", auth, admin, getOne);
router.put(
  "/api/product/update/:id",
  upload.array("images", 5),
  auth,
  admin,
  update
);
router.delete("/api/product/destroy/:id", auth, admin, destroy);

module.exports = router;
