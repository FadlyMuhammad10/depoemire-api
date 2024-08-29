const { ResponseError } = require("../error/response-error");
const prisma = require("../lib/prisma");

const cloudinary = require("../lib/cloudinary");

module.exports = {
  createProductImage: async (req) => {
    const { productId } = req.params;

    const uploadProductImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "depoemire/product",
    });

    const result = await prisma.productImage.create({
      data: {
        product_id: Number(productId),
        image_url: uploadProductImage.secure_url,
        public_id: uploadProductImage.public_id,
      },
    });

    return result;
  },

  deleteProductImage: async (req) => {
    const { id } = req.params;

    const productImage = await prisma.productImage.delete({
      where: {
        id: Number(id),
      },
    });

    await cloudinary.uploader.destroy(productImage.public_id);

    return productImage;
  },
};
