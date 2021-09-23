const {
  selectArticleById,
  updateArticleById,
  selectArticles,
  selectArticleComments,
  insertArticleComments
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
    const {sort_by, order, topic} = req.query
    selectArticles(sort_by, order, topic)
    .then((articles)=> {
        res.status(200).send({articles})
    })
    .catch(next)
};

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params
    selectArticleComments(article_id)
    .then((comments) => {
      res.status(200).send({comments})
    })
    .catch(next)
}

exports.postArticleComments = (req, res, next) => {
  const {article_id} = req.params;
  const {username, body} = req.body;
  insertArticleComments(article_id, username, body)
  .then((comment) => {
    res.status(201).send({comment})
  })
  .catch(next)
}
