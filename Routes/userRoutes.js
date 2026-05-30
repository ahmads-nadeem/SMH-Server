const express = require('express');
const db = require('../utils/databaseutil');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
const {authenticate} = require('../controller/AuthController');


const userRouter = express.Router();

userRouter.get('/customer-table-data', async (req, res, next) => {
    let [row, col] = await db.execute('SELECT * FROM storepatients');
    res.json(row)
})
userRouter.get('/today-customers', (req, res, next) => {

})
userRouter.post('/add-new-patient', async (req, res, next) => {
    console.log('POST request is received!');
    let { Name, PhoneNumber, ConsultedBy, date, totalbill } = req.body;
    let query = '';
    let dataList = [];
    let list1 = [Name, PhoneNumber, ConsultedBy, date, totalbill];
    let list2 = [Name, PhoneNumber, ConsultedBy, totalbill];
    let normalQuery = `INSERT INTO storepatients (Name, PhoneNumber, ConsultedBy, DateTime, totalbill) VALUES (?, ?, ?, ?, ?)`;
    let withOutTime = `INSERT INTO storepatients (Name, PhoneNumber, ConsultedBy, totalbill) VALUES (?, ?, ?, ?)`;
    if (date === '') {
        query = withOutTime;
        dataList = list2
    }
    else {
        query = normalQuery;
        dataList = list1
    }
    let [result] = await db.execute(query, dataList)
    res.status(201).json({
        message: "Customer successfully added!",
        insertedId: result.insertId
    });
})


userRouter.get('/all-medicines', async (req, res, next) => {
    // if(req!=null){
    //     console.log('GET request is received!');
    // }else{
    //     console.log('GET request is not received!');
    // }
    console.log('GET request is received!');
    let medicines = await db.execute('SELECT * FROM storemedicines');
    console.log(medicines);
    res.json(medicines[0])
});
userRouter.post('/add-new-medicine', async (req, res, next) => {
    console.log('POST request is received!');
    let { Name, Price, Quantity } = req.body;
    let query = 'INSERT INTO storemedicines (Name, Price, Quantity) VALUES (?, ?, ?)';
    let [result] = await db.execute(query, [Name, Price, Quantity]);
    res.status(201).json({
        message: "Medicine successfully added!",
        insertedId: result.insertId
    });
});


userRouter.post('/purchase-assets', async (req, res, next) => {
    console.log('POST request is received!');
    let {
        name,
        category,
        formula,
        power,
        purchaseRate,
        purchaseQuantity,
        supplier,
        receivingDate,
        expiryDate,
        paymentStatus,
        purchasePrice,
        packQuantity,
        sellPrice
    } = req.body;
    if (formula === '') {
        formula = 'N/A';
    }
    const pRate = parseFloat(purchaseRate) || 0;
    const pPrice = parseFloat(purchasePrice) || 0;
    const sPrice = parseFloat(sellPrice) || 0;
    const pQty = parseInt(purchaseQuantity, 10) || 0;
    const packQty = parseInt(packQuantity, 10) || 0;

    let [rows] = await db.execute('SELECT * FROM storemedicines WHERE productName = ? AND power = ? AND category = ?', [name.toLowerCase(), power.toLowerCase(), category.toLowerCase()]);
    if(rows.length == 0){
        console.log('medicin not present');
        let querymed = 'INSERT INTO storemedicines (productName, formula, category, boxprice, power, nopiec, adddate, sellprice, expirydate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        let [result] = await db.execute(querymed, [name.toLowerCase(), formula.toLowerCase(), category.toLowerCase(), pPrice, power.toLowerCase(), packQty, receivingDate, sPrice, expiryDate]);
    }
    else{
        console.log('medicine is present');
        let updatequery = 'UPDATE storemedicines SET boxprice = ?, nopiec = ?, sellprice = ? WHERE productId = ?';
        let [row] = await db.execute(updatequery, [pPrice, packQty, sPrice, rows[0].productId]);
    }    
    // try {
    let query = 'INSERT INTO assetspurchase (medname, formula, category, power, purchaserate, purchaseprice,  sellprice, purchasequantity, packquantity, supplier, receivingdate, expirydate, paymentstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, formula, category, power, pRate, pPrice, sPrice, pQty, packQty, supplier, receivingDate, expiryDate, paymentStatus]);
    res.status(201).json({
        message: "Asset successfully purchased!",
        insertedId: result.insertId
    });
});

userRouter.post('/login', authenticate);

module.exports = userRouter;

