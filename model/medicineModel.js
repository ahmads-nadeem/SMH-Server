const db = require('../utils/databaseutil');
const checkMedicin = async (name, power, category) => {
    let [rows] = await db.execute('SELECT * FROM storemedicines WHERE productName = ? AND power = ? AND category = ?', [name.toLowerCase(), power.toLowerCase(), category.toLowerCase()]);
    return rows
}
const insertStoreMedicin = async (name, formula, category, pPrice, power, packQty, receivingDate, sPrice, expiryDate) => {
    try{
        let querymed = 'INSERT INTO storemedicines (productName, formula, category, boxprice, power, nopiec, adddate, sellprice, expirydate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let [result] = await db.execute(querymed, [name.toLowerCase(), formula.toLowerCase(), category.toLowerCase(), pPrice, power.toLowerCase(), packQty, receivingDate, sPrice, expiryDate]);
        return result
    }
    catch(error){
        throw error
    }
}

const refillMedicin = async(pPrice, packQty, sPrice, productId) => {
    try{
        let updatequery = 'UPDATE storemedicines SET boxprice = ?, nopiec = ?, sellprice = ? WHERE productId = ?';
        let [row] = await db.execute(updatequery, [pPrice, packQty, sPrice, productId]);
        return row
    }
    catch(error){
        throw error
    }
}

const addNewPurchase = async (name, formula, category, power, pRate, pPrice, sPrice, pQty, packQty, supplier, receivingDate, expiryDate, paymentStatus) => {
    let query = 'INSERT INTO assetspurchase (medname, formula, category, power, purchaserate, purchaseprice,  sellprice, purchasequantity, packquantity, supplier, receivingdate, expirydate, paymentstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, formula, category, power, pRate, pPrice, sPrice, pQty, packQty, supplier, receivingDate, expiryDate, paymentStatus]);

}

const storeMedicines = async() => {
    let medicines = await db.execute('SELECT * FROM storemedicines');
    return medicines;
}

module.exports = { storeMedicines, checkMedicin, insertStoreMedicin, refillMedicin, addNewPurchase };