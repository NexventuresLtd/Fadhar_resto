import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, ChevronDown, ChevronRight, Upload, Image as ImageIcon } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';


interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    subcategory_id: number;
    subcategory_name: string;
}

interface Subcategory {
    id: number;
    name: string;
    category_id: number;
}

interface Category {
    id: number;
    name: string;
    subcategories: Subcategory[];
}

const MenuItemManagement: React.FC = () => {
    const [showAddForm, setAddForm] = useState(false)
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | ''>('');
    const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
    const [newMenuItem, setNewMenuItem] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        subcategory_id: ''
    });
    const [editingMenuItem, setEditingMenuItem] = useState<number | null>(null);
    const [editMenuItem, setEditMenuItem] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        subcategory_id: ''
    });
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

    // Fetch categories and menu items on component mount
    useEffect(() => {
        fetchCategories();
        fetchMenuItems();
    }, []);

    // Update filtered subcategories when category selection changes
    useEffect(() => {
        if (selectedCategoryId) {
            const category = categories.find(cat => cat.id === selectedCategoryId);
            if (category) {
                setFilteredSubcategories(category.subcategories);
            } else {
                setFilteredSubcategories([]);
            }
        } else {
            setFilteredSubcategories([]);
        }
        setSelectedSubcategoryId('');
    }, [selectedCategoryId, categories]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await mainAxios.get('/categories/');
            setCategories(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch categories');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await mainAxios.get('/menu/');
            setMenuItems(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch menu items');
            console.error('Error fetching menu items:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuItemsBySubcategory = async (subcategoryId: number) => {
        try {
            setLoading(true);
            const response = await mainAxios.get(`/menu/subcategory/${subcategoryId}`);
            setMenuItems(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch menu items');
            console.error('Error fetching menu items:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                if (isEdit) {
                    setEditMenuItem({ ...editMenuItem, image: base64 });
                    setEditImagePreview(base64);
                } else {
                    setNewMenuItem({ ...newMenuItem, image: base64 });
                    setImagePreview(base64);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const addMenuItem = async () => {
        if (!newMenuItem.name.trim() || !newMenuItem.description.trim() ||
            !newMenuItem.price || !newMenuItem.subcategory_id) return;

        try {
            setLoading(true);
            const response = await mainAxios.post('/menu/add', {
                name: newMenuItem.name.trim(),
                description: newMenuItem.description.trim(),
                price: parseFloat(newMenuItem.price),
                image: newMenuItem.image,
                subcategory_id: parseInt(newMenuItem.subcategory_id)
            });

            setMenuItems([...menuItems, response.data]);
            setNewMenuItem({
                name: '',
                description: '',
                price: '',
                image: '',
                subcategory_id: ''
            });
            setImagePreview(null);
            setSelectedCategoryId('');
            setSelectedSubcategoryId('');
            setSuccess('Menu item added successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to add menu item');
            console.error('Error adding menu item:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateMenuItem = async (id: number) => {
        if (!editMenuItem.name.trim() || !editMenuItem.description.trim() ||
            !editMenuItem.price || !editMenuItem.subcategory_id) return;

        try {
            setLoading(true);
            const response = await mainAxios.put(`/menu/${id}`, {
                name: editMenuItem.name.trim(),
                description: editMenuItem.description.trim(),
                price: parseFloat(editMenuItem.price),
                image: editMenuItem.image,
                subcategory_id: parseInt(editMenuItem.subcategory_id)
            });

            setMenuItems(menuItems.map(item =>
                item.id === id ? response.data : item
            ));

            setEditingMenuItem(null);
            setEditMenuItem({
                name: '',
                description: '',
                price: '',
                image: '',
                subcategory_id: ''
            });
            setEditImagePreview(null);
            setSuccess('Menu item updated successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update menu item');
            console.error('Error updating menu item:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteMenuItem = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this menu item?')) return;

        try {
            setLoading(true);
            await mainAxios.delete(`/menu/${id}`);

            setMenuItems(menuItems.filter(item => item.id !== id));
            setSuccess('Menu item deleted successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete menu item');
            console.error('Error deleting menu item:', err);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (item: MenuItem) => {
        setEditingMenuItem(item.id);
        setEditMenuItem({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            image: item.image,
            subcategory_id: item.subcategory_id.toString()
        });
        setEditImagePreview(item.image);

        // Find the category for this subcategory
        const category = categories.find(cat =>
            cat.subcategories.some(sub => sub.id === item.subcategory_id)
        );
        if (category) {
            setSelectedCategoryId(category.id);
            setFilteredSubcategories(category.subcategories);
        }
    };

    const cancelEdit = () => {
        setEditingMenuItem(null);
        setEditMenuItem({
            name: '',
            description: '',
            price: '',
            image: '',
            subcategory_id: ''
        });
        setEditImagePreview(null);
        setSelectedCategoryId('');
        setSelectedSubcategoryId('');
    };

    const toggleExpand = (id: number) => {
        if (expandedCategories.includes(id)) {
            setExpandedCategories(expandedCategories.filter(catId => catId !== id));
        } else {
            setExpandedCategories([...expandedCategories, id]);
        }
    };

    const handleSubcategoryClick = async (subcategoryId: number) => {
        await fetchMenuItemsBySubcategory(subcategoryId);
    };

    return (
        <div className="min-h-screen bg-white md:p-6">
            <div className="max-w-full mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl md:text-3xl font-bold text-green-800 mb-8 text-center"
                >
                    Fadhar Restaurant Menu Item Management
                </motion.h1>

                {/* Success and Error Messages */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center"
                        >
                            <span>{error}</span>
                            <button onClick={() => setError(null)}>
                                <X size={20} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center"
                        >
                            <span>{success}</span>
                            <button onClick={() => setSuccess(null)}>
                                <X size={20} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                {showAddForm &&
                    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        {/* Add Menu Item Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg p-6 mb-8"
                        >
                            <div className="flex justify-between py-2 cursor-pointer">
                                <h2 className="text-xl font-semibold text-green-700 mb-4">Add New Menu Item</h2>
                                <X onClick={() => setAddForm(false)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-green-700 mb-1">Category</label>
                                    <select
                                        value={selectedCategoryId}
                                        onChange={(e) => setSelectedCategoryId(e.target.value ? parseInt(e.target.value) : '')}
                                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-green-700 mb-1">Subcategory</label>
                                    <select
                                        value={selectedSubcategoryId}
                                        onChange={(e) => {
                                            const value = e.target.value ? parseInt(e.target.value) : '';
                                            setSelectedSubcategoryId(value);
                                            setNewMenuItem({ ...newMenuItem, subcategory_id: value.toString() });
                                        }}
                                        disabled={!selectedCategoryId}
                                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                                    >
                                        <option value="">Select a subcategory</option>
                                        {filteredSubcategories.map((subcategory) => (
                                            <option key={subcategory.id} value={subcategory.id}>
                                                {subcategory.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-green-700 mb-1">Item Name</label>
                                    <input
                                        type="text"
                                        value={newMenuItem.name}
                                        onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                                        placeholder="Enter item name"
                                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-green-700 mb-1">Price</label>
                                    <input
                                        type="number"
                                        value={newMenuItem.price}
                                        onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                                        placeholder="Enter price"
                                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-green-700 mb-1">Description</label>
                                    <textarea
                                        value={newMenuItem.description}
                                        onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                                        placeholder="Enter item description"
                                        rows={3}
                                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-green-700 mb-1">Image</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition-colors">
                                            <Upload size={20} />
                                            Upload Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e)}
                                                className="hidden"
                                            />
                                        </label>
                                        {imagePreview && (
                                            <div className="relative">
                                                <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-green-300" />
                                                <button
                                                    onClick={() => {
                                                        setNewMenuItem({ ...newMenuItem, image: '' });
                                                        setImagePreview(null);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={addMenuItem}
                                disabled={loading || !newMenuItem.name.trim() || !newMenuItem.description.trim() ||
                                    !newMenuItem.price || !newMenuItem.subcategory_id}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                <Plus size={20} />
                                Add Menu Item
                            </button>
                        </motion.div>
                    </div>
                }
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Categories Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-50 rounded-lg overflow-hidden h-fit"
                    >
                        <h2 className="text-xl font-semibold text-green-700 p-4 border-b border-green-100">
                            Categories
                        </h2>
                        {loading && categories.length === 0 ? (
                            <div className="p-4 text-center text-green-600">Loading categories...</div>
                        ) : categories.length === 0 ? (
                            <div className="p-4 text-center text-green-600">No categories found.</div>
                        ) : (
                            <ul className="divide-y divide-green-100">
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleExpand(category.id)}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        {expandedCategories.includes(category.id) ? (
                                                            <ChevronDown size={20} />
                                                        ) : (
                                                            <ChevronRight size={20} />
                                                        )}
                                                    </button>
                                                    <span className="font-medium text-green-800">{category.name}</span>
                                                </div>
                                            </div>

                                            {/* Subcategories */}
                                            {expandedCategories.includes(category.id) && (
                                                <motion.ul
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-2 ml-8 pl-4 border-l-2 border-green-200"
                                                >
                                                    {category.subcategories.length === 0 ? (
                                                        <li className="text-green-500 italic py-1">No subcategories</li>
                                                    ) : (
                                                        category.subcategories.map((subcategory) => (
                                                            <li key={subcategory.id} className="py-1">
                                                                <button
                                                                    onClick={() => handleSubcategoryClick(subcategory.id)}
                                                                    className="text-green-600 hover:text-green-800 text-sm"
                                                                >
                                                                    {subcategory.name}
                                                                </button>
                                                            </li>
                                                        ))
                                                    )}
                                                </motion.ul>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>

                    {/* Menu Items List */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-50 rounded-lg overflow-hidden lg:col-span-2"
                    >
                        <div className="flex justify-between items-center px-2">

                            <h2 className="text-xl font-semibold text-green-700 p-4 border-b border-green-100">
                                Menu Items
                            </h2>
                            <button onClick={() => setAddForm(true)} className='p-2 cursor-pointer text-white bg-green-500 rounded-sm'>
                                <Plus />
                            </button>
                        </div>

                        {loading && menuItems.length === 0 ? (
                            <div className="p-6 text-center text-green-600">Loading menu items...</div>
                        ) : menuItems.length === 0 ? (
                            <div className="p-6 text-center text-green-600">No menu items found. Select a subcategory or add new items!</div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 p-4">
                                {menuItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white hover:bg-green-50 cursor-pointer rounded-lg p-4"
                                    >
                                        {editingMenuItem === item.id ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-green-700 mb-1">Category</label>
                                                        <select
                                                            value={selectedCategoryId}
                                                            onChange={(e) => setSelectedCategoryId(e.target.value ? parseInt(e.target.value) : '')}
                                                            className="w-full px-3 py-1 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        >
                                                            <option value="">Select a category</option>
                                                            {categories.map((category) => (
                                                                <option key={category.id} value={category.id}>
                                                                    {category.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-green-700 mb-1">Subcategory</label>
                                                        <select
                                                            value={editMenuItem.subcategory_id}
                                                            onChange={(e) => setEditMenuItem({ ...editMenuItem, subcategory_id: e.target.value })}
                                                            className="w-full px-3 py-1 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        >
                                                            <option value="">Select a subcategory</option>
                                                            {filteredSubcategories.map((subcategory) => (
                                                                <option key={subcategory.id} value={subcategory.id}>
                                                                    {subcategory.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-green-700 mb-1">Item Name</label>
                                                        <input
                                                            type="text"
                                                            value={editMenuItem.name}
                                                            onChange={(e) => setEditMenuItem({ ...editMenuItem, name: e.target.value })}
                                                            className="w-full px-3 py-1 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-green-700 mb-1">Price</label>
                                                        <input
                                                            type="number"
                                                            value={editMenuItem.price}
                                                            onChange={(e) => setEditMenuItem({ ...editMenuItem, price: e.target.value })}
                                                            className="w-full px-3 py-1 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-green-700 mb-1">Description</label>
                                                        <textarea
                                                            value={editMenuItem.description}
                                                            onChange={(e) => setEditMenuItem({ ...editMenuItem, description: e.target.value })}
                                                            rows={3}
                                                            className="w-full px-3 py-1 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-green-700 mb-1">Image</label>
                                                        <div className="flex items-center gap-4">
                                                            <label className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-green-700 transition-colors text-sm">
                                                                <Upload size={16} />
                                                                Change Image
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageUpload(e, true)}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                            {editImagePreview && (
                                                                <div className="relative">
                                                                    <img src={editImagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-green-300" />
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditMenuItem({ ...editMenuItem, image: '' });
                                                                            setEditImagePreview(null);
                                                                        }}
                                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => updateMenuItem(item.id)}
                                                        disabled={loading || !editMenuItem.name.trim() || !editMenuItem.description.trim() ||
                                                            !editMenuItem.price || !editMenuItem.subcategory_id}
                                                        className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                                                    >
                                                        <Save size={16} />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-gray-400 transition-colors text-sm"
                                                    >
                                                        <X size={16} />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex-shrink-0">
                                                    {item.image ? (
                                                        <img src={item.image == "string" ? "https://m.media-amazon.com/images/I/81Ty4ssA1oL.jpg" : item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                                                    ) : (
                                                        <div className="w-24 h-24 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <ImageIcon size={32} className="text-green-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-semibold text-green-800 text-lg uppercase">{item.name}</h3>
                                                    <p className="text-green-600 text-sm mb-2 lowercase">{item.subcategory_name}</p>
                                                    <p className="text-green-700 text-sm mb-2 lowercase">{item.description}</p>
                                                    <p className="font-bold text-green-800">Rwf {item.price.toLocaleString()}</p>
                                                </div>
                                                <div className="flex gap-2 self-start">
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-colors"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteMenuItem(item.id)}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MenuItemManagement;