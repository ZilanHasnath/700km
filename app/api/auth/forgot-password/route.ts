import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await connectMongoDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: 'If that email exists, a password reset link has been sent.' },
                { status: 200 }
            );
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
            
        user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const message = `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>You requested a password reset for your account. Click the link below to proceed:</p>
                <a href="${resetUrl}" target="_blank" style="color: #06b6d4; font-weight: bold;">Reset Password</a>
                <p>This link is valid for 15 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `;

        await transporter.sendMail({
            from: `"Support" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: message,
        });

        return NextResponse.json(
            { message: 'Password reset email sent successfully.' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { message: 'Internal server error. Could not send email.' },
            { status: 500 }
        );
    }
}