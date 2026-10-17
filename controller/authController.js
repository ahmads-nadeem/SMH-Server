const bcrypt = require('bcrypt')
const { isAvailable, addUser } = require('../model/authModel')
const { generateToken } = require('../utils/jwtUtils');
const jwt = require('jsonwebtoken');
exports.logout = (req, res) => {
    res.status(200).clearCookie('token', {
        httpOnly: true,
        secure: true,  //false
        sameSite: none //lax in local
    }).json({
        message: "Logout Successfully"
    });
}

exports.preAuth = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Login to Your Account' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return res.status(200).json({
            message: "You have signedIn already",
            user: {
                name: decoded.name,
                mail: decoded.mail,
                role: decoded.role // decoded token mein role hona chahiye
            }
        })
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

exports.register = async (req, res) => {
    const { name, mail, password } = req.body.formData;
    const role = 'doctor'
    if (!name || !mail || !password) {
        return res.status(400).json({
            "success": false,
            "message": "All fields are required."
        })
    }
    const isExist = await isAvailable(mail)
    if (isExist.length !== 0) {
        return res.status(409).json({
            "success": false,
            "message": "Email already registered. Please login or use a different email."
        })
    }
    const saultRount = 10;
    const hashedPassword = await bcrypt.hash(password, saultRount)
    const result = await addUser(name, mail, hashedPassword)
    const tokenCreate = generateToken({ name, mail, role });
    res.cookie('token', tokenCreate.token, tokenCreate.options)
    return res.status(201).json({
        "success": true,
        "message": "User registered successfully.",
        user: {
            id: result[0].id,
            name: result[0].name,
            role: result[0].role, // FIXED: Array index [0] added
            mail: result[0].username
        }
    });
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const isExist = await isAvailable(username);
    if (isExist.length == 0) {
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
    const tokenCreate = generateToken({ name: isExist[0].name, username, role: isExist[0].role });
    res.cookie('token', tokenCreate.token, tokenCreate.options)
    return res.status(200).json({
        "success": true,
        "message": "User logged in successfully.",
        user: {
            id: isExist[0].id,
            name: isExist[0].name,
            role: isExist[0].role,
            email: username
        }
    })
}

