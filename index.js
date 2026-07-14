const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userRouter = require('./Routes/userRoutes');
const authRouter = require('./Routes/authRoutes')
const db = require('./utils/databaseutil');
const { verifyToken } = require('./middleware/authMiddleware');
const { authenticate, login, register } = require('./controller/AuthController');
const app = express();
app.use(cookieParser());
app.use(express.json())
// app.use(cors(
//     {
//         origin: '*',
//         credentials: true
//     }
// ));

app.use(cors({
    origin: 'https://smh-hospital.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); 
app.use('/auth', authRouter)
app.use('/users', verifyToken, userRouter);

const PORT = process.env.SERVER_PORT || 1190;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})