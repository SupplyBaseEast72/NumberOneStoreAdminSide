const app = require("./app");
const { port } = require("./utils/config");
const { info } = require("./utils/logger");

app.listen(process.env.PORT || port, () => {
  info(`App is listening on port ${port}`);
});
