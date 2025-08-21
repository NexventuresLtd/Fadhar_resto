
import { motion } from 'framer-motion';
import { categories } from '../../constants/HomePage';


export default function BestDel() {
    return (
        <>
            {/* Best Delivered Categories */}
            <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
                <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-800 mb-6">
                                Best <span className="text-red-500">Delivered</span><br />
                                Categories
                            </h2>
                            <p className="text-gray-600 mb-8 text-lg">
                                Here Are Some Of Our Best Distributed Categories. If You Want, You Can Order From Here.
                            </p>

                            <div className="grid grid-cols-1 gap-6">
                                {categories.map((category, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ x: 10 }}
                                        className="bg-white rounded-2xl p-6 transition-all border border-gray-100 cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-2xl`}>
                                                {category.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-800 mb-1">{category.name}</h3>
                                                <button className="text-red-500 font-medium hover:text-red-600 transition-colors">
                                                    Order Now →
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Right side illustration placeholder */}
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="bg-gradient-to-br from-orange-200 to-red-200 rounded-3xl h-48 flex items-center justify-center text-6xl overflow-hidden"
                                >
                                    <img src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
                                        alt="Burger"
                                        className="w-full h-full object-cover" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [10, -10, 10] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                    className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-3xl h-48 flex items-center justify-center text-6xl overflow-hidden"
                                >
                                    <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
                                        alt="Pizza"
                                        className="w-full h-full object-cover" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [10, -10, 10] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                    className="bg-gradient-to-br from-red-200 to-pink-200 rounded-3xl h-48 flex items-center justify-center text-6xl overflow-hidden"
                                >
                                    <img src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
                                        alt="Chicken"
                                        className="w-full h-full object-cover" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                                    className="bg-gradient-to-br from-green-200 to-teal-200 rounded-3xl h-48 flex items-center justify-center text-6xl overflow-hidden"
                                >
                                    <img src="https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
                                        alt="Fries"
                                        className="w-full h-full object-cover" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
