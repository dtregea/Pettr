require("dotenv").config();
//require('dotenv').config({ path: require('find-config')('.env') })
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");

app.use(credentials);
app.use(logger);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(require("./routes/userRoute"));
app.use(require("./routes/loginRoute"));
app.use(require("./routes/petRoute"));
app.use(require("./routes/postsRoute"));
app.use(require("./routes/followRoute"));
app.use(require("./routes/refreshRoute"));
app.use(require("./routes/searchRoute"));

const port = process.env.PORT || 5000;
try {
  mongoose.connect(
    process.env.DATABASE_CONNECTION,
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
