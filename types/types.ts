export interface Category {
    id: number;
    name: string;
    description: string;
    image_url: string;
}

export interface Food {
    id: number;
    name: string;
    description: string;
    image_url: string;
    price?: number;
    rating?: number;
    nutritional_info?: string;
}

export interface CartItem {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    category: string;
}

export interface SavedItem {
    id: number;
    name: string;
    image: string;
    price: number;
    rating: number;
    category: string;
    description: string;
}

export interface Payment {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
}

export interface User {
    id?: number;
    email: string;
    full_name: string;
    password: string;
    phone?: string;
    avatar_url: string;
    created_at?: string;
}

export interface Review {
    id?: number;
    rating: number;
    user_id: number;
    created_at?: string;
    description: string;
}