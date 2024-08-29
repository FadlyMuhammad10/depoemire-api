const bcrypt = require("bcrypt");
const { signupSchema, signinSchema } = require("../validation/user-validation");
const { ResponseError } = require("../error/response-error");
const prisma = require("../lib/prisma");
const { createJwt, createPayloadUser } = require("../utils");

const createUser = async (req) => {
  const validationResult = signupSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw new ResponseError(400, validationResult.error.message);
  }

  const { name, email, password } = validationResult.data;

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
    },
  });

  delete user.password;

  return user;
};

const loginUser = async (req) => {
  const validationResult = signinSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw new ResponseError(400, validationResult.error.message);
  }

  const { email, password } = validationResult.data;
  if (!email || !password) {
    throw new ResponseError(400, "Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ResponseError(403, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ResponseError(403, "Invalid email or password");
  }

  const token = createJwt({ payload: createPayloadUser(user) });

  return token;
};

module.exports = { createUser, loginUser };
