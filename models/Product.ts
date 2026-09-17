import mongoose, { Schema, models } from 'mongoose';

const reviewSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

const productSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        images: [{ type: String, required: true }],
        category: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
        reviews: [reviewSchema],
        rating: { type: Number, required: true, default: 0 },
        numReviews: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

const Product = models.Product || mongoose.model('Product', productSchema);
export default Product;