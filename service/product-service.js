const { ResponseError } = require("../error/response-error");
const prisma = require("../lib/prisma");
const {
  createSchema,
  updateSchema,
} = require("../validation/product-validation");
const cloudinary = require("../lib/cloudinary");
const productRepository = require("../repository/productRepository");
const productImgRepository = require("../repository/productImageRepository");

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
      status: req.body.status ? Boolean(req.body.status) : false,
    };
    const validationResult = createSchema.safeParse(body);

    if (!validationResult.success) {
      throw new ResponseError(400, validationResult.error.message);
    }

    const {
      name,
      description,
      price,
      stock,
      category_id,
      primaryImageIndex,
      status,
    } = validationResult.data;

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

    // jalankan transaksi supaya bisa rollback/batching
    $result = await prisma.$transaction(async (tx) => {
      const product = await productRepository.createProduct(tx, {
        name,
        description,
        price,
        stock,
        category_id,
        status,
      });

      // Create product images
      const productImages = [];
      for (let i = 0; i < uploads.length; i++) {
        const upload = uploads[i];
        const isPrimary = i === primaryImageIndex;
        const image = await productImgRepository.createImage(tx, {
          product_id: product.id,
          image_url: upload.url,
          public_id: upload.public_id,
          isPrimary: isPrimary,
        });
        productImages.push(image);
      }

      return {
        ...product,
        images: productImages,
      };
    });

    return $result;
  },

  getProducts: async (req) => {
    const products = await productRepository.findAll();

    return products;
  },

  getOneProduct: async (req) => {
    const { id } = req.params;
    const product = await productRepository.findOne(id);
    return product;
  },

  updateProduct: async (req) => {
    console.log("req", req);
    const body = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : undefined,
      stock: req.body.stock ? Number(req.body.stock) : undefined,
      category_id: req.body.category_id
        ? Number(req.body.category_id)
        : undefined,
      primaryImageIndex: req.body.primaryImageIndex
        ? Number(req.body.primaryImageIndex)
        : 0,
      status: req.body.status ? Boolean(req.body.status) : false,
    };
    const validationResult = updateSchema.safeParse(body);

    if (!validationResult.success) {
      throw new ResponseError(400, validationResult.error.message);
    }

    const { id } = req.params;
    const {
      name,
      description,
      price,
      stock,
      category_id,
      primaryImageIndex,
      status,
    } = validationResult.data;

    // Cek apakah product ada
    const existingProduct = await productRepository.findOne(id);

    if (!existingProduct) {
      throw new ResponseError(404, "Product not found");
    }

    let uploads = [];

    // Jika ada file baru yang diupload, hapus gambar lama dari Cloudinary
    if (req.files && req.files.length > 0) {
      uploads = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "depoemire/product",
          });
          return {
            url: result.secure_url,
            public_id: result.public_id,
          };
        })
      );
    }

    const existingImageIds =
      req.body.existingImageIds &&
      Array.isArray(JSON.parse(req.body.existingImageIds))
        ? JSON.parse(req.body.existingImageIds).map(Number)
        : [];

    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Hapus hanya gambar yang tidak ada di existingImageIds
      const imagesToDelete = existingProduct.images.filter(
        (img) => !existingImageIds.includes(img.id)
      );
      for (const img of imagesToDelete) {
        await productImgRepository.deleteImage(tx, img.id);
      }
      // Upload gambar baru ke database
      let allImages = [
        ...existingProduct.images.filter((img) =>
          existingImageIds.includes(img.id)
        ),
      ];

      if (uploads.length > 0) {
        for (let i = 0; i < uploads.length; i++) {
          const upload = uploads[i];
          const newImage = await productImgRepository.createImage(tx, {
            product_id: Number(id),
            image_url: upload.url,
            public_id: upload.public_id,
            isPrimary: false, // sementara false semua
          });
          allImages.push(newImage);
        }
      }

      // 🔥 pastikan hanya satu gambar yang isPrimary = true
      if (allImages.length > 0) {
        const primaryImage = allImages[primaryImageIndex] || allImages[0];

        await tx.productImage.updateMany({
          where: { product_id: Number(id) },
          data: { isPrimary: false },
        });

        await tx.productImage.update({
          where: { id: primaryImage.id },
          data: { isPrimary: true },
        });
      }
      const product = await productRepository.updateProduct(tx, id, {
        name,
        description,
        price,
        stock,
        category_id,
        status,
      });

      return product;
    });

    if (existingProduct.images) {
      for (const image of existingProduct.images) {
        if (!existingImageIds.includes(image.id) && image.public_id) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
    }

    return updatedProduct;
  },

  deleteProduct: async (req) => {
    const { id } = req.params;

    const existingProduct = await productRepository.findOne(id);

    if (!existingProduct) {
      throw new ResponseError(404, "Product not found");
    }

    // Hapus gambar dari Cloudinary
    for (const image of existingProduct.images) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

    // Hapus record gambar dari database
    await productImgRepository.deleteMany(id);

    const product = await productRepository.deleteProduct(id);

    return product;
  },
};
