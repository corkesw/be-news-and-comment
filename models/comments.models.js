const db = require("../db/connection.js");
const format = require("pg-format");
const {checkExists} = require("../db/utils/data-manipulation");

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
      console.log('line 16')
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
