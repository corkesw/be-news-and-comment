const express = require("express");
const apiRouter = require("./routers/api.router.js");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleInvalidPath
} = require("./errors/index.js");


const app = new express();
app.use(express.json());
app.use("/api", apiRouter);

app.all("*", handleInvalidPath);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
