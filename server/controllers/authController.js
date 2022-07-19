require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '1d';
const authController = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers.authorization || req.headers.Authorization;
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({
            status: "fail",
            message: "You are not allowed to access this users resources" ,
          });
        }
        req.user = decoded?.UserInfo?._id;
        next();
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  verifySameUser: async (req, res, next) => {
    try {
      if (!(req.user != req.params.id)) {
        return res.status(403).json({
          status: "fail",
          message: "You are not allowed to access this users resources" ,
        });
      }
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  verifyId: async (req, id) => {
    return req.user == id;
  },
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password)
        return res
          .status(400)
          .json({ message: "Username and password are required." });

      const foundUser = await User.findOne({ username: username }).exec();
      if (!foundUser) {
        return res
          .status(400)
          .json({
            status: "fail",
            message: "No user found with this username",
          });
      }
      // evaluate password
      const match = await bcrypt.compare(password, foundUser.password);
      if (!match) {
        return res
          .status(400)
          .json({
            status: "fail",
            message: "Incorrect password",
          });
      }
      // create JWTs
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            _id: foundUser._id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRATION }
      );
      const refreshToken = jwt.sign(
        { _id: foundUser._id, username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRATION }
      );
      // Saving refreshToken with current user
      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();

      return res
        .cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          status: "success",
          data: { accessToken: accessToken, userId: foundUser._id },
        });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  handleRefreshToken: async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden
    // evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
          return res.sendStatus(403);
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: decoded.username,
              _id: decoded._id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: ACCESS_TOKEN_EXPIRATION }
        );
        res.json({ accessToken: accessToken, userId: foundUser._id });
      }
    );
  },
};

async function isCorrectPassword(plainPassword, encodedPassword) {
  return await bcrypt.compare(plainPassword, encodedPassword);
}

module.exports = authController;
