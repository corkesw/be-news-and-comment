const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getArticleComments,
  postArticleComments,
  postArticle,
  deleteArticleById
} = require("../controllers/articles.controllers");


articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById)

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComments)



module.exports = articlesRouter;