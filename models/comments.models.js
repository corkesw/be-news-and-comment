const db = require("../db/connection.js");
const format = require("pg-format");
const { checkExists } = require("../db/utils/data-manipulation");

exports.removeCommentById = async (comment_id) => {
  // reject invalid comment_id
  if (isNaN(comment_id)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - comment_id must be a number",
    });
  }
  // check if comment exists
  const commentExists = await checkExists("comments", "comment_id", comment_id);
  if (!commentExists) {
    return Promise.reject({
      status: 404,
      msg: "Comment does not exist",
    });
  }

  const deletedComment = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
    [comment_id]
  );
  return deletedComment;
};

exports.updateCommentById = async (comment_id, inc_votes) => {
  // handle missing parameters in request body
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input",
    });
  }

  const updatedComment = await db.query(
    `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
    [inc_votes, comment_id]
  );

  // handle non-existent comment_id
  if (!updatedComment.rows.length) {
    return Promise.reject({
      status: 404,
      msg: "Not found - there is not a comment with selected comment_id",
    });
  }

  return updatedComment.rows[0];
};
