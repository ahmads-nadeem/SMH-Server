const express = require('express');
const db = require('../utils/databaseutil');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticate =async (req, res, next) => {
    console.log('POST request is received For Login!');
    let { username, password } = req.body;
    let query = 'SELECT * FROM users WHERE username = ?';  // AND password = ?
    let [rows] = await db.execute(query, [username]); //, password
    if (rows.length > 0) {
        // User found, login successful
        if (rows[0].password === password) {
            const token = jwt.sign({
                userId: rows[0].id,
                username: rows[0].username
            },
                process.env.JWT_SECRET,
                { expiresIn: '30s' }
            );
            return res.cookie('token', token, {
                httpOnly: true,
                maxAge: 30 * 1000, // 30 seconds
                secure: false,
                sameSite: 'Strict'
            }).status(200).json({
                message: "Login successful!",
                user: rows[0]
            });
        }
        else {
            // User not found, login failed
            res.status(401).json({
                message: "Invalid username or password"
            });
        }
    }
    else {
        // User not found, login failed
        res.status(401).json({
            message: "Invalid username or password"
        });
    }



}