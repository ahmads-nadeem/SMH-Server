const { doctorServices, patientsTables } = require('../model/doctorModel');

// exports.insertPatient = (req, res) => {

// }

exports.doctorServices = async (req, res) => {
    const fetchedServices = await doctorServices();
    res.status(200).json(fetchedServices);
}
exports.patientsTables = async (req, res) => {
    const fetchPatients = await patientsTables();
    res.status(200).json({...fetchPatients});
}