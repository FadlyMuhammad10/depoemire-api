const { z } = require("zod");

const createSchema = z.object({
  product_id: z.number({ message: "Product id is required" }),
  quantity: z.number({ message: "Quantity is required" }),
});

module.exports = { createSchema };
