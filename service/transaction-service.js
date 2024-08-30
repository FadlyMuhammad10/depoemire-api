const { ResponseError } = require("../error/response-error");
const prisma = require("../lib/prisma");

module.exports = {
  createWebhookMidtrans: async (req, res) => {
    const webhookData = req.body;

    // Temukan transaksi berdasarkan order_id dari webhook
    const transaction = await prisma.transaction.findUnique({
      where: { order_id_midtrans: webhookData.order_id },
    });

    if (!transaction) {
      throw new ResponseError(
        404,
        `Transaksi tidak ditemukan dengan order_id: :  ${webhookData.order_id}`
      );
    }

    // Perbarui status transaksi sesuai dengan yang diterima dari webhook
    transaction.transaction_status = webhookData.transaction_status;
    transaction.transaction_id = webhookData.transaction_id;
    transaction.fraud_status = webhookData.fraud_status;
    transaction.payment_type = webhookData.payment_type;
    transaction.status_code = webhookData.status_code;
    transaction.transaction_time = webhookData.transaction_time;

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: transaction,
    });

    // Temukan pesanan berdasarkan order_id yang terkait dengan transaksi
    const order = await prisma.order.findUnique({
      where: { order_id: transaction.order_id_midtrans },
    });

    if (!order) {
      throw new ResponseError(
        404,
        `Pesanan tidak ditemukan dengan order_id: :  ${webhookData.order_id}`
      );
    }

    // Perbarui status pesanan sesuai dengan status transaksi yang diterima dari webhook
    order.status = webhookData.transaction_status;

    await prisma.order.update({
      where: { id: order.id },
      data: order,
    });

    if (webhookData.transaction_status === "settlement") {
      const { cart_item } = order;

      // Temukan semua item dalam cart terkait
      const cartItems = await prisma.cart.findMany({
        where: { id: cart_item },
        include: { product: true },
      });

      // Kurangi stok produk berdasarkan item dalam cart
      for (const item of cartItems) {
        await prisma.product.update({
          where: { id: item.product_id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      //   update is checkouted
      await prisma.cart.updateMany({
        where: { id: cart_item },
        data: {
          isCheckout: true,
        },
      });
    }

    return res.status(200).send("Webhook dari Midtrans berhasil diterima");
  },
};
