
import { motion } from 'framer-motion';
import {  Star, } from 'lucide-react';
import { menuItems } from '../../constants/HomePage';

import { fadeInUp, staggerContainer } from '../../hooks/HomePage';



export default function OurMenu() {
    return (
        <>
            {/* Regular Menu Section */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                <span className="text-red-500">Regular</span> Menu
                            </h2>
                            <p className="text-gray-600 hidden md:block">These Are Our Regular Menu. You Can Order Anything You Like.</p>
                        </div>
                        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold transition-all text-sm">
                            See All
                        </button>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 transition-all border border-gray-100 overflow-hidden"
                            >
                                <div className="text-center">
                                    <div className="w-full h-48 mb-4 bg-gray-200 rounded-2xl overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                                    <div className="flex items-center justify-center mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm text-gray-600">({item.rating})</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-gray-800">{item.price}</span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium text-sm transition-all"
                                        >
                                            Order Now
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    )
}
