const db = require('../utils/databaseutil');

const patientAdd = async (data) => {
    let { Name, PhoneNumber, ConsultedBy, date, totalbill } = data;
    const [add_patient] = await db.execute('name, PhoneNumber, cnic',[Name, PhoneNumber, ])


    let query = 'INSERT INTO patients (Name, PhoneNumber, ConsultedBy, totalbill';
    const query2 = 'INSERT INTO patients_visits (cid, created_by, total_bill, visit_date)';
    let list = [Name, PhoneNumber, ConsultedBy, totalbill];
    if (date == '' || date.trim() == '') {
        console.log('this is if condition');
        query += ') VALUES (?, ?, ?, ?)';
    }

    else {
        query += ', DateTime) VALUES (?, ?, ?, ?, ?)';
        list.push(date);
    }
    const [isExist] = await db.execute('SELECT * FROM patients WHERE cnic = ?', [cnic])
    if (isExist.length < 0) {
        let [result] = await db.execute(query, list);
        const data = [result.insertId, user, totalbill, date];
        let [result2] = await db.execute(query2, data);
    }
    else{
        let [result] = await db.execute(query, list);
    }
    return result;
}

const customerData = async () => {
    let [row, col] = await db.execute('SELECT * FROM patients');
    return row
}


module.exports = { patientAdd, customerData };