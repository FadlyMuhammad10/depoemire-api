const { getOrders, updateStatusShipping } = require("../service/order-service");

const get = async (req, res, next) => {
  try {
    const result = await getOrders();
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await updateStatusShipping(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { get, update };
