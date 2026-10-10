const express = require('express')
const authRouter = express.Router()
const { register, login, preAuth, logout } = require('../controller/authController')



authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/pre-auth', preAuth)
authRouter.get('/logout', logout)



module.exports = authRouter