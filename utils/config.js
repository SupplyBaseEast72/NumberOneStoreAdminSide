require("dotenv").config();

const mongoUrl = process.env.MONGO_URI;
const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;

module.exports = { mongoUrl, port, secretKey };
