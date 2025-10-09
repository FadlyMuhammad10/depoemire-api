const prisma = require("../lib/prisma");

exports.findAll = async () => {
  return prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      carts: {
        include: {
          cart: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

exports.findByAll = async (data) => {
  return prisma.order.findMany({
    where: data,
    select: {
      id: true,
      order_id: true,
      status: true,
      date: true,
      gross_amount: true,
      shipping_cost: true,
      carts: {
        select: {
          id: true,
          order_id: true,
          cart: {
            // Ini relasi ke tabel Cart
            select: {
              id: true,
              product: {
                include: {
                  images: {
                    orderBy: {
                      id: "asc",
                    },
                  },
                },
              },
              quantity: true,
              isCheckout: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};

exports.updateOrder = async (id, data) => {
  return prisma.order.update({
    where: {
      id: Number(id),
    },
    data,
  });
};

exports.createOrder = async (data) => {
  return prisma.order.create({
    data,
  });
};

exports.findByOne = async (data) => {
  return prisma.order.findFirst({
    where: data,
    include: {
      carts: {
        select: {
          id: true,
          order_id: true,
          cart: {
            // Ini relasi ke tabel Cart
            select: {
              id: true,
              product: {
                include: {
                  images: {
                    orderBy: {
                      id: "asc",
                    },
                  },
                },
              },
              quantity: true,
              isCheckout: true,
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
};
