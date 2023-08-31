const { secretKey } = require("./config");
const { info, error } = require("./logger");
const jwt = require("jsonwebtoken");

const requestLogger = (req, res, next) => {
  const method = req.method;
  const path = req.path;
  const body = JSON.stringify(req.body);

  info(`${method} ${path} ${body}`);
  next();
};

const errorHandler = (err, req, res, next) => {
  // type of error can be found in err.name
  return res.status(200).send(err);
  // if (err.name === "CastError") {
  //   return res.status(404).send("Sadge");
  // }
  return res.status(404).send(err);
};

const verifyUser = (req, res, next) => {
  const authorizationHeader = req.get("authorization").replace("bearer ", "");
  try {
    const userVerification = jwt.verify(authorizationHeader, secretKey);
    if (userVerification) {
      console.log("User has been verified and operation can be carried out");
      return next();
    }
  } catch (err) {
    // possible error names are: TokenExpiredError, JsonWebTokenError
    res.status(401).send({ error: err.name });
  }
};

module.exports = { requestLogger, errorHandler, verifyUser };
