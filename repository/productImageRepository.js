const prisma = require("../lib/prisma");

exports.createImage = async (data) => {
  return prisma.productImage.create({
    data,
  });
};

exports.deleteMany = async (pid) => {
  return prisma.productImage.deleteMany({
    where: {
      product_id: Number(pid),
    },
  });
};
