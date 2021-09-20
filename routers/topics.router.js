const topicsRouter = require('express').Router();
const {getTopics} = require('../controllers/topics.controllers.js')

exports.topicsRouter.get('/', getTopics)