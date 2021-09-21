const {
  selectArticleById,
  updateArticleById,
  selectArticles
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(Number(article_id))
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
    const {sort_by} = req.query
    selectArticles(sort_by)
    .then((articles)=> {
        res.status(200).send({articles})
    })
    .catch(next)
};
