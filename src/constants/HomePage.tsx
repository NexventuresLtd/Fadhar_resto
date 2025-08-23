import { Truck, Utensils, Wallet } from "lucide-react";

  // Real food images from the web
  export const popularDishes = [
    {
      id: 1,
      title: "Signature Lamb Burger",
      description: "Juicy lamb patty with fresh veggies",
      price: "RWF 1128.50",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 2,
      title: "Mediterranean Pizza",
      description: "Fresh mozzarella with herbs",
      price: "RWF 11212.00",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 3,
      title: "Crispy Chicken Wings",
      description: "Golden crispy with special sauce",
      price: "RWF 1129.20",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    }
  ];

  export const menuItems = [
    { name: "Premium Burger", price: "RWF 1127.80", rating: 4.8, image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
    { name: "Chicken Pizza", price: "RWF 1124.20", rating: 4.9, image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
    { name: "Chicken Fry", price: "RWF 1125.00", rating: 4.7, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
    { name: "Club Sandwich", price: "RWF 1126.30", rating: 4.6, image: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
    { name: "Taco Trail", price: "RWF 1123.63", rating: 4.8, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
    { name: "Noodle Ramen", price: "RWF 1126.50", rating: 4.9, image: "https://images.unsplash.com/photo-1610878665011-0d2d5d16f9a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" }
  ];

  export const categories = [
    { name: "Burgers", icon: "🍔", color: "from-green-400 to-green-400" },
    { name: "Pizza", icon: "🍕", color: "from-green-400 to-green-400" },
    { name: "Fried Items", icon: "🍗", color: "from-green-400 to-green-400" }
  ];
  export  const features = [
    {
      id: 1,
      title: "Home Delivery",
      desc: "Order online and get fresh meals delivered to your door. Typical delivery window is 45–60 minutes. Choose delivery or pickup during checkout.",
      icon: Truck,
      bgColor: "from-green-50 to-green-100",
      border: "border-green-100",
      iconBg: "from-green-500 to-green-500",
    },
    {
      id: 2,
      title: "Instant Table Booking",
      desc: "Pick an available table and confirm instantly. Your booking holds for 30 minutes—if you don’t arrive, it auto-cancels and the table reopens.",
      icon: Utensils,
      bgColor: "from-green-50 to-green-100",
      border: "border-green-100",
      iconBg: "from-green-500 to-green-500",
    },
    {
      id: 3,
      title: "Quick MoMo Payment",
      desc: "Fast, secure MoMo checkout (similar to Sinc Events). Once paid, your order and booking are locked in and synced to our system.",
      icon: Wallet,
      bgColor: "from-green-50 to-green-100",
      border: "border-green-100",
      iconBg: "from-green-500 to-teal-500",
    },
  ];