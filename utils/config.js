require("dotenv").config();

const mongoUrl = process.env.MONGO_URI;
const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;
const imgbbApiKey = process.env.IMGBB_API_KEY;

module.exports = { mongoUrl, port, secretKey, imgbbApiKey };
