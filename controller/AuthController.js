// const express = require('express');
// const db = require('../utils/databaseutil');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// require('dotenv').config();
// exports.authenticate =async (req, res, next) => {
//     console.log('POST request is received For Login!');
//     let { username, password } = req.body;
//     let query = 'SELECT * FROM users WHERE username = ?';  // AND password = ?
//     let [rows] = await db.execute(query, [username]); //, password
//     if (rows.length > 0) {
//         if (rows[0].password === password) {
//             const token = jwt.sign({
//                 userId: rows[0].id,
//                 username: rows[0].username
//             },
//                 process.env.JWT_SECRET,
//                 { expiresIn: '30s' }
//             );

//             return res.cookie('token', token, {
//                 httpOnly: true,
//                 maxAge: 30 * 1000, // 30 seconds
//                 secure: false,
//                 sameSite: 'Strict'
//             }).status(200).json({
//                 message: "Login successful!",
//                 user: rows[0]
//             });
//         }
//         else {
//             // User not found, login failed
//             res.status(401).json({
//                 message: "Invalid username or password"
//             });
//         }
//     }
//     else {
//         // User not found, login failed
//         res.status(401).json({
//             message: "Invalid username or password"
//         });
//     }
// }
// exports.register = async (req, res, next) => {
//     let { username, password, gmail } = req.body;
//     let [existingUser] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
//     if (existingUser.length > 0) {
//         return res.status(400).json({
//             message: "Username already exists"
//         });
//     }
//     const HashedPassword = await bcrypt.hash(password, 10);
//     let query = 'INSERT INTO users (username, password, gmail) VALUES (?, ?, ?)';
//     let [result] = await db.execute(query, [username, HashedPassword, gmail]);
//     res.status(201).json({
//         message: "User registered successfully!",
//         insertedId: result.insertId
//     });
// }





// exports.login = async (req, res, next) => {
//     const { username, password } = req.body;
//     let query = 'SELECT * FROM users WHERE username = ?';
//     let [ result ] = await db.execute(query, [username]);
//     if(result.length === 0){
//         return res.status(401).json({
//             message: "Invalid username or password"
//         });
//     }
//     const user = result[0];
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//         return res.status(401).json({
//             message: "Invalid password"
//         });
//     }
//     const token = jwt.sign({
//         userId: user.id,
//         username: user.username
//     },
//         process.env.JWT_SECRET,
//         { expiresIn: '30s' }
//     );
//     res.status(200).json({
//         message: "Login successful!",
//         token: token
//     });
// }