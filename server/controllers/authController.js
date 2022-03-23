require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  createToken: (id, username) => {
    return jwt.sign(
      {
        id: id,
        username: username,
      },
      process.env.SECRET
    );
  },
  verifyToken: async (req, res, next) => {
    try {
      const token = req.header("Authorization");
      if (!token) {
        return res.status(400).json({
          status: "fail",
          data: { token: "No token found in request" },
        });
      }

      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!decodedToken) {
        return res.status(400).json({
          status: "fail",
          data: { token: "You are not authenticated" },
        });
      }

      const user = await User.findOne({ _id: decodedToken.id });
      if (!user) {
        return res.status(400).json({
          status: "fail",
          data: { user: "No user belonging to this token" },
        });
      }
      req.user = user;
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  verifySameUser: async (req, res, next) => {
    try {
      const token = req.header("Authorization");
      if (!token) {
        return res.status(400).json({
          status: "fail",
          data: { token: "No token found in request" },
        });
      }

      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!decodedToken) {
        return res.status(400).json({
          status: "fail",
          data: { token: "You are not authenticated" },
        });
      }

      if (req.params.id != decodedToken.id) {
        return res.status(400).json({
          status: "fail",
          data: { token: "You are not allowed to access this users resources" },
        });
      }
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  loginUser: async (req, res) => {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        data: { username: "No user exists with this username" },
      });
    }

    if (isCorrectPassword(req.body.password, user.password)) {
      const token = authController.createToken(user._id, user.username);
      return res
        .status(200)
        .json({ status: "success", data: { token: token, id: user._id } });
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid password" });
    }
  },
};

async function isCorrectPassword(plainPassword, encodedPassword) {
  return await bcrypt.compare(plainPassword, encodedPassword);
}

module.exports = authController;
