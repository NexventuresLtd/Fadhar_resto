import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, X, Eye, ChevronDown, RefreshCw } from 'lucide-react';
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

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'customer' | 'item' | 'type' | 'date'>('customer');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<'all' | 'delivery' | 'dine-in' | 'takeaway'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [orders, searchTerm, filterBy, sortBy, sortOrder]);

  // Count orders by type
  const orderCounts = useMemo(() => {
    return {
      all: orders.length,
      delivery: orders.filter(order => order.order_type === 'delivery').length,
      dineIn: orders.filter(order => order.order_type === 'dine-in').length,
      takeaway: orders.filter(order => order.order_type === 'takeaway').length,
    };
  }, [orders]);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
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
    }
  };

  const fetchMenuItemDetails = async (menuItemId: number) => {
    // Validate that menuItemId is a valid number
    if (!menuItemId || isNaN(menuItemId)) {
      setError('Invalid menu item ID');
      return;
    }

    try {
      setDetailLoading(true);
      const response = await mainAxios.get(`/orders/menu/${menuItemId}`);
      setSelectedMenuItem(response.data);
      setShowItemDetails(true);
      setError(null);
    } catch (err) {
      setError('Failed to fetch menu item details');
      console.error('Error fetching menu item details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleSort = (field: 'customer' | 'item' | 'type' | 'date') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const closeItemDetails = () => {
    setShowItemDetails(false);
    setSelectedMenuItem(null);
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

  // Add a function to refresh orders
  const refreshOrders = () => {
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div>

        {/* Order Counters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{orderCounts.all}</div>
            <div className="text-sm text-gray-500">Total Orders</div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{orderCounts.delivery}</div>
            <div className="text-sm text-gray-500">Delivery</div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{orderCounts.dineIn}</div>
            <div className="text-sm text-gray-500">Dine-in</div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{orderCounts.takeaway}</div>
            <div className="text-sm text-gray-500">Takeaway</div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
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
                  <option value="all">All Orders</option>
                  <option value="delivery">Delivery</option>
                  <option value="dine-in">Dine-in</option>
                  <option value="takeaway">Takeaway</option>
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
                  onClick={() => toggleSort('item')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'item' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Item</span>
                  {sortBy === 'item' && (
                    sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                  )}
                </button>
                
                <button
                  onClick={() => toggleSort('type')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'type' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Type</span>
                  {sortBy === 'type' && (
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
                  <option value="all">All Orders</option>
                  <option value="delivery">Delivery</option>
                  <option value="dine-in">Dine-in</option>
                  <option value="takeaway">Takeaway</option>
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
                  onClick={() => toggleSort('item')}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'item' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Item</span>
                  {sortBy === 'item' && (
                    sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                  )}
                </button>
                
                <button
                  onClick={() => toggleSort('type')}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${sortBy === 'type' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Type</span>
                  {sortBy === 'type' && (
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
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
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
            {loading && orders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-green-600 bg-green-50 transition ease-in-out duration-150 cursor-not-allowed">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading orders...
                </div>
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
                {(searchTerm || filterBy !== 'all') && orders.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterBy('all');
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
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderTypeColor(order.order_type)}`}>
                            {getOrderTypeText(order.order_type)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="truncate">{order.customer_phone}</span>
                          <span className="truncate">Qty: {order.quantity}</span>
                          {order.table_number && (
                            <span className="truncate">Table: {order.table_number}</span>
                          )}
                        </div>
                        
                        <p className="mt-2 text-sm text-gray-700 truncate">
                          {order.menu_item_name}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Only show the view button if menu_item_id exists and is valid */}
                        {order.menu_item_id && !isNaN(order.menu_item_id) && (
                          <button
                            onClick={() => fetchMenuItemDetails(order.menu_item_id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                            title="View menu item details"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Menu Item Details Modal */}
      <AnimatePresence>
        {showItemDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeItemDetails}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Menu Item Details</h2>
                  <button
                    onClick={closeItemDetails}
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
                ) : selectedMenuItem ? (
                  <div className="space-y-4">
                    {selectedMenuItem.image ? (
                      <img 
                        src={selectedMenuItem.image} 
                        alt={selectedMenuItem.name} 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-gray-400">No image available</div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{selectedMenuItem.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedMenuItem.category_name} • {selectedMenuItem.subcategory_name}
                      </p>
                    </div>
                    
                    <p className="text-gray-700">{selectedMenuItem.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        Ksh {selectedMenuItem.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Unable to load menu item details
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