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


module.exports = { doctorServices, patientsTables }