const db = require('../utils/databaseutil');
const { storeMedicines, checkMedicin, insertStoreMedicin, refillMedicin, addNewPurchase, searchMedicin } = require('../model/medicineModel');




exports.searchMedicin = async (req, res) => {
    const { medicin } = req.query;
    // console.log(medicin);

    if (!medicin.trim()) {
        res.status(400).json({
            message: "Bad Request!",
        });
    }
    const results = await searchMedicin(medicin)

    res.status(200).json({
        message: "successful",
        result: results
    });

}

exports.storePatient = async (req, res) => {
    const data = req.body;
    // console.log(data);
    res.status(201).json({
        message: "Pateint Succesfully Added"
    })    
}

exports.purchaseAssets = async (req, res) => {
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

    const rows = await checkMedicin(name, power, category);
    let medResult;
    if (rows.length == 0) {
        medResult = insertStoreMedicin(name, formula, category, pPrice, power, packQty, receivingDate, sPrice, expiryDate);
    }
    else {
        medResult = refillMedicin(pPrice, packQty, sPrice, rows[0].productId)
    }
    let newPurchase = addNewPurchase(name, formula, category, power, pRate, pPrice, sPrice, pQty, packQty, supplier, receivingDate, expiryDate, paymentStatus)
    res.status(201).json({
        message: (rows.length == 0 ? "New Medicin Inserted into DataBase and Purchase is Created" : "Medicin is refilled and Purchase is Created"),
        insertedId: newPurchase.insertId
    });
}

exports.allMedicines = async (req, res) => {
    const medicines = await storeMedicines();
    res.json(medicines[0]);
}




