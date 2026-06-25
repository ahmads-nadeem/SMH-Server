const db = require('../utils/databaseutil');
const { storeMedicines, checkMedicin, insertStoreMedicin, refillMedicin, addNewPurchase } = require('../model/medicineModel');


exports.purchaseAssets = async (req, res, next) => {
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

    const rows = db.checkMedicin(name, power, category);
    let medResult;
    if (rows.length == 0) {
        medResult = insertStoreMedicin(name, formula, category, pPrice, power, packQty, receivingDate, sPrice, expiryDate);
    }
    else {
        medResult = refillMedicin(pPrice, packQty, sPrice, rows[0].productId)
    }
    let newPurchase = addNewPurchase(name, formula, category, power, pRate, pPrice, sPrice, pQty, packQty, supplier, receivingDate, expiryDate, paymentStatus)
    res.status(201).json({
        message: (rows.length == 0? "New Medicin Inserted into DataBase and Purchase is Created": "Medicin is refilled and Purchase is Created"),
        insertedId: newPurchase.insertId
    });
}

exports.allMedicines = async (req, res, next) => {
    const medicines = await storeMedicines();
    res.json(medicines[0]);
}




