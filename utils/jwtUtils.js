require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
exports.generateToken = (payload) => {
    const token = jwt.sign(payload, secretKey, { expiresIn: '1m' });
    const cookieOptions = {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: 'strict',
        maxAge: 60 * 1000 // 1 second
    }
    const data = {
        token: token,
        options: cookieOptions
    }
    return data;
}