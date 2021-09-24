const db = require('../db/connection')

exports.selectUsers = async () => {
    const users = await db.query(`SELECT username FROM users`)
    return users.rows
}

exports.selectUserById = async (username) => {
    const user = await db.query(`SELECT * FROM users WHERE username = $1`, [username])
    if (user.rows.length === 0) {
        return Promise.reject({
            status:404, msg: "Not found"
        })
    }
    return user.rows[0]
}