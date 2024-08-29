const { createUser, loginUser } = require("../service/user-service");

const create = async (req, res, next) => {
  try {
    const result = await createUser(req);
    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, login };
