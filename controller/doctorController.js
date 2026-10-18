const { doctorServices, patientsTables, insertPatient, addVisit, addPatientAdvice } = require('../model/doctorModel');

exports.insertPatient = async (req, res) => {
    const {patientDetails, patientPurchses} = req.body;
    const {name, phone, age, gender} = patientDetails;
    const ser = await doctorServices();
    let totalBill = 0;
    function spec(service){
        const specific = ser.filter(obj=> obj.service == service)
        return Number(specific[0].price)
    }
    
    if(patientPurchses.service.includes('ultrasound')){
        totalBill = totalBill + spec('ultrasound')
    }
    if(patientPurchses.service.includes('checkup')){
        totalBill = totalBill + spec('checkup')
    }   

    const addPatientDetails = await insertPatient(name, phone, age, gender);
    const addPatientVisit = await addVisit(patientDetails, addPatientDetails.insertId, totalBill);  
    await addPatientAdvice(patientPurchses.medicine, addPatientVisit.insertId);
    
    res.status(201).json({
        message:'Patient Successfully Added',
        // patientsTables: addPatientDetails,
        // patientVisit: addPatientVisit
    })    
}

exports.doctorServices = async (req, res) => {
    const fetchedServices = await doctorServices();    
    res.status(200).json({fetchedServices});
}
exports.patientsTables = async (req, res) => {
    const fetchPatients = await patientsTables();
    res.status(200).json({...fetchPatients});
}