const db = require('../utils/databaseutil');

const storeMedicines = async() => {
    let medicines = await db.execute('SELECT * FROM storemedicines');
    return medicines;
}



module.exports = { storeMedicines };