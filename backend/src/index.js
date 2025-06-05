import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})