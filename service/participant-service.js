const { jwtDecode } = require("jwt-decode");
const { ResponseError } = require("../error/response-error");

const { createSchema } = require("../validation/cart-validation");
const midtransClient = require("midtrans-client");
const uuid = require("uuid");

const productRepository = require("../repository/productRepository");
const cartRepository = require("../repository/cartRepository");
const orderRepository = require("../repository/orderRepository");
const trxRepository = require("../repository/transactionRepository");

let snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: process.env.server_key,
  clientKey: process.env.client_key,
});

module.exports = {
  showProducts: async (req) => {
    const result = await productRepository.findAll();

    return result;
  },

  showProductDetail: async (id) => {
    const product = await productRepository.findOne(id);
    return product;
  },

  addCart: async (req) => {
    const validationResult = createSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw new ResponseError(400, validationResult.error.message);
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { userId } = decoded;

    const { product_id, quantity } = req.body;

    const product = await productRepository.findOne(product_id);
    if (product.stock < quantity) {
      throw new ResponseError(400, `stock has only: ${product.stock}`);
    }

    //check cart
    const checkCart = await cartRepository.findBy({
      user_id: userId,
      product_id,
      isCheckout: false,
    });
    if (checkCart.length > 0) {
      // throw new ResponseError(400, "product already in cart");
      await cartRepository.updateCartQuantity(userId, product_id, {
        quantity: checkCart[0].quantity + quantity,
      });
    } else {
      await cartRepository.createCart({
        user_id: userId,
        product_id,
        quantity,
      });
    }

    return product;
  },

  showCart: async (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { userId } = decoded;

    const cart = await cartRepository.findBy({
      user_id: userId,
      isCheckout: false,
    });
    return cart;
  },

  updateCart: async (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { userId } = decoded;

    const { id } = req.params;
    const { quantity } = req.body;

    const cart = await cartRepository.findBy({
      id: Number(id),
      user_id: userId,
    });

    if (!cart) {
      throw new ResponseError(400, "cart not found");
    }

    await cartRepository.updateCartQuantity(userId, cart[0].product_id, {
      quantity,
    });

    return "success";
  },

  deleteCart: async (id) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { userId } = decoded;

    const cart = await cartRepository.deleteCart({
      id: Number(id),
      user_id: userId,
    });
    return cart;
  },

  createOrder: async (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { userId } = decoded;

    const {
      name,
      email,
      origin_city,
      courier,
      cart_item,
      price,
      destination_postal_code,
      destination_city,
      destination_province_name,
      destination_city_name,
      shipping_cost,
    } = req.body;

    const order = await orderRepository.createOrder({
      order_id: uuid.v4(),
      name,
      email,
      user_id: userId,
      date: new Date().toDateString(),
      price: parseInt(price),
      gross_amount: parseInt(price),
      shipping_cost: parseInt(shipping_cost), // contoh
      origin_city: parseInt(origin_city),
      destination_city: parseInt(destination_city),
      courier,
      destination_city_name,
      destination_postal_code,
      destination_province_name,
      carts: {
        create: cart_item.map((id) => ({
          cart: { connect: { id } },
        })),
      },
    });

    const transactionDetails = {
      transaction_details: {
        order_id: order.order_id,
        gross_amount: order.gross_amount,
      },
      customer_details: {
        first_name: order.name,
        email: order.email,
      },
    };

    const transactionToken = await snap.createTransaction(transactionDetails);

    const transaction = await trxRepository.createTransaction({
      order_id_midtrans: transactionDetails.transaction_details.order_id, // Simpan order_id Midtrans
      gross_amount: transactionDetails.transaction_details.gross_amount,
    });

    return {
      transactionToken,
      order,
      transaction,
    };
  },

  showOrder: async (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { userId } = decoded;

    const order = await orderRepository.findByAll({
      user_id: userId,
      status: "settlement",
    });

    return order;
  },

  showDetailOrder: async (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { userId } = decoded;

    const { id } = req.params;
    const order = await orderRepository.findByOne({
      id: Number(id),
      user_id: userId,
    });
    return order;
  },

  completeShippment: async (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { userId } = decoded;

    const { id } = req.params;

    const { status_shipment } = req.body;

    if (!["completed"].includes(status_shipment)) {
      throw new ResponseError(400, "Status harus  completed");
    }

    const order = await orderRepository.findByOne({
      user_id: userId,
    });

    if (!order) {
      throw new ResponseError(400, "order not found");
    }

    await orderRepository.updateOrder(id, { status_shipment });

    return order;
  },
};
