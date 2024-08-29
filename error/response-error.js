class ResponseError extends Error {
  constructor(status, message) {
    super(message);
  }
}

module.exports = { ResponseError };
