const {
  createProductImage,
  deleteProductImage,
} = require("../service/productImage-service");

const create = async (req, res, next) => {
  try {
    const result = await createProductImage(req);
    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteProductImage(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, destroy };
