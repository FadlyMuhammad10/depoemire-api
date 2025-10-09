const prisma = require("../lib/prisma");

exports.findBy = async (data) => {
  return prisma.cart.findMany({
    where: data,
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
};

exports.updateCartQuantity = async (userId, productId, data) => {
  return prisma.cart.updateMany({
    where: {
      user_id: userId,
      product_id: productId,
      isCheckout: false,
    },
    data,
  });
};

exports.createCart = async (data) => {
  return prisma.cart.create({
    data,
  });
};

exports.deleteCart = async (data) => {
  return prisma.cart.delete({
    where: data,
  });
};
