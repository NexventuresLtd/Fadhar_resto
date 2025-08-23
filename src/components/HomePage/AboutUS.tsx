import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../hooks/HomePage';
import { Mail, MapPin, Phone } from 'lucide-react';
export default function AboutUS() {
    return (
        <>
            {/* About Fadhar's Section */}
            <section className="py-20 bg-stone-50">
                <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="space-y-16"
                    >
                        {/* Section Title */}
                        <motion.div variants={fadeInUp} className="text-center">
                            <h2 className="text-4xl font-bold text-stone-800 mb-4" id='about'>About Fadhar's</h2>
                        </motion.div>

                        {/* Two-column Layout */}
                        <div className="grid lg:grid-cols-2 gap-12 items-start">
                            {/* Left Column - Description */}
                            <motion.div
                                variants={fadeInUp}
                                className="space-y-6"
                            >
                                <p className="text-lg text-stone-700 leading-relaxed">
                                    Welcome to Fadhar's, where culinary tradition meets modern dining excellence.
                                    Established with a passion for authentic flavors and warm hospitality, we have
                                    been serving our community with pride for over a decade.
                                </p>

                                <p className="text-lg text-stone-700 leading-relaxed">
                                    Our restaurant is more than just a place to eat—it's a gathering space where
                                    families come together, friends reconnect, and memories are made over exceptional
                                    food. We believe that every meal should be a celebration of life's simple pleasures.
                                </p>

                                <p className="text-lg text-stone-700 leading-relaxed">
                                    At Fadhar's, we source the finest ingredients and prepare each dish with care,
                                    ensuring that every bite delivers the authentic taste and quality you deserve.
                                    Our warm, inviting atmosphere and dedicated staff make every visit a delightful
                                    experience.
                                </p>

                                <div className="pt-4">
                                    <h3 className="text-2xl font-bold text-stone-800 mb-3">Our Mission</h3>
                                    <p className="text-lg text-stone-700 leading-relaxed">
                                        To create memorable dining experiences that bring people together through
                                        exceptional food, genuine hospitality, and a welcoming atmosphere that
                                        feels like home.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Right Column - Map and Contact */}
                            <motion.div
                                variants={fadeInUp}
                                className="space-y-8"
                            >
                                {/* Map Placeholder */}
                                <div className="bg-stone-200 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-stone-200 opacity-50"></div>
                                    <div className="relative text-center space-y-2">
                                        <MapPin className="w-12 h-12 text-stone-600 mx-auto" />
                                        <p className="text-stone-600 font-medium">Interactive Map</p>
                                        <p className="text-sm text-stone-500">Fadhar's Restaurant Location</p>
                                    </div>
                                    {/* Map grid pattern */}
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                                            {[...Array(48)].map((_, i) => (
                                                <div key={i} className="border border-stone-300"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Visit Us Today</h3>

                                    <div className="space-y-4">
                                        <motion.div
                                            className="flex items-center space-x-4 group cursor-pointer"
                                            whileHover={{ x: 5 }}
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
                                            >
                                                <MapPin className="w-6 h-6 text-green-600" />
                                            </motion.div>
                                            <div id="contact">
                                                <p className="font-semibold text-stone-800">Address</p>
                                                <p className="text-stone-600">123 Culinary Street, Food District</p>
                                                <p className="text-stone-600">Downtown, City 12345</p>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            className="flex items-center space-x-4 group cursor-pointer"
                                            whileHover={{ x: 5 }}
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: -5 }}
                                                className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
                                            >
                                                <Phone className="w-6 h-6 text-green-600" />
                                            </motion.div>
                                            <div>
                                                <p className="font-semibold text-stone-800">Phone</p>
                                                <p className="text-stone-600">+250 (790) 110-231</p>
                                                <p className="text-sm text-stone-500">Call us for reservations</p>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            className="flex items-center space-x-4 group cursor-pointer"
                                            whileHover={{ x: 5 }}
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
                                            >
                                                <Mail className="w-6 h-6 text-green-600" />
                                            </motion.div>
                                            <div>
                                                <p className="font-semibold text-stone-800">Email</p>
                                                <p className="text-stone-600">hello@fadhars.com</p>
                                                <p className="text-sm text-stone-500">We'd love to hear from you</p>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Hours */}
                                    <div className="pt-6 border-t border-stone-200">
                                        <h4 className="text-lg font-bold text-stone-800 mb-3">Opening Hours</h4>
                                        <div className="space-y-2 text-stone-600">
                                            <div className="flex justify-between">
                                                <span>Monday - Thursday</span>
                                                <span className="font-medium">11:00 AM - 10:00 PM</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Friday - Saturday</span>
                                                <span className="font-medium">11:00 AM - 11:00 PM</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Sunday</span>
                                                <span className="font-medium">12:00 PM - 9:00 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Call-to-Action Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-20"
                >
                    <div className="bg-stone-800 py-12">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h3 className="text-3xl font-bold text-green-400 mb-4">
                                Ready for an Unforgettable Dining Experience?
                            </h3>
                            <p className="text-xl text-stone-300 mb-8">
                                Book your table today and discover what makes Fadhar's special
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-green-500 rounded-2xl cursor-pointer text-white px-10 py-4 text-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                            >
                                Book Your Table Today
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </section>
        </>
    )
}
