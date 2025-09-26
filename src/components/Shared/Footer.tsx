import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <>
            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300 py-12">
                <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-4xl font-bold text-white mb-6 font-greatvibes">Fadhar's </h3>
                            <p className="text-gray-400 leading-relaxed">
                                Creating memorable dining experiences with authentic flavors and fast delivery.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Menu</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="/about" className="hover:text-orange-400 transition-colors">Our Menu</a></li>
                                <li><a href="/about" className="hover:text-orange-400 transition-colors">Our Order</a></li>
                                <li><a href="/about" className="hover:text-orange-400 transition-colors"> Deliveries</a></li>
                                <li><a href="/about" className="hover:text-orange-400 transition-colors">Beverages</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Information</h4>
                            <ul className="space-y-2 text-gray-400">
                                {/* <li><a href="#" className="hover:text-orange-400 transition-colors">Fadhar's Restorant</a></li> */}
                                <li><a href="#" className="hover:text-orange-400 transition-colors capitalize">pickup service</a></li>
                                <li><a href="#" className="hover:text-orange-400 transition-colors capitalize">Fast Delivery</a></li>
                                <li><a href="#" className="hover:text-orange-400 transition-colors capitalize">table booking</a></li>
                                <li><a href="/#events" className="hover:text-orange-400 transition-colors capitalize">catering services</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
                            <div className="space-y-3 text-gray-400">
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span>250 783 330 008</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4" />
                                    <span>fadharcoffeebrewers@gmail.com</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>Nyamirambo Mumarangi ,Kigali, Rwanda</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                        <div className="p-3 ml-auto flex gap-2 w-full justify-end items-center">
                            <p className="font-delius">Follow us on :</p>
                            <a href="https://www.instagram.com/fadhars_coffee_brewers/?__pwa=1" target="_blank" rel="noopener noreferrer">
                                <Instagram />
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=100087358899614" target="_blank" rel="noopener noreferrer">
                                <Facebook />
                            </a>
                            <a href="https://www.tiktok.com/@fadhar.coffee.bre" target="_blank" rel="noopener noreferrer">
                                <img
                                    src="https://www.svgrepo.com/show/447151/tiktok-outline.svg"
                                    className="w-7 filter invert"
                                />

                            </a>
                        </div>
                        <p className="text-gray-400">© {new Date().getUTCFullYear()} Fadhar's Restaurant. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}
