const db = require("../connection.js");
const format = require("pg-format");
const { formatData } = require("../utils/data-manipulation.js");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics;");
    })
    .then(() => {
      return db.query(
        "CREATE TABLE topics (slug VARCHAR (50) PRIMARY KEY NOT NULL, description VARCHAR(255) NOT NULL);"
      );
    })
    .then(() => {
      return db.query(
        "CREATE TABLE users (username VARCHAR(255) PRIMARY KEY NOT NULL, avatar_url VARCHAR(1000), name VARCHAR(255) NOT NULL);"
      );
    })
    .then(() => {
      return db.query(
        "CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, body TEXT NOT NULL, votes INT NOT NULL, topic VARCHAR NOT NULL REFERENCES topics(slug), author VARCHAR(255) NOT NULL REFERENCES users(username), created_at TIMESTAMP NOT NULL);"
      );
    })
    .then(() => {
      return db.query(
        "CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, author VARCHAR(255) NOT NULL REFERENCES users(username), article_id INT NOT NULL REFERENCES articles(article_id), votes INT NOT NULL, created_at TIMESTAMP NOT NULL, body TEXT NOT NULL);"
      );
    })
    .then(() => {
      const keys = ["username", "name", "avatar_url"];
      const formattedUsers = formatData(userData, keys);
      const queryString = format(
        "INSERT INTO users (username, name, avatar_url) VALUES %L;",
        formattedUsers
      );
      return db.query(queryString);
    })
    .then(() => {
      const keys = ["slug", "description"];
      const formattedTopics = formatData(topicData, keys);
      const queryString = format(
        "INSERT INTO topics (slug, description) VALUES %L;",
        formattedTopics
      );
      return db.query(queryString);
    })
    .then(() => {
      const keys = ["title", "body", "votes", "topic", "author", "created_at"];
      const formattedArticles = formatData(articleData, keys);
      const queryString = format(
        "INSERT INTO articles (title, body, votes, topic, author, created_at) VALUES %L;",
        formattedArticles
      );
      return db.query(queryString);
    })
    .then(() => {
      const keys = ['author', 'article_id', 'votes', 'created_at', 'body']
      const formattedComments = formatData(commentData, keys)
      const queryString = format("INSERT INTO comments (author, article_id, votes, created_at, body) VALUES %L;", formattedComments)
      return db.query(queryString)
    });
};

module.exports = {seed};
