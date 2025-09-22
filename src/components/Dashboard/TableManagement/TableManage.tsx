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
  Timer,
  Image as ImageIcon,
  X
} from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

interface Table {
  id: number;
  number: string;
  capacity: number;
  status: 'available' | 'booked';
  booking_timeout: string | null;
  table_image: string | null;
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
  const [newTableImage, setNewTableImage] = useState<string>('');
  const [newTableImageFile, setNewTableImageFile] = useState<File | null>(null);
  const [editTableImageFile, setEditTableImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editTableData, setEditTableData] = useState<{
    capacity: number;
    status: string;
    table_image?: string;
  }>({
    capacity: 4,
    status: 'available',
    table_image: ''
  });
  const [bookingData, setBookingData] = useState<BookingData>({
    table_id: 0,
    customer_name: '',
    customer_phone: '',
    number_of_people: 1,
    booking_duration: 60
  });

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle image file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      if (type === 'add') {
        setNewTableImageFile(file);
        setNewTableImage(''); // Clear URL input
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        setEditTableImageFile(file);
        setEditTableData({ ...editTableData, table_image: '' }); // Clear URL input
        const previewUrl = URL.createObjectURL(file);
        setEditImagePreview(previewUrl);
      }
    }
  };

  // Clear image previews
  const clearImagePreviews = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setImagePreview(null);
    setEditImagePreview(null);
    setNewTableImageFile(null);
    setEditTableImageFile(null);
    setNewTableImage('');
  };

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
    return () => {
      // Cleanup object URLs on component unmount
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    };
  }, []);

  const addTable = async () => {
    setActionLoading({ ...actionLoading, add: true });
    try {
      let imageBase64 = newTableImage; // Use URL if provided

      // Convert uploaded file to base64
      if (newTableImageFile) {
        imageBase64 = await convertToBase64(newTableImageFile);
      }

      await mainAxios.post('/tables/add', {
        capacity: newTableCapacity,
        table_image: imageBase64 || undefined
      });

      setNewTableCapacity(4);
      setShowAddModal(false);
      clearImagePreviews();
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
      let imageBase64 = editTableData.table_image;

      // Convert uploaded file to base64
      if (editTableImageFile) {
        imageBase64 = await convertToBase64(editTableImageFile);
      }

      await mainAxios.put(`/tables/${selectedTable.id}`, {
        ...editTableData,
        table_image: imageBase64
      });

      setShowEditModal(false);
      setSelectedTable(null);
      clearImagePreviews();
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
    setEditTableData({
      capacity: table.capacity,
      status: table.status,
      table_image: table.table_image || ''
    });
    setEditImagePreview(null);
    setEditTableImageFile(null);
    setShowEditModal(true);
  };

  const openBookModal = (tableId: number) => {
    setBookingData({ ...bookingData, table_id: tableId });
    setShowBookModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    clearImagePreviews();
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    clearImagePreviews();
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
                className="bg-white border-2 border-green-200 rounded-lg overflow-hidden hover:border-green-300 transition-colors shadow-sm"
              >
                {/* Table Image - Full width at top */}
                {table.table_image && (
                  <div className="relative h-40 bg-gray-100">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${table.table_image}`}
                      alt={`Table ${table.number}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        // Show fallback background if image fails to load
                        (e.target as HTMLImageElement).parentElement!.className = 'relative h-40 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center';
                      }}
                    />
                    {/* Fallback icon if image is missing */}
                    {!table.table_image && (
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <ImageIcon className="text-green-400" size={48} />
                      </div>
                    )}
                  </div>
                )}
                {}

                {/* Fallback for tables without images */}
                {!table.table_image && (
                  <div className="relative h-40 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <ImageIcon className="text-green-400" size={48} />
                    <span className="absolute bottom-2 right-2 text-green-600 text-xs">
                      No image
                    </span>
                  </div>
                )}

                {/* Table Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-green-800">Table {table.number}</h3>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${table.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                      {table.status === 'available' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                      {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-green-600">
                    <Users size={18} />
                    <span>Capacity: {table.capacity} people</span>
                  </div>

                  {table.booking_timeout && (
                    <div className="flex items-center gap-2 mb-4 text-orange-600 bg-orange-50 p-2 rounded-lg">
                      <Clock size={16} />
                      <span className="text-sm">
                        Reserved until: {new Date(table.booking_timeout).toLocaleTimeString()}
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
              className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
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
                    max="20"
                    className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter capacity"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-green-700 font-medium mb-2">Table Image</label>

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'add')}
                    className="hidden"
                    id="add-table-image"
                  />
                  <label
                    htmlFor="add-table-image"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <ImageIcon className="text-green-500" size={32} />
                    <div>
                      <p className="text-green-600 font-medium">
                        {newTableImageFile ? 'Change Image' : 'Click to upload'}
                      </p>
                      <p className="text-gray-500 text-sm">PNG, JPG up to 5MB</p>
                    </div>
                  </label>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4 relative">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border border-green-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(imagePreview);
                          setImagePreview(null);
                          setNewTableImageFile(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Uploaded: {newTableImageFile?.name}
                    </p>
                  </div>
                )}

                {/* OR Separator */}
                {(imagePreview || newTableImage) && (
                  <div className="my-4 flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                )}

                {/* URL Input */}
                <div>
                  <label className="block text-green-700 font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={newTableImage}
                    onChange={(e) => {
                      setNewTableImage(e.target.value);
                      if (e.target.value) {
                        setImagePreview(null);
                        setNewTableImageFile(null);
                      }
                    }}
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="https://example.com/table-image.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addTable}
                  disabled={actionLoading.add || newTableCapacity < 1}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading.add ? 'Adding...' : 'Add Table'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeAddModal}
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
              className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
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
                    max="20"
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

              <div className="mb-6">
                <label className="block text-green-700 font-medium mb-2">Table Image</label>

                {/* Current Image Display */}
                {selectedTable.table_image && !editImagePreview && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                    <img
                      src={selectedTable.table_image}
                      alt="Current table"
                      className="w-full h-40 object-cover rounded-lg border border-green-200"
                    />
                  </div>
                )}

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'edit')}
                    className="hidden"
                    id="edit-table-image"
                  />
                  <label
                    htmlFor="edit-table-image"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <ImageIcon className="text-green-500" size={32} />
                    <div>
                      <p className="text-green-600 font-medium">
                        {editTableImageFile ? 'Change Image' : 'Upload New Image'}
                      </p>
                      <p className="text-gray-500 text-sm">PNG, JPG up to 5MB</p>
                    </div>
                  </label>
                </div>

                {/* New Image Preview */}
                {editImagePreview && (
                  <div className="mt-4 relative">
                    <div className="relative">
                      <img
                        src={editImagePreview}
                        alt="New preview"
                        className="w-full h-40 object-cover rounded-lg border border-green-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(editImagePreview);
                          setEditImagePreview(null);
                          setEditTableImageFile(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      New upload: {editTableImageFile?.name}
                    </p>
                  </div>
                )}

                {/* OR Separator */}
                {(editImagePreview || editTableData.table_image) && (
                  <div className="my-4 flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                )}

                {/* URL Input */}
                <div>
                  <label className="block text-green-700 font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={editTableData.table_image || ''}
                    onChange={(e) => {
                      setEditTableData({ ...editTableData, table_image: e.target.value });
                      if (e.target.value) {
                        setEditImagePreview(null);
                        setEditTableImageFile(null);
                      }
                    }}
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="https://example.com/table-image.jpg"
                  />
                </div>

                {/* Remove Image Button */}
                {(selectedTable.table_image || editTableData.table_image) && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditTableData({ ...editTableData, table_image: '' });
                      setEditImagePreview(null);
                      setEditTableImageFile(null);
                    }}
                    className="mt-3 text-red-500 text-sm hover:text-red-700 flex items-center gap-1"
                  >
                    <X size={16} />
                    Remove Image
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={updateTable}
                  disabled={actionLoading.edit || editTableData.capacity < 1}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading.edit ? 'Updating...' : 'Update Table'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeEditModal}
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