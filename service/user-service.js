const bcrypt = require("bcrypt");
const { ResponseError } = require("../error/response-error");
const { createJwt, createPayloadUser } = require("../utils");
const userRepository = require("../repository/userRepository");

exports.register = async ({ name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) throw new ResponseError(400, "Email already exist");

  const hash = await bcrypt.hash(password, 10);
  const newUser = await userRepository.createUser({
    name,
    email,
    password: hash,
  });

  delete newUser.password;
  return newUser;
};

exports.login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new ResponseError(403, "Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ResponseError(400, "Invalid email or password");

  const token = createJwt({ payload: createPayloadUser(user) });
  return token;
};
