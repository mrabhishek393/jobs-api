const { StatusCodes } = require("http-status-codes");
const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require("../errors");
const jwt = require("jsonwebtoken");
const Job = require("../models/Job");

const getAllJobs = async (req, res) => {
  const items = await Job.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ jobs: items });
};

const getJob = async (req, res) => {
  const item = await Job.findOne({
    _id: req.params.id,
    createdBy: req.user.userId,
  });
  if (!item) throw new NotFoundError("No such job exists");
  res.status(StatusCodes.OK).json(item);
};
const updateJob = async (req, res) => {
  const item = await Job.findByIdAndUpdate(
    { _id: req.params.id, createdBy: req.user.userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!item) throw new NotFoundError("No such job exists");
  res.status(StatusCodes.OK).json(item);
};
const deleteJob = async (req, res) => {
  const item = await Job.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.userId,
  });
  if (!item) throw new NotFoundError("No such job exists");
  res.status(StatusCodes.OK).json({ deleted: true, entryDeleted: item });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const item = await Job.create(req.body);
  res.status(StatusCodes.OK).json(item);
};

module.exports = { getAllJobs, getJob, updateJob, deleteJob, createJob };
