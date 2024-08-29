const { z } = require("zod");

const createSchema = z.object({
  product_id: z.number({ invalid_type_error: "Product id is required" }),
  quantity: z.number({ invalid_type_error: "Quantity is required" }),
});

module.exports = { createSchema };
