import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

dotenv.config();

console.log(TWILIO_ACCOUNT_SID);
console.log(TWILIO_AUTH_TOKEN);
console.log(TWILIO_PHONE_NUMBER);
const app = express();
connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
