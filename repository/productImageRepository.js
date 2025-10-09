exports.createImage = async (tx, data) => {
  return tx.productImage.create({
    data,
  });
};

exports.deleteMany = async (tx, pid) => {
  return tx.productImage.deleteMany({
    where: {
      product_id: Number(pid),
    },
  });
};

exports.deleteImage = async (tx, imageId) => {
  return tx.productImage.delete({
    where: {
      id: Number(imageId),
    },
  });
};
