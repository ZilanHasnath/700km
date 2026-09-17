import mongoose, { Schema, models, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    address: string;
    role: 'user' | 'admin';
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { type: String, required: true },
        role: { type: String, default: 'user', enum: ['user', 'admin'] },
        resetPasswordToken: { type: String },
        resetPasswordExpire: { type: Date },
    },
    { timestamps: true }
);

const User = models.User || mongoose.model<IUser>('User', userSchema);
export default User;