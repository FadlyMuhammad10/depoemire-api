const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

module.exports = { createJwt };
