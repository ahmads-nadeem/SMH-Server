const express = require('express');
const userRouter = express.Router();
// local imports
const { getMed, getPatients, getSalesPurchase  } = require('../controller/DataBaseController');
const { purchaseAssets, allMedicines } = require('../controller/medicineController');
const { addnewpatient, customerTableData, todayPatients } = require('../controller/patientController');


userRouter.get('/today-patients', todayPatients);
userRouter.get('/customer-table-data', customerTableData); //Working
userRouter.post('/add-new-patient', addnewpatient); //testing

userRouter.get('/all-medicines', allMedicines);  // Working
userRouter.post('/purchase-assets', purchaseAssets);

// i will fix the below code after some time because i have to add some more features in it
userRouter.get('/database-medicines', getMed);
userRouter.get('/database-patients', getPatients);
userRouter.get('/database-sales-purchase', getSalesPurchase);
module.exports = userRouter;











// const jwt = require('jsonwebtoken');
// const {authenticate} = require('../controller/AuthController');

// userRouter.post('/login', authenticate);
// userRouter.post('/add-new-medicine', async (req, res, next) => {
//     console.log('POST request is received!');
//     let { Name, Price, Quantity } = req.body;
//     let query = 'INSERT INTO storemedicines (Name, Price, Quantity) VALUES (?, ?, ?)';
//     let [result] = await db.execute(query, [Name, Price, Quantity]);
//     res.status(201).json({
//         message: "Medicine successfully added!",
//         insertedId: result.insertId
//     });
// });