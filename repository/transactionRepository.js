const prisma = require("../lib/prisma");

exports.createTransaction = async (data) => {
  return prisma.transaction.create({
    data,
  });
};
