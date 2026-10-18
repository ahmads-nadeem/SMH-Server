
const express = require('express');
const doctorRouter = express.Router();
const {insertPatient, doctorServices, printReport} = require('../controller/doctorController')


// Doctors routes
doctorRouter.post('/add-patient', insertPatient)

doctorRouter.get('/services', doctorServices)

doctorRouter.post('/report', printReport)


module.exports = doctorRouter;