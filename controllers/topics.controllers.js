const {selectTopics} = require('../models/topics.models')


exports.getTopics = (req, res, next) => {
    selectTopics()
}