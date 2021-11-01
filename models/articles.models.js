const db = require("../db/connection.js");
const format = require("pg-format");
const { checkExists } = require("../db/utils/data-manipulation");

exports.selectArticleById = async (article_id) => {
  const results = await db.query(
    `SELECT COUNT (comments.comment_id) AS comment_count, title, articles.article_id, articles.author, articles.body, topic, articles.created_at, articles.votes FROM articles 
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
    [article_id]
  );

  // handle non-existent article_id
  if (!results.rows.length) {
    return Promise.reject({
      status: 404,
      msg: "Not found - there is not an article with selected article_id",
    });
  }
  return results.rows[0];
};

exports.updateArticleById = async (article_id, inc_votes, body) => {
  
  let updatedArticle

  if(body) { 
    updatedArticle = await db.query(
      `UPDATE articles SET body = $1 WHERE article_id = $2 RETURNING *`,
      [body, article_id]
    );
  }

  if(inc_votes) {
    updatedArticle = await db.query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    );
  }

  // handle missing parameters in request body
  if (!inc_votes && !body) {
    return Promise.reject({
      status: 422,
      msg: "Unprocessable Entity, error in request body",
    });
  }

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
  topic,
  limit = 10,
  p = 1
) => {
  // determine offset value from p and limit values
  const offset = (p - 1) * limit;
  let total_count = 0;

  // get total number of articles for query
  if (!topic) {
    const countQuery = await db.query(
      `SELECT COUNT(article_id) FROM articles;`
    );
    total_count = Number(countQuery.rows[0].count);
  } else {
    const countQuery = await db.query(
      `SELECT COUNT(article_id) FROM articles WHERE topic = $1;`,
      [topic]
    );
    total_count = Number(countQuery.rows[0].count);
  }

  // if topic query is provided, check that topic exists and reject if non-existent
  if (topic) {
    const topicQuery = await db.query(`SELECT * FROM topics WHERE slug = $1;`, [
      topic,
    ]);
    if (topicQuery.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
  }

  // reject non-number for offset and limit to prevent injection
  if (isNaN(offset) === true || isNaN(limit) === true) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
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
  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${offset};`;

  if (topic) {
    const articles = await db.query(queryString, [topic]);
    return { articles: articles.rows, total_count };
  } else {
    const articles = await db.query(queryString);
    return { articles: articles.rows, total_count };
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
    `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
    [article_id]
  );
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
      status: 404,
      msg: "User not found",
    });
  }

  // check if article exists
  const articleExists = await checkExists("articles", "article_id", article_id);
  if (!articleExists) {
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

exports.insertArticle = async (author, title, body, topic) => {
  const votes = 0;
  const comment_count = 0;
  const created_at = new Date();
  const newArticle = await db.query(
    `INSERT INTO articles 
  (author, title, body, topic, votes, created_at)
  VALUES ($1, $2, $3, $4, $5, $6) 
  RETURNING *`,
    [author, title, body, topic, votes, created_at]
  );
  newArticle.rows[0].comment_count = 0;
  return newArticle.rows[0];
};

exports.removeArticleById = async (article_id) => {
  // check if article exists
  const commentExists = await checkExists("articles", "article_id", article_id);
  if (!commentExists) {
    return Promise.reject({
      status: 404,
      msg: "Article does not exist",
    });
  }

  const deletedArticle = await db.query(
    `DELETE FROM articles WHERE article_id = $1 RETURNING *;`,
    [article_id]
  );
  return deletedArticle.rows[0];
};
