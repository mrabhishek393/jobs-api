const { StatusCodes } = require("http-status-codes");
require("express-async-errors");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

const userSchema = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("Please provide email and password");
  const item = await userSchema.findOne({ email: email });
  if (!item) throw new UnauthenticatedError("No such User exists");

  const isSame = await bcrypt.compare(password, item.password);

  if (!isSame) throw new UnauthenticatedError("Wrong password entered");

  const token = item.createToken();
  res.status(StatusCodes.OK).json({ token });
};

const register = async (req, res) => {
  const { name, password, email } = req.body;

  const user = {
    name: name,
    password: password,
    email: email,
  };

  const entry = await userSchema.create(user);
  const token = entry.createToken();
  res.status(StatusCodes.CREATED).json({ msg: "Successful", token: token });
};

module.exports = { login, register };
