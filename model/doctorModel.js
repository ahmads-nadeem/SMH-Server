const db = require('../utils/databaseutil');

const doctorServices = async () => {
    const [result] = await db.execute('SELECT * FROM services');
    return result
}
const patientsTables = async () => {
    const [[patients], [visits]] = await Promise.all([
        db.execute('SELECT * FROM patients'),
        db.execute('SELECT * FROM patients_visits')
    ])
    return {
        success: true,
        patients,
        visits_patients: visits
    }
}

const insertPatient = async (name, phone, age, gender) => {
    const [isExist] = await db.execute('SELECT * FROM patients WHERE PhoneNumber = ?', [phone])
    if (isExist.length > 0) {
        return isExist[0].cid
    }
    const query = "INSERT INTO patients (name, PhoneNumber, age, gender) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(query, [name, phone, age, gender]);
    return result.insertId
}

const addVisit = async (data, id, totalBill) => {
    const {
        name, age, lmp, gpa, gestationalAge, hb, bp,
        suger, urine, clinicalFindings, remarks,
        purpose, visitDate, nextVisit, createdby
    } = data;
    const formatDate = (date) => (date && date !== '' ? date : null);
    const visitDate2 = formatDate(visitDate);
    const lmp2 = formatDate(lmp);
    const nextVisit2 = formatDate(nextVisit);
    const hb2 = hb ? parseFloat(hb) : null;
    const query = `
        INSERT INTO patients_visits (
            cid, patient_name, created_by, total_bill, visit_date, age, gpa, lmp, 
            gestationalage, visit_purpose, clinical_findings, hb, bp, 
            urine, suger, remarks, nextvisit
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        id, name, createdby, totalBill, visitDate2, age, gpa, lmp2,
        gestationalAge, purpose, clinicalFindings, hb2, bp,
        urine, suger, remarks, nextVisit2
    ];
    const [result] = await db.execute(query, values);
    return result;
};

const addPatientAdvice = async (usersArray, vid) => {
    const values = usersArray.map(user => [vid, user.productName, user.formula, user.power, user.category]);
    const query = "INSERT INTO doctoradvice (vid, medicin_name, medicin_formula, medicin_power, medicin_type) VALUES ?";
    const [result] = await db.query(query, [values]);
    return result
}

module.exports = { doctorServices, patientsTables, insertPatient, addVisit, addPatientAdvice }