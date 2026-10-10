const db = require('../utils/databaseutil');

exports.isAvailable = async (mailPara) => {
    const mail = mailPara.toLowerCase()
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [mail]);
    return rows
}
exports.addUser = async (namePara, mailPara, password) => {
    const name = namePara.toLowerCase()
    const mail = mailPara.toLowerCase()
    const result = await db.execute('INSERT INTO users (name, email, password, role) VALUE (?, ?, ?, ?)',[name, mail, password, "doctor"])
    return result
}   