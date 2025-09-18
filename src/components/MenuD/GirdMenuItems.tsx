import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Grid, List, Search, Filter, X, ChevronRight, ChevronLeft, Check, CreditCard, DollarSign, BikeIcon, HandGrab, Table, BookMarked, Utensils, ShoppingCart } from 'lucide-react';
import mainAxios from '../../Instance/mainAxios';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    subcategory_id: number;
    subcategory_name: string;
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

// interface PaymentData {
//     order_id: number;
//     amount: number;
//     phone: string;
// }

const CustomerMenu: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
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
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
    const [paymentStep, setPaymentStep] = useState<'order' | 'payment'>('order');
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentReference, setPaymentReference] = useState<string>('');
    // const [success, setSuccess] = useState<string>('');

    // Fetch categories and menu items on component mount
    useEffect(() => {
        fetchCategories();
        fetchMenuItems();
    }, []);
    console.log(categories)
    // Filter items based on search and category
    useEffect(() => {
        let filtered = menuItems;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(item => item.subcategory_name === selectedCategory);
        }

        setFilteredItems(filtered);
    }, [menuItems, searchTerm, selectedCategory]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await mainAxios.get('/categories/');
            setCategories(response.data);
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
        } catch (err) {
            setError('Failed to fetch menu items');
            console.error('Error fetching menu items:', err);
        } finally {
            setLoading(false);
        }
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

    const initiatePayment = async (orderId: number, amount: number, phone: string) => {
        try {
            setPaymentLoading(true);
            setError(null);

            const response = await mainAxios.post(`/payments/initiate/${orderId}?amount=${amount}&phone=${phone}`, {});

            setPaymentReference(response.data.reference_id);
            setPaymentSuccess(true);

            // Start polling for payment status
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
        const maxAttempts = 20; // Check for 5 minutes (20 * 15 seconds)

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
                    // You might want to update the UI to show payment completion
                } else if (status === 'failed') {
                    setError('Payment failed. Please try again.');
                } else {
                    // Continue polling if still pending
                    attempts++;
                    setTimeout(checkStatus, 15000); // Check every 15 seconds
                }
            } catch (err) {
                console.error('Error checking payment status:', err);
                attempts++;
                setTimeout(checkStatus, 15000);
            }
        };

        setTimeout(checkStatus, 15000);
    };

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
        // Validate current step before proceeding
        if (bookingStep === 1) {
            // Validate customer info
            if (!bookingData.customer_name.trim() || !bookingData.customer_phone.trim()) {
                setError('Please provide your name and phone number');
                return;
            }

            // Validate number of people
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
            // Validate table selection
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

            // Validate inputs based on order type
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

            // Create order
            const orderPayload = {
                ...orderData,
                customer_name: orderData.customer_name || bookingData.customer_name,
                customer_phone: orderData.customer_phone || bookingData.customer_phone,
                table_number: orderType === 'booking' ? availableTables.find(t => t.id === bookingData.table_id)?.id : undefined
            };

            const orderResponse = await mainAxios.post('/orders/add', orderPayload);
            const orderId = orderResponse.data.id;
            setCreatedOrderId(orderId);

            // If booking, also book the table
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

            // Move to payment step
            setPaymentStep('payment');

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to place order';
            setError(errorMessage);
            console.error('Error placing order:', err);
        } finally {
            setLoading(false);
        }
    };
    const handlePaymentInitiation = async () => {
        if (!createdOrderId || !selectedItem) return;

        const phone = orderType === 'booking' ? bookingData.customer_phone : orderData.customer_phone;
        const amount = selectedItem.price * orderData.quantity;

        await initiatePayment(createdOrderId, amount, phone);
    };

    const handleWhatsAppInquiry = () => {
        const message = `Hello, I have an inquiry about my order at Fadhar Restaurant.`;
        const phoneNumber = '0790110231';
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const getImageUrl = (image: string) => {
        return image === "string" || !image ? "https://m.media-amazon.com/images/I/81Ty4ssA1oL.jpg" : image;
    };

    const uniqueCategories = [...new Set(menuItems.map(item => item.subcategory_name))];

    const renderBookingStep = () => {
        switch (bookingStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>

                        {/* Customer Information for Booking */}
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
                                                <img src={table.table_image} alt={`Table ${table.number}`} className="w-full h-32 object-cover rounded-t-lg mb-2" />
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
        const phone = orderType === 'booking' ? bookingData.customer_phone : orderData.customer_phone;

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
                                You will receive a payment request on your phone number: <strong>{phone}</strong>
                            </p>
                        </div>

                        <button
                            onClick={handlePaymentInitiation}
                            disabled={paymentLoading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
                        onClick={handleWhatsAppInquiry}
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
                <div className="flex flex-col md:flex-row gap-4 mb-8">
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

                    {/* Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter size={18} />
                            Filter
                        </button>
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg p-4 z-10 min-w-48"
                                >
                                    <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="category"
                                                value=""
                                                checked={selectedCategory === ''}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="mr-2"
                                            />
                                            All Categories
                                        </label>
                                        {uniqueCategories.map(category => (
                                            <label key={category} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    value={category}
                                                    checked={selectedCategory === category}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="mr-2"
                                                />
                                                {category}
                                            </label>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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

                {/* Menu Items */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -4 }}
                                    className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-orange-300 transition-colors"
                                    onClick={() => handleItemClick(item)}
                                >
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
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
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            {filteredItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ x: 4 }}
                                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-300 transition-colors"
                                    onClick={() => handleItemClick(item)}
                                >
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
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
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

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

                {/* Empty State */}
                {!loading && filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Menu items found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerMenu;