
import { motion } from 'framer-motion';
import { Utensils, Star, Clock, ChevronDown } from 'lucide-react';

const MenuHero = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-orange-100 to-red-100 pt-16 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center space-y-8"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
          >
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Delicious Menu</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover a world of flavors crafted with the finest ingredients and prepared with passion by our expert chefs.
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 pt-6"
          >
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
              <Utensils className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-gray-700">100+ Menu Items</span>
            </div>
            
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
              <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
              <span className="text-gray-700">Healthy first</span>
            </div>
            
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
              <Clock className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-gray-700">Freshly Prepared</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center py-6">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-400"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </div>
      
      {/* Floating food icons */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-10 text-4xl opacity-20 hidden md:block"
      >
        🍔
      </motion.div>
      
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        className="absolute top-32 right-16 text-5xl opacity-20 hidden md:block"
      >
        🍕
      </motion.div>
      
      <motion.div
        animate={{ y: [-15, 15, -15], rotate: [-3, 3, -3] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 left-24 text-3xl opacity-20 hidden md:block"
      >
        🍗
      </motion.div>
      
      <motion.div
        animate={{ y: [15, -15, 15], rotate: [3, -3, 3] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
        className="absolute bottom-32 right-20 text-4xl opacity-20 hidden md:block"
      >
        🥗
      </motion.div>
    </section>
  );
};

export default MenuHero;