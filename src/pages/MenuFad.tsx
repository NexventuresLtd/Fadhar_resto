import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Star, Clock, Truck, Utensils, MapPin, QrCode, Copy, Check } from 'lucide-react';
import NavBar from '../components/HomePage/NavBar';
import Footer from '../components/Shared/Footer';
import MenuHero from '../components/MenuD/hero';
type Notification = {
  message: string;
  type: 'success' | 'error' | 'info'; // You can define other types if needed
} | null;
type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  prepTime: string;
  image: string;
};

const MenuComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [orderOption, setOrderOption] = useState('');
  const [notification, setNotification] = useState<Notification>(null);
  const [paymentStep, setPaymentStep] = useState('options'); // options, details, payment, confirmation
  const [copied, setCopied] = useState(false);

  // Sample menu data
  const menuData = [
    {
      id: 1,
      name: "Signature Lamb Burger",
      description: "Juicy lamb patty with fresh veggies, special sauce, and artisan bun",
      price: 8.50,
      rating: 4.8,
      category: "burgers",
      prepTime: "15-20 min",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23F4A261' opacity='0.2'/%3E%3Cpath d='M50 120 Q100 80 150 120 Q100 160 50 120' fill='%23D4A574'/%3E%3Cpath d='M60 115 Q100 90 140 115 Q100 140 60 115' fill='%23E76F51'/%3E%3Cpath d='M70 110 Q100 95 130 110 Q100 125 70 110' fill='%235A3E36'/%3E%3Cpath d='M65 105 Q100 85 135 105' fill='%23228B22' stroke-width='3'/%3E%3Cpath d='M75 125 Q100 135 125 125' fill='%23FF6B6B'/%3E%3Cpath d='M50 130 Q100 110 150 130' fill='%23FFD93D'/%3E%3C/svg%3E"
    },
    {
      id: 2,
      name: "Mediterranean Pizza",
      description: "Fresh mozzarella with herbs, olives, sun-dried tomatoes, and feta cheese",
      price: 12.00,
      rating: 4.9,
      category: "pizza",
      prepTime: "20-25 min",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23FFE5B4'/%3E%3Ccircle cx='100' cy='100' r='75' fill='%23F4A261'/%3E%3Ccircle cx='80' cy='85' r='8' fill='%23E76F51'/%3E%3Ccircle cx='120' cy='85' r='8' fill='%23E76F51'/%3E%3Ccircle cx='100' cy='110' r='8' fill='%23E76F51'/%3E%3Ccircle cx='85' cy='120' r='6' fill='%23228B22'/%3E%3Ccircle cx='115' cy='120' r='6' fill='%23228B22'/%3E%3Cpath d='M100 25 L110 15 L100 5 L90 15 Z' fill='%23D4A574'/%3E%3C/svg%3E"
    },
    {
      id: 3,
      name: "Crispy Chicken Wings",
      description: "Golden crispy with special sauce, served with celery sticks and dip",
      price: 9.20,
      rating: 4.7,
      category: "fried",
      prepTime: "15-18 min",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23FFE5B4' opacity='0.3'/%3E%3Cpath d='M70 90 Q90 70 110 90 Q130 70 150 90 Q130 110 110 90 Q90 110 70 90' fill='%23D4A574'/%3E%3Cpath d='M75 95 Q95 80 115 95 Q125 80 135 95 Q125 105 115 95 Q95 105 75 95' fill='%23E76F51'/%3E%3Cpath d='M80 100 Q100 85 120 100' fill='%23F4A261'/%3E%3Ccircle cx='85' cy='95' r='2' fill='%23FFD93D'/%3E%3Ccircle cx='115' cy='95' r='2' fill='%23FFD93D'/%3E%3C/svg%3E"
    },
    {
      id: 4,
      name: "Premium Beef Burger",
      description: "100% Angus beef with cheddar cheese, lettuce, tomato, and special sauce",
      price: 7.80,
      rating: 4.8,
      category: "burgers",
      prepTime: "12-15 min",
      image: "🍔"
    },
    {
      id: 5,
      name: "Margherita Pizza",
      description: "Classic pizza with fresh tomatoes, mozzarella, and basil",
      price: 10.50,
      rating: 4.6,
      category: "pizza",
      prepTime: "18-22 min",
      image: "🍕"
    },
    {
      id: 6,
      name: "French Fries",
      description: "Crispy golden fries with sea salt, served with ketchup",
      price: 4.50,
      rating: 4.5,
      category: "fried",
      prepTime: "8-10 min",
      image: "🍟"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'fried', name: 'Fried Items' }
  ];

  // MoMo payment details
  const momoDetails = {
    number: "024 123 4567",
    name: "Fadhar's Restaurant",
    amount: orderOption === 'pickup' ? (selectedItem ? (selectedItem.price / 2).toFixed(2) : '0.00') : (selectedItem ? selectedItem.price.toFixed(2) : '0.00'),
    reference: `FADHAR-${Math.floor(1000 + Math.random() * 9000)}`
  };

  // Filter menu items based on search and category
  const filteredItems = menuData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOrderOptionSelect = (option: any) => {
    setOrderOption(option);
    setPaymentStep('details');
  };

  const handleProceedToPayment = () => {
    setPaymentStep('payment');
  };

  const handlePaymentComplete = () => {
    setPaymentStep('confirmation');

    let message = '';
    switch (orderOption) {
      case 'delivery':
        message = `Your order for ${selectedItem?.name} has been placed for delivery. You will pay the full amount upon delivery.`;
        break;
      case 'pickup':
        message = `Your order for ${selectedItem?.name} has been placed for pickup. You have paid 50% now and will pay the remaining 50% upon pickup.`;
        break;
      case 'table':
        message = `Your table has been booked and ${selectedItem?.name} will be prepared upon your arrival.`;
        break;
      default:
        message = 'Order placed successfully.';
    }

    showNotification(message);
  };

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closePopup = () => {
    setSelectedItem(null);
    setOrderOption('');
    setPaymentStep('options');
  };

  return (
    <>
      <NavBar />
      <div className="pt-20"></div>
      <MenuHero />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-full md:max-w-11/12 mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Menu</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our delicious selection of dishes made with the finest ingredients and prepared with care.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl p-6  mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for dishes..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="text-gray-600 w-5 h-5" />
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
          {filteredItems.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl overflow-hidden  border border-gray-100 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {item.image.startsWith('data:image') ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-6xl">{item.image}</div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                      <span className="text-lg font-bold text-orange-600">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-700">{item.rating}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {item.prepTime}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl ">
              <p className="text-gray-600 text-lg">No items found matching your criteria.</p>
              <button
                className="mt-4 text-orange-500 font-medium hover:text-orange-600"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Item Detail Popup */}
          <AnimatePresence>
            {selectedItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={closePopup}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {paymentStep === 'options' && (
                    <>
                      <div className="relative">
                        <button
                          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2  hover:bg-gray-100"
                          onClick={closePopup}
                        >
                          <X className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="h-56 bg-gray-100 flex items-center justify-center">
                          {selectedItem.image.startsWith('data:image') ? (
                            <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-8xl">{selectedItem.image}</div>
                          )}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-bold text-gray-800">{selectedItem.name}</h3>
                          <span className="text-xl font-bold text-orange-600">${selectedItem.price.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center mb-4">
                          <div className="flex items-center mr-4">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="ml-1 font-medium text-gray-700">{selectedItem.rating}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="w-5 h-5 mr-1" />
                            {selectedItem.prepTime}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-6">{selectedItem.description}</p>

                        <div className="space-y-4 mb-6">
                          <h4 className="font-semibold text-gray-800">How would you like to order?</h4>

                          <div className="grid grid-cols-1 gap-3">
                            <button
                              onClick={() => handleOrderOptionSelect('delivery')}
                              className="flex items-center p-4 border rounded-xl transition-colors border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                            >
                              <Truck className="w-5 h-5 text-orange-500 mr-3" />
                              <div className="text-left">
                                <span className="font-medium block">Delivery</span>
                                <span className="text-sm text-gray-600">Pay full amount upon delivery</span>
                              </div>
                            </button>

                            <button
                              onClick={() => handleOrderOptionSelect('pickup')}
                              className="flex items-center p-4 border rounded-xl transition-colors border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                            >
                              <MapPin className="w-5 h-5 text-orange-500 mr-3" />
                              <div className="text-left">
                                <span className="font-medium block">Pickup</span>
                                <span className="text-sm text-gray-600">Pay 50% now, 50% upon pickup</span>
                              </div>
                            </button>

                            <button
                              onClick={() => handleOrderOptionSelect('table')}
                              className="flex items-center p-4 border rounded-xl transition-colors border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                            >
                              <Utensils className="w-5 h-5 text-orange-500 mr-3" />
                              <div className="text-left">
                                <span className="font-medium block">Book a Table</span>
                                <span className="text-sm text-gray-600">Pay at restaurant</span>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {paymentStep === 'details' && (
                    <div className="p-6">
                      <button
                        onClick={() => setPaymentStep('options')}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                      >
                        <X className="w-5 h-5 mr-1" />
                        Back
                      </button>

                      <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h3>

                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center mb-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                            {selectedItem.image.startsWith('data:image') ? (
                              <img src={selectedItem.image} alt={selectedItem.name} className="w-12 h-12 object-cover" />
                            ) : (
                              <div className="text-2xl">{selectedItem.image}</div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{selectedItem.name}</h4>
                            <p className="text-sm text-gray-600">{selectedItem.description}</p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Item Price</span>
                            <span>${selectedItem.price.toFixed(2)}</span>
                          </div>
                          {orderOption === 'delivery' && (
                            <div className="flex justify-between">
                              <span>Delivery Fee</span>
                              <span>$2.50</span>
                            </div>
                          )}
                          {orderOption === 'pickup' && (
                            <div className="flex justify-between">
                              <span>Deposit (50%)</span>
                              <span>${(selectedItem.price / 2).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="border-t border-gray-200 pt-2 mt-2 font-semibold flex justify-between">
                            <span>{orderOption === 'pickup' ? 'Amount to Pay Now' : 'Total Amount'}</span>
                            <span>
                              ${orderOption === 'pickup'
                                ? (selectedItem.price / 2).toFixed(2)
                                : orderOption === 'delivery'
                                  ? (selectedItem.price + 2.5).toFixed(2)
                                  : '0.00'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleProceedToPayment}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  )}

                  {paymentStep === 'payment' && (
                    <div className="p-6">
                      <button
                        onClick={() => setPaymentStep('details')}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                      >
                        <X className="w-5 h-5 mr-1" />
                        Back
                      </button>

                      <h3 className="text-2xl font-bold text-gray-800 mb-6">Complete Payment</h3>
                      <p className="text-gray-600 mb-6">Scan the QR code or use the MoMo number below to complete your payment.</p>

                      <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
                        <div className="w-40 h-40 mx-auto bg-white rounded-lg flex items-center justify-center mb-4 border border-gray-200">
                          <QrCode className="w-32 h-32 text-gray-700" />
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Send payment to</p>
                            <div className="flex items-center justify-center">
                              <span className="font-semibold text-lg">{momoDetails.number}</span>
                              <button
                                onClick={() => copyToClipboard(momoDetails.number)}
                                className="ml-2 text-orange-500 hover:text-orange-600"
                              >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <p className="text-sm text-gray-600">{momoDetails.name}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 mb-1">Amount</p>
                            <p className="font-semibold text-lg">GH₵ {momoDetails.amount}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 mb-1">Reference</p>
                            <div className="flex items-center justify-center">
                              <span className="font-semibold">{momoDetails.reference}</span>
                              <button
                                onClick={() => copyToClipboard(momoDetails.reference)}
                                className="ml-2 text-orange-500 hover:text-orange-600"
                              >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <p className="text-yellow-800 text-sm">
                          <strong>Note:</strong> Please use the reference code above when making your payment. Your order will be confirmed once payment is received.
                        </p>
                      </div>

                      <button
                        onClick={handlePaymentComplete}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        I've Completed Payment
                      </button>
                    </div>
                  )}

                  {paymentStep === 'confirmation' && (
                    <div className="p-6 text-center">
                      <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <Check className="w-10 h-10 text-green-600" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Confirmed!</h3>

                      {orderOption === 'delivery' && (
                        <p className="text-gray-600 mb-6">
                          Your <strong>{selectedItem.name}</strong> is being prepared and will be delivered to you shortly.
                          You'll pay GH₵ {(selectedItem.price + 2.5).toFixed(2)} upon delivery.
                        </p>
                      )}

                      {orderOption === 'pickup' && (
                        <p className="text-gray-600 mb-6">
                          Your <strong>{selectedItem.name}</strong> is being prepared for pickup.
                          You've paid GH₵ {(selectedItem.price / 2).toFixed(2)} deposit.
                          Please pay the remaining GH₵ {(selectedItem.price / 2).toFixed(2)} when you pickup your order.
                        </p>
                      )}

                      {orderOption === 'table' && (
                        <p className="text-gray-600 mb-6">
                          Your table has been reserved and your <strong>{selectedItem.name}</strong> will be prepared upon your arrival.
                          Please arrive within 15 minutes of your booking time.
                        </p>
                      )}

                      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                        <h4 className="font-semibold text-gray-800 mb-2">Order Details</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="text-gray-600">Order ID:</span> {momoDetails.reference}</p>
                          <p><span className="text-gray-600">Item:</span> {selectedItem.name}</p>
                          <p><span className="text-gray-600">Total Amount:</span> GH₵ {orderOption === 'pickup' ? selectedItem.price.toFixed(2) : (selectedItem.price + 2.5).toFixed(2)}</p>
                          <p><span className="text-gray-600">Paid:</span> GH₵ {orderOption === 'pickup' ? (selectedItem.price / 2).toFixed(2) : '0.00'}</p>
                        </div>
                      </div>

                      <button
                        onClick={closePopup}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className={`fixed bottom-4 right-4 px-6 py-4 rounded-xl shadow-lg ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                  } text-white font-medium max-w-sm`}
              >
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MenuComponent;