import { Category, Food, Review, User } from "@/types/types";
import { supabase } from "./supabase";


export const getFoods = async (): Promise<Food[]> => {
    const { data, error } = await supabase
        .from('foods')
        .select('*');

    if (error || !data) {
        console.error(error);
        throw new Error("foods could not be loaded");
    }

    return data;
};

export const getCategories = async () => {
    let { data, error } = await supabase.from("categories").select("*");
    if (error) {
        console.error(error);
        throw new Error("categories could not be loaded");
    }
    return data;
}

export const getFoodsByCategory = async (categoryId: number) => {
    const { data, error } = await supabase
        .from("foods")
        .select("*")
        .eq("category_id", categoryId);

    if (error) {
        console.error(error);
        throw new Error("Foods could not be loaded");
    }

    return data;
};

export const getCategoryById = async (categoryId: number): Promise<Category> => {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .single();

    if (error) {
        console.error(error);
        throw new Error("Category could not be loaded");
    }

    return data;
};

export const getDishById = async (dishId: number): Promise<Food> => {
    const { data, error } = await supabase
        .from("foods")
        .select("*")
        .eq("id", dishId)
        .single();

    if (error) {
        console.error(error);
        throw new Error("Dish could not be loaded");
    }

    return data;
};


interface AddUserResponse {
    success: boolean;
    data?: User;
    error?: any;
}

export const addUser = async (user: User): Promise<AddUserResponse> => {
    const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
        .single();

    if (error) return { success: false, error };
    return { success: true, data };
};


export const checkUserLogin = async (email: string, password: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

    if (error && error.code !== 'PGRST116') {
        return { success: false, error };
    }

    if (!data) {
        return {
            success: false,
            error: { message: 'Invalid email or password.' }
        };
    }

    return {
        success: true,
        user: data
    };
};

export const addReview = async (review: Review) => {
    const { data, error } = await supabase
        .from('reviews')
        .insert([review]);

    if (error) return { success: false, error };
    return { success: true, data };
};

export const getReviewsByUserId = async (userId: number): Promise<{
    success: boolean;
    data?: Review[];
    error?: any;
}> => {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        return { success: false, error };
    }

    return { success: true, data };
};
