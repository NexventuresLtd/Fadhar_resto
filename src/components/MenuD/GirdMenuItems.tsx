import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Grid, List, Search, X, ChevronRight, ChevronLeft, Check, CreditCard, DollarSign, BikeIcon, HandGrab, BookMarked, Utensils, Plus, Loader } from 'lucide-react';
import mainAxios from '../../Instance/mainAxios';
import { contactMe } from '../../app/WhatsappMessage';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    subcategory_id: number;
    subcategory_name: string;
    category_name: string;
}

interface Table {
    id: number;
    number: string;
    capacity: number;
    table_image?: string;
    status: 'available' | 'booked';
    booking_timeout: string | null;
}

interface OrderData {
    customer_name: string;
    customer_phone: string;
    order_type: 'delivery' | 'pickup' | 'booking';
    item_id: number;
    quantity: number;
    table_number?: number;
}

interface BookingData {
    table_id: number;
    customer_name: string;
    customer_phone: string;
    number_of_people: number;
    booking_duration: number;
}

interface Category {
    id: number;
    name: string;
    subcategories: Subcategory[];
}

interface Subcategory {
    id: number;
    name: string;
    category_id: number;
}

// Image Skeleton Component
const ImageSkeleton: React.FC = () => (
    <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
);

// Menu Item Skeleton Component
const MenuItemSkeleton: React.FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => {
    if (viewMode === 'grid') {
        return (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                    <ImageSkeleton />
                </div>
                <div className="p-4">
                    <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 mb-3"></div>
                    <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
                        <div className="h-8 bg-gray-200 animate-pulse rounded-full w-1/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageSkeleton />
                </div>
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 animate-pulse rounded mb-2 w-2/3"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-2"></div>
                    <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
                        <div className="h-8 bg-gray-200 animate-pulse rounded-full w-1/4"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Menu Item Card Component
const MenuItemCard: React.FC<{
    item: MenuItem;
    viewMode: 'grid' | 'list';
    onItemClick: (item: MenuItem) => void;
    imageLoading: boolean;
    onImageLoad: (id: number) => void;
}> = ({ item, viewMode, onItemClick, imageLoading, onImageLoad }) => {
    const [imgLoaded, setImgLoaded] = useState(false);

    const handleImageLoad = () => {
        setImgLoaded(true);
        onImageLoad(item.id);
    };

    const getImageUrl = (image: string) => {
        return image === "string" || !image
            ? "https://m.media-amazon.com/images/I/81Ty4ssA1oL.jpg"
            : `${import.meta.env.VITE_API_BASE_URL}${item.image}`;
    };

    if (viewMode === 'grid') {
        return (
            <motion.div
                whileHover={{ y: -4 }}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-orange-300 transition-colors"
                onClick={() => onItemClick(item)}
            >
                <div className="h-48 overflow-hidden relative">
                    {(!imgLoaded || imageLoading) && <ImageSkeleton />}
                    <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className={`w-full h-full object-cover ${(!imgLoaded || imageLoading) ? 'hidden' : ''}`}
                        onLoad={handleImageLoad}
                        onError={(e) => {
                            e.currentTarget.src = "https://m.media-amazon.com/images/I/81Ty4ssA1oL.jpg";
                        }}
                    />
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 uppercase">{item.name}</h3>
                    <div className="text-xs text-orange-600 font-medium mb-1 lowercase">{item.subcategory_name}</div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 lowercase">{item.description}</p>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-orange-600">Rwf {item.price.toLocaleString()}</span>
                        <div className="p-2 bg-orange-100 px-3 rounded-full flex gap-2 items-center">
                            <Utensils size={16} className="text-orange-600" />
                            Order
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={{ x: 4 }}
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-300 transition-colors"
            onClick={() => onItemClick(item)}
        >
            <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {(!imgLoaded || imageLoading) && <ImageSkeleton />}
                    <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className={`w-full h-full object-cover ${(!imgLoaded || imageLoading) ? 'hidden' : ''}`}
                        onLoad={handleImageLoad}
                        onError={(e) => {
                            e.currentTarget.src = "https://m.media-amazon.com/images/I/81Ty4ssA1oL.jpg";
                        }}
                    />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 uppercase">{item.name}</h3>
                    <div className="text-xs text-orange-600 font-medium mb-1 lowercase">{item.subcategory_name.toLowerCase()}</div>
                    <p className="text-gray-600 text-sm mb-2 lowercase">{item.description.toLowerCase()}</p>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-orange-600">Rwf {item.price.toLocaleString()}</span>
                        <div className="p-2 bg-orange-100 px-3 rounded-full flex gap-2 items-center">
                            <Utensils size={16} className="text-orange-600" />
                            Order
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Menu Items Grid Component
const MenuItemsGrid: React.FC<{
    items: MenuItem[];
    viewMode: 'grid' | 'list';
    onItemClick: (item: MenuItem) => void;
    loadingImages: Set<number>;
    onImageLoad: (id: number) => void;
}> = ({ items, viewMode, onItemClick, loadingImages, onImageLoad }) => {
    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                    <MenuItemCard
                        key={item.id}
                        item={item}
                        viewMode={viewMode}
                        onItemClick={onItemClick}
                        imageLoading={loadingImages.has(item.id)}
                        onImageLoad={onImageLoad}
                    />
                ))}
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
                    onItemClick={onItemClick}
                    imageLoading={loadingImages.has(item.id)}
                    onImageLoad={onImageLoad}
                />
            ))}
        </div>
    );
};

// Category Tabs Component
const CategoryTabs: React.FC<{
    categories: Category[];
    selectedCategory: number | null;
    onCategorySelect: (categoryId: number | null) => void;
}> = ({ categories, selectedCategory, onCategorySelect }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Filter by Category</h3>
                <button
                    onClick={() => onCategorySelect(null)}
                    className="text-orange-600 hover:text-orange-800 text-xs font-medium transition-colors"
                >
                    Show All
                </button>
            </div>
            <div 
                ref={scrollContainerRef}
                className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide"
            >
                <button
                    onClick={() => onCategorySelect(null)}
                    className={`flex-shrink-0 px-3 py-2 rounded-md font-medium transition-all whitespace-nowrap border ${
                        selectedCategory === null 
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    All Items
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategorySelect(category.id)}
                        className={`flex-shrink-0 px-3 py-2 rounded-md font-medium transition-all whitespace-nowrap border ${
                            selectedCategory === category.id 
                                ? 'bg-orange-500 text-white border-orange-500 shadow-sm' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

const CustomerMenu: React.FC = () => {
    const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
    const [displayedItems, setDisplayedItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderType, setOrderType] = useState<'delivery' | 'pickup' | 'booking'>('delivery');
    const [orderData, setOrderData] = useState<OrderData>({
        customer_name: '',
        customer_phone: '',
        order_type: 'delivery',
        item_id: 0,
        quantity: 1,
    });
    const [availableTables, setAvailableTables] = useState<Table[]>([]);
    const [bookingData, setBookingData] = useState<BookingData>({
        table_id: 0,
        customer_name: '',
        customer_phone: '',
        number_of_people: 1,
        booking_duration: 60,
    });
    const [bookingStep, setBookingStep] = useState(1);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
    const [paymentStep, setPaymentStep] = useState<'order' | 'payment'>('order');
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentReference, setPaymentReference] = useState<string>('');
    const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());
    const [currentDisplayPage, setCurrentDisplayPage] = useState(1);
    const [currentFetchPage, setCurrentFetchPage] = useState(1);
    const [hasMoreDisplay, setHasMoreDisplay] = useState(true);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [backgroundLoading, setBackgroundLoading] = useState(false);
    const [allDataLoaded, setAllDataLoaded] = useState(false);
    console.log(hasMoreData)
    const itemsPerDisplayPage = 10;
    const itemsPerFetch = 100;

    // Fetch initial data on component mount
    useEffect(() => {
        fetchInitialData();
    }, []);

    // Apply filters to ALL data whenever search term, category, or allMenuItems changes
    useEffect(() => {
        applyFilters();
    }, [allMenuItems, searchTerm, selectedCategory]);

    // Reset display when filters change
    useEffect(() => {
        setCurrentDisplayPage(1);
        updateDisplayedItems(1);
    }, [filteredItems]);

    // Background fetching - continuously fetch until all data is loaded
    useEffect(() => {
        if (!allDataLoaded && !backgroundLoading && !initialLoad) {
            fetchMoreDataInBackground();
        }
    }, [allDataLoaded, backgroundLoading, initialLoad, currentFetchPage]);

    const fetchInitialData = async () => {
        try {
            setInitialLoad(true);
            
            // Fetch categories first
            const categoriesResponse = await mainAxios.get('/categories/');
            setCategories(categoriesResponse.data);

            // Fetch first batch of menu items
            await fetchMenuItems(1);
            
            setError(null);
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Error fetching data:', err);
        } finally {
            setInitialLoad(false);
        }
    };

    const fetchMenuItems = async (page: number): Promise<boolean> => {
        try {
            const response = await mainAxios.get('/menu/', {
                params: {
                    skip: itemsPerFetch * (page - 1),
                    limit: itemsPerFetch
                }
            });
            
            const items = response.data.items || response.data;
            
            if (items && items.length > 0) {
                setAllMenuItems(prev => {
                    const combined = [...prev, ...items];
                    // Remove duplicates based on id
                    const uniqueItems = combined.filter((item, index, self) =>
                        index === self.findIndex(i => i.id === item.id)
                    );
                    return uniqueItems;
                });
                
                // Check if there's more data to fetch
                const hasMore = items.length === itemsPerFetch;
                setHasMoreData(hasMore);
                if (!hasMore) {
                    setAllDataLoaded(true);
                }
                
                return hasMore;
            } else {
                setHasMoreData(false);
                setAllDataLoaded(true);
                return false;
            }
        } catch (err) {
            setError('Failed to fetch menu items');
            console.error('Error fetching menu items:', err);
            return false;
        }
    };

    const fetchMoreDataInBackground = async () => {
        if (allDataLoaded || backgroundLoading) return;

        setBackgroundLoading(true);
        try {
            const nextPage = currentFetchPage + 1;
            const hasMore = await fetchMenuItems(nextPage);
            if (hasMore) {
                setCurrentFetchPage(nextPage);
            }
        } catch (err) {
            console.error('Error in background fetching:', err);
        } finally {
            setBackgroundLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...allMenuItems];

        // Apply search filter to ALL data
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.subcategory_name.toLowerCase().includes(query) ||
                item.category_name?.toLowerCase().includes(query)
            );
        }

        // Apply category filter to ALL data
        if (selectedCategory) {
            const category = categories.find(cat => cat.id === selectedCategory);
            if (category) {
                const subcategoryIds = category.subcategories.map(sub => sub.id);
                filtered = filtered.filter(item => subcategoryIds.includes(item.subcategory_id));
            }
        }

        setFilteredItems(filtered);
        setHasMoreDisplay(currentDisplayPage * itemsPerDisplayPage < filtered.length);
    };

    const updateDisplayedItems = (page: number) => {
        const startIndex = 0;
        const endIndex = page * itemsPerDisplayPage;
        const itemsToShow = filteredItems.slice(startIndex, endIndex);
        setDisplayedItems(itemsToShow);
        setHasMoreDisplay(endIndex < filteredItems.length);
    };

    const handleLoadMoreClick = () => {
        if (!hasMoreDisplay || isLoadingMore) return;

        setIsLoadingMore(true);
        
        setTimeout(() => {
            const nextPage = currentDisplayPage + 1;
            setCurrentDisplayPage(nextPage);
            updateDisplayedItems(nextPage);
            setIsLoadingMore(false);
        }, 300);
    };

    const handleCategorySelect = (categoryId: number | null) => {
        setSelectedCategory(categoryId);
        setCurrentDisplayPage(1);
    };

    const fetchAvailableTables = async () => {
        try {
            setLoading(true);
            const response = await mainAxios.get('/tables/available');
            setAvailableTables(response.data);
        } catch (err) {
            setError('Failed to fetch available tables');
            console.error('Error fetching tables:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageLoadComplete = useCallback((id: number) => {
        setLoadingImages(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    }, []);

    const handleItemClick = (item: MenuItem) => {
        setSelectedItem(item);
        setShowOrderModal(true);
        setOrderData({
            ...orderData,
            item_id: item.id,
            quantity: 1
        });
        setBookingStep(1);
        setPaymentStep('order');
        setPaymentSuccess(false);
        setPaymentReference('');
        setCreatedOrderId(null);
        setError(null);
    };

    const handleOrderTypeChange = (type: 'delivery' | 'pickup' | 'booking') => {
        setOrderType(type);
        setOrderData({
            ...orderData,
            order_type: type
        });

        if (type === 'booking') {
            setBookingStep(1);
            setBookingData({
                ...bookingData,
                customer_name: '',
                customer_phone: '',
                table_id: 0
            });
        }
    };

    const handleBookingNext = async () => {
        if (bookingStep === 1) {
            if (!bookingData.customer_name.trim() || !bookingData.customer_phone.trim()) {
                setError('Please provide your name and phone number');
                return;
            }

            if (bookingData.number_of_people < 1) {
                setError('Number of people must be at least 1');
                return;
            }

            try {
                setLoading(true);
                await fetchAvailableTables();
                setBookingStep(2);
                setError(null);
            } catch (err) {
                setError('Failed to fetch available tables');
            } finally {
                setLoading(false);
            }
        } else if (bookingStep === 2) {
            if (!bookingData.table_id) {
                setError('Please select a table');
                return;
            }
            setBookingStep(3);
            setError(null);
        }
    };

    const handleBookingPrev = () => {
        if (bookingStep > 1) {
            setBookingStep(bookingStep - 1);
            setError(null);
        }
    };

    const handleOrderSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            if (orderType !== 'booking') {
                if (!orderData.customer_name.trim() || !orderData.customer_phone.trim()) {
                    setError('Please provide your name and phone number');
                    return;
                }
            }

            if (orderType === 'booking' && !bookingData.table_id) {
                setError('Please select a table for booking');
                return;
            }

            const orderPayload = {
                ...orderData,
                customer_name: orderData.customer_name || bookingData.customer_name,
                customer_phone: orderData.customer_phone || bookingData.customer_phone,
                table_number: orderType === 'booking' ? availableTables.find(t => t.id === bookingData.table_id)?.id : undefined
            };

            const orderResponse = await mainAxios.post('/orders/add', orderPayload);
            const orderId = orderResponse.data.id;
            setCreatedOrderId(orderId);

            if (orderType === 'booking') {
                await mainAxios.post('/tables/book', {
                    ...bookingData,
                    customer_name: bookingData.customer_name,
                    customer_phone: bookingData.customer_phone
                });
                setBookingSuccess(true);
            } else {
                setOrderSuccess(true);
            }

            setPaymentStep('payment');

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to place order';
            setError(errorMessage);
            console.error('Error placing order:', err);
        } finally {
            setLoading(false);
        }
    };

    const initiatePayment = async (orderId: number, amount: number, phone: string) => {
        try {
            setPaymentLoading(true);
            setError(null);

            const response = await mainAxios.post(`/payments/initiate/${orderId}?amount=${amount}&phone=${phone}`, {});

            setPaymentReference(response.data.reference_id);
            setPaymentSuccess(true);

            checkPaymentStatusPeriodically(response.data.reference_id);

        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Failed to initiate payment';
            setError(errorMessage);
            console.error('Error initiating payment:', err);
        } finally {
            setPaymentLoading(false);
        }
    };

    const checkPaymentStatusPeriodically = async (referenceId: string) => {
        let attempts = 0;
        const maxAttempts = 20;

        const checkStatus = async () => {
            if (attempts >= maxAttempts) {
                console.log('Payment status check timeout');
                return;
            }

            try {
                const response = await mainAxios.get(`/payments/status/${referenceId}`);
                const status = response.data.status;

                if (status === 'completed') {
                    setError('Payment completed successfully!');
                } else if (status === 'failed') {
                    setError('Payment failed. Please try again.');
                } else {
                    attempts++;
                    setTimeout(checkStatus, 15000);
                }
            } catch (err) {
                console.error('Error checking payment status:', err);
                attempts++;
                setTimeout(checkStatus, 15000);
            }
        };

        setTimeout(checkStatus, 15000);
    };

    const handlePaymentInitiation = async () => {
        if (!createdOrderId || !selectedItem) return;

        const phone = orderType === 'booking' ? bookingData.customer_phone : orderData.customer_phone;
        const amount = selectedItem.price * orderData.quantity;

        await initiatePayment(createdOrderId, amount, phone);
    };

    const handleWhatsAppInquiry = (name: any, qua: any, price: any) => {
        const message = `Hello, I'm reaching out regarding my order of ${name} (Quantity: ${qua}, Price: ${price}) at Fadhar Restaurant.`;
        const phoneNumber = '250794285876';
        contactMe(phoneNumber, message)
    };

    const renderBookingStep = () => {
        switch (bookingStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={bookingData.customer_name}
                                    onChange={(e) => setBookingData({ ...bookingData, customer_name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={bookingData.customer_phone}
                                    onChange={(e) => setBookingData({ ...bookingData, customer_phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={bookingData.number_of_people}
                                    onChange={(e) => setBookingData({ ...bookingData, number_of_people: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={orderData.quantity}
                                    onChange={(e) => setOrderData({ ...orderData, quantity: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                                <select
                                    value={bookingData.booking_duration}
                                    onChange={(e) => setBookingData({ ...bookingData, booking_duration: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value={30}>30 minutes</option>
                                    <option value={60}>1 hour</option>
                                    <option value={90}>1.5 hours</option>
                                    <option value={120}>2 hours</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={handleBookingNext}
                            disabled={loading}
                            className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Next'} <ChevronRight size={18} />
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Select Table</h3>
                            <button onClick={handleBookingPrev} className="text-gray-500 hover:text-gray-700">
                                <ChevronLeft size={20} />
                            </button>
                        </div>
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                                <p className="mt-2 text-gray-600">Loading available tables...</p>
                            </div>
                        ) : availableTables.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-600">No tables available at the moment</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                                    {availableTables.map((table) => (
                                        <motion.button
                                            key={table.id}
                                            onClick={() => setBookingData({ ...bookingData, table_id: table.id })}
                                            className={`p-0 border-3 cursor-pointer rounded-lg text-left hover:border-orange-500 transition-all ${bookingData.table_id === table.id
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className='w-full'>
                                                <img src={`${import.meta.env.VITE_API_BASE_URL}${table.table_image}`} alt={`Table ${table.number}`} className="w-full h-32 object-cover rounded-t-lg mb-2" />
                                            </div>
                                            <div className="px-4 py-2">
                                                <div className="font-medium">Table {table.number}</div>
                                                <div className="text-sm text-gray-500">Capacity: {table.capacity}</div>
                                                {bookingData.number_of_people > table.capacity && (
                                                    <div className="text-xs text-red-500 mt-1">
                                                        Warning: Exceeds table capacity
                                                    </div>
                                                )}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                                <button
                                    onClick={handleBookingNext}
                                    disabled={!bookingData.table_id}
                                    className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Next <ChevronRight size={18} />
                                </button>
                            </>
                        )}
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Confirm Booking</h3>
                            <button onClick={handleBookingPrev} className="text-gray-500 hover:text-gray-700">
                                <ChevronLeft size={20} />
                            </button>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span>Customer:</span>
                                <span className="font-medium">{bookingData.customer_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phone:</span>
                                <span className="font-medium">{bookingData.customer_phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Table:</span>
                                <span className="font-medium">
                                    Table {availableTables.find(t => t.id === bookingData.table_id)?.number}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>People:</span>
                                <span className="font-medium">{bookingData.number_of_people}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Duration:</span>
                                <span className="font-medium">{bookingData.booking_duration} minutes</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Item:</span>
                                <span className="font-medium">{selectedItem?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Quantity:</span>
                                <span className="font-medium">{orderData.quantity}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>Rwf {selectedItem ? (selectedItem.price * orderData.quantity).toLocaleString() : 0}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleOrderSubmit}
                            disabled={loading}
                            className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </div>
                );
        }
    };

    const renderPaymentStep = () => {
        if (!selectedItem || !createdOrderId) return null;

        const totalAmount = selectedItem.price * orderData.quantity;

        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                        <CreditCard size={32} className="text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Payment</h3>
                    <p className="text-gray-600 mb-4">Order #{createdOrderId} - Rwf {totalAmount.toLocaleString()}</p>
                </div>

                {paymentSuccess ? (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <Check size={20} className="text-green-600" />
                            <span className="font-medium text-green-800">Payment Initiated Successfully!</span>
                        </div>
                        <p className="text-green-700 text-sm mb-3">
                            Reference ID: <span className="font-mono">{paymentReference}</span>
                        </p>
                        <p className="text-green-700 text-sm">
                            Please check your phone to complete the MoMo payment. We'll notify you when payment is confirmed.
                            Or click <b>*182*7*1#</b> on your mobile
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">Payment Instructions</h4>
                            <p className="text-blue-700 text-sm">
                                Contact number to make your order <strong>0783330008</strong>
                            </p>
                        </div>

                        <button
                            onClick={handlePaymentInitiation}
                            disabled={paymentLoading}
                            className="w-full hidden bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {paymentLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Initiating Payment...
                                </>
                            ) : (
                                <>
                                    <DollarSign size={20} />
                                    Pay with MoMo
                                </>
                            )}
                        </button>
                    </>
                )}

                <div className="text-center">
                    <p className="text-gray-600 mb-4">
                        Need assistance? Contact us via WhatsApp:
                    </p>
                    <button
                        onClick={() => handleWhatsAppInquiry(selectedItem.name, orderData.quantity, selectedItem.price)}
                        className="flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg mx-auto hover:bg-orange-700 transition-colors"
                    >
                        <MessageCircle size={18} />
                        <span>Chat on WhatsApp</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-11/12 mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-900 mb-2 font-greatvibes"
                    >
                        Fadhar Restaurant
                    </motion.h1>
                    <p className="text-gray-600">Discover our delicious menu</p>
                </div>

                {/* Background Loading Indicator */}
                {backgroundLoading && (
                    <div className="fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
                        <Loader size={16} className="animate-spin" />
                        <span className="text-sm">Loading more items...</span>
                    </div>
                )}

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center"
                        >
                            <span>{error}</span>
                            <button onClick={() => setError(null)} className="text-red-800 hover:text-red-900">
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-3 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Category Tabs */}
                <CategoryTabs
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                />

                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedCategory 
                                ? categories.find(cat => cat.id === selectedCategory)?.name
                                : 'All Menu Items'
                            }
                        </h2>
                        <p className="text-gray-600">
                            Showing {displayedItems.length} of {filteredItems.length} items
                            {searchTerm || selectedCategory ? ' (filtered)' : ''}
                        </p>
                    </div>
                </div>

                {/* Menu Items */}
                <AnimatePresence mode="wait">
                    {initialLoad ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={viewMode === 'grid'
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                : "space-y-4"
                            }
                        >
                            {Array.from({ length: 8 }).map((_, index) => (
                                <MenuItemSkeleton key={index} viewMode={viewMode} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <MenuItemsGrid
                                items={displayedItems}
                                viewMode={viewMode}
                                onItemClick={handleItemClick}
                                loadingImages={loadingImages}
                                onImageLoad={handleImageLoadComplete}
                            />

                            {/* Load More Button */}
                            {hasMoreDisplay && displayedItems.length > 0 && (
                                <div className="flex justify-center mt-8">
                                    <motion.button
                                        onClick={handleLoadMoreClick}
                                        disabled={isLoadingMore}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-orange-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-orange-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-3 shadow-lg hover:shadow-xl"
                                    >
                                        {isLoadingMore ? (
                                            <>
                                                <Loader size={20} className="animate-spin" />
                                                Loading More Items...
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={20} />
                                                Load More
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            )}

                            {/* End of results */}
                            {!hasMoreDisplay && displayedItems.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200 rounded-lg p-6 max-w-md mx-auto">
                                        <Check size={32} className="text-orange-600 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                                        <p className="text-gray-600">
                                            {allDataLoaded 
                                                ? `You've seen all ${filteredItems.length} delicious items ${selectedCategory ? 'in this category' : 'in our menu'}.`
                                                : `Showing ${displayedItems.length} of ${filteredItems.length} items. More may be loading in the background.`
                                            }
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State */}
                {!initialLoad && !loading && displayedItems.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Dishes Available</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {/* Order Modal */}
                <AnimatePresence>
                    {showOrderModal && selectedItem && (
                        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {paymentStep === 'payment' ? 'Complete Payment' : `Order ${selectedItem.name}`}
                                        </h2>
                                        <button
                                            onClick={() => {
                                                setShowOrderModal(false);
                                                setOrderSuccess(false);
                                                setBookingSuccess(false);
                                                setBookingStep(1);
                                                setPaymentStep('order');
                                                setError(null);
                                            }}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    {/* Error Message */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center"
                                            >
                                                <span>{error}</span>
                                                <button onClick={() => setError(null)} className="text-red-800 hover:text-red-900">
                                                    <X size={18} />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {paymentStep === 'payment' ? (
                                        renderPaymentStep()
                                    ) : !orderSuccess && !bookingSuccess ? (
                                        <>
                                            {/* Order Type Selection */}
                                            <div className="mb-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-3">Order Type</h3>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {/* Delivery */}
                                                    <button
                                                        onClick={() => handleOrderTypeChange('delivery')}
                                                        className={`group relative p-3 rounded-lg flex cursor-pointer flex-col items-center justify-center transition-colors ${orderType === 'delivery'
                                                            ? 'bg-orange-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        <BikeIcon size={20} />
                                                        <span className="mt-1 text-sm font-medium">Home Delivery</span>

                                                        {/* Hover description */}
                                                        <span className="absolute top-full mt-2 w-40 text-xs text-center text-white bg-gray-800 rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                            Get your order delivered straight to your door.
                                                        </span>
                                                    </button>

                                                    {/* Pickup */}
                                                    <button
                                                        onClick={() => handleOrderTypeChange('pickup')}
                                                        className={`group relative p-3 rounded-lg cursor-pointer flex flex-col items-center justify-center transition-colors ${orderType === 'pickup'
                                                            ? 'bg-orange-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        <HandGrab size={20} />
                                                        <span className="mt-1 text-sm font-medium">Pick and Go</span>

                                                        {/* Hover description */}
                                                        <span className="absolute top-full mt-2 w-40 text-xs text-center text-white bg-gray-800 rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                            Place your order online and pick it up yourself.
                                                        </span>
                                                    </button>

                                                    {/* Booking */}
                                                    <button
                                                        onClick={() => handleOrderTypeChange('booking')}
                                                        className={`group relative p-3 rounded-lg cursor-pointer flex flex-col items-center justify-center transition-colors ${orderType === 'booking'
                                                            ? 'bg-orange-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        <BookMarked size={20} />
                                                        <span className="mt-1 text-sm font-medium">Table Booking</span>

                                                        {/* Hover description */}
                                                        <span className="absolute top-full mt-2 w-40 text-xs text-center text-white bg-gray-800 rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                            Reserve a table in advance for your visit.
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>


                                            {orderType !== 'booking' ? (
                                                <>
                                                    {/* Customer Information */}
                                                    <div className="mb-6">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Your Information</h3>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                                                <input
                                                                    type="text"
                                                                    value={orderData.customer_name}
                                                                    onChange={(e) => setOrderData({ ...orderData, customer_name: e.target.value })}
                                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                    placeholder="Enter your name"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                                                <input
                                                                    type="tel"
                                                                    value={orderData.customer_phone}
                                                                    onChange={(e) => setOrderData({ ...orderData, customer_phone: e.target.value })}
                                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                    placeholder="Enter your phone number"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={orderData.quantity}
                                                                    onChange={(e) => setOrderData({ ...orderData, quantity: parseInt(e.target.value) })}
                                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={handleOrderSubmit}
                                                        disabled={loading}
                                                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                                                    >
                                                        {loading ? 'Processing...' : `Place Order - Rwf ${(selectedItem.price * orderData.quantity).toLocaleString()}`}
                                                    </button>
                                                </>
                                            ) : (
                                                renderBookingStep()
                                            )}
                                        </>
                                    ) : (
                                        /* Success Message */
                                        <div className="text-center py-6">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                                                <Check size={32} className="text-orange-600" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {orderType === 'booking' ? 'Table Booked Successfully!' : 'Order Placed Successfully!'}
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                {orderType === 'booking'
                                                    ? 'Your table has been reserved. Please proceed to payment.'
                                                    : 'Your order has been received. Please proceed to payment.'}
                                            </p>

                                            <button
                                                onClick={() => setPaymentStep('payment')}
                                                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <CreditCard size={20} />
                                                Proceed to Payment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CustomerMenu;