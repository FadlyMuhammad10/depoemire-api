const express = require("express");
const { createUser, login } = require("../controller/user-controller");
const validateRequest = require("../middleware/validateRequest");
const { signupSchema, signinSchema } = require("../validation/user-validation");

const router = express.Router();

router.post("/api/signup", validateRequest(signupSchema), createUser);

router.post("/api/signin", validateRequest(signinSchema), login);

module.exports = router;
