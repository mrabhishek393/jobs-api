const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || 500,
    message: err.message || "Something wen wrong please try again",
  };

  if (err.code && err.code === 11000)
    return res
      .status(400)
      .json({ msg: "Account with this email id already exists" });

  if (err.name && err.name === "ValidationError") {
    const msg = Object.values(err.errors).reduce((acc, item) => {
      acc += item.message + ",";
      return acc;
    }, "");
    return res.status(400).json({ msg: msg });
  }

  if (err.name && err.name === "CastError")
    return res
      .status(400)
      .json({ msg: "No such id exists: Inavlid Id provided" });

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};

module.exports = errorHandlerMiddleware;
