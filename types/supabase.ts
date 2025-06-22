export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      dishes: {
        Row: {
          id: number;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
          rating: number;
          prep_time: number;
          ingredients: string[];
          allergens: string[];
          nutrition_info: any;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
          rating?: number;
          prep_time: number;
          ingredients: string[];
          allergens?: string[];
          nutrition_info?: any;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          category?: string;
          rating?: number;
          prep_time?: number;
          ingredients?: string[];
          allergens?: string[];
          nutrition_info?: any;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: number;
          user_id: string;
          total_amount: number;
          status: string;
          delivery_address: string;
          delivery_time: string;
          payment_method: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          total_amount: number;
          status?: string;
          delivery_address: string;
          delivery_time: string;
          payment_method: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          total_amount?: number;
          status?: string;
          delivery_address?: string;
          delivery_time?: string;
          payment_method?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: number;
          dish_id: number;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          order_id: number;
          dish_id: number;
          quantity: number;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          order_id?: number;
          dish_id?: number;
          quantity?: number;
          price?: number;
          created_at?: string;
        };
      };
      saved_dishes: {
        Row: {
          id: number;
          user_id: string;
          dish_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          dish_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          dish_id?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}