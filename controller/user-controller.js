const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const { createPayloadUser, createJwt } = require("../utils");
const dotenv = require("dotenv");
dotenv.config();

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const emailExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailExist) {
      return res.status(400).json({ errors: "Email already exist" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    delete user.password;

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(403).json({ errors: "Invalid email or password" });
    }

    const token = createJwt({ payload: createPayloadUser(user) });

    res.status(200).json({
      data: token,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

module.exports = { createUser, login };
