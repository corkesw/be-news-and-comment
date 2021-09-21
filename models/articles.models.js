const db = require("../db/connection.js");
const format = require("pg-format");
const request = require("superagent");
const { addKeys } = require("../db/utils/data-manipulation");

exports.selectArticleById = async (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - article_id must be a number",
    });
  }
  const count = await db.query(
    `SELECT COUNT(article_id) FROM comments WHERE article_id = $1`,
    [article_id]
  );
  const results = await db.query(
    `SELECT author, title, article_id, body, topic, created_at, votes FROM articles WHERE article_id = $1`,
    [article_id]
  );

  if (!results.rows.length) {
    return Promise.reject({
      status: 404,
      msg: "Not found - there is not an article with selected article_id",
    });
  }

  results.rows[0].comment_count = Number(count.rows[0].count);
  return results.rows[0];
};

exports.updateArticleById = async (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 422,
      msg: "Unprocessable Entity, error in request body",
    });
  }
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - article_id must be a number",
    });
  }
  const updatedArticle = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
    [inc_votes, article_id]
  );
  if (!updatedArticle.rows.length) {
    return Promise.reject({
      status: 404,
      msg: "Not found - there is not an article with selected article_id",
    });
  }
  return updatedArticle.rows[0];
};

exports.selectArticles = async (sort_by) => {
  let queryString = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id`;
  if (sort_by) {
    queryString += ` ORDER by $1 DESC`;
  }
  console.log(queryString, sort_by);

  const articles = await db.query(queryString, [sort_by]);

  return articles.rows;
};
