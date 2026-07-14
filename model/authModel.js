const db = require('../utils/databaseutil');

exports.isAvailable = async (mail) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [mail.toLowerCase()]);
    return rows
}
exports.addUser = async (name, mail, password) => {
    const result = await db.execute('INSERT INTO users (name, email, password, role) VALUE (?, ?, ?, ?)',[name.toLowerCase(), mail.toLowerCase(), password.toLowerCase(), "user"])
    return result
}   