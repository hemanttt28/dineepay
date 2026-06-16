"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    image?: string;
    available: boolean;
}

export default function MenuPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "Main Course",
        image: "",
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/menu");
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch menu items", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingItem) {
                // Update existing item
                const res = await fetch("/api/menu", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, id: editingItem.id, available: editingItem.available }),
                });
                if (!res.ok) throw new Error("Failed to update");
            } else {
                // Create new item
                const res = await fetch("/api/menu", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                if (!res.ok) throw new Error("Failed to create");
            }

            await fetchItems();
            closeModal();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(`/api/menu?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setItems(items.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error);
            alert("Failed to delete item");
        }
    };

    const openModal = (item?: MenuItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                price: item.price.toString(),
                category: item.category,
                image: item.image || "",
            });
        } else {
            setEditingItem(null);
            setFormData({ name: "", price: "", category: "Main Course", image: "" });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Menu <span className="text-[#ff6b00]">Management</span></h1>
                    <p className="text-gray-400">Add, edit, or remove items from your digital menu.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-[#ff6b00] hover:bg-[#ff8c42] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Item
                </button>
            </div>

            {loading && items.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#ff6b00] animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#2C1810]/50 border border-white/5 rounded-2xl overflow-hidden group hover:border-[#ff6b00]/30 transition-all"
                        >
                            <div className="h-48 bg-[#1a0f0a] relative flex items-center justify-center overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-600">
                                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                        <span className="text-xs">No Image</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(item)}
                                        className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-lg text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-white">{item.name}</h3>
                                    <span className="bg-[#ff6b00]/10 text-[#ff6b00] text-xs px-2 py-1 rounded-full font-medium">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400 text-sm">
                                    <span>₹{item.price}</span>
                                    <span className={item.available ? "text-green-500" : "text-red-500"}>
                                        {item.available ? "Available" : "Sold Out"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#2C1810] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl"
                        >
                            <h2 className="text-xl font-bold text-white mb-6">
                                {editingItem ? "Edit Item" : "Add New Item"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#ff6b00] focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#ff6b00] focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#ff6b00] focus:outline-none transition-colors appearance-none"
                                        >
                                            <option value="Main Course" className="bg-[#2C1810]">Main Course</option>
                                            <option value="Starters" className="bg-[#2C1810]">Starters</option>
                                            <option value="Beverages" className="bg-[#2C1810]">Beverages</option>
                                            <option value="Desserts" className="bg-[#2C1810]">Desserts</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Image URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#ff6b00] focus:outline-none transition-colors"
                                    />
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-[#ff6b00] hover:bg-[#ff8c42] text-white rounded-xl transition-colors font-bold disabled:opacity-50"
                                    >
                                        {loading ? "Saving..." : "Save Item"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
