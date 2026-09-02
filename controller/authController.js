const bcrypt = require('bcrypt')
const { isAvailable, addUser } = require('../model/authModel')
const { generateToken } = require('../utils/jwtUtils');

async function exist(mail){
    return await isAvailable(mail);
}

//  Here is the new user register logic of server
exports.register = async (req, res) => {
    const { name, mail, password } = req.body.formData
    if (!name || !mail || !password) {
        return res.status(400).json({
            "success": false,
            "message": "All fields are required."
        })
    }
    const isExist = await isAvailable(mail)
    // const isExist = exist(mail)
    if (isExist.length !== 0) {
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
        "userid": result[0].insertId,
        "name": name,
        "email": mail,
        "role": isExist.role
    });
}
//  Here is the new user login logic of server
exports.login = async (req, res) => {
    const { username, password } = req.body;
    const isExist = await isAvailable(username);
    // const isExist = exist(username);
    if (isExist.length == 0) {
        return res.status(404).json({
            "success": false,
            "message": "User not Registered yet."
        })
    }
    const isMatch = await bcrypt.compare(password, isExist[0].password)
    console.log(isMatch);

    if (!isMatch) {
        console.log('wrong password');
        return res.status(401).json({
            "success": false,
            "message": "Invalid credentials."
        })
    }
    const tokenCreate = await generateToken({ name: isExist[0].name, username });
    res.cookie('token', tokenCreate.token, tokenCreate.options)
    return res.status(200).json({
        "success": true,
        "message": "User logged in successfully.",
        "userid": isExist[0].id,
        "name": isExist[0].name,
        "role": isExist.role,
        "email": username
    })
}
