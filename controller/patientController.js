const db = require('../utils/databaseutil');
const { patientAdd, customerData } = require('../model/patientsModel');

exports.addnewpatient = async (req, res, next) => {
    const result = await patientAdd(req.body);
    res.status(201).json({
        message: "Customer successfully added!",
        insertedId: result.insertId
    });
};

exports.customerTableData = async (req, res, next) => {
    let result = await customerData();
    res.status(200).json(result)
};

exports.todayPatients = async (req, res, next) => {
    console.log('hello g');
    
};