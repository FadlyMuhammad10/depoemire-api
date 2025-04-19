const { jwtDecode } = require("jwt-decode");
const prisma = require("../lib/prisma");
const midtransClient = require("midtrans-client");
const {
  showOrder,
  showDetailOrder,
  completeShippment,
} = require("../service/participant-service");

const uuid = require("uuid");

let snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: process.env.server_key,
  clientKey: process.env.client_key,
});

const show = async (req, res, next) => {
  try {
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
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwtDecode(token);
    const { userId } = decoded;

    const { product_id, quantity } = req.body;

    const product = await prisma.product.findUnique({
      where: {
        id: product_id,
      },
    });
    if (product.stock < quantity) {
      throw new ResponseError(400, `stock has only: ${product.stock}`);
    }

    //check cart
    const checkCart = await prisma.cart.findMany({
      where: {
        user_id: userId,
        product_id,
        isCheckout: false,
      },
    });
    if (checkCart.length > 0) {
      // throw new ResponseError(400, "product already in cart");
      await prisma.cart.updateMany({
        where: {
          user_id: userId,
          product_id,
          isCheckout: false,
        },
        data: {
          quantity: checkCart[0].quantity + quantity,
        },
      });
    } else {
      await prisma.cart.create({
        data: {
          user_id: userId,
          product_id,
          quantity,
        },
      });
    }
    // const result = await addCart(req);
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
    // const result = await showCart(req);
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

    const order = await prisma.order.create({
      data: {
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

    res.status(200).json({
      data: {
        order: order.id,
        token: transactionToken.token,
        url: transactionToken.redirect_url,
        transaction: transaction.id,
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
};
