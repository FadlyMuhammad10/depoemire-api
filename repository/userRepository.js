const prisma = require("../lib/prisma");

exports.findByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

exports.createUser = async (data) => {
  return prisma.user.create({
    data,
  });
};
