import mongoose, { Schema, models } from 'mongoose';

const cartSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        cartItems: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true, default: 1 },
            },
        ],
    },
    { timestamps: true }
);

const Cart = models.Cart || mongoose.model('Cart', cartSchema);
export default Cart;