const {
  createProduct,
  getProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
} = require("../service/product-service");
const dotenv = require("dotenv");
dotenv.config();

const create = async (req, res, next) => {
  try {
    const result = await createProduct(req);
    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await getProducts();
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const result = await getOneProduct(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await updateProduct(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteProduct(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getOne, update, destroy };
