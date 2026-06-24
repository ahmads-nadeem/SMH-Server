const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userRouter = require('./Routes/userRoutes');
const db = require('./utils/databaseutil');
const { verifyToken } = require('./middleware/authMiddleware');
const { authenticate, login, register } = require('./controller/AuthController');

const app = express();
// app.use(cookieParser());
app.use(cors());
app.use(express.json())

// app.use(cors({
//     origin: 'https://smh-hospital.vercel.app',
//     // origin: 'http://localhost:5173', // Aapke React app ka URL
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.post('/users/login', login);
// app.post('/users/register', register);
// app.use(verifyToken);  
app.use('/users',userRouter);

const PORT = process.env.SERVER_PORT || 1190;
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})