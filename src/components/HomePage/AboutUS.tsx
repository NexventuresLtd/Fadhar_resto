import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, Star, Users, Award } from 'lucide-react';
import { fadeIn, scaleUp, slideUp, staggerContainer } from '../../constants/annimations';
import EventsCelebrations from './Events';

export default function AboutUS() {
    // Animation variants for reusability


    return (
        <>

            {/* CTA Section */}
            <motion.section
                className="py-20 h-[700px] flex items-center relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeIn}
            >
                <div className="absolute inset-0 bg-black/70">
                    <motion.img
                        src="/images/img1.JPG"
                        alt="Restaurant dining"
                        className="w-full h-full object-cover object-top aspect-video opacity-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ duration: 1.5 }}
                    />
                </div>

                <motion.div
                    className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    variants={staggerContainer}
                >
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-white mb-6 font-greatvibes"
                        variants={slideUp}
                    >
                        Ready for an Unforgettable
                        <p className="text-orange-400 mt-2"> Dining Experience?</p>
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed"
                        variants={slideUp}
                    >
                        Book your table today and discover what makes Fadhar's a culinary destination
                        that creates lasting memories
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        variants={staggerContainer}
                    >
                        <motion.button
                            onClick={() => window.location.href = "/menu"}
                            className="bg-orange-500 text-white px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
                            variants={scaleUp}
                            whileHover={{
                                scale: 1.05,
                                transition: { type: "spring", stiffness: 400 }
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Book Your Table
                        </motion.button>
                        <motion.button
                            onClick={() => window.location.href = "/menu"}
                            className="bg-transparent text-white px-8 py-4 text-lg font-semibold rounded-2xl ring-2 ring-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                            variants={scaleUp}
                            whileHover={{
                                scale: 1.05,
                                transition: { type: "spring", stiffness: 400 }
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View Our Menu
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.section>
            <EventsCelebrations />
            {/* Hero Section */}
            <motion.section
                className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 hidden"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
                {/* Background Image */}
                <div className="absolute inset-0 bg-black/40">
                    <motion.img
                        src="/images/img2.JPG"
                        alt="Restaurant Interior"
                        className="w-full h-full object-cover opacity-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ duration: 1.5 }}
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex items-center min-h-screen">
                    <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <motion.div
                            className="text-center max-w-4xl mx-auto"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.h1
                                className="text-5xl md:text-11/12 font-bold text-white mb-6 leading-tight"
                                variants={slideUp}
                            >
                                About <span className="text-orange-400">Fadhar's</span>
                            </motion.h1>
                            <motion.p
                                className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed"
                                variants={slideUp}
                            >
                                Where culinary tradition meets modern dining excellence
                            </motion.p>
                            <motion.div
                                className="flex flex-wrap justify-center gap-6 text-green-500"
                                variants={staggerContainer}
                            >
                                <motion.div
                                    className="flex items-center gap-2"
                                    variants={slideUp}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-semibold">Premium Quality</span>
                                </motion.div>
                                <motion.div
                                    className="flex items-center gap-2"
                                    variants={slideUp}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Users className="w-5 h-5" />
                                    <span className="font-semibold">Family Owned</span>
                                </motion.div>
                                <motion.div
                                    className="flex items-center gap-2"
                                    variants={slideUp}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Award className="w-5 h-5" />
                                    <span className="font-semibold">Award Winning</span>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Story Section */}
            <motion.section
                className="py-20 bg-white"
                id='about'
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeIn}
            >
                <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left - Images */}
                        <motion.div
                            className="space-y-6"
                            variants={staggerContainer}
                        >
                            <motion.div
                                className="grid grid-cols-2 gap-4"
                                variants={slideUp}
                            >
                                <motion.img
                                    src="/images/img2.JPG"
                                    alt="Chef preparing food"
                                    className="w-full h-64 object-cover rounded-2xl"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                />
                                <motion.img
                                    src="/images/img3.JPG"
                                    alt="Delicious food plating"
                                    className="w-full h-64 object-cover rounded-2xl mt-8"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                />
                            </motion.div>
                            <motion.img
                                src="/images/img8.JPG"
                                alt="Happy customers dining"
                                className="w-full h-72 object-cover rounded-2xl"
                                variants={slideUp}
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                        </motion.div>

                        {/* Right - Content */}
                        <motion.div
                            className="space-y-8"
                            variants={staggerContainer}
                        >
                            <motion.div variants={slideUp}>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-greatvibes" id="about">
                                    Our Story
                                </h2>
                                <div className="w-20 h-1 bg-orange-400 mb-8"></div>
                            </motion.div>

                            <motion.p className="text-lg text-gray-700 leading-relaxed" variants={slideUp}>
                                Welcome to Fadhar's, where culinary tradition meets modern dining excellence.
                                Established with a passion for authentic flavors and warm hospitality, we have
                                been serving our community with pride for over a decade.
                            </motion.p>

                            <motion.p className="text-lg text-gray-700 leading-relaxed" variants={slideUp}>
                                Our restaurant is more than just a place to eat—it's a gathering space where
                                families come together, friends reconnect, and memories are made over exceptional
                                food. We believe that every meal should be a celebration of life's simple pleasures.
                            </motion.p>

                            <motion.div
                                className="bg-green-50 p-8 rounded-3xl"
                                variants={slideUp}
                                whileHover={{
                                    scale: 1.02,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-greatvibes">Our Mission</h3>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    To create memorable dining experiences that bring people together through
                                    exceptional food, genuine hospitality, and a welcoming atmosphere that
                                    feels like home.
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-2 gap-6 pt-4 hidden">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-500 mb-2">10+</div>
                                    <div className="text-gray-600">Years of Excellence</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-500 mb-2">5000+</div>
                                    <div className="text-gray-600">Happy Customers</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Experience Section */}
            <motion.section
                className="py-20 bg-gradient-to-r from-gray-50 to-orange-50"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeIn}
            >
                <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        variants={slideUp}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-greatvibes">
                            The Fadhar's Experience
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Every detail is crafted to ensure your dining experience is nothing short of extraordinary
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                    >
                        <motion.div
                            className="text-center group"
                            variants={scaleUp}
                            whileHover={{ y: -10 }}
                        >
                            <div className="relative mb-6 overflow-hidden rounded-3xl">
                                <motion.img
                                    src="/images/img1.JPG"
                                    alt="Fadhar's "
                                    className="w-full h-64 md:h-92 object-cover transition-transform duration-300 group-hover:scale-105"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-greatvibes">Fadhar's Owner</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Fadhar is a visionary leader in the culinary world, dedicated to creating exceptional dining experiences.
                            </p>
                        </motion.div>

                        <motion.div
                            className="text-center group"
                            variants={scaleUp}
                            whileHover={{ y: -10 }}
                        >
                            <div className="relative mb-6 overflow-hidden rounded-3xl">
                                <motion.img
                                    src="/images/img2.JPG"
                                    alt="Expert chefs"
                                    className="w-full h-64 md:h-92 object-cover transition-transform duration-300 group-hover:scale-105"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-greatvibes">Expert Chefs</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our experienced culinary team brings years of expertise and passion to every
                                plate, creating dishes that tell a story.
                            </p>
                        </motion.div>

                        <motion.div
                            className="text-center group"
                            variants={scaleUp}
                            whileHover={{ y: -10 }}
                        >
                            <div className="relative mb-6 overflow-hidden rounded-3xl">
                                <motion.img
                                    src="/images/img4.JPG"
                                    alt="Warm atmosphere"
                                    className="w-full h-64 md:h-92 object-cover transition-transform duration-300 group-hover:scale-105"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-greatvibes">Warm Atmosphere</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our thoughtfully designed space creates the perfect ambiance for intimate
                                dinners, celebrations, and memorable moments.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
                className="py-20 bg-white"
                id="contact"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeIn}
            >
                <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Left - Contact Info */}
                        <motion.div
                            className="space-y-8"
                            variants={staggerContainer}
                        >
                            <motion.div variants={slideUp}>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-greatvibes">
                                    Visit Us Today
                                </h2>
                                <p className="text-xl text-gray-600 mb-8">
                                    We can't wait to welcome you to the Fadhar's family
                                </p>
                            </motion.div>

                            <motion.div
                                className="space-y-6"
                                variants={staggerContainer}
                            >
                                <motion.div
                                    className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors duration-300"
                                    variants={slideUp}
                                    whileHover={{
                                        x: 10,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">Address</p>
                                        <p className="text-gray-600">Nyamirambo Mumarangi </p>
                                        <p className="text-gray-600">Kigali, Rwanda</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors duration-300"
                                    variants={slideUp}
                                    whileHover={{
                                        x: 10,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">Phone</p>
                                        <p className="text-gray-600">+250 794 285 876</p>
                                        <p className="text-sm text-gray-500">Call us for reservations</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors duration-300"
                                    variants={slideUp}
                                    whileHover={{
                                        x: 10,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">Email</p>
                                        <p className="text-gray-600">fadharcoffeebrewers@gmail.com</p>
                                        <p className="text-sm text-gray-500">We'd love to hear from you</p>
                                    </div>
                                </motion.div>
                            </motion.div>


                        </motion.div>

                        {/* Right - Map */}
                        <motion.div
                            className="space-y-6"
                            variants={staggerContainer}
                        >
                            <motion.div
                                className="bg-gradient-to-br from-gray-100 to-green-100 rounded-3xl h-96 flex items-center justify-center relative overflow-hidden"
                                variants={scaleUp}
                                whileHover={{
                                    scale: 1.02,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.469946284573!2d30.06083818292095!3d-1.965920771819769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca53429d10169%3A0xa6ff535b26e71173!2sFadhar&#39;s%20coffee%20brewers!5e0!3m2!1sen!2srw!4v1758536954034!5m2!1sen!2srw"
                                    className="w-full h-full" loading="lazy" ></iframe>
                            </motion.div>
                            {/* Hours */}
                            <motion.div
                                className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl"
                                variants={slideUp}
                                whileHover={{
                                    scale: 1.02,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <div className="flex items-center mb-6">
                                    <Clock className="w-8 h-8 text-green-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900 font-greatvibes">Opening Hours</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-700 font-medium">Monday - Sunday</span>
                                        <span className="font-bold text-gray-900">10:00 AM - 23:00 PM</span>
                                    </div>
                                </div>
                            </motion.div>

                        </motion.div>
                    </div>
                </div>
            </motion.section>

        </>
    );
}