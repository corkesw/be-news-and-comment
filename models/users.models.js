const db = require('../db/connection')

exports.selectUsers = async () => {
    const users = await db.query(`SELECT username FROM users`)
    return users.rows
}