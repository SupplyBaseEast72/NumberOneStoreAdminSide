const { info, error } = require("./logger");

const requestLogger = (req, res, next) => {
  const method = req.method;
  const path = req.path;
  const body = JSON.stringify(req.body);

  info(`${method} ${path} ${body}`);
  next();
};

const errorHandler = (err, req, res, next) => {
  // type of error can be found in err.name
  return res.status(200).send(JSON.stringify(err));
  // if (err.name === "CastError") {
  //   return res.status(404).send("Sadge");
  // }
  return res.status(404).send(err);
};

module.exports = { requestLogger, errorHandler };
