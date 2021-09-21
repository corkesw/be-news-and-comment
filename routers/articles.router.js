const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("../controllers/articles.controllers");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.get("/", getArticles);

module.exports = { articlesRouter };
