const express = require("express");
const authController = require("../controller/user-controller");
const validateRequest = require("../middleware/validateRequest");
const { signupSchema, signinSchema } = require("../validation/user-validation");

const router = express.Router();

router.post(
  "/api/signup",
  validateRequest(signupSchema),
  authController.register
);

router.post("/api/signin", validateRequest(signinSchema), authController.login);

module.exports = router;
