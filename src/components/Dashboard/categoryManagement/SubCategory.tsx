import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, ChevronDown, ChevronRight, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

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

const SubcategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [editingSubcategory, setEditingSubcategory] = useState<number | null>(null);
    const [editSubcategoryName, setEditSubcategoryName] = useState('');
    const [editSubcategoryCategoryId, setEditSubcategoryCategoryId] = useState<number | ''>('');
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [ShowForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'category'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter and sort subcategories
    const filteredAndSortedCategories = useMemo(() => {
        let filtered = categories.map(category => ({
            ...category,
            subcategories: category.subcategories.filter(subcategory =>
                subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })).filter(category => category.subcategories.length > 0);

        // Sort categories by name
        filtered.sort((a, b) => a.name.localeCompare(b.name));

        // Sort subcategories
        filtered.forEach(category => {
            category.subcategories.sort((a, b) => {
                let comparison = 0;

                if (sortBy === 'name') {
                    comparison = a.name.localeCompare(b.name);
                } else if (sortBy === 'category') {
                    // Already sorted by category name above
                    comparison = 0;
                }

                return sortOrder === 'asc' ? comparison : -comparison;
            });
        });

        return filtered;
    }, [categories, searchTerm, sortBy, sortOrder]);

    // Fetch categories and their subcategories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

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

    const addSubcategory = async () => {
        if (!newSubcategoryName.trim() || !selectedCategoryId) return;

        try {
            setLoading(true);
            const response = await mainAxios.post(`/categories/${selectedCategoryId}/subcategories`, {
                name: newSubcategoryName.trim()
            });

            // Update the categories state to include the new subcategory
            setCategories(categories.map(cat =>
                cat.id === selectedCategoryId
                    ? { ...cat, subcategories: [...cat.subcategories, response.data] }
                    : cat
            ));

            setNewSubcategoryName('');
            setSelectedCategoryId('');
            setSuccess('Subcategory added successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to add subcategory');
            console.error('Error adding subcategory:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateSubcategory = async (id: number) => {
        if (!editSubcategoryName.trim() || !editSubcategoryCategoryId) return;

        try {
            setLoading(true);
            const response = await mainAxios.put(`/categories/subcategories/${id}`, {
                name: editSubcategoryName.trim(),
                category_id: editSubcategoryCategoryId
            });

            // Update the categories state with the updated subcategory
            setCategories(prevCategories => {
                return prevCategories.map(category => {
                    // If it's the new category → insert/update
                    if (category.id === editSubcategoryCategoryId) {
                        // Check if sub already exists (same category update) or needs adding
                        const exists = category.subcategories.some(sub => sub.id === id);
                        return {
                            ...category,
                            subcategories: exists
                                ? category.subcategories.map(sub => sub.id === id ? response.data : sub)
                                : [...category.subcategories, response.data] // new category → add
                        };
                    }

                    // Otherwise → remove if it was here
                    return {
                        ...category,
                        subcategories: category.subcategories.filter(sub => sub.id !== id)
                    };
                });
            });

            setEditingSubcategory(null);
            setEditSubcategoryName('');
            setEditSubcategoryCategoryId('');
            setSuccess('Subcategory updated successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update subcategory');
            console.error('Error updating subcategory:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteSubcategory = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this subcategory?')) return;

        try {
            setLoading(true);
            await mainAxios.delete(`/categories/subcategories/${id}`);

            // Remove the subcategory from the state
            setCategories(prevCategories =>
                prevCategories.map(category => ({
                    ...category,
                    subcategories: category.subcategories.filter(sub => sub.id !== id)
                }))
            );

            setSuccess('Subcategory deleted successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete subcategory');
            console.error('Error deleting subcategory:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: number) => {
        if (expandedCategories.includes(id)) {
            setExpandedCategories(expandedCategories.filter(catId => catId !== id));
        } else {
            setExpandedCategories([...expandedCategories, id]);
        }
    };

    const startEdit = (subcategory: Subcategory) => {
        setEditingSubcategory(subcategory.id);
        setEditSubcategoryName(subcategory.name);
        setEditSubcategoryCategoryId(subcategory.category_id);
    };

    const cancelEdit = () => {
        setEditingSubcategory(null);
        setEditSubcategoryName('');
        setEditSubcategoryCategoryId('');
    };

    const toggleSort = (field: 'name' | 'category') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const expandAll = () => {
        setExpandedCategories(categories.map(cat => cat.id));
    };

    const collapseAll = () => {
        setExpandedCategories([]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white ">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-700 mb-2">
                            Subcategory Management
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Manage your restaurant subcategories
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Alert Messages */}
                <div className="mb-6">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-r-lg"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-red-800">{error}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setError(null)}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="bg-green-50 border-l-4 border-green-400 p-4 mb-4 rounded-r-lg"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-green-800">{success}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSuccess(null)}
                                        className="text-green-400 hover:text-green-600 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {ShowForm &&
                    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        {/* Add Subcategory Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl  p-6 mb-8"
                        >
                            <div className="flex items-center gap-3 mb-6 justify-between">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Add New Subcategory</h2>
                                    <p className="text-sm text-gray-500">Create a new subcategory for your restaurant</p>
                                </div>
                                <button onClick={() => setShowForm(false)} className='p-2 bg-red-100 cursor-pointer rounded-md text-red-500'>
                                    <X />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={selectedCategoryId}
                                        onChange={(e) => setSelectedCategoryId(e.target.value ? parseInt(e.target.value) : '')}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name</label>
                                    <input
                                        type="text"
                                        value={newSubcategoryName}
                                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                                        placeholder="Enter subcategory name"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={addSubcategory}
                                disabled={loading || !newSubcategoryName.trim() || !selectedCategoryId}
                                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                Add Subcategory
                            </button>
                        </motion.div>
                    </div>
                }
                {/* Search and Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl  p-6 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <button className="bg-green-500 text-white rounded md p-2 flex justify-center cursor-pointer" onClick={()=>setShowForm(true)}><Plus/> add new Category</button>
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search subcategories or categories..."
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Button (Mobile) */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                <Filter size={18} />
                                <span>Filters</span>
                            </button>
                        </div>

                        {/* Filter Options (Desktop) */}
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleSort('name')}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'name' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span>Name</span>
                                    {sortBy === 'name' && (
                                        sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                                    )}
                                </button>

                                <button
                                    onClick={() => toggleSort('category')}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'category' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span>Category</span>
                                    {sortBy === 'category' && (
                                        sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={expandAll}
                                    className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-300"
                                >
                                    Expand All
                                </button>
                                <button
                                    onClick={collapseAll}
                                    className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-300"
                                >
                                    Collapse All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Options (Mobile - Expanded) */}
                    {isFilterOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-4 md:hidden"
                        >
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleSort('name')}
                                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'name' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span>Name</span>
                                    {sortBy === 'name' && (
                                        sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                                    )}
                                </button>

                                <button
                                    onClick={() => toggleSort('category')}
                                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'category' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span>Category</span>
                                    {sortBy === 'category' && (
                                        sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={expandAll}
                                    className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-300"
                                >
                                    Expand All
                                </button>
                                <button
                                    onClick={collapseAll}
                                    className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-300"
                                >
                                    Collapse All
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Categories and Subcategories List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl  overflow-hidden"
                >
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold text-gray-900">Categories & Subcategories</h2>
                            </div>
                            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full border">
                                {filteredAndSortedCategories.reduce((total, cat) => total + cat.subcategories.length, 0)} subcategories
                            </span>
                        </div>
                    </div>

                    {loading && categories.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-green-600 bg-green-50 transition ease-in-out duration-150 cursor-not-allowed">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading categories...
                            </div>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="text-gray-400 mx-auto mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">No categories found</h3>
                            <p className="text-sm text-gray-500">Add categories first to create subcategories</p>
                        </div>
                    ) : filteredAndSortedCategories.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="text-gray-400 mx-auto mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">No matching subcategories</h3>
                            <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-3 text-sm text-green-600 hover:text-green-700 underline"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredAndSortedCategories.map((category) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <button
                                                    onClick={() => toggleExpand(category.id)}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
                                                    disabled={category.subcategories.length === 0}
                                                >
                                                    {category.subcategories.length > 0 ? (
                                                        expandedCategories.includes(category.id) ? (
                                                            <ChevronDown size={18} />
                                                        ) : (
                                                            <ChevronRight size={18} />
                                                        )
                                                    ) : (
                                                        <div className="w-[18px] h-[18px]" />
                                                    )}
                                                </button>

                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="min-w-0">
                                                        <h3 className="text-base font-medium text-gray-900 truncate">
                                                            {category.name}
                                                        </h3>
                                                        {category.subcategories.length > 0 && (
                                                            <p className="text-sm text-gray-500">
                                                                {category.subcategories.length} subcategory{category.subcategories.length !== 1 ? 'ies' : 'y'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subcategories */}
                                        <AnimatePresence>
                                            {category.subcategories.length > 0 && expandedCategories.includes(category.id) && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="mt-4 ml-8 overflow-hidden"
                                                >
                                                    <div className="bg-gray-50 rounded-lg p-4 ">
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {category.subcategories.map((subcategory) => (
                                                                <div key={subcategory.id} className="flex items-center justify-between p-3 bg-white rounded-lg ">
                                                                    {editingSubcategory === subcategory.id ? (
                                                                        <div className="flex-1">
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                                                                    <select
                                                                                        value={editSubcategoryCategoryId}
                                                                                        onChange={(e) => setEditSubcategoryCategoryId(e.target.value ? parseInt(e.target.value) : '')}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                                                    >
                                                                                        <option value="">Select a category</option>
                                                                                        {categories.map((cat) => (
                                                                                            <option key={cat.id} value={cat.id}>
                                                                                                {cat.name}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        value={editSubcategoryName}
                                                                                        onChange={(e) => setEditSubcategoryName(e.target.value)}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex gap-2 justify-end">
                                                                                <button
                                                                                    onClick={() => updateSubcategory(subcategory.id)}
                                                                                    disabled={loading || !editSubcategoryName.trim() || !editSubcategoryCategoryId}
                                                                                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg flex items-center gap-1 hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                                                                                >
                                                                                    <Save size={16} />
                                                                                    Save
                                                                                </button>
                                                                                <button
                                                                                    onClick={cancelEdit}
                                                                                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1 hover:bg-gray-300 transition-colors text-sm"
                                                                                >
                                                                                    <X size={16} />
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <div className="flex-1 min-w-0">
                                                                                <span className="text-gray-700 font-medium truncate block">{subcategory.name}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <button
                                                                                    onClick={() => startEdit(subcategory)}
                                                                                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                                                                                    title="Edit subcategory"
                                                                                >
                                                                                    <Edit size={16} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => deleteSubcategory(subcategory.id)}
                                                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                                    title="Delete subcategory"
                                                                                >
                                                                                    <Trash2 size={16} />
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default SubcategoryManagement;