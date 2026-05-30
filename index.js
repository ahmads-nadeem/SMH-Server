const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userRouter = require('./Routes/userRoutes');
const db = require('./utils/databaseutil');
const app = express();

app.use(cookieParser());
app.use(cors({
    origin: 'https://smh-hospital.vercel.app',
    // origin: 'http://localhost:5173', // Aapke React app ka URL
    credentials: true
}));
app.use(express.json())
app.get('/',( req, res ) => {
    res.send('server is running')
});
app.use('/users',userRouter);

// const initializeDatabase = async () => {
//     try {
//         // 1. Pehli Table: assetspurchase
//         const assetspurchaseSql = `
//         CREATE TABLE IF NOT EXISTS \`assetspurchase\` (
//           \`id\` INT AUTO_INCREMENT PRIMARY KEY,
//           \`medname\` VARCHAR(255) NOT NULL,
//           \`formula\` VARCHAR(255) NOT NULL,
//           \`category\` VARCHAR(100) NOT NULL,
//           \`power\` VARCHAR(50) NOT NULL,
//           \`purchaserate\` FLOAT NOT NULL,
//           \`purchaseprice\` FLOAT NOT NULL,
//           \`sellprice\` FLOAT NOT NULL,
//           \`purchasequantity\` INT NOT NULL,
//           \`packquantity\` INT NOT NULL,
//           \`supplier\` VARCHAR(255) NOT NULL,
//           \`receivingdate\` DATE NOT NULL,
//           \`expirydate\` DATE NOT NULL,
//           \`paymentstatus\` VARCHAR(50) NOT NULL
//         );`;
//         await db.query(assetspurchaseSql);
//         console.log("🚀 assetspurchase table checked/created successfully!");

//         // 2. Doosri Table: storemedicines
//         const storemedicinesSql = `
//         CREATE TABLE IF NOT EXISTS \`storemedicines\` (
//           \`productId\` INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
//           \`productName\` VARCHAR(45) NOT NULL,
//           \`formula\` VARCHAR(45) NOT NULL,
//           \`category\` VARCHAR(45) NOT NULL,
//           \`boxprice\` FLOAT NOT NULL,
//           \`power\` VARCHAR(45) NOT NULL,
//           \`nopiec\` INT NOT NULL,
//           \`adddate\` DATE NOT NULL,
//           \`sellprice\` FLOAT NOT NULL,
//           \`expirydate\` DATE NOT NULL
//         );`;
//         await db.query(storemedicinesSql);
//         console.log("🚀 storemedicines table checked/created successfully!");

//         console.log("🟢 All database tables initialized perfectly in Aiven!");

//     } catch (err) {
//         console.error("❌ Database initialization error:", err.message);
//     }
// };

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
    // initializeDatabase();
})