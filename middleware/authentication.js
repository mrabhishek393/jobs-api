const { UnauthenticatedError, BadRequestError } = require("../errors");
const jwt = require("jsonwebtoken");

const authorizeUser = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    throw new BadRequestError("Token not provided");

  const token = auth.split(" ")[1];
  console.log(token);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Verification failed");
  }
};

module.exports = authorizeUser;
