const db = require('../utils/databaseutil');

exports.isAvailable = async (mailPara) => {
    // console.log('mail');
    const mail = mailPara.toLowerCase()
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [mail]);
    console.log('user exsist');
    
    return rows
}
exports.addUser = async (namePara, mailPara, password) => {
    const name = namePara.toLowerCase()
    const mail = mailPara.toLowerCase()
    // const password = passwordPara.toLowerCase()
    const result = await db.execute('INSERT INTO users (name, email, password, role) VALUE (?, ?, ?, ?)',[name, mail, password, "user"])
    return result
}   