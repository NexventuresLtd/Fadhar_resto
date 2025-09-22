import {  HandGrab, BookMarked, BikeIcon, PartyPopperIcon} from "lucide-react";

import mainAxios from "../Instance/mainAxios";

export interface Dish {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
}

export interface ApiDish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  subcategory_name: string;
  subcategory_id: number;
}


export const fetchPopularDishes = async (): Promise<Dish[]> => {
  try {
    const response = await mainAxios.get<ApiDish[]>('/menu/');

    return response.data.map(item => ({
      id: item.id,
      title: item.name,
      description: item.description,
      price: new Intl.NumberFormat('rw', {
        style: 'currency',
        currency: 'RWF'
      }).format(item.price), // Format price as string
      image: item.image == "string" ? "https://m.media-amazon.com/images/I/81Ty4ssA1oL.jpg" : item.image
    }));
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return [];
  }
};

export const menuItems = [
  { name: "Premium Burger", price: "RWF 1127.80", rating: 4.8, image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
  { name: "Chicken Pizza", price: "RWF 1124.20", rating: 4.9, image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
  { name: "Chicken Fry", price: "RWF 1125.00", rating: 4.7, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
  { name: "Club Sandwich", price: "RWF 1126.30", rating: 4.6, image: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
  { name: "Taco Trail", price: "RWF 1123.63", rating: 4.8, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
  { name: "Noodle Ramen", price: "RWF 1126.50", rating: 4.9, image: "https://images.unsplash.com/photo-1610878665011-0d2d5d16f9a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" }
];

export const categories = [
  { name: "Burgers", icon: "🍔", color: "from-orange-400 to-orange-400" },
  { name: "Pizza", icon: "🍕", color: "from-orange-400 to-orange-400" },
  { name: "Fried Items", icon: "🍗", color: "from-orange-400 to-orange-400" }
];
export const features = [
  {
    id: 1,
    title: "Home Delivery",
    desc: "Get your favorite meals delivered hot and fresh right to your doorstep within 45–60 minutes. Flexible options for both delivery and pickup at checkout.",
    icon: BikeIcon,
    bgColor: "from-green-50 to-green-100",
    border: "border-green-100",
    iconBg: "from-green-700 to-green-700",
  },
  {
    id: 2,
    title: "Instant Table Booking",
    desc: "Reserve a table in real time with one tap. Your spot is held for 30 minutes, ensuring a smooth dining experience without waiting in line.",
    icon: BookMarked,
    bgColor: "from-teal-50 to-teal-100",
    border: "border-teal-100",
    iconBg: "from-teal-500 to-teal-500",
  },
  {
    id: 3,
    title: "Quick Pickup",
    desc: "Order ahead, pay securely, and collect without delay. Perfect for when you’re on the go and want to skip the wait.",
    icon: HandGrab,
    bgColor: "from-orange-50 to-orange-100",
    border: "border-orange-100",
    iconBg: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    title: "Events",
    desc: "Cater your weddings, birthdays, and special events with customized menus and seamless service to make your celebration memorable.",
    icon: PartyPopperIcon, // replace with the actual icon you want for events
    bgColor: "from-purple-50 to-purple-100",
    border: "border-purple-100",
    iconBg: "from-purple-500 to-purple-500",
  },
];
