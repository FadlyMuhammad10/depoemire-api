const { ResponseError } = require("../error/response-error");
const prisma = require("../lib/prisma");
module.exports = {
  getOrders: async (req) => {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
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
    });

    return orders;
  },

  updateStatusShipping: async (req) => {
    const { id } = req.params;
    const { status_shipment, receipt } = req.body;
    if (!["processing", "delivered", "completed"].includes(status_shipment)) {
      throw new ResponseError(
        400,
        "Status harus processing, delivered, completed"
      );
    }
    const order = await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        status_shipment,
        receipt,
      },
    });
    return order;
  },
};
