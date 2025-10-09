const { ResponseError } = require("../error/response-error");
const prisma = require("../lib/prisma");
const orderRepository = require("../repository/orderRepository");
module.exports = {
  getOrders: async (req) => {
    const orders = await orderRepository.findAll();

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
    const order = await orderRepository.updateOrder(id, {
      status_shipment,
      receipt,
    });
    return order;
  },
};
