import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Utensils } from 'lucide-react';
import { features } from '../../constants/HomePage';
import { fadeInUp, staggerContainer } from '../../hooks/HomePage';
import { useEffect, useState } from 'react';
import { fetchPopularDishes } from '../../constants/HomePage';

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [popularDishes, setPopularDishes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDishes = async () => {
            try {
                const dishes = await fetchPopularDishes();
                setPopularDishes(dishes);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load dishes:', error);
                setLoading(false);
            }
        };

        loadDishes();
    }, []);

    useEffect(() => {
        if (popularDishes.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % popularDishes.length);
            }, 4000);
            return () => clearInterval(timer);
        }
    }, [popularDishes.length]);

    // Show loading state
    if (loading) {
        return (
            <section className="relative overflow-hidden bg-gradient-to-br from-green-200 to-green-200 pt-16">
                <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content Skeleton */}
                        <div className="space-y-8">
                            {/* Title Skeleton */}
                            <div className="space-y-4">
                                <div className="h-12 bg-green-100 rounded-full animate-pulse w-4/5"></div>
                                <div className="h-12 bg-green-100 rounded-full animate-pulse w-3/4"></div>
                                <div className="h-12 bg-green-100 rounded-full animate-pulse w-2/3"></div>
                            </div>
                            
                            {/* Icon with text Skeleton */}
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-green-100 rounded-full animate-pulse w-40"></div>
                                    <div className="h-3 bg-green-100 rounded-full animate-pulse w-32"></div>
                                </div>
                            </div>
                            
                            {/* Buttons Skeleton */}
                            <div className="flex flex-row gap-4 pt-4">
                                <div className="h-12 bg-green-100 rounded-full animate-pulse w-32"></div>
                                <div className="h-12 bg-green-100 rounded-full animate-pulse w-32"></div>
                            </div>
                        </div>

                        {/* Right Content Skeleton */}
                        <div className="relative">
                            <div className="relative w-full h-96 flex items-center justify-center">
                                {/* Main image skeleton */}
                                <div className="w-full h-96 bg-green-100 rounded-3xl animate-pulse"></div>
                                
                                {/* Navigation buttons skeleton */}
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                    <div className="p-3 rounded-full bg-green-100 animate-pulse">
                                        <div className="w-6 h-6"></div>
                                    </div>
                                </div>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                                    <div className="p-3 rounded-full bg-green-100 animate-pulse">
                                        <div className="w-6 h-6"></div>
                                    </div>
                                </div>
                                
                                {/* Dish info skeleton */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                                    <div className="h-6 bg-green-100 rounded-full animate-pulse mb-2 w-3/4"></div>
                                    <div className="h-4 bg-green-100 rounded-full animate-pulse mb-3 w-full"></div>
                                    <div className="h-4 bg-green-100 rounded-full animate-pulse w-1/4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section Skeleton */}
                <div className="bg-white py-12">
                    <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((id) => (
                                <div key={id} className="text-center p-6 bg-green-100 rounded-2xl border border-gray-200">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl animate-pulse"></div>
                                    <div className="h-5 bg-green-100 rounded-full animate-pulse mb-2 w-3/4 mx-auto"></div>
                                    <div className="h-4 bg-green-100 rounded-full animate-pulse w-full mx-auto"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (popularDishes.length === 0) {
        return (
            <section className="relative overflow-hidden bg-gradient-to-br from-green-200 to-green-200 pt-16">
                <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <p>No dishes available</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-green-200 to-green-200 pt-16">
                <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="space-y-8"
                        >
                            <motion.h1
                                variants={fadeInUp}
                                className="text-3xl lg:text-6xl font-bold text-gray-800 leading-tight"
                            >
                                All Fast Food is<br />
                                Available at <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-500">Fadhar's</span>
                            </motion.h1>

                            <motion.div
                                variants={fadeInUp}
                                className="flex items-center space-x-4 text-gray-600"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Utensils className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <p className="font-medium">We Are Just a Click Away When You</p>
                                    <p className="text-sm">Crave For Delicious Fast Food</p>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={fadeInUp}
                                className="flex flex-row gap-4 pt-4"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r cursor-pointer from-green-500 to-green-500 text-white px-4 text-sm md:text-md md:px-8 py-2 md:py-4 rounded-full font-semibold transition-all flex items-center justify-center space-x-2"
                                >
                                    <span>Order Now</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="border-2 cursor-pointer border-black text-gray-700 px-4 text-sm md:text-md md:px-8 py-2 md:py-4 rounded-full font-semibold hover:border-green-500 hover:text-green-500 transition-all"
                                >
                                    Contact Us
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        {/* Right Content - Food Slider */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative w-full h-96 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentSlide}
                                        src={popularDishes[currentSlide].image}
                                        alt={popularDishes[currentSlide].title}
                                        className="w-full h-96 object-cover rounded-3xl"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </AnimatePresence>

                                {/* Slider Controls */}
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                    <motion.button
                                        onClick={() => setCurrentSlide((currentSlide - 1 + popularDishes.length) % popularDishes.length)}
                                        className="p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white transition-all"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </motion.button>
                                </div>

                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                                    <motion.button
                                        onClick={() => setCurrentSlide((currentSlide + 1) % popularDishes.length)}
                                        className="p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white transition-all"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </motion.button>
                                </div>

                                {/* Dish Info */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4"
                                >
                                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                        {popularDishes[currentSlide].title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        {popularDishes[currentSlide].description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-green-500">{popularDishes[currentSlide].price}</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="bg-white py-12">
                    <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map(({ id, title, desc, icon: Icon, bgColor, border, iconBg }) => (
                                <motion.div
                                    key={id}
                                    whileHover={{ y: -5 }}
                                    className={`text-center p-6 bg-gradient-to-br ${bgColor} rounded-2xl border ${border}`}
                                >
                                    <div
                                        className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${iconBg} rounded-2xl flex items-center justify-center`}
                                    >
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                                    <p className="text-gray-600 text-sm">{desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}