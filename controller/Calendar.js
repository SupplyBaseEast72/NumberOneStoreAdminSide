const calendarRouter = require("express").Router();
const axios = require("axios");

calendarRouter.post("/", async (req, res) => {
  const response = await axios.post(
    "https://script.google.com/macros/s/AKfycbzEsbkojVCiPBxxye41SBMq3RhL9Z2jkoh028xUE5NzauHLW9BBbcJHFLhuJl56gIwavA/exec",
    req.body
  );
  res.status(200).send({ ok: true });
});

module.exports = calendarRouter;
