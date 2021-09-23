const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getArticleComments,
  postArticleComments
} = require("../controllers/articles.controllers");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getArticleComments)
articlesRouter.get("/", getArticles);

articlesRouter.patch("/:article_id", patchArticleById);

articlesRouter.post("/:article_id/comments", postArticleComments)

module.exports = { articlesRouter };