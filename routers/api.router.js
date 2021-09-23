const apiRouter = require("express").Router();
const fsPromise = require("fs").promises;
const readFile = require("../db/utils/data-manipulation");

const topicsRouter = require("./topics.router");
const { articlesRouter } = require("./articles.router");

apiRouter.get("/", (req, res, next) => {

  return fsPromise
    .readFile('/Users/stephencorke/northcoders/backend/be-nc-news/endpoints.json', "utf-8")
    .then((endpoints) => {
      res.status(200).send({endpoints});
    })
    .catch(next)

});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
