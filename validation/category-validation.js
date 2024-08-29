const { z } = require("zod");

const createSchema = z.object({
  name: z
    .string()
    .min(1, "Name Category is required")
    .max(20, "Name Category is too long"),
});
const updateSchema = z.object({
  name: z
    .string()
    .min(1, "Name Category is required")
    .max(20, "Name Category is too long"),
});

module.exports = { createSchema, updateSchema };
