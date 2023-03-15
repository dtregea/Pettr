require("dotenv").config();
//require('dotenv').config({ path: require('find-config')('.env') })
import express from "express";
const app = express();
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import credentials from "./middleware/credentials";
import corsOptions from "./config/corsOptions";
const cloudinary = require("cloudinary").v2;
import { logger } from "./middleware/logEvents";
import path from "path";
import userRoute from "./routes/userRoute";
import loginRoute from "./routes/loginRoute";
import petRoute from "./routes/petRoute"
import postsRoute from "./routes/postsRoute"
import followRoute from "./routes/followRoute"
import refreshRoute from "./routes/refreshRoute"
import searchRoute from "./routes/searchRoute"

cloudinary.config({
  cloud_name: process.env.CDN_NAME,
  api_key: process.env.CDN_KEY,
  api_secret: process.env.CDN_SECRET,
  secure: true,
});

app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use(credentials);
app.use(logger);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(userRoute);
app.use(loginRoute);
app.use(petRoute);
app.use(postsRoute);
app.use(followRoute);
app.use(refreshRoute);
app.use(searchRoute);

app.get("/*", (req, res) => {
  res.sendFile(
    path.join(path.join(__dirname, "..", "client", "build", "index.html"))
  );
});

const port = process.env.PORT || 5000;
try {
  mongoose.connect(
    process.env.DATABASE_CONNECTION || '',
    // @ts-ignore
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
      if (error) {
        console.log("Database connection failure");
        console.log(error);
      } else {
        console.log("Database connection success");
      }
    }
  );
} catch (error) {
  console.log("error in connecting");
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
