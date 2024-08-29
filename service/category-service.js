const {
  createSchema,
  updateSchema,
} = require("../validation/category-validation");
const { ResponseError } = require("../error/response-error");
const prisma = require("../lib/prisma");

module.exports = {
  createCategory: async (req) => {
    const validationResult = createSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw new ResponseError(400, validationResult.error.message);
    }

    const { name } = validationResult.data;

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return category;
  },

  getCategories: async () => {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return categories;
  },

  updateCategory: async (req) => {
    const validationResult = updateSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw new ResponseError(400, validationResult.error.message);
    }

    const { id } = req.params;
    const { name } = validationResult.data;

    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });
    return category;
  },

  deleteCategory: async (req) => {
    const { id } = req.params;

    const category = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    return category;
  },
};
