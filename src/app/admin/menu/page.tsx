"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";

interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    image?: string;
    available: boolean;
}

export default function AdminMenuPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newItem, setNewItem] = useState({ name: "", price: "", category: "Snacks", image: "" });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/admin/menu");
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addItem = async () => {
        if (!newItem.name || !newItem.price) return;
        setAdding(true);
        try {
            await fetch("/api/admin/menu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            });
            setNewItem({ name: "", price: "", category: "Snacks", image: "" });
            fetchItems();
        } catch (err) {
            alert("Failed to add item");
        } finally {
            setAdding(false);
        }
    };

    const deleteItem = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" });
            setItems(items.filter((i) => i.id !== id));
        } catch (err) {
            alert("Failed to delete");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Menu Management</h1>
                <p className="text-gray-500">Update your restaurant's menu items.</p>
            </div>

            {/* Add New Item Form */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-orange-500" />
                    Add New Item
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Item Name"
                        className="input-field"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Price (₹)"
                        className="input-field"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    />
                    <select
                        className="input-field"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    >
                        <option>Snacks</option>
                        <option>Meals</option>
                        <option>Drinks</option>
                        <option>Desserts</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Image URL"
                        className="input-field"
                        value={newItem.image}
                        onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    />
                </div>
                <button
                    onClick={addItem}
                    disabled={adding}
                    className="mt-4 px-6 py-2 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                    {adding ? "Adding..." : "Add Item"}
                </button>
            </div>

            {/* Menu List */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-semibold">Image</th>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Price</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/10 transition-colors">
                                <td className="p-4">
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 m-3 text-gray-300" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="p-4 font-bold">₹{item.price}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {items.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">No items found. Add some!</div>
                )}
            </div>
        </div>
    );
}
