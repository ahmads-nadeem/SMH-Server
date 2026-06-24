const db = require('../utils/databaseutil');

const patientAdd = async (data) => {
    let { Name, PhoneNumber, ConsultedBy, date, totalbill } = data;
    let query = 'INSERT INTO storepatients (Name, PhoneNumber, ConsultedBy, totalbill';
    let list = [Name, PhoneNumber, ConsultedBy, totalbill];
    if (date == '' || date.trim() == '') {
        query += ') VALUES (?, ?, ?, ?)';
    }
    else {
        query += ', DateTime) VALUES (?, ?, ?, ?, ?)';
        list.push(date)
    }
    let [result] = await db.execute(query, list)
    return result;
}

const customerData = async ()=> {
    let [row, col] = await db.execute('SELECT * FROM patients');
    return row
}


module.exports = { patientAdd, customerData };