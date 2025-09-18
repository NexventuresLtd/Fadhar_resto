import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState('/');
    console.log(isMobile)
    useEffect(() => {
        // Set active tab based on current path
        const path = window.location.pathname;
        const hash = window.location.hash;

        // For home page with no hash
        if (path === '/' && !hash) {
            setActiveTab('/');
        }
        // For home page with hash (like #about or #contact)
        else if (path === '/' && hash) {
            setActiveTab(hash);
        }
        // For other pages like /menu
        else {
            setActiveTab(path);
        }

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

    // Additional useEffect to handle hash changes without page reload
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (window.location.pathname === '/') {
                setActiveTab(hash || '/');
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Function to determine if a tab is active
    const isActive = (tabPath: any) => {
        return activeTab === tabPath;
    };

    return (
        <>
            {/* Modern Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white py-1' : 'bg-white backdrop-blur-sm py-1'}`}>
                <div className="max-w-full md:max-w-11/12 mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className=" h-16 w-50 md:w-64 overflow-hidden py-1">
                            <img src="fadhar.png" className='w-full h-full scale-[4.9] md:scale-[5.9] object-contain' alt="" />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8 uppercase font-poppins">
                            <a
                                href="/"
                                className={` transition-colors ${isActive('/')
                                    ? 'text-orange-500 font-semibold'
                                    : isScrolled ? 'text-gray-800' : 'text-gray-700'}`}
                            >
                                Home
                            </a>
                            <a
                                href="/menu"
                                className={`transition-colors ${isActive('/menu')
                                    ? 'text-orange-500 font-semibold'
                                    : isScrolled ? 'text-gray-600 hover:text-orange-500' : 'text-gray-700 hover:font-medium'}`}
                            >
                                Menu
                            </a>
                            <a
                                href="/#about"
                                className={`transition-colors ${isActive('#about')
                                    ? 'text-orange-500 font-semibold'
                                    : isScrolled ? 'text-gray-600 hover:text-orange-500' : 'text-gray-700 hover:font-medium'}`}
                            >
                                About Us
                            </a>
                            <a
                                href="/#contact"
                                className={`transition-colors ${isActive('#contact')
                                    ? 'text-orange-500 font-semibold'
                                    : isScrolled ? 'text-gray-600 hover:text-orange-500' : 'text-gray-700 hover:font-medium'}`}
                            >
                                Contact
                            </a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <motion.button
                                onClick={() => window.location.href = "/menu"}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-2 md:px-6 text-nowrap py-2 text-xs md:text-sm rounded-full font-medium transition-all backdrop-blur-sm bg-orange-500  text-white`}
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
                            className="md:hidden bg-white shadow-lg uppercase font-poppins"
                        >
                            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                                <a
                                    href="/"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-800 hover:bg-orange-50 hover:text-orange-600'}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </a>
                                <a
                                    href="/menu"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/menu')
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Menu
                                </a>
                                <a
                                    href="/#about"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('#about')
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    About Us
                                </a>
                                <a
                                    href="/#contact"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('#contact')
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Contact
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    )
}

export default NavBar;