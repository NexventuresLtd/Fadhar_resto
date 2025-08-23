import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <>
            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300 py-12">
                <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6">Fadhar's</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Creating memorable dining experiences with authentic flavors and fast delivery.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Menu</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-green-400 transition-colors">Burgers</a></li>
                                <li><a href="#" className="hover:text-green-400 transition-colors">Pizza</a></li>
                                <li><a href="#" className="hover:text-green-400 transition-colors">Fried Items</a></li>
                                <li><a href="#" className="hover:text-green-400 transition-colors">Beverages</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Information</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-green-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-green-400 transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-green-400 transition-colors">Fast Delivery</a></li>
                                <li><a href="#" className="hover:text-green-400 transition-colors">Terms</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
                            <div className="space-y-3 text-gray-400">
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span>+250 (790) 110-231</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4" />
                                    <span>info@fadhars.com</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>123 Restaurant St, City</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                        <p className="text-gray-400">© {new Date().getUTCFullYear()} Fadhar's Restaurant. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}
