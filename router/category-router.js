const express = require("express");

const auth = require("../middleware/auth");
const admin = require("../middleware/authorization");

const {
  create,
  get,
  update,
  destroy,
} = require("../controller/category-controller");

const router = express.Router();

router.post("/api/category/create", auth, admin, create);
router.get("/api/categories", auth, admin, get);
router.put("/api/category/update/:id", auth, admin, update);
router.delete("/api/category/destroy/:id", auth, admin, destroy);

module.exports = router;
