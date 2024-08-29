const express = require("express");

const auth = require("../middleware/auth");
const admin = require("../middleware/authorization");
const upload = require("../middleware/multer");
const { create, destroy } = require("../controller/productImage-controller");

const router = express.Router();

router.post(
  "/api/product-image/create/:productId",
  upload.single("image_url"),
  auth,
  admin,
  create
);

router.delete("/api/product-image/destroy/:id", auth, admin, destroy);

module.exports = router;
