const {
  getProvince,
  getCity,
  checkCost,
  getCityDetail,
} = require("../service/rajaongkir-service");
const dotenv = require("dotenv");
dotenv.config();

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
    const result = await getCity(req.params.provinceId);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const cityDetail = async (req, res, next) => {
  try {
    const result = await getCityDetail(req.params.cityId);
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

module.exports = { province, city, shippingCost, cityDetail };
