import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';


const NavBar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    console.log(isMobile)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Scroll event listener
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {/* Modern Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white py-1' : 'bg-transparent backdrop-blur-sm py-4'}`}>
                <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-gray-800">Fadhar's</h1>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="/" className={`font-medium transition-colors ${isScrolled ? 'text-gray-800' : 'text-gray-700'}`}>Home</a>
                            <a href="#about" className={`transition-colors ${isScrolled ? 'text-gray-600 hover:text-orange-500' : 'text-gray-700 hover:font-medium'}`}>About Us</a>
                            <a href="#contact" className={`transition-colors ${isScrolled ? 'text-gray-600 hover:text-orange-500' : 'text-gray-700 hover:font-medium'}`}>Contact</a>
                            <a href="#" className={`transition-colors ${isScrolled ? 'text-gray-600 hover:text-orange-500' : 'text-gray-700 hover:font-medium'}`}>Deliveries</a>
                            <a href="/menu" className={`transition-colors ${isScrolled ? 'text-gray-600 hover:text-orange-500' : 'text-gray-700 hover:font-medium'}`}>Menu</a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-2 rounded-full font-medium transition-all backdrop-blur-sm bg-orange-500  text-white`}
                            >
                                Order Now
                            </motion.button>
                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className={`p-2 rounded-full ${isScrolled ? 'bg-orange-100 text-orange-600' : 'bg-orange-100 text-orange-600'}`}
                                >
                                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-white shadow-lg"
                        >
                            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                                <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-600">Home</a>
                                <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600">About Us</a>
                                <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600">Contact</a>
                                <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600">Delivers</a>
                                <a href="/menu" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600">Menu</a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    )
}

export default NavBar
