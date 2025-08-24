import { Truck, Utensils, Wallet } from "lucide-react";
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
      price: `Rwf ${(item.price / 100).toFixed(2)}`, // Format price as string
      image: item.image == "string"? "https://m.media-amazon.com/images/I/81Ty4ssA1oL.jpg" : item.image
    }));
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return [];
  }
};

 
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