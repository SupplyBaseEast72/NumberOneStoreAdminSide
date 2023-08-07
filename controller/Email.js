const emailRouter = require("express").Router();
const axios = require("axios");
require("dotenv").config();

// this is very problematic if the person keys in the wrong email address though. But I am going to assume that everyone keys it in correctly
// parameters that will be variable are: receiver object, orderId of the submitted order, [as a future upgrade, will probably wish to cc staff louis]
emailRouter.post("/", async (req, res) => {
  const { receiver, requestId } = req.body;
  const data = JSON.stringify({
    // directly responsing to this sender will enable you to respond to the store
    sender: { name: "Number One Store", email: "supplybaseeast072@gmail.com" },
    to: [receiver],
    subject: "Order confirmation",
    htmlContent: `<!DOCTYPE html><html lang="en"><body><h1>Your request ID is ${requestId}</h1></body></html>`,
  });
  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    data,
    { headers: { "api-key": process.env.BREVO_API_KEY } }
  );
  if (response.status === 201) {
    res.status(200).send({ ok: "Email successfully sent" });
  } else {
    res.status(500).send({
      ok: false,
      error: "Encountered an error while sending a confirmation email",
    });
  }
});

module.exports = emailRouter;
