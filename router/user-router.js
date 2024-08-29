const express = require("express");
const { create, login } = require("../controller/user-controller");

const router = express.Router();

router.post("/api/signup", create);

router.post("/api/signin", login);

module.exports = router;
