require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const accountController = {
  registerUser: async (req, res) => {
    try {
      const newPassword = await bcrypt.hash(req.body.password, 10);
      await User.create(
        {
          username: req.body.username,
          fullname: req.body.name,
          email: req.body.email,
          password: newPassword,
        },
        (error, user) => {
          if (error) {
            if (error.code === 11000) {
              res.status(400).json({ token: false, message: "Duplicate User" });
            }
          } else if (user) {
            const token = jwt.sign(
              {
                email: req.body.email,
              },
              process.env.SECRET
            );
            console.log("User created");
            res.status(200).json({ token: token });
          }
        }
      );
    } catch (err) {
      res.status(500).json({ token: false });
    }
  },
  loginUser: async (req, res) => {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      console.log("Invalid user");
      return res.status(400).json({
        token: false,
        error: "There is no user with this email",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          fullname: user.username,
          email: user.email,
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
