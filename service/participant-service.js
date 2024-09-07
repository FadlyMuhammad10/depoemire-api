const { jwtDecode } = require("jwt-decode");
const { ResponseError } = require("../error/response-error");
const prisma = require("../lib/prisma");
const { createSchema } = require("../validation/cart-validation");
const midtransClient = require("midtrans-client");
const uuid = require("uuid");
const {
  calculateShippingCost,
  getCityDetail,
} = require("./rajaongkir-service");

let snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: process.env.server_key,
  clientKey: process.env.client_key,
});

module.exports = {
  showProducts: async (req) => {
    const result = await prisma.product.findMany({
      where: {
        status: true,
      },
      select: {
        id: true,
        images: {
          orderBy: {
            id: "asc",
          },
        },
        price: true,
        name: true,
        status: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return result;
  },

  showProductDetail: async (req) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        categories: {
          select: {
            name: true,
          },
        },
        images: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });
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

    const { product_id, quantity } = validationResult.data;

    // check stock product
    const product = await prisma.product.findUnique({
      where: {
        id: product_id,
      },
    });
    if (product.stock < quantity) {
      throw new ResponseError(400, `stock has only: ${product.stock}`);
    }

    // check cart
    const checkCart = await prisma.cart.findMany({
      where: {
        user_id: userId,
        product_id,
        isCheckout: false,
      },
    });
    if (checkCart.length > 0) {
      throw new ResponseError(400, "product already in cart");
    }

    const cart = await prisma.cart.create({
      data: {
        user_id: userId,
        product_id,
        quantity,
      },
    });
    return cart;
  },

  showCart: async (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { userId } = decoded;

    const cart = await prisma.cart.findMany({
      where: {
        user_id: userId,
        isCheckout: false,
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: {
                id: "asc",
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    return cart;
  },

  deleteCart: async (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { userId } = decoded;

    const { id } = req.params;
    const cart = await prisma.cart.delete({
      where: {
        id: Number(id),
        user_id: userId,
      },
    });
    return cart;
  },

  createOrder: async (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { name, email, userId } = decoded;

    const { origin, destination, weight, courier, cart_item, price } = req.body;

    // Hitung ongkir menggunakan RajaOngkir
    const shippingCosts = await calculateShippingCost(
      origin,
      destination,
      weight,
      courier
    );
    const shippingCost = shippingCosts[1].cost[0].value;

    const destinationCityDetail = await getCityDetail(destination);

    // Tambahkan shipping cost ke gross amount
    const totalPrice = parseInt(price) + parseInt(shippingCost);

    const order = await prisma.order.create({
      data: {
        name,
        email,
        user_id: userId,
        cart_item,
        order_id: uuid.v4(),
        price: parseInt(price),
        gross_amount: parseInt(totalPrice),
        origin_city: origin,
        destination_city: destination,
        courier,
        shipping_cost: parseInt(shippingCost),
        destination_city_name: destinationCityDetail.cityName,
        destination_postal_code: destinationCityDetail.postalCode,
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

    const transaction = await prisma.transaction.create({
      data: {
        order_id_midtrans: transactionDetails.transaction_details.order_id, // Simpan order_id Midtrans
        gross_amount: transactionDetails.transaction_details.gross_amount,
      },
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

    const order = await prisma.order.findMany({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
        status: true,
        date: true,
        cart: {
          select: {
            product: {
              include: {
                images: {
                  orderBy: {
                    id: "asc",
                  },
                },
              },
            },
          },
        },
      },
      // include: {
      //   cart: {
      //     select: {
      //       product: {
      //         include: {
      //           images: {
      //             orderBy: {
      //               id: "asc",
      //             },
      //           },
      //         },
      //       },
      //     },
      //     // include: {
      //     //   product: {
      //     //     include: {
      //     //       images: {
      //     //         orderBy: {
      //     //           id: "asc",
      //     //         },
      //     //       },
      //     //     },
      //     //   },
      //     // },
      //   },
      // },
      orderBy: {
        id: "desc",
      },
    });

    return order;
  },

  showDetailOrder: async (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { userId } = decoded;

    const { id } = req.params;
    const order = await prisma.order.findFirst({
      where: {
        user_id: userId,
        id: Number(id),
      },
      include: {
        cart: {
          select: {
            product: {
              include: {
                images: {
                  orderBy: {
                    id: "asc",
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
      },
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

    const order = await prisma.order.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (!order) {
      throw new ResponseError(400, "order not found");
    }

    await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        status_shipment,
      },
    });

    return order;
  },
};
