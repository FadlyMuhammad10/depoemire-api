const { jwtDecode } = require("jwt-decode");
const prisma = require("../lib/prisma");
const midtransClient = require("midtrans-client");
const {
  showOrder,
  showDetailOrder,
  completeShippment,
  showProducts,
  showProductDetail,
  addCart,
  showCart,
  createOrder,
  deleteCart,
  updateCart,
} = require("../service/participant-service");

const dotenv = require("dotenv");
dotenv.config();

const show = async (req, res, next) => {
  try {
    const result = await showProducts(req);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const showDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await showProductDetail(id);

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const result = await addCart(req);
    res.status(200).json({
      data: "success",
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const showCartProduct = async (req, res, next) => {
  try {
    const result = await showCart(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const updateCartProduct = async (req, res, next) => {
  try {
    const cart = await updateCart(req);

    res.status(200).json({
      data: cart,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const deleteCartProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = await deleteCart(id);

    res.status(200).json({
      data: cart,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const order = async (req, res, next) => {
  try {
    const order = await createOrder(req);

    res.status(200).json({
      data: {
        order: order.id,
        token: order.transactionToken.token,
        url: order.transactionToken.redirect_url,
        transaction: order.transaction.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const showOrderProduct = async (req, res, next) => {
  try {
    const result = await showOrder(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const showDetailOrderProduct = async (req, res, next) => {
  try {
    const result = await showDetailOrder(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const completeShipping = async (req, res, next) => {
  try {
    const result = await completeShippment(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  show,
  showDetail,
  add,
  showCartProduct,
  deleteCartProduct,
  order,
  showOrderProduct,
  showDetailOrderProduct,
  completeShipping,
  updateCartProduct,
};
