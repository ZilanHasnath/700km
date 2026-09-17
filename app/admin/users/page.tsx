'use client';

import { useState, useEffect } from 'react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('user');
    
    const [editingUserId, setEditingUserId] = useState<string | null>(null);

    const fetchUsers = async () => {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (res.ok) setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const resetForm = () => {
        setName('');
        setEmail('');
        setAddress('');
        setRole('user');
        setEditingUserId(null);
    };

    const startEditing = (user: any) => {
        setEditingUserId(user._id);
        setName(user.name);
        setEmail(user.email);
        setAddress(user.address);
        setRole(user.role);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUserId) return;

        const res = await fetch(`/api/admin/users/${editingUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, address, role }),
        });

        if (res.ok) {
            resetForm();
            fetchUsers();
        } else {
            const data = await res.json();
            alert(data.message || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        const res = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchUsers();
        } else {
            const data = await res.json();
            alert(data.message || 'Failed to delete user');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading admin users...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Users</h1>

            {editingUserId && (
                <form onSubmit={handleUpdateUser} className="mb-8 bg-gray-50 p-4 rounded-lg border space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Edit User</h2>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-sm text-gray-500 hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="border p-2 rounded w-full bg-white"
                        >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Update User
                    </button>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-100 text-sm">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Address</th>
                            <th className="p-3">Role</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user._id} className="border-b hover:bg-gray-50 text-sm">
                                <td className="p-3 font-medium">{user.name}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.address}</td>
                                <td className="p-3 capitalize font-semibold text-gray-700">
                                    {user.role}
                                </td>
                                <td className="p-3 text-center space-x-2">
                                    <button
                                        onClick={() => startEditing(user)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
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