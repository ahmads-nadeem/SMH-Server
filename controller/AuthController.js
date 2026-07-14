const bcrypt = require('bcrypt')
const { isAvailable, addUser } = require('../model/authModel')
const { generateToken } = require('../utils/jwtutils');

exports.register = async (req, res) => {
    console.log('starting');
    
    const { name, mail, password } = req.body.formData
    if (!name || !mail || !password) {
        return res.status(400).json({
            "success": false,
            "message": "All fields are required."
        })
    }
    console.log('This is first section');
    
    const isExist = await isAvailable(mail)
    if (isExist.length !== 0) {
        console.log('This is second section');
        return res.status(409).json({
            "success": false,
            "message": "Email already registered. Please login or use a different email."
        })
    }
    const saultRount = 10;
    const hashedPassword = await bcrypt.hash(password, saultRount)
    const result = await addUser(name, mail, hashedPassword)
    const tokenCreate = await generateToken({ name, mail });
    res.cookie('token', tokenCreate.token, tokenCreate.options)
    return res.status(201).json({
        "success": true,
        "message": "User registered successfully.",
        userid: result[0].insertId,
        name: name,
        email: mail
    });
}

exports.login = async (req, res) => {
    const { mail, password } = req.body;
    const isExist = await isAvailable(mail)
    if (!isExist) {
        return res.status(404).json({
            "success": false,
            "message": "User not Registered yet."
        })
    }
    const isMatch = await bcrypt.compare(password, isExist[0].password)
    if (!isMatch) {
        return res.status(401).json({
            "success": false,
            "message": "Invalid credentials."
        })
    }
    const tokenCreate = await generateToken({ name: isExist[0].name, mail });
    res.cookie('token', tokenCreate.token, tokenCreate.options)
    return res.status(200).json({
        "success": true,
        "message": "User logged in successfully.",
        userid: isExist[0].id,
        name: isExist[0].name,
        email: mail
    })
}