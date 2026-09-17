import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import bcrypt from 'bcryptjs';
import { connectMongoDB } from '../lib/mongodb';
import User from '../models/User';

async function createAdmin() {
    try {
        await connectMongoDB();

        const adminEmail = 'adminzilan@gmail.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('123456789', 10);

        await User.create({
            name: 'Zilan Hasnath',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            address: 'Dhaka, Bangladesh',
        });

        console.log('Admin user created successfully!');
        console.log('Email: adminzilan@gmail.com');
        console.log('Password: 123456789');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdmin();