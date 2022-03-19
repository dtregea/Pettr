require("dotenv").config();
//require('dotenv').config({ path: require('find-config')('.env') })
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(require("./routes/userRoute"));
app.use(require("./routes/loginRoute"));
// app.use(require("./routes/registerRoute"));
app.use(require("./routes/postsRoute"));
app.use(require("./routes/followRoute"));

const port = process.env.PORT || 5000;

try {
  mongoose.connect(process.env.DATABASE_CONNECTION);
  console.log("Database connection success");
} catch (error) {
  console.log("error in connecting");
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
