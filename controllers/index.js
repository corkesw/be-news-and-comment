const { selectArticleById, selectArticleComments, insertArticleComments } = require("../models/articles.models")
const { getArticleById } = require("./articles.controllers")

module.exports = {
    getArticleById, selectArticleById, selectArticleComments, insertArticleComments, 
}