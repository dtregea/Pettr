require("dotenv").config();
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Post from "../models/postModel";
import { NextFunction, Request, Response } from "express";
import envVars from "../config/defaults";
import { AccessToken, RefreshToken } from "../types/types";

const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '1d';

const authController = {
  verifyToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization || req.headers.Authorization as string;
      if (!token) {
        return res.status(403).json({
          status: "fail",
          message: "Invalid access token",
        });
      }
      jwt.verify(token, envVars.ACCESS_TOKEN_SECRET, (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
        if (err) {
          return res.status(403).json({
            status: "fail",
            message: "Access token has expired",
          });
        }

        const accessToken = decoded as AccessToken;

        if (!accessToken?.UserInfo?._id) {
          return res.status(403).json({
            status: "fail",
            message: "Access token is invalid",
          });
        }

        req.user = accessToken.UserInfo._id;
        next();
      });
    } catch (error: any) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  verifySameUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let userId;

      if (req.originalUrl.includes('posts')) {
        let foundPost = await Post.findById(req.params.id).populate("user");
        if(!foundPost) {
          return res.status(400).json({
            status: "fail",
            message: "This post does not exist",
          });
        }
        // @ts-ignore
        userId = foundPost.user._id;
      } else if (req.originalUrl.includes('users')) {
        userId = req.params.id;
      } else if (req.originalUrl.includes('follow')) {

        if (req.query.follower) {
          userId = req.query.follower;
        }

      }
      if (req.user != userId) {
        return res.status(403).json({
          status: "fail",
          message: "You are not allowed to access this users resources",
        });
      }
      next();
    } catch (error: any) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  verifyId: async (req: Request, id: string) => {
    return req.user === id;
  },
  loginUser: async (req: Request, res: Response) => {
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
        envVars.ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRATION }
      );
      
      const refreshToken: string = jwt.sign(
        { _id: foundUser._id, username: foundUser.username },
        envVars.REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRATION }
      );
      
      // Saving refreshToken with current user
      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();
        console.log(7);
        
      return res
        .cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          status: "success",
          data: { accessToken: accessToken, userId: foundUser._id },
        });
    } catch (error: any) {
      console.log(error);
      
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  handleRefreshToken: async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden
    // evaluate jwt
    jwt.verify(
      refreshToken,
      envVars.REFRESH_TOKEN_SECRET,
      (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
        const refreshToken = decoded as RefreshToken;
        if (err || foundUser.username !== refreshToken.username)
          return res.sendStatus(403);
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: refreshToken.username,
              _id: refreshToken._id,
            },
          },
          envVars.ACCESS_TOKEN_SECRET,
          { expiresIn: ACCESS_TOKEN_EXPIRATION }
        );
        res.json({ accessToken: accessToken, userId: foundUser._id });
      }
    );
  },
};

async function isCorrectPassword(plainPassword: string, encodedPassword: string) {
  return await bcrypt.compare(plainPassword, encodedPassword);
}

export default authController;
