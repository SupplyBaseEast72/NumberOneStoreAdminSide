const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { mongoUrl } = require("./utils/config");
const { info } = require("./utils/logger");
const storeRouter = require(".//controller/Store");
const requestRouter = require(".//controller/Request");
const emailRouter = require("./controller/Email");
const calendarRouter = require("./controller/Calendar");
const userRouter = require(".//controller/User");
const { requestLogger, errorHandler } = require("./utils/middleware");

// set up the configuration to access the DB
mongoose.set("strictQuery", false);
info(`Attempting to connect to MongoDB`);
(async () => {
  await mongoose.connect(mongoUrl);
  info(`Connected to MongoDB`);
})();

// making use of all the packages that have to be loaded before the app starts
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("build"));

app.use("/api/store", storeRouter);
app.use("/api/request", requestRouter);
app.use("/api/email", emailRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/user", userRouter);

// error handling packages
app.use(errorHandler);

module.exports = app;
