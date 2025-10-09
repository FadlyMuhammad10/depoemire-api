const prisma = require("../lib/prisma");

exports.findAll = async () => {
  return prisma.category.findMany({
    orderBy: { id: "asc" },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
};

exports.createCategory = async (data) => {
  return prisma.category.create({
    data,
  });
};

exports.updateCategory = async (id, data) => {
  return prisma.category.update({
    where: { id: Number(id) },
    data,
  });
};

exports.deleteCategory = async (id) => {
  return prisma.category.delete({
    where: { id: Number(id) },
  });
};
