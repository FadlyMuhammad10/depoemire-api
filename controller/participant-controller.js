const {
  showProducts,
  showProductDetail,
  addCart,
  showCart,
  deleteCart,
  createOrder,
  showOrder,
  completeShippment,
} = require("../service/participant-service");

const show = async (req, res, next) => {
  try {
    const result = await showProducts(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const showDetail = async (req, res, next) => {
  try {
    const result = await showProductDetail(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const result = await addCart(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
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
    next(error);
  }
};

const deleteCartProduct = async (req, res, next) => {
  try {
    const result = await deleteCart(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const order = async (req, res, next) => {
  try {
    const result = await createOrder(req);
    res.status(200).json({
      data: {
        order: result.order,
        token: result.transactionToken.token,
        url: result.transactionToken.redirect_url,
        transaction: result.transaction,
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
  completeShipping,
};
