'use client';

import { useState, useEffect } from 'react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    const productCategories = [
        'Single-Rotor',
        'Tandem',
        'Coaxial',
        'Intermeshing',
        'Tiltrotor',
        'Compound',
        'Spare Parts',
        'Tools',
    ];

    const fetchProducts = async () => {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        if (res.ok) setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setStock('');
        setImage('');
        setIsCreating(false);
        setEditingProductId(null);
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!category) {
            alert('Please select a category type.');
            return;
        }

        const url = editingProductId 
            ? `/api/admin/products/${editingProductId}` 
            : '/api/admin/products';
        
        const method = editingProductId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                description,
                price: Number(price),
                category,
                stock: Number(stock),
                images: [image],
            }),
        });

        if (res.ok) {
            resetForm();
            fetchProducts();
        } else {
            const data = await res.json();
            alert(data.message || 'Failed to save product');
        }
    };

    const startEditing = (product: any) => {
        setEditingProductId(product._id);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setStock(product.stock);
        setImage(product.images?.[0] || '');
        setIsCreating(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const res = await fetch(`/api/admin/products/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchProducts();
        } else {
            alert('Failed to delete product');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading admin products...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
                <button
                    onClick={() => {
                        if (isCreating) {
                            resetForm();
                        } else {
                            resetForm();
                            setIsCreating(true);
                        }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {isCreating ? 'Cancel' : 'Add New Product'}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleSaveProduct} className="mb-8 bg-gray-50 p-4 rounded-lg border space-y-4">
                    <h2 className="text-lg font-semibold">{editingProductId ? 'Edit Product' : 'Create Product'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Stock"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Category Type *
                            </label>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                {productCategories.map((cat) => (
                                    <button
                                        type="button"
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition shrink-0 border ${
                                            category === cat
                                                ? 'bg-blue-600 text-white border-blue-600 shadow'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border p-2 rounded w-full md:col-span-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        {editingProductId ? 'Update Product' : 'Save Product'}
                    </button>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-100 text-sm">
                            <th className="p-3">Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product: any) => (
                            <tr key={product._id} className="border-b hover:bg-gray-50 text-sm">
                                <td className="p-3 font-medium">{product.name}</td>
                                <td className="p-3">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="p-3">${product.price}</td>
                                <td className="p-3">{product.stock}</td>
                                <td className="p-3 text-center space-x-2">
                                    <button
                                        onClick={() => startEditing(product)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-xs"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}