const usersRouter = require("express").Router();
const {getUsers, getUserById} = require('../controllers/users.controllers')


usersRouter.get("/", getUsers)
usersRouter.get("/:username", getUserById)

module.exports = usersRouter