import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  User,
  Timer
} from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';


interface Table {
  id: number;
  number: string;
  capacity: number;
  status: 'available' | 'booked';
  booking_timeout: string | null;
}

interface BookingData {
  table_id: number;
  customer_name: string;
  customer_phone: string;
  number_of_people: number;
  booking_duration: number;
}

const TableManagement: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [newTableCapacity, setNewTableCapacity] = useState<number>(4);
  const [editTableData, setEditTableData] = useState<{ capacity: number; status: string }>({ capacity: 4, status: 'available' });
  const [bookingData, setBookingData] = useState<BookingData>({
    table_id: 0,
    customer_name: '',
    customer_phone: '',
    number_of_people: 1,
    booking_duration: 60
  });

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await mainAxios.get('/tables/');
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const addTable = async () => {
    setActionLoading({ ...actionLoading, add: true });
    try {
      await mainAxios.post('/tables/add', { capacity: newTableCapacity });
      setNewTableCapacity(4);
      setShowAddModal(false);
      fetchTables();
    } catch (error) {
      console.error('Error adding table:', error);
    } finally {
      setActionLoading({ ...actionLoading, add: false });
    }
  };

  const updateTable = async () => {
    if (!selectedTable) return;
    setActionLoading({ ...actionLoading, edit: true });
    try {
      await mainAxios.put(`/tables/${selectedTable.id}`, editTableData);
      setShowEditModal(false);
      setSelectedTable(null);
      fetchTables();
    } catch (error) {
      console.error('Error updating table:', error);
    } finally {
      setActionLoading({ ...actionLoading, edit: false });
    }
  };

  const deleteTable = async (tableId: number) => {
    setActionLoading({ ...actionLoading, [`delete_${tableId}`]: true });
    try {
      await mainAxios.delete(`/tables/${tableId}`);
      fetchTables();
    } catch (error) {
      console.error('Error deleting table:', error);
    } finally {
      setActionLoading({ ...actionLoading, [`delete_${tableId}`]: false });
    }
  };

  const bookTable = async () => {
    setActionLoading({ ...actionLoading, book: true });
    try {
      await mainAxios.post('/tables/book', bookingData);
      setShowBookModal(false);
      setBookingData({
        table_id: 0,
        customer_name: '',
        customer_phone: '',
        number_of_people: 1,
        booking_duration: 60
      });
      fetchTables();
    } catch (error) {
      console.error('Error booking table:', error);
    } finally {
      setActionLoading({ ...actionLoading, book: false });
    }
  };

  const changeTableStatus = async (tableId: number, status: 'available' | 'booked') => {
    setActionLoading({ ...actionLoading, [`status_${tableId}`]: true });
    try {
      await mainAxios.put(`/tables/${tableId}/status?status=${status}`);
      fetchTables();
    } catch (error) {
      console.error('Error changing table status:', error);
    } finally {
      setActionLoading({ ...actionLoading, [`status_${tableId}`]: false });
    }
  };

  const openEditModal = (table: Table) => {
    setSelectedTable(table);
    setEditTableData({ capacity: table.capacity, status: table.status });
    setShowEditModal(true);
  };

  const openBookModal = (tableId: number) => {
    setBookingData({ ...bookingData, table_id: tableId });
    setShowBookModal(true);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
            Fadhar Restaurant
          </h1>
          <p className="text-green-600 text-lg">Table Management System</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Add New Table
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchTables}
            disabled={loading}
            className="flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-200 transition-colors border border-green-300"
          >
            {loading ? 'Loading...' : 'Refresh Tables'}
          </motion.button>
        </div>

        {/* Tables Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-green-600">Loading tables...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tables.map((table) => (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border-2 border-green-200 rounded-lg p-6 hover:border-green-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-green-800">{table.number}</h3>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    table.status === 'available' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {table.status === 'available' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {table.status}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 text-green-600">
                  <Users size={18} />
                  <span>Capacity: {table.capacity}</span>
                </div>

                {table.booking_timeout && (
                  <div className="flex items-center gap-2 mb-4 text-orange-600">
                    <Clock size={16} />
                    <span className="text-sm">
                      Timeout: {new Date(table.booking_timeout).toLocaleTimeString()}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {table.status === 'available' ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openBookModal(table.id)}
                      disabled={actionLoading[`book_${table.id}`]}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading[`book_${table.id}`] ? 'Booking...' : 'Book Table'}
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => changeTableStatus(table.id, 'available')}
                      disabled={actionLoading[`status_${table.id}`]}
                      className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {actionLoading[`status_${table.id}`] ? 'Updating...' : 'Mark Available'}
                    </motion.button>
                  )}

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openEditModal(table)}
                      className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors border border-green-300"
                    >
                      <Edit size={16} className="mx-auto" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => deleteTable(table.id)}
                      disabled={actionLoading[`delete_${table.id}`]}
                      className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors border border-red-300 disabled:opacity-50"
                    >
                      {actionLoading[`delete_${table.id}`] ? '...' : <Trash2 size={16} className="mx-auto" />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Table Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-green-800 mb-4">Add New Table</h2>
              <div className="mb-4">
                <label className="block text-green-700 font-medium mb-2">Table Capacity</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                  <input
                    type="number"
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                    min="1"
                    className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter capacity"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addTable}
                  disabled={actionLoading.add}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading.add ? 'Adding...' : 'Add Table'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Table Modal */}
        {showEditModal && selectedTable && (
          <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-green-800 mb-4">Edit Table {selectedTable.number}</h2>
              <div className="mb-4">
                <label className="block text-green-700 font-medium mb-2">Table Capacity</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                  <input
                    type="number"
                    value={editTableData.capacity}
                    onChange={(e) => setEditTableData({ ...editTableData, capacity: Number(e.target.value) })}
                    min="1"
                    className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-green-700 font-medium mb-2">Status</label>
                <select
                  value={editTableData.status}
                  onChange={(e) => setEditTableData({ ...editTableData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={updateTable}
                  disabled={actionLoading.edit}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading.edit ? 'Updating...' : 'Update Table'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Book Table Modal */}
        {showBookModal && (
          <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-green-800 mb-4">Book Table</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-green-700 font-medium mb-2">Customer Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                    <input
                      type="text"
                      value={bookingData.customer_name}
                      onChange={(e) => setBookingData({ ...bookingData, customer_name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter customer name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-green-700 font-medium mb-2">Customer Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                    <input
                      type="tel"
                      value={bookingData.customer_phone}
                      onChange={(e) => setBookingData({ ...bookingData, customer_phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-green-700 font-medium mb-2">Number of People</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                    <input
                      type="number"
                      value={bookingData.number_of_people}
                      onChange={(e) => setBookingData({ ...bookingData, number_of_people: Number(e.target.value) })}
                      min="1"
                      className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Number of guests"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-green-700 font-medium mb-2">Booking Duration (minutes)</label>
                  <div className="relative">
                    <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                    <input
                      type="number"
                      value={bookingData.booking_duration}
                      onChange={(e) => setBookingData({ ...bookingData, booking_duration: Number(e.target.value) })}
                      min="15"
                      step="15"
                      className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Duration in minutes"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={bookTable}
                  disabled={actionLoading.book || !bookingData.customer_name || !bookingData.customer_phone}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading.book ? 'Booking...' : 'Book Table'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBookModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableManagement;