import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, ChevronDown, ChevronRight, Upload, Image as ImageIcon, Search, Filter, Loader, Grid, List } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    subcategory_id: number;
    subcategory_name: string;
    created_at: string;
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

const ImageSkeleton: React.FC = () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-lg"></div>
);

const MenuItemSkeleton: React.FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => {
    if (viewMode === 'grid') {
        return (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <ImageSkeleton />
                </div>
                <div className="p-5">
                    <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg mb-3"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg w-1/3 mb-2"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg w-2/3 mb-4"></div>
                    <div className="flex justify-between items-center">
                        <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg w-1/4"></div>
                        <div className="h-8 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-xl w-1/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100">
                    <ImageSkeleton />
                </div>
                <div className="flex-1">
                    <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg mb-3 w-2/3"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg w-1/4 mb-2"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg w-full mb-3"></div>
                    <div className="flex justify-between items-center">
                        <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg w-1/4"></div>
                        <div className="h-8 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-xl w-1/4"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MenuItemCard: React.FC<{
    item: MenuItem;
    viewMode: 'grid' | 'list';
    onEdit: (item: MenuItem) => void;
    onDelete: (id: number) => void;
    isEditing: boolean;
}> = ({ item, viewMode, onEdit, onDelete, isEditing }) => {
    const [imgLoaded, setImgLoaded] = useState(false);

    const handleImageLoad = () => {
        setImgLoaded(true);
    };

    const getImageUrl = (image: string) => {
        return image === "string" || !image
            ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
            : `${import.meta.env.VITE_API_BASE_URL}${item.image}`;
    };

    if (viewMode === 'grid') {
        return (
            <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover group"
            >
                <div className="h-48 overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100">
                    {!imgLoaded && <ImageSkeleton />}
                    <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${!imgLoaded ? 'hidden' : ''}`}
                        onLoad={handleImageLoad}
                        onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
                    <div className="text-xs text-green-600 font-medium mb-2 px-2 py-1 bg-green-50 rounded-full inline-block">
                        {item.subcategory_name}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-green-600 text-lg">Rwf {item.price.toLocaleString()}</span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => onEdit(item)}
                                disabled={isEditing}
                                className="p-2 text-green-600 hover:text-green-700 rounded-xl hover:bg-green-50 transition-all duration-200 disabled:opacity-30 transform hover:scale-110"
                                title="Edit item"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => onDelete(item.id)}
                                disabled={isEditing}
                                className="p-2 text-red-600 hover:text-red-700 rounded-xl hover:bg-red-50 transition-all duration-200 disabled:opacity-30 transform hover:scale-110"
                                title="Delete item"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={{ x: 4 }}
            className="bg-white rounded-xl border border-gray-100 p-5 transition-all duration-300 hover group"
        >
            <div className="flex gap-5">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative bg-gradient-to-br from-gray-50 to-gray-100">
                    {!imgLoaded && <ImageSkeleton />}
                    <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${!imgLoaded ? 'hidden' : ''}`}
                        onLoad={handleImageLoad}
                        onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80";
                        }}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 truncate mr-2">{item.name}</h3>
                        <span className="font-bold text-green-600 text-lg flex-shrink-0">Rwf {item.price.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-green-600 font-medium mb-2 px-2 py-1 bg-green-50 rounded-full inline-block">
                        {item.subcategory_name}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{item.description}</p>
                    <div className="flex justify-end gap-1">
                        <button
                            onClick={() => onEdit(item)}
                            disabled={isEditing}
                            className="px-3 py-2 text-green-600 hover:text-green-700 rounded-lg hover:bg-green-50 transition-all duration-200 disabled:opacity-30 flex items-center gap-2"
                        >
                            <Edit size={16} />
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            disabled={isEditing}
                            className="px-3 py-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all duration-200 disabled:opacity-30 flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const MenuItemsGrid: React.FC<{
    items: MenuItem[];
    viewMode: 'grid' | 'list';
    onEdit: (item: MenuItem) => void;
    onDelete: (id: number) => void;
    isEditing: boolean;
    loadingRef?: any;
}> = ({ items, viewMode, onEdit, onDelete, isEditing, loadingRef }) => {
    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {items.map((item) => (
                    <MenuItemCard
                        key={item.id}
                        item={item}
                        viewMode={viewMode}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isEditing={isEditing}
                    />
                ))}
                <div ref={loadingRef} className="h-10 w-full col-span-full" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <MenuItemCard
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isEditing={isEditing}
                />
            ))}
            <div ref={loadingRef} className="h-10 w-full" />
        </div>
    );
};

const MenuItemManagement: React.FC = () => {
    const [showAddForm, setAddForm] = useState(false)
    const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
    const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);
    const [displayedMenuItems, setDisplayedMenuItems] = useState<MenuItem[]>([]);
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

    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'created_at'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentSubcategory, setCurrentSubcategory] = useState<number | null>(null);
    const [autoLoadEnabled, setAutoLoadEnabled] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [initialLoad, setInitialLoad] = useState(true);

    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);

    const loadingRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Fetch all data on component mount
    useEffect(() => {
        fetchCategories();
        fetchAllMenuItems();
    }, []);

    // Filter and sort items whenever filters change
    useEffect(() => {
        applyFiltersAndSort();
    }, [allMenuItems, searchQuery, priceFilter, sortBy, sortOrder, currentSubcategory]);

    // Handle infinite scroll
    useEffect(() => {
        if (!autoLoadEnabled || !hasMore || loading || isLoadingMore) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && !isLoadingMore) {
                    loadMoreItems();
                }
            },
            { threshold: 0.1 }
        );

        if (loadingRef.current) {
            observerRef.current.observe(loadingRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [autoLoadEnabled, hasMore, loading, isLoadingMore, displayedMenuItems.length]);

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

    const fetchAllMenuItems = async () => {
        try {
            setInitialLoad(true);
            setLoading(true);
            
            // Fetch all menu items without any filters - only pagination for initial load
            let allItems: MenuItem[] = [];
            let page = 1;
            let hasMoreData = true;

            while (hasMoreData) {
                const response = await mainAxios.get('/menu/', {
                    params: {
                        skip: (page - 1) * itemsPerPage,
                        limit: itemsPerPage
                    }
                });
                
                const items = response.data.items || response.data;
                if (items && items.length > 0) {
                    allItems = [...allItems, ...items];
                    hasMoreData = items.length === itemsPerPage;
                    page++;
                } else {
                    hasMoreData = false;
                }
            }

            setAllMenuItems(allItems);
            setError(null);
        } catch (err) {
            setError('Failed to fetch menu items');
            console.error('Error fetching menu items:', err);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...allMenuItems];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.subcategory_name.toLowerCase().includes(query)
            );
        }

        // Apply price filter
        if (priceFilter.min) {
            const minPrice = parseFloat(priceFilter.min);
            filtered = filtered.filter(item => item.price >= minPrice);
        }
        if (priceFilter.max) {
            const maxPrice = parseFloat(priceFilter.max);
            filtered = filtered.filter(item => item.price <= maxPrice);
        }

        // Apply subcategory filter
        if (currentSubcategory) {
            filtered = filtered.filter(item => item.subcategory_id === currentSubcategory);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;
            
            switch (sortBy) {
                case 'price':
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case 'created_at':
                    aValue = new Date(a.created_at).getTime();
                    bValue = new Date(b.created_at).getTime();
                    break;
                case 'name':
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredMenuItems(filtered);
        setDisplayedMenuItems(filtered.slice(0, itemsPerPage));
        setCurrentPage(1);
        setHasMore(filtered.length > itemsPerPage);
    };

    const loadMoreItems = () => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        
        setTimeout(() => {
            const nextPage = currentPage + 1;
            const startIndex = 0; // Since we're slicing from filtered array
            const endIndex = nextPage * itemsPerPage;
            const newItems = filteredMenuItems.slice(startIndex, endIndex);
            
            setDisplayedMenuItems(newItems);
            setCurrentPage(nextPage);
            setHasMore(endIndex < filteredMenuItems.length);
            setIsLoadingMore(false);
        }, 300);
    };

    const handleLoadMoreClick = () => {
        loadMoreItems();
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
            await mainAxios.post('/menu/add', {
                name: newMenuItem.name.trim(),
                description: newMenuItem.description.trim(),
                price: parseFloat(newMenuItem.price),
                image: newMenuItem.image,
                subcategory_id: parseInt(newMenuItem.subcategory_id)
            });

            // Refresh the entire list
            await fetchAllMenuItems();

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
            setAddForm(false);
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
            await mainAxios.put(`/menu/${id}`, {
                name: editMenuItem.name.trim(),
                description: editMenuItem.description.trim(),
                price: parseFloat(editMenuItem.price),
                image: editMenuItem.image,
                subcategory_id: parseInt(editMenuItem.subcategory_id)
            });

            // Refresh the entire list
            await fetchAllMenuItems();

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

            // Refresh the entire list
            await fetchAllMenuItems();

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
        setEditImagePreview(item.image ? `${import.meta.env.VITE_API_BASE_URL}${item.image}` : null);

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

    const handleSubcategoryClick = (subcategoryId: number) => {
        setCurrentSubcategory(subcategoryId);
    };

    const showAllMenuItems = () => {
        setCurrentSubcategory(null);
        setSearchQuery('');
        setPriceFilter({ min: '', max: '' });
        setSortBy('name');
        setSortOrder('asc');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                        Menu Management
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Effortlessly manage your restaurant menu with a modern, intuitive interface
                    </p>
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex justify-between items-center"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="font-medium">{error}</span>
                            </div>
                            <button onClick={() => setError(null)} className="text-red-800 hover:text-red-900 transition-colors">
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
                            className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 flex justify-between items-center"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="font-medium">{success}</span>
                            </div>
                            <button onClick={() => setSuccess(null)} className="text-green-800 hover:text-green-900 transition-colors">
                                <X size={20} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {showAddForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900">Add New Menu Item</h2>
                                    <button
                                        onClick={() => setAddForm(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                                            <select
                                                value={selectedCategoryId}
                                                onChange={(e) => setSelectedCategoryId(e.target.value ? parseInt(e.target.value) : '')}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">Subcategory</label>
                                            <select
                                                value={selectedSubcategoryId}
                                                onChange={(e) => {
                                                    const value = e.target.value ? parseInt(e.target.value) : '';
                                                    setSelectedSubcategoryId(value);
                                                    setNewMenuItem({ ...newMenuItem, subcategory_id: value.toString() });
                                                }}
                                                disabled={!selectedCategoryId}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:opacity-50"
                                            >
                                                <option value="">Select a subcategory</option>
                                                {filteredSubcategories.map((subcategory) => (
                                                    <option key={subcategory.id} value={subcategory.id}>
                                                        {subcategory.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Item Name</label>
                                        <input
                                            type="text"
                                            value={newMenuItem.name}
                                            onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                                            placeholder="Enter item name"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Price (Rwf)</label>
                                        <input
                                            type="number"
                                            value={newMenuItem.price}
                                            onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                                            placeholder="Enter price"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                                        <textarea
                                            value={newMenuItem.description}
                                            onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                                            placeholder="Enter item description"
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Item Image</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-3 rounded-xl cursor-pointer hover:from-green-700 hover:to-green-800 transition-all hover:shadow-xl">
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
                                                <div className="relative group">
                                                    <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border-2 border-green-200" />
                                                    <button
                                                        onClick={() => {
                                                            setNewMenuItem({ ...newMenuItem, image: '' });
                                                            setImagePreview(null);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={addMenuItem}
                                        disabled={loading || !newMenuItem.name.trim() || !newMenuItem.description.trim() ||
                                            !newMenuItem.price || !newMenuItem.subcategory_id}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        <Plus size={20} />
                                        Add Menu Item
                                    </button>
                                    <button
                                        onClick={() => setAddForm(false)}
                                        className="px-8 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-fit xl:col-span-1"
                    >
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Categories</h2>
                                <button
                                    onClick={showAllMenuItems}
                                    className="text-green-600 hover:text-green-800 text-sm font-semibold transition-colors"
                                >
                                    Show All
                                </button>
                            </div>
                        </div>

                        {loading && categories.length === 0 ? (
                            <div className="p-6 space-y-3">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="h-8 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-xl"></div>
                                ))}
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">No categories found.</div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {categories.map((category) => (
                                    <li key={category.id} className="hover:bg-gray-50 transition-colors">
                                        <div className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => toggleExpand(category.id)}
                                                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                                                    >
                                                        {expandedCategories.includes(category.id) ? (
                                                            <ChevronDown size={18} />
                                                        ) : (
                                                            <ChevronRight size={18} />
                                                        )}
                                                    </button>
                                                    <span className="font-semibold text-gray-900">{category.name}</span>
                                                </div>
                                            </div>

                                            {expandedCategories.includes(category.id) && (
                                                <motion.ul
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-3 ml-8 pl-4 border-l-2 border-green-100"
                                                >
                                                    {category.subcategories.length === 0 ? (
                                                        <li className="text-gray-400 text-sm py-2">No subcategories</li>
                                                    ) : (
                                                        category.subcategories.map((subcategory) => (
                                                            <li key={subcategory.id} className="py-2">
                                                                <button
                                                                    onClick={() => handleSubcategoryClick(subcategory.id)}
                                                                    className={`text-sm px-3 py-2 rounded-lg transition-all w-full text-left ${
                                                                        currentSubcategory === subcategory.id 
                                                                            ? 'bg-green-50 text-green-700 font-semibold' 
                                                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                                                    }`}
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

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="xl:col-span-3"
                    >
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-center">
                                <div className="flex-1 relative w-full">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search menu items by name or description..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
                                        >
                                            <Filter size={18} />
                                            Filters
                                        </button>
                                        <AnimatePresence>
                                            {showFilters && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-xl p-5 z-10 min-w-80 shadow-xl"
                                                >
                                                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Filters & Sort</h4>
                                                    <div className="space-y-5">
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range (Rwf)</label>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <input
                                                                        type="number"
                                                                        value={priceFilter.min}
                                                                        onChange={(e) => setPriceFilter({ ...priceFilter, min: e.target.value })}
                                                                        placeholder="Min"
                                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <input
                                                                        type="number"
                                                                        value={priceFilter.max}
                                                                        onChange={(e) => setPriceFilter({ ...priceFilter, max: e.target.value })}
                                                                        placeholder="Max"
                                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                                                                <select
                                                                    value={sortBy}
                                                                    onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'created_at')}
                                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                                                                >
                                                                    <option value="name">Name</option>
                                                                    <option value="price">Price</option>
                                                                    <option value="created_at">Date Added</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
                                                                <select
                                                                    value={sortOrder}
                                                                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                                                                >
                                                                    <option value="asc">Ascending</option>
                                                                    <option value="desc">Descending</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                            <input
                                                                type="checkbox"
                                                                checked={autoLoadEnabled}
                                                                onChange={() => setAutoLoadEnabled(!autoLoadEnabled)}
                                                                className="rounded text-green-600 focus:ring-green-500 w-4 h-4"
                                                            />
                                                            <label className="text-sm text-gray-700 font-medium">Auto Load More Items</label>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-3 transition-all ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:text-gray-800'}`}
                                            title="Grid view"
                                        >
                                            <Grid size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-3 transition-all ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:text-gray-800'}`}
                                            title="List view"
                                        >
                                            <List size={18} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => setAddForm(true)}
                                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <Plus size={20} />
                                        Add Item
                                    </button>
                                </div>
                            </div>
                        </div>

                        {currentSubcategory && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                                <span className="text-green-800 font-medium">
                                    Showing items from: <strong>{categories.flatMap(cat => cat.subcategories).find(sub => sub.id === currentSubcategory)?.name}</strong>
                                </span>
                                <button
                                    onClick={showAllMenuItems}
                                    className="text-green-600 hover:text-green-800 text-sm font-semibold transition-colors"
                                >
                                    Show All Items
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {currentSubcategory 
                                        ? categories.flatMap(cat => cat.subcategories).find(sub => sub.id === currentSubcategory)?.name
                                        : 'All Menu Items'
                                    }
                                </h2>
                                <p className="text-gray-600">
                                    {displayedMenuItems.length} of {filteredMenuItems.length} items
                                    {searchQuery || priceFilter.min || priceFilter.max || currentSubcategory ? ' (filtered)' : ''}
                                </p>
                            </div>
                            
                            {!autoLoadEnabled && hasMore && (
                                <button
                                    onClick={handleLoadMoreClick}
                                    disabled={isLoadingMore}
                                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLoadingMore ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                                    Load More
                                </button>
                            )}
                        </div>

                        {initialLoad ? (
                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <MenuItemSkeleton key={index} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : displayedMenuItems.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                <div className="text-gray-300 mb-6">
                                    <ImageIcon size={80} className="mx-auto" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No menu items found</h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    {searchQuery || priceFilter.min || priceFilter.max || currentSubcategory
                                        ? 'Try adjusting your search filters or clear them to see all items.'
                                        : 'Get started by adding your first menu item to showcase your offerings.'
                                    }
                                </p>
                                {!searchQuery && !priceFilter.min && !priceFilter.max && !currentSubcategory && (
                                    <button
                                        onClick={() => setAddForm(true)}
                                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all hover:shadow-xl flex items-center gap-2 mx-auto"
                                    >
                                        <Plus size={20} />
                                        Add Your First Item
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <MenuItemsGrid
                                    items={displayedMenuItems}
                                    viewMode={viewMode}
                                    onEdit={startEdit}
                                    onDelete={deleteMenuItem}
                                    isEditing={editingMenuItem !== null}
                                    loadingRef={loadingRef}
                                />
                                
                                {isLoadingMore && (
                                    <div className="flex justify-center py-12">
                                        <div className="flex items-center gap-3 text-green-600">
                                            <Loader size={24} className="animate-spin" />
                                            <span className="font-medium">Loading more items...</span>
                                        </div>
                                    </div>
                                )}
                                
                                {!hasMore && displayedMenuItems.length > 0 && (
                                    <div className="text-center py-12 text-gray-500 border-t border-gray-100 mt-8">
                                        <div className="max-w-md mx-auto">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            </div>
                                            <p className="font-medium">You've reached the end of the menu</p>
                                            <p className="text-sm mt-1">All {filteredMenuItems.length} items are displayed</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>

                {editingMenuItem !== null && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900">Edit Menu Item</h2>
                                    <button
                                        onClick={cancelEdit}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                                            <select
                                                value={selectedCategoryId}
                                                onChange={(e) => setSelectedCategoryId(e.target.value ? parseInt(e.target.value) : '')}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">Subcategory</label>
                                            <select
                                                value={editMenuItem.subcategory_id}
                                                onChange={(e) => setEditMenuItem({ ...editMenuItem, subcategory_id: e.target.value })}
                                                disabled={!selectedCategoryId}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:opacity-50"
                                            >
                                                <option value="">Select a subcategory</option>
                                                {filteredSubcategories.map((subcategory) => (
                                                    <option key={subcategory.id} value={subcategory.id}>
                                                        {subcategory.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Item Name</label>
                                        <input
                                            type="text"
                                            value={editMenuItem.name}
                                            onChange={(e) => setEditMenuItem({ ...editMenuItem, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Price (Rwf)</label>
                                        <input
                                            type="number"
                                            value={editMenuItem.price}
                                            onChange={(e) => setEditMenuItem({ ...editMenuItem, price: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                                        <textarea
                                            value={editMenuItem.description}
                                            onChange={(e) => setEditMenuItem({ ...editMenuItem, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Item Image</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-3 rounded-xl cursor-pointer hover:from-green-700 hover:to-green-800 transition-all hover:shadow-xl">
                                                <Upload size={20} />
                                                Change Image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, true)}
                                                    className="hidden"
                                                />
                                            </label>
                                            {editImagePreview && (
                                                <div className="relative group">
                                                    <img src={editImagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border-2 border-green-200" />
                                                    <button 
                                                        onClick={() => {
                                                            setEditMenuItem({ ...editMenuItem, image: '' });
                                                            setEditImagePreview(null);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => updateMenuItem(editingMenuItem)}
                                        disabled={loading || !editMenuItem.name.trim() || !editMenuItem.description.trim() ||
                                            !editMenuItem.price || !editMenuItem.subcategory_id}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        <Save size={20} />
                                        Update Menu Item
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="px-8 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuItemManagement;