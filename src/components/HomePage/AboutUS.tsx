import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, Star, Users, Award } from 'lucide-react';
import { fadeIn, scaleUp, slideUp, staggerContainer } from '../../constants/annimations';

export default function AboutUS() {
    // Animation variants for reusability


    return (
        <>
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
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
                                    src="https://imgs.search.brave.com/qN5ThxnhL2nN-tx0RMLIIN0dcYKZ6DBKeXjoMzOGx2w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9jaGVm/LTI0Nzc5MzgzLmpw/Zw"
                                    alt="Chef preparing food"
                                    className="w-full h-64 object-cover rounded-2xl"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                />
                                <motion.img
                                    src="https://imgs.search.brave.com/spmGQJ8nmwPFfj69KzHiaiWABvq97SWpuKpuRdXbKS8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0LzI5LzIyLzMz/LzM2MF9GXzQyOTIy/MzM2MF9LTXhIR0hY/ZUwyT1RFZko2Umda/ZkY2V09UT2JTYmNv/bS5qcGc"
                                    alt="Delicious food plating"
                                    className="w-full h-64 object-cover rounded-2xl mt-8"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                />
                            </motion.div>
                            <motion.img
                                src="https://imgs.search.brave.com/spmGQJ8nmwPFfj69KzHiaiWABvq97SWpuKpuRdXbKS8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0LzI5LzIyLzMz/LzM2MF9GXzQyOTIy/MzM2MF9LTXhIR0hY/ZUwyT1RFZko2Umda/ZkY2V09UT2JTYmNv/bS5qcGc"
                                alt="Happy customers dining"
                                className="w-full h-48 object-cover rounded-2xl"
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
                                    src="https://imgs.search.brave.com/Xw3jpOiThhzYz6G00WQgzayGqr_0_FjgVz-svZ1CJEo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9jaGVmLXByZXBh/cmVzLWZvb2Qta2l0/Y2hlbi13aXRoLWJv/d2wtcmljZS12ZWdl/dGFibGVzXzEyNzY5/MTMtMjgzODIuanBn/P3NlbXQ9YWlzX2h5/YnJpZCZ3PTc0MCZx/PTgw"
                                    alt="Fadhar's "
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
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
                                    src="https://imgs.search.brave.com/YNBpR5ULts4zExYDMqjJNWU0YFz9ecpH0R5Grvr5LAI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9iaXlv/cG9zLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8wNy9m/YW1vdXMtYWZyaWNh/bi1jaGVmcy1jb29r/aW5nLXRvZ2V0aGVy/LnBuZw"
                                    alt="Expert chefs"
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
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
                                    src="https://imgs.search.brave.com/gJuiVAtl8gXA4EtUPR3IZ_HmfuZbR4Ork7AwnHpFGcc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA3LzE0LzE4LzYz/LzM2MF9GXzcxNDE4/NjMxOV9sWEFkUFF1/Um83QkZsdWQzSUZz/RWdtVjVkTnZGT0Qz/dy5qcGc"
                                    alt="Warm atmosphere"
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
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
                                        <p className="text-gray-600">123 Culinary Street, Food District</p>
                                        <p className="text-gray-600">Downtown, City 12345</p>
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
                                        <p className="text-gray-600">+250 (790) 110-231</p>
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
                                        <p className="text-gray-600">hello@fadhars.com</p>
                                        <p className="text-sm text-gray-500">We'd love to hear from you</p>
                                    </div>
                                </motion.div>
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
                                        <span className="text-gray-700 font-medium">Monday - Thursday</span>
                                        <span className="font-bold text-gray-900">11:00 AM - 10:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-700 font-medium">Friday - Saturday</span>
                                        <span className="font-bold text-gray-900">11:00 AM - 11:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-700 font-medium">Sunday</span>
                                        <span className="font-bold text-gray-900">12:00 PM - 9:00 PM</span>
                                    </div>
                                </div>
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
                                <motion.img
                                    src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                    alt="Restaurant location"
                                    className="w-full h-full object-cover rounded-3xl"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                />
                                <div className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <MapPin className="w-16 h-16 mx-auto mb-4" />
                                        <p className="text-xl font-semibold">Find Us Here</p>
                                        <p className="text-sm opacity-90">Click to view on map</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                className="bg-gray-50 p-8 rounded-3xl"
                                variants={slideUp}
                                whileHover={{ 
                                    y: -5,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Getting Here</h3>
                                <div className="space-y-3 text-gray-600">
                                    <p>🚗 Free parking available</p>
                                    <p>🚌 Bus stop 2 minutes walk</p>
                                    <p>🚇 Metro station 5 minutes walk</p>
                                    <p>♿ Wheelchair accessible entrance</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
                className="py-20 bg-gradient-to-r from-slate-900 to-green-900 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeIn}
            >
                <div className="absolute inset-0 bg-black/80">
                    <motion.img
                        src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Restaurant dining"
                        className="w-full h-full object-cover opacity-30"
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
                        <span className="text-orange-400"> Dining Experience?</span>
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
        </>
    );
}