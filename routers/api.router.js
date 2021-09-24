const apiRouter = require("express").Router();
const fsPromise = require("fs").promises;
const readFile = require("../db/utils/data-manipulation");

const topicsRouter = require("./topics.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("../routers/comments.router")
const usersRouter = require("./users.router")


apiRouter.get("/", (req, res, next) => {

  return fsPromise
    .readFile('./endpoints.json', "utf-8")
    .then((response) => {
      const endpoints = JSON.parse(response)
      res.status(200).send({endpoints});
    })
    .catch(next)

});

apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter)

module.exports = apiRouter;
