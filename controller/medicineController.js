const db = require('../utils/databaseutil');
const { storeMedicines } = require('../model/medicineModel');

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

    let query = 'INSERT INTO assetspurchase (medname, formula, category, power, purchaserate, purchaseprice,  sellprice, purchasequantity, packquantity, supplier, receivingdate, expirydate, paymentstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, formula, category, power, pRate, pPrice, sPrice, pQty, packQty, supplier, receivingDate, expiryDate, paymentStatus]);
    res.status(201).json({
        message: "Asset successfully purchased!",
        insertedId: result.insertId
    });
}
exports.allMedicines =  async (req, res, next) => {
    console.log('GET request is received!');
    const medicines = await storeMedicines();
    res.json(medicines[0])
}




