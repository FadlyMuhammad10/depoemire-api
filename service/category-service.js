const {
  createSchema,
  updateSchema,
} = require("../validation/category-validation");
const { ResponseError } = require("../error/response-error");
const categoryRepository = require("../repository/categoryRepository");

module.exports = {
  createCategory: async (req) => {
    const validationResult = createSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw new ResponseError(400, validationResult.error.message);
    }

    const { name } = validationResult.data;

    const category = await categoryRepository.createCategory({ name });

    return category;
  },

  getCategories: async () => {
    const categories = await categoryRepository.findAll();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      productCount: category._count.products,
    }));
  },

  updateCategory: async (req) => {
    const validationResult = updateSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw new ResponseError(400, validationResult.error.message);
    }

    const { id } = req.params;
    const { name } = validationResult.data;

    const category = await categoryRepository.updateCategory(id, { name });
    return category;
  },

  deleteCategory: async (req) => {
    const { id } = req.params;

    const category = await categoryRepository.deleteCategory(id);

    return category;
  },
};
