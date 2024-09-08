const {
  getProvince,
  getCity,
  checkCost,
} = require("../service/rajaongkir-service");

const province = async (req, res, next) => {
  try {
    const result = await getProvince(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const city = async (req, res, next) => {
  try {
    const result = await getCity(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const shippingCost = async (req, res, next) => {
  try {
    const result = await checkCost(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { province, city, shippingCost };
