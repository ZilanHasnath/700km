import mongoose, { Schema, models } from 'mongoose';

const orderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
});

const orderSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        orderItems: [orderItemSchema],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: { type: String, required: true },
        itemsPrice: { type: Number, required: true, default: 0.0 },
        taxPrice: { type: Number, required: true, default: 0.0 },
        shippingPrice: { type: Number, required: true, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },
        status: { type: String, required: true, default: 'Processing' },
        cancellationReason: { type: String },
    },
    { timestamps: true }
);

const Order = models.Order || mongoose.model('Order', orderSchema);
export default Order;