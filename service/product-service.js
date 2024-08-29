const { ResponseError } = require("../error/response-error");
const prisma = require("../lib/prisma");
const {
  createSchema,
  updateSchema,
} = require("../validation/product-validation");

module.exports = {
  createProduct: async (req) => {
    const validationResult = createSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw new ResponseError(400, validationResult.error.message);
    }

    const { name, description, price, stock, category_id } =
      validationResult.data;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        category_id,
      },
    });
    return product;
  },

  getProducts: async (req) => {
    const products = await prisma.product.findMany({
      include: {
        categories: {
          select: {
            name: true,
          },
        },
        images: {
          orderBy: {
            id: "asc",
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return products;
  },

  getOneProduct: async (req) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        categories: {
          select: {
            name: true,
          },
        },
        images: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });
    return product;
  },

  updateProduct: async (req) => {
    const validationResult = updateSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw new ResponseError(400, validationResult.error.message);
    }

    const { id } = req.params;
    const { name, description, price, stock, category_id } =
      validationResult.data;
    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        description,
        price,
        stock,
        category_id,
      },
    });
    return product;
  },

  deleteProduct: async (req) => {
    const { id } = req.params;

    const product = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    return product;
  },

  changeStatus: async (req) => {
    const { id } = req.params;
    const { status } = req.body;
    if (![true, false].includes(status)) {
      throw new ResponseError(400, "Status harus true atau false");
    }
    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
      },
    });
    return product;
  },
};
