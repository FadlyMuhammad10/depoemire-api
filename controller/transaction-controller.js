const { createWebhookMidtrans } = require("../service/transaction-service");

const webhook = async (req, res, next) => {
  try {
    const result = await createWebhookMidtrans(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { webhook };
