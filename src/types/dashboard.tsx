// Types
export interface Category {
    id: string;
    name: string;
    description?: string;
    subcategories: Subcategory[];
}

export interface Subcategory {
    id: string;
    name: string;
    description?: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    subcategory?: string;
    available: boolean;
}

export interface Table {
    id: string;
    number: number;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved';
}

export interface Order {
    id: string;
    tableId: string;
    items: OrderItem[];
    status: 'pending' | 'preparing' | 'completed' | 'served' | 'paid';
    total: number;
    createdAt: Date;
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    method: 'cash' | 'card' | 'online';
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
}
