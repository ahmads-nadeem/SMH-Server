
const express = require('express');
const doctorRouter = express.Router();
const {insertPatient, doctorServices} = require('../controller/doctorController')


// Doctors routes
doctorRouter.post('/add-patient', insertPatient)

doctorRouter.get('/services', doctorServices)


module.exports = doctorRouter;