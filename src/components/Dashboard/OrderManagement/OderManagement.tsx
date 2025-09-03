import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, SortAsc, SortDesc, X, Eye, ChevronDown, 
  RefreshCw, Trash2, Edit3, CheckCircle, Clock, AlertCircle,
  Phone, MessageCircle, ShoppingBag, Utensils, Truck, Coffee
} from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  order_type: string;
  quantity: number;
  table_number: number | null;
  menu_item_name: string;
  menu_item_id: number;
  status: string;
  created_at: string;
  price?: number;
  total?: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  subcategory_name: string;
  subcategory_id: number;
  category_name: string;
}

interface OrderDetails {
  id: number;
  customer_name: string;
  customer_phone: string;
  order_type: string;
  quantity: number;
  table_number: number | null;
  menu_item_name: string;
  menu_item_id: number;
  status: string;
  created_at: string;
  price?: number;
  total?: number;
  menu_item_details?: MenuItem;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState('');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'customer' | 'item' | 'type' | 'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<'all' | 'delivery' | 'dine-in' | 'takeaway'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Skeleton loading state
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      // Search filter
      const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.menu_item_name.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Order type filter
      if (filterBy !== 'all' && order.order_type !== filterBy) return false;

      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'customer') {
        comparison = a.customer_name.localeCompare(b.customer_name);
      } else if (sortBy === 'item') {
        comparison = a.menu_item_name.localeCompare(b.menu_item_name);
      } else if (sortBy === 'type') {
        comparison = a.order_type.localeCompare(b.order_type);
      } else if (sortBy === 'date') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [orders, searchTerm, filterBy, statusFilter, sortBy, sortOrder]);

  // Count orders by type and status
  const orderCounts = useMemo(() => {
    return {
      all: orders.length,
      delivery: orders.filter(order => order.order_type === 'delivery').length,
      dineIn: orders.filter(order => order.order_type === 'dine-in').length,
      takeaway: orders.filter(order => order.order_type === 'takeaway').length,
      pending: orders.filter(order => order.status === 'pending').length,
      preparing: orders.filter(order => order.status === 'preparing').length,
      completed: orders.filter(order => order.status === 'completed').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length,
    };
  }, [orders]);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
    
    // Simulate skeleton loading for 1.5 seconds
    const timer = setTimeout(() => {
      setSkeletonLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await mainAxios.get('/orders/');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
      setSkeletonLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      setDetailLoading(true);
      const response = await mainAxios.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
      setEditStatus(response.data.status);
      setShowOrderDetails(true);
      setError(null);
    } catch (err) {
      setError('Failed to fetch order details');
      console.error('Error fetching order details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      // Create a copy of the order data with the updated status
      const updatedOrder = {
        ...selectedOrder,
        status: status
      };

      // Remove the menu_item_details field as it's not needed for the update
      delete updatedOrder.menu_item_details;

      const response = await mainAxios.put(`/orders/${orderId}`, updatedOrder);

      // Update the orders list with the new status
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      // Update the selected order details
      setSelectedOrder(prev => prev ? { ...prev, status } : null);

      setSuccess('Order status updated successfully');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await mainAxios.delete(`/orders/${orderId}`);

      // Remove the order from the list
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));

      // Close the details modal if it's open for this order
      if (selectedOrder && selectedOrder.id === orderId) {
        setShowOrderDetails(false);
        setSelectedOrder(null);
      }

      setSuccess('Order deleted successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete order');
      console.error('Error deleting order:', err);
    }
  };

  const toggleSort = (field: 'customer' | 'item' | 'type' | 'date' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
    setIsEditing(false);
  };

  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case 'delivery': return 'bg-blue-100 text-blue-800';
      case 'dine-in': return 'bg-green-100 text-green-800';
      case 'takeaway': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderTypeText = (type: string) => {
    switch (type) {
      case 'delivery': return 'Delivery';
      case 'dine-in': return 'Dine-in';
      case 'takeaway': return 'Takeaway';
      default: return type;
    }
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'delivery': return <Truck size={16} />;
      case 'dine-in': return <Utensils size={16} />;
      case 'takeaway': return <ShoppingBag size={16} />;
      default: return <Coffee size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'preparing': return <RefreshCw size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <AlertCircle size={16} />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Invalid date';
    
    const isoDateString = dateString.replace(' ', 'T');
    const date = new Date(isoDateString);
    
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RWF',
    }).format(amount);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (phone: string, customerName: string) => {
    const message = `Hi ${customerName}, this is regarding your order at our restaurant.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  const refreshOrders = () => {
    setSkeletonLoading(true);
    fetchOrders();
  };

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Order Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage and track restaurant orders
              </p>
            </div>
            <button
              onClick={refreshOrders}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Order Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{orderCounts.all}</div>
            <div className="text-sm text-gray-500">Total Orders</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{orderCounts.delivery}</div>
            <div className="text-sm text-gray-500">Delivery</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{orderCounts.dineIn}</div>
            <div className="text-sm text-gray-500">Dine-in</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{orderCounts.takeaway}</div>
            <div className="text-sm text-gray-500">Takeaway</div>
          </div>
        </motion.div>

        {/* Status Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{orderCounts.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{orderCounts.preparing}</div>
            <div className="text-sm text-gray-500">Preparing</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{orderCounts.completed}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-600">{orderCounts.cancelled}</div>
            <div className="text-sm text-gray-500">Cancelled</div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders by customer, phone, or menu item..."
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
                  <option value="all">All Types</option>
                  <option value="delivery">Delivery</option>
                  <option value="dine-in">Dine-in</option>
                  <option value="takeaway">Takeaway</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSort('customer')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'customer' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Customer</span>
                  {sortBy === 'customer' && (
                    sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                  )}
                </button>

                <button
                  onClick={() => toggleSort('date')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'date' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Date</span>
                  {sortBy === 'date' && (
                    sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                  )}
                </button>

                <button
                  onClick={() => toggleSort('status')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'status' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Status</span>
                  {sortBy === 'status' && (
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
                  <option value="all">All Types</option>
                  <option value="delivery">Delivery</option>
                  <option value="dine-in">Dine-in</option>
                  <option value="takeaway">Takeaway</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSort('customer')}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'customer' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Customer</span>
                  {sortBy === 'customer' && (
                    sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                  )}
                </button>

                <button
                  onClick={() => toggleSort('date')}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'date' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Date</span>
                  {sortBy === 'date' && (
                    sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                  )}
                </button>

                <button
                  onClick={() => toggleSort('status')}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'status' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Status</span>
                  {sortBy === 'status' && (
                    sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
              </div>
              <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full border">
                {filteredAndSortedOrders.length} of {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {skeletonLoading ? (
              <div className="p-6">
                <SkeletonLoader />
              </div>
            ) : filteredAndSortedOrders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Search className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {orders.length === 0 ? 'No orders' : 'No matching orders'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {orders.length === 0
                    ? 'Orders will appear here when customers place them.'
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {(searchTerm || filterBy !== 'all' || statusFilter !== 'all') && orders.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterBy('all');
                      setStatusFilter('all');
                    }}
                    className="mt-3 text-sm text-green-600 hover:text-green-700 underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              filteredAndSortedOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-medium text-gray-900 truncate">
                            {order.customer_name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getOrderTypeColor(order.order_type)}`}>
                            {getOrderTypeIcon(order.order_type)}
                            {getOrderTypeText(order.order_type)}
                          </span>
                          <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="truncate">{order.customer_phone}</span>
                          <span className="truncate">Qty: {order.quantity}</span>
                          {order.table_number && (
                            <span className="truncate">Table: {order.table_number}</span>
                          )}
                          <span className="truncate">{formatDate(order.created_at)}</span>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <p className="text-sm text-gray-700 truncate">
                            {order.menu_item_name}
                          </p>
                          {order.price && (
                            <span className="text-sm font-medium text-green-600">
                              • {formatCurrency(order.price * order.quantity)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCall(order.customer_phone)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Call customer"
                        >
                          <Phone size={18} />
                        </button>
                        
                        <button
                          onClick={() => handleWhatsApp(order.customer_phone, order.customer_name)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </button>
                        
                        <button
                          onClick={() => fetchOrderDetails(order.id)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                          title="View order details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete order"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeOrderDetails}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                  <button
                    onClick={closeOrderDetails}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {detailLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-green-600 bg-green-50 transition ease-in-out duration-150 cursor-not-allowed">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading details...
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Order Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Customer Name</h3>
                        <p className="text-lg font-medium text-gray-900">{selectedOrder.customer_name}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Customer Phone</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-medium text-gray-900">{selectedOrder.customer_phone}</p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleCall(selectedOrder.customer_phone)}
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                              title="Call customer"
                            >
                              <Phone size={16} />
                            </button>
                            <button
                              onClick={() => handleWhatsApp(selectedOrder.customer_phone, selectedOrder.customer_name)}
                              className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-all"
                              title="Message on WhatsApp"
                            >
                              <MessageCircle size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Order Type</h3>
                        <p className="text-lg font-medium text-gray-900">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderTypeColor(selectedOrder.order_type)}`}>
                            {getOrderTypeIcon(selectedOrder.order_type)}
                            {getOrderTypeText(selectedOrder.order_type)}
                          </span>
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
                        <p className="text-lg font-medium text-gray-900">{selectedOrder.quantity}</p>
                      </div>

                      {selectedOrder.table_number && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Table Number</h3>
                          <p className="text-lg font-medium text-gray-900">{selectedOrder.table_number}</p>
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Order Date & Time</h3>
                        <p className="text-lg font-medium text-gray-900">{formatDate(selectedOrder.created_at)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Menu Item</h3>
                        <p className="text-lg font-medium text-gray-900">{selectedOrder.menu_item_name}</p>
                      </div>

                      {selectedOrder.price && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(selectedOrder.price * selectedOrder.quantity)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status Section */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Order Status</h3>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                          >
                            <Edit3 size={16} />
                            Edit Status
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsEditing(false)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => updateOrderStatus(selectedOrder.id, editStatus)}
                              className="text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                              Save
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          {selectedOrder.status}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => deleteOrder(selectedOrder.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                        Delete Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManagement;