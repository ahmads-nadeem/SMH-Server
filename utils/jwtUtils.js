require('dotenv').config();
const jwt = require('jsonwebtoken');
// const secretKey = process.env.JWT_SECRET;
exports.generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none', 
        maxAge: 30 * 60 * 1000 // 30 second
    }
    const data = {
        token: token,
        options: cookieOptions
    }
    return data;
}