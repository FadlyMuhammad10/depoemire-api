const { jwtDecode } = require("jwt-decode");
const prisma = require("../lib/prisma");
const {
  createOrder,
  showOrder,
  showDetailOrder,
  completeShippment,
} = require("../service/participant-service");

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
