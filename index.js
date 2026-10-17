require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./Routes/userRoutes');
const authRouter = require('./Routes/authRoutes');
const doctorRouter = require('./Routes/doctorRoutes');
const { verifyToken } = require('./middleware/authMiddleware');
const app = express();
app.use(cookieParser());
app.use(express.json())
// app.use(cors(
//     {
//         origin: 'http://localhost:5173',
//         credentials: true
//     }
// ));
app.use(cors({
    origin: 'https://smh-hospital.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); 
// app.use('verify', verifyToken)
app.use('/islogin', authRouter)
app.use('/auth', authRouter)    
app.use('/users', userRouter); //verifyToken,
// Doctor Routes
app.use('/doctors', doctorRouter); //verifyToken,

const PORT = process.env.SERVER_PORT || 1190;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})