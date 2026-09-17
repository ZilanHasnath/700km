import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection;
    }

    return await mongoose.connect(MONGODB_URI);
};