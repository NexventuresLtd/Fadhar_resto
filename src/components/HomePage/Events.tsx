import React, { useState } from 'react';
import { Calendar, Heart, Gift, Phone, MessageCircle } from 'lucide-react';
import { contactMe } from '../../app/WhatsappMessage';

// TypeScript interfaces
interface Event {
    id: number;
    title: string;
    description: string;
    images: string[];
    date: string;
    icon: React.ComponentType<{ className?: string }>;
    phone?: string;
    whatsapp?: string;
}

interface EventsCelebrationsProps {
    events?: Event[];
    className?: string;
}

// Default sample events data
const defaultEvents: Event[] = [
    {
        id: 1,
        title: "Wedding",
        description: "Make your big day extra delicious with our wedding catering. From cozy dinners to epic feasts, we serve up flavors that everyone will remember.",
        images: [
            "/images/cat1.jpeg",
            "/images/cat2.jpeg",
            "/images/cat3.jpeg"
        ],
        date: "Year Round",
        icon: Heart,
        phone: "+250783330008",
        whatsapp: "+250783330008"
    },
    {
        id: 2,
        title: "Celebrations",
        description: "Celebrate your love with food and drinks that speaks the heart. From milestone anniversaries to intimate dinners for two, we cook up the perfect flavors to match your special moments.",
        images: [
            "/images/cat4.jpeg",
            "/images/cat5.jpeg",
            "/images/cat2.jpeg"
        ],
        date: "Any Season",
        icon: Calendar,
        phone: "+250783330008",
        whatsapp: "+250783330008"
    },
    {
        id: 3,
        title: "Birthday",
        description: "Create magical birthday experiences for all ages. From children's themed parties to sophisticated adult celebrations, every birthday becomes a cherished memory.",
        images: [
            "/images/cat1.jpeg",
            "/images/cat5.jpeg",
            "/images/cat7.jpeg"
        ],
        date: "All Year",
        icon: Gift,
        phone: "+250783330008",
        whatsapp: "+250783330008"
    }
];

const EventsCelebrations: React.FC<EventsCelebrationsProps> = ({
    events = defaultEvents,
    className = ""
}) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleCall = (phoneNumber?: string) => {
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        }
    };

    const handleWhatsApp = (whatsappNumber?: string) => {
        if (whatsappNumber) {
            contactMe(whatsappNumber, "Hello, I want to enquire about your catering services")
            // window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '?msg=')}`, '_blank');
        }
    };

    return (
        <section className={`py-20 bg-white ${className}`} id="events">
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-greatvibes">
                        Events & Celebrations
                    </h2>
                    <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex justify-center mb-12 ">
                    {events.map((event, index) => {
                        const IconComponent = event.icon;
                        return (
                            <button
                                key={event.id}
                                onClick={() => setActiveTab(index)}
                                className={`flex items-center px-2 md:px-6 py-3  text-sm md:text-lg font-medium rounded-t-lg transition-all duration-300 ${activeTab === index
                                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                                    : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                                    }`}
                            >
                                <IconComponent className="w-5 h-5 mr-2" />
                                {event.title}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="space-y-20">
                    {events.map((event, index) => {
                        if (activeTab !== index) return null;

                        const IconComponent = event.icon;
                        const isEven = index % 2 === 0;

                        return (
                            <div key={event.id} className="grid lg:grid-cols-2 gap-16 items-center">
                                {/* Images Section - Left for even, Right for odd */}
                                <div className={`space-y-6 ${!isEven ? 'lg:order-2' : ''}`}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <img
                                            src={event.images[0]}
                                            alt={`${event.title} - Image 1`}
                                            className="w-full h-64 object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
                                        />
                                        <img
                                            src={event.images[1]}
                                            alt={`${event.title} - Image 2`}
                                            className="w-full h-64 object-cover rounded-2xl mt-8 hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <img
                                        src={event.images[2]}
                                        alt={`${event.title} - Image 3`}
                                        className="w-full h-72 object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Content Section - Right for even, Left for odd */}
                                <div className={`space-y-8 ${!isEven ? 'lg:order-1' : ''}`}>
                                    {/* Icon and Title */}
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-3">
                                            <IconComponent className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 font-greatvibes">
                                                {event.title}
                                            </h3>
                                            <div className="flex items-center text-red-600 mt-2">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">{event.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        {event.description}
                                    </p>

                                    {/* Mission-style box */}
                                    <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-3xl border border-red-100">
                                        <h4 className="text-2xl font-bold text-gray-900 mb-4 font-greatvibes">
                                            Why Choose Us?
                                        </h4>
                                        <p className="text-lg text-gray-700 leading-relaxed">
                                            We bring years of experience and attention to detail to make your {event.title.toLowerCase()}
                                            truly special. Every moment is crafted with care to create lasting memories.
                                        </p>
                                    </div>

                                    {/* Contact Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button
                                            onClick={() => handleCall(event.phone)}
                                            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            <Phone className="w-5 h-5 mr-2" />
                                            Call Us
                                        </button>
                                        <button
                                            onClick={() => handleWhatsApp(event.whatsapp)}
                                            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            <MessageCircle className="w-5 h-5 mr-2" />
                                            WhatsApp
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default EventsCelebrations;