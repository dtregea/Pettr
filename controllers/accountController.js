require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const accountController = {
  authenticateUser: async (req, res) => {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      console.log("Invalid user");
      return res.status(400).json({
        token: false,
        error: "There is no user with this username",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          username: user.username,
        },
        process.env.SECRET
      );

      return res.status(200).json({ token: token });
    } else {
      return res.status(400).json({ token: false, error: "Invalid password" });
    }
  },
};

module.exports = accountController;
