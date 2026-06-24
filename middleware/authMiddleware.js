// const dotenv = require('dotenv');
// dotenv.config();
// const jwt = require('jsonwebtoken');
// // const express = require('express'); 
// // const router = express.Router();
// function verifyToken(req, res, next) {
//     // Header se token lo
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

//     if (!token) {
//         return res.status(401).json({ message: 'Token nahi mila, login karo' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // user info request mein add ho gayi
//         next();
//     } catch (err) {
//         return res.status(403).json({ message: 'Token invalid ya expire ho gaya' });
//     }
// }

// module.exports = verifyToken;