const { ResponseError } = require("../error/response-error");
const prisma = require("../lib/prisma");
const {
  createSchema,
  updateSchema,
} = require("../validation/product-validation");
const cloudinary = require("../lib/cloudinary");

module.exports = {
  createProduct: async (req) => {
    const body = {
      ...req.body,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      category_id: Number(req.body.category_id),
      primaryImageIndex: req.body.primaryImageIndex
        ? Number(req.body.primaryImageIndex)
        : 0,
    };
    const validationResult = createSchema.safeParse(body);

    if (!validationResult.success) {
      throw new ResponseError(400, validationResult.error.message);
    }

    const { name, description, price, stock, category_id, primaryImageIndex } =
      validationResult.data;

    const uploads = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "depoemire/product",
      });
      uploads.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        category_id,
      },
    });

    // Create product images
    const productImages = [];
    for (let i = 0; i < uploads.length; i++) {
      const upload = uploads[i];
      const isPrimary = i === primaryImageIndex;
      const image = await prisma.productImage.create({
        data: {
          product_id: product.id,
          image_url: upload.url,
          public_id: upload.public_id,
          isPrimary: isPrimary, // User pilih mana yang jadi primary
        },
      });
      productImages.push(image);
    }

    return {
      ...product,
      images: productImages,
    };
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
