const { ZodError } = require("zod");
const { ResponseError } = require("../error/response-error");
const errorMiddleware = async (error, req, res, next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      errors: `Validation Error : ${JSON.stringify(error)}`,
    });
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({
      errors: error.message,
    });
  } else {
    res.status(500).json({
      errors: error.message,
    });
  }
};

module.exports = { errorMiddleware };
