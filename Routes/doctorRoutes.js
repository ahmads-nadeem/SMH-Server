
const express = require('express');
const doctorRouter = express.Router();
const {insertPatient} = require('../controller/doctorController')


// Doctors routes
// doctorRouter.post('/', insertPatient)


module.exports = doctorRouter;