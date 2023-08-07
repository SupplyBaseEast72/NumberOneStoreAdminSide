const calendarRouter = require("express").Router();
const axios = require("axios");

calendarRouter.post("/", async (req, res) => {
  const response = await axios.post(
    "https://script.google.com/macros/s/AKfycbzJiekbfXcffgqW1Gl3Iv_9TP5MuBWvEuiLVG2CMad0nRxosyq1OCGssYOu5i7v3RwqUA/exec",
    req.body
  );
  res.send(200);
});

module.exports = calendarRouter;
