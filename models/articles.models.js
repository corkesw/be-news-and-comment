const db = require("../db/connection.js");
const format = require("pg-format");
const { checkExists } = require("../db/utils/data-manipulation");


exports.selectArticleById = async (article_id) => {
 
  const count = await db.query(
    `SELECT COUNT(article_id) FROM comments WHERE article_id = $1`,
    [article_id]
  );
  const results = await db.query(
    `SELECT author, title, article_id, body, topic, created_at, votes FROM articles WHERE article_id = $1`,
    [article_id]
  );

  // handle non-existent article_id
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
  // handle missing parameters in request body
  if (!inc_votes) {
    return Promise.reject({
      status: 422,
      msg: "Unprocessable Entity, error in request body",
    });
  }

  // handle malformed article_id
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

  // handle non-existent article_id
  if (!updatedArticle.rows.length) {
    return Promise.reject({
      status: 404,
      msg: "Not found - there is not an article with selected article_id",
    });
  }
  return updatedArticle.rows[0];
};

exports.selectArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic
) => {
  // if topic query is provided, check that topic exists and reject if non-existent
  if (topic) {
    const topicQuery = await db.query(`SELECT * FROM topics WHERE slug = $1;`, [
      topic,
    ]);
    if (topicQuery.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
  }

  // if sort_by query is provided, check is argument is valid and reject if column is non-existent
  const validColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - cannot sort by unknown column",
    });
  }

  // if order query is provided, reject if not asc/desc
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({
      status: 400,
      msg: "Bad request - order should be asc or desc",
    });
  }

  // create query for db based on queries provided
  let queryString = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    `;

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
  }
  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  if (topic) {
    const articles = await db.query(queryString, [topic]);
    // if topic valid but has no articles respond with 204
    if (articles.rows.length === 0) {
      return Promise.reject({ status: 204, msg: "No content" });
    }
    return articles.rows;
  } else {
    const articles = await db.query(queryString);
    return articles.rows;
  }
};

exports.selectArticleComments = async (article_id) => {
  // handle malformed article_id
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - article_id must be a number",
    });
  }
  // handle non-existent article_id
  const articleExists = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  if (!articleExists.rows.length) {
    return Promise.reject({
      status: 404,
      msg: "Not found - there is not an article with selected article_id",
    });
  }
  const comments = await db.query(
    `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1`,
    [article_id]
  );
  // handle article with no comments
  if (comments.rows.length === 0) {
    return Promise.reject({ status: 204, msg: "No content" });
  }

  return comments.rows;
};

exports.insertArticleComments = async (article_id, username, body) => {
  // handle malformed article_id
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - article_id must be a number",
    });
  }

  // check if user exists
  const userExists = await checkExists("users", "username", username);
  if (!userExists) {
    return Promise.reject({
      status: 403,
      msg: "User does not exist - comment has been rejected",
    });
  }

  // check if article exists
  const articleExists = await checkExists("articles", "article_id", article_id)
  if(!articleExists) {
    return Promise.reject({
      status: 404,
      msg: "Not found - there is not an article with selected article_id",
    });
  }

  // create new comment
  const created_at = new Date();
  const postedComment = await db.query(
    `INSERT INTO comments (body, votes, author, article_id, created_at) VALUES ($1, 0, $2, $3, $4) RETURNING *`,
    [body, username, article_id, created_at]
  );
  return postedComment.rows[0];
};
