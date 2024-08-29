const createPayloadUser = (user) => {
  return {
    name: user.name,
    userId: user.id,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };
};

module.exports = { createPayloadUser };
