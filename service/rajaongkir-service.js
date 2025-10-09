const { default: axios } = require("axios");

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
module.exports = {
  getProvince: async (req) => {
    const result = await axios.get(
      `https://rajaongkir.komerce.id/api/v1/destination/province`,
      {
        headers: {
          key: RAJAONGKIR_API_KEY,
        },
      }
    );

    return result.data;
  },
  getCity: async (provinceId) => {
    const result = await axios.get(
      `https://rajaongkir.komerce.id/api/v1/destination/city/${provinceId}`,
      {
        headers: {
          key: RAJAONGKIR_API_KEY,
        },
      }
    );

    return result.data;
  },

  getCityDetail: async (cityId) => {
    const result = await axios.get(
      `https://rajaongkir.komerce.id/api/v1/destination/district/${cityId}`,
      {
        headers: {
          key: RAJAONGKIR_API_KEY,
        },
      }
    );

    return result.data;
  },
  checkCost: async (req) => {
    const { origin, destination, weight, courier } = req.body;
    const result = await axios.post(
      `https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost`,
      {
        origin, // ID kota asal
        destination, // ID kota tujuan
        weight, // Berat paket dalam gram
        courier, // Nama kurir (jne, pos, tiki, dll)
      },
      {
        headers: {
          key: RAJAONGKIR_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return result.data;
  },
};
