import mongoose from 'mongoose';

export const connectDB = async () => { 
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected ${conn.connection.host} successfully!`);
    } catch (error) { 
        console.error(`MongoDB connection error: ${error.message}`);
    }
}