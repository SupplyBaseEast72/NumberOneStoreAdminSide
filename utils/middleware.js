const { info, error } = require("./logger");

const requestLogger = (req, res, next) => {
  const method = req.method;
  const path = req.path;
  const body = JSON.stringify(req.body);

  info(`${method} ${path} ${body}`);
  next();
};

const errorHandler = (err, req, res, next) => {
  error(err.name);
  // type of error can be found in err.name
  res.status(404).send(err.name);
};

module.exports = { requestLogger, errorHandler };
