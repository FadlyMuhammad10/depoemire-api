const prisma = require("../lib/prisma");

exports.findAll = async () => {
  return prisma.product.findMany({
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
};

exports.findOne = async (id) => {
  return prisma.product.findUnique({
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
};

exports.createProduct = async (tx, data) => {
  return tx.product.create({
    data,
  });
};

exports.updateProduct = async (tx, id, data) => {
  return tx.product.update({
    where: {
      id: Number(id),
    },
    data,
  });
};

exports.deleteProduct = async (id) => {
  return prisma.product.delete({
    where: {
      id: Number(id),
    },
  });
};
