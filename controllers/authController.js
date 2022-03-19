require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.header("Authorization");
      if (!token) {
        return res.status(400).json({
          status: "fail",
          data: { token: "No token found in request" },
        });
      }

      const decoded = jwt.verify(token, process.env.SECRET);
      if (!decoded) {
        return res
          .status(400)
          .json({ status: "fail", data: { token: "Invalid token" } });
      }

      const user = await User.findOne({ _id: decoded.id });
      req.user = user;
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
      const token = jwt.sign(
        {
          username: user.username,
          id: user._id,
        },
        process.env.SECRET
      );
      return res
        .status(200)
        .json({ status: "success", data: { token: token } });
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
