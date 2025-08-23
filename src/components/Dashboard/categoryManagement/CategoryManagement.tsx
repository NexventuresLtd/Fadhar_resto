import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, ChevronDown, ChevronRight, Folder, FolderOpen, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
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

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<number | null>(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [ShowForm, setShowForm] = useState(false);
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'subcategories'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filterBy, setFilterBy] = useState<'all' | 'with-subcategories' | 'without-subcategories'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter and sort categories
    const filteredAndSortedCategories = useMemo(() => {
        let filtered = categories.filter(category => {
            // Search filter
            const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.subcategories.some(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()));

            if (!matchesSearch) return false;

            // Category type filter
            switch (filterBy) {
                case 'with-subcategories':
                    return category.subcategories.length > 0;
                case 'without-subcategories':
                    return category.subcategories.length === 0;
                default:
                    return true;
            }
        });

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;

            if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === 'subcategories') {
                comparison = a.subcategories.length - b.subcategories.length;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [categories, searchTerm, filterBy, sortBy, sortOrder]);

    // Fetch categories on component mount
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

    const addCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            setLoading(true);
            const response = await mainAxios.post('/categories/add', {
                name: newCategoryName.trim()
            });

            setCategories([...categories, response.data]);
            setNewCategoryName('');
            setSuccess('Category added successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to add category');
            console.error('Error adding category:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async (id: number) => {
        if (!editCategoryName.trim()) return;

        try {
            setLoading(true);
            const response = await mainAxios.put(`/categories/${id}`, {
                name: editCategoryName.trim()
            });

            setCategories(categories.map(cat =>
                cat.id === id ? response.data : cat
            ));

            setEditingCategory(null);
            setEditCategoryName('');
            setSuccess('Category updated successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update category');
            console.error('Error updating category:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            setLoading(true);
            await mainAxios.delete(`/categories/${id}`);

            setCategories(categories.filter(cat => cat.id !== id));
            setSuccess('Category deleted successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete category');
            console.error('Error deleting category:', err);
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

    const toggleSort = (field: 'name' | 'subcategories') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white rounded-2xl">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-700 mb-2">
                            Category Management
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Manage your restaurant categories and subcategories
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

                {/* Search and Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <button className="bg-green-600 text-white rounded md p-2 flex justify-center cursor-pointer" onClick={() => setShowForm(true)}><Plus /> add new Category</button>
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search categories or subcategories..."
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
                            <div className="relative">
                                <select
                                    value={filterBy}
                                    onChange={(e) => setFilterBy(e.target.value as any)}
                                    className="pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="with-subcategories">With Subcategories</option>
                                    <option value="without-subcategories">Without Subcategories</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronDown size={16} />
                                </div>
                            </div>

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
                                    onClick={() => toggleSort('subcategories')}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'subcategories' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span>Subcategories</span>
                                    {sortBy === 'subcategories' && (
                                        sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                                    )}
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
                            <div className="relative">
                                <select
                                    value={filterBy}
                                    onChange={(e) => setFilterBy(e.target.value as any)}
                                    className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="with-subcategories">With Subcategories</option>
                                    <option value="without-subcategories">Without Subcategories</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronDown size={16} />
                                </div>
                            </div>

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
                                    onClick={() => toggleSort('subcategories')}
                                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'subcategories' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span>Subcategories</span>
                                    {sortBy === 'subcategories' && (
                                        sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
                {ShowForm &&
                    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        {/* Add Category Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                        >
                            <div className="flex items-center gap-3 mb-6 justify-between">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Add New Category</h2>
                                    <p className="text-sm text-gray-500">Create a new category for your restaurant</p>
                                </div>
                                <button onClick={() => setShowForm(false)} className='p-2 bg-red-100 cursor-pointer rounded-md text-red-500'>
                                    <X />
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Enter category name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <button
                                    onClick={addCategory}
                                    disabled={loading || !newCategoryName.trim()}
                                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-fit"
                                >
                                    <Plus size={18} />
                                    <span className="hidden sm:inline">Add Category</span>
                                    <span className="sm:hidden">Add</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                }

                {/* Categories List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Folder className="w-4 h-4 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                            </div>
                            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full border">
                                {filteredAndSortedCategories.length} of {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                            </span>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
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
                        ) : filteredAndSortedCategories.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <Folder className="mx-auto h-12 w-12 text-gray-300" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    {categories.length === 0 ? 'No categories' : 'No matching categories'}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {categories.length === 0
                                        ? 'Get started by creating your first category.'
                                        : 'Try adjusting your search or filter criteria.'
                                    }
                                </p>
                                {(searchTerm || filterBy !== 'all') && categories.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterBy('all');
                                            setIsFilterOpen(false);
                                        }}
                                        className="mt-3 text-sm text-green-600 hover:text-green-700 underline"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredAndSortedCategories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div className="px-6 py-4">
                                        {editingCategory === category.id ? (
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                                <div className="flex-1 w-full sm:w-auto">
                                                    <input
                                                        type="text"
                                                        value={editCategoryName}
                                                        onChange={(e) => setEditCategoryName(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => updateCategory(category.id)}
                                                        disabled={loading || !editCategoryName.trim()}
                                                        className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    >
                                                        <Save size={16} />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingCategory(null);
                                                            setEditCategoryName('');
                                                        }}
                                                        className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <X size={16} />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
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
                                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                {expandedCategories.includes(category.id) && category.subcategories.length > 0 ? (
                                                                    <FolderOpen className="w-4 h-4 text-green-600" />
                                                                ) : (
                                                                    <Folder className="w-4 h-4 text-green-600" />
                                                                )}
                                                            </div>
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

                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button
                                                            onClick={() => {
                                                                setEditingCategory(category.id);
                                                                setEditCategoryName(category.name);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                                                            title="Edit category"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteCategory(category.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                            title="Delete category"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
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
                                                            className="mt-4 ml-11 overflow-hidden"
                                                        >
                                                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                                <h4 className="text-sm font-medium text-gray-700 mb-3">Subcategories</h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                    {category.subcategories.map((subcategory) => (
                                                                        <div key={subcategory.id} className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
                                                                            <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                                                                            <span className="truncate">{subcategory.name}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CategoryManagement;