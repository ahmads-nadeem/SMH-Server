const express = require('express');
const db = require('../utils/databaseutil');
require('dotenv').config();

exports.getMed = async (req, res) => {
    console.log('GET request is received For Data!');
    let query = 'SELECT * FROM storemedicines';
    let medicines = await db.execute(query);
    console.log('Medicin Fetch Api Call');
    
    console.log(medicines);
    // res.json(data);
}
exports.getPatients = async (req, res) => {
    console.log('GET request is received For Data!');
    let query = 'SELECT * FROM storepatients';
    let patients = await db.execute(query);
    console.log('Patient Fetch Api Call');
    console.log(patients);
}
exports.getSalesPurchase = async (req, res) => {
    console.log('GET request is received For Data!');
    let query = 'SELECT * FROM assetspurchase';
    let salesPurchase = await db.execute(query);
    console.log('Sales/Purchase Fetch Api Call');
    console.log(salesPurchase);
}