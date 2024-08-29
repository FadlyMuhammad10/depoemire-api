const { z } = require("zod");

const createSchema = z.object({
  name: z
    .string()
    .min(1, "Name Product is required")
    .max(50, "Name Product is too long"),
  description: z.string().min(1, "Description Product is required"),
  price: z
    .number({ invalid_type_error: "Price Product is required" })
    .min(1, "Price Product is required"),
  stock: z
    .number({ invalid_type_error: "Stock Product is required" })
    .min(1, "Stock Product is required"),
  category_id: z.number({ invalid_type_error: "Category Product is required" }),
});
const updateSchema = z.object({
  name: z
    .string()
    .min(1, "Name Product is required")
    .max(50, "Name Product is too long"),
  description: z.string().min(1, "Description Product is required"),
  price: z
    .number({ invalid_type_error: "Price Product is required" })
    .min(1, "Price Product is required"),
  stock: z
    .number({ invalid_type_error: "Stock Product is required" })
    .min(1, "Stock Product is required"),
  category_id: z.number({ invalid_type_error: "Category Product is required" }),
});

module.exports = { createSchema, updateSchema };
