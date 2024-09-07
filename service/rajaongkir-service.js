const { default: axios } = require("axios");

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
module.exports = {
  getProvince: async (req) => {
    const result = await axios.get(
      `https://api.rajaongkir.com/starter/province`,
      {
        headers: {
          key: RAJAONGKIR_API_KEY,
        },
      }
    );

    return result.data.rajaongkir.results;
  },
  getCity: async (req) => {
    const result = await axios.get(`https://api.rajaongkir.com/starter/city`, {
      headers: {
        key: RAJAONGKIR_API_KEY,
      },
    });

    return result.data.rajaongkir.results;
  },

  calculateShippingCost: async (origin, destination, weight, courier) => {
    const result = await axios.post(
      `https://api.rajaongkir.com/starter/cost`,
      {
        origin, // ID kota asal
        destination, // ID kota tujuan
        weight, // Berat paket dalam gram
        courier, // Nama kurir (jne, pos, tiki, dll)
      },
      {
        headers: {
          key: RAJAONGKIR_API_KEY,
        },
      }
    );

    return result.data.rajaongkir.results[0].costs;
  },

  getCityDetail: async (cityId) => {
    const result = await axios.get(
      `https://api.rajaongkir.com/starter/city?id=${cityId}`,
      {
        headers: {
          key: RAJAONGKIR_API_KEY,
        },
      }
    );
    // Ambil nama provinsi, kota dan kode pos dari response
    const provinceName = result.data.rajaongkir.results.province;
    const cityName = result.data.rajaongkir.results.city_name;
    const postalCode = result.data.rajaongkir.results.postal_code;

    return { cityName, postalCode, provinceName };
  },
};
