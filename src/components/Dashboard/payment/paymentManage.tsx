import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, DollarSign, Search, Filter, Eye, Bell, Activity, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';


interface Payment {
  id: number;
  order_id: number;
  amount_paid: number;
  currency: string;
  status: string;
  date_paid: string | null;
  reference_id: string;
  paid_account_number?: string;
  external_id?: string;
}

interface OrderPayment {
  order_id: number;
  payments: Payment[];
}

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orderPayments, setOrderPayments] = useState<OrderPayment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'initiate' | 'order' | 'status'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [initiateData, setInitiateData] = useState({
    order_id: '',
    amount: '',
    phone: ''
  });
  const [statusCheckData, setStatusCheckData] = useState({
    reference_id: ''
  });
  const [orderCheckData, setOrderCheckData] = useState({
    order_id: ''
  });
  const [notificationData, setNotificationData] = useState({
    reference_id: '',
    message: 'Thank you for your payment at Fadhar Restaurant!'
  });

  // Fetch all payments on component mount
  useEffect(() => {
    if (activeTab === 'all') {
      fetchAllPayments();
    }
  }, [activeTab]);

  const fetchAllPayments = async () => {
    try {
      setLoading(true);
      const response = await mainAxios.get('/payments/all');
      setPayments(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch payments');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderPayments = async (orderId: number) => {
    try {
      setLoading(true);
      const response = await mainAxios.get(`/payments/order/${orderId}`);
      setOrderPayments(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch order payments');
      console.error('Error fetching order payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    if (!initiateData.order_id || !initiateData.amount || !initiateData.phone) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await mainAxios.post(`/payments/initiate/${initiateData.order_id}`, {
        amount: parseFloat(initiateData.amount),
        phone: initiateData.phone
      });

      setSuccess(`Payment initiated successfully. Reference ID: ${response.data.reference_id}`);
      setInitiateData({ order_id: '', amount: '', phone: '' });
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to initiate payment');
      console.error('Error initiating payment:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!statusCheckData.reference_id) {
      setError('Please enter a reference ID');
      return;
    }

    try {
      setLoading(true);
      const response = await mainAxios.get(`/payments/status/${statusCheckData.reference_id}`);
      setSuccess(`Payment status: ${response.data.status}. MoMo status: ${response.data.momo_status || 'N/A'}`);
      setTimeout(() => setSuccess(null), 5000);
      
      // Refresh the payments list if we're on the all payments tab
      if (activeTab === 'all') {
        fetchAllPayments();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to check payment status');
      console.error('Error checking payment status:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async () => {
    if (!notificationData.reference_id) {
      setError('Please enter a reference ID');
      return;
    }

    try {
      setLoading(true);
      const response = await mainAxios.post(`/payments/notify/${notificationData.reference_id}`, {
        message: notificationData.message
      });

      setSuccess('Notification sent successfully');
      setNotificationData({ reference_id: '', message: 'Thank you for your payment at Fadhar Restaurant!' });
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send notification');
      console.error('Error sending notification:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      setLoading(true);
      const response = await mainAxios.get('/payments/health');
      setSuccess(`Payment system is ${response.data.status}. Environment: ${response.data.environment}`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to check system health');
      console.error('Error checking health:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = searchTerm === '' || 
      payment.reference_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.order_id.toString().includes(searchTerm) ||
      (payment.paid_account_number && payment.paid_account_number.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              Payment Management System
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={checkHealth}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Activity size={20} />
                System Health
              </button>
              <button
                onClick={fetchAllPayments}
                disabled={loading && activeTab === 'all'}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={20} />
                Refresh
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === 'all' ? 'bg-green-100 text-green-800 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              All Payments
            </button>
            <button
              onClick={() => setActiveTab('initiate')}
              className={`px-4 py-2 hidden rounded-t-lg font-medium ${activeTab === 'initiate' ? 'bg-green-100 text-green-800 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Initiate Payment
            </button>
            <button
              onClick={() => setActiveTab('order')}
              className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === 'order' ? 'bg-green-100 text-green-800 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Order Payments
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === 'status' ? 'bg-green-100 text-green-800 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Check Status
            </button>
          </div>

          {/* Success and Error Messages */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center"
              >
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
                  <XCircle size={20} />
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
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center"
              >
                <span>{success}</span>
                <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">
                  <XCircle size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Content */}
          {activeTab === 'all' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by reference ID, order ID, or phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-600" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw size={32} className="animate-spin text-green-600 mx-auto mb-2" />
                  <p className="text-gray-600">Loading payments...</p>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <DollarSign size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No payments found</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Paid</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPayments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{payment.reference_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{payment.order_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.amount_paid.toLocaleString()} {payment.currency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.paid_account_number || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                {getStatusIcon(payment.status)}
                                {payment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.date_paid ? new Date(payment.date_paid).toLocaleString() : 'Not paid'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setStatusCheckData({ reference_id: payment.reference_id });
                                  setActiveTab('status');
                                }}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setNotificationData({ ...notificationData, reference_id: payment.reference_id });
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Bell size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'initiate' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Initiate New Payment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
                  <input
                    type="number"
                    value={initiateData.order_id}
                    onChange={(e) => setInitiateData({ ...initiateData, order_id: e.target.value })}
                    placeholder="Enter order ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={initiateData.amount}
                    onChange={(e) => setInitiateData({ ...initiateData, amount: e.target.value })}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={initiateData.phone}
                    onChange={(e) => setInitiateData({ ...initiateData, phone: e.target.value })}
                    placeholder="Enter customer phone number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Format: 2507XXXXXXX for production, any number for sandbox</p>
                </div>
              </div>
              <button
                onClick={initiatePayment}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <DollarSign size={20} />
                Initiate Payment
              </button>
            </motion.div>
          )}

          {activeTab === 'order' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Check Order Payments</h2>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
                  <input
                    type="number"
                    value={orderCheckData.order_id}
                    onChange={(e) => setOrderCheckData({ order_id: e.target.value })}
                    placeholder="Enter order ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="self-end">
                  <button
                    onClick={() => fetchOrderPayments(parseInt(orderCheckData.order_id))}
                    disabled={loading || !orderCheckData.order_id}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Search size={20} />
                    Search
                  </button>
                </div>
              </div>

              {orderPayments && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">Payments for Order #{orderPayments.order_id}</h3>
                  </div>
                  {orderPayments.payments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No payments found for this order</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Paid</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orderPayments.payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{payment.reference_id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payment.amount_paid.toLocaleString()} {payment.currency}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                  {getStatusIcon(payment.status)}
                                  {payment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payment.date_paid ? new Date(payment.date_paid).toLocaleString() : 'Not paid'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'status' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Check Payment Status</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reference ID</label>
                    <input
                      type="text"
                      value={statusCheckData.reference_id}
                      onChange={(e) => setStatusCheckData({ reference_id: e.target.value })}
                      placeholder="Enter payment reference ID"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="self-end">
                    <button
                      onClick={checkPaymentStatus}
                      disabled={loading || !statusCheckData.reference_id}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={20} />
                      Check Status
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Send Payment Notification</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reference ID</label>
                    <input
                      type="text"
                      value={notificationData.reference_id}
                      onChange={(e) => setNotificationData({ ...notificationData, reference_id: e.target.value })}
                      placeholder="Enter payment reference ID"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notification Message</label>
                    <textarea
                      value={notificationData.message}
                      onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <button
                  onClick={sendNotification}
                  disabled={loading || !notificationData.reference_id}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Bell size={20} />
                  Send Notification
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentManagement;