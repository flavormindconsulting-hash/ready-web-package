export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      newsletter: {
        Row: {
          created_at: string
          email: string
          id: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color: string
          id: number
          order_id: number
          price: number
          product_id: number | null
          product_image: string
          product_name: string
          product_slug: string
          quantity: number
          size: string
        }
        Insert: {
          color: string
          id?: number
          order_id: number
          price: number
          product_id?: number | null
          product_image: string
          product_name: string
          product_slug: string
          quantity?: number
          size: string
        }
        Update: {
          color?: string
          id?: number
          order_id?: number
          price?: number
          product_id?: number | null
          product_image?: string
          product_name?: string
          product_slug?: string
          quantity?: number
          size?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          discount: number
          id: number
          order_number: string
          payment_status: string
          promo_code: string | null
          shipping_address: string
          shipping_city: string
          shipping_cost: number
          shipping_country: string
          shipping_method: string
          shipping_postal_code: string
          status: string
          subtotal: number
          tax: number
          total: number
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          discount?: number
          id?: number
          order_number: string
          payment_status?: string
          promo_code?: string | null
          shipping_address: string
          shipping_city: string
          shipping_cost?: number
          shipping_country: string
          shipping_method?: string
          shipping_postal_code: string
          status?: string
          subtotal: number
          tax?: number
          total: number
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          discount?: number
          id?: number
          order_number?: string
          payment_status?: string
          promo_code?: string | null
          shipping_address?: string
          shipping_city?: string
          shipping_cost?: number
          shipping_country?: string
          shipping_method?: string
          shipping_postal_code?: string
          status?: string
          subtotal?: number
          tax?: number
          total?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          care_instructions: string | null
          category: string
          colors: string | null
          compare_at_price: number | null
          created_at: string
          description: string
          details: string | null
          fit: string
          id: number
          images: string
          in_stock: boolean | null
          is_bestseller: boolean | null
          is_featured: boolean | null
          is_new: boolean | null
          material: string
          name: string
          price: number
          sizes: string
          slug: string
          subtitle: string | null
          updated_at: string
        }
        Insert: {
          care_instructions?: string | null
          category: string
          colors?: string | null
          compare_at_price?: number | null
          created_at?: string
          description: string
          details?: string | null
          fit: string
          id?: number
          images: string
          in_stock?: boolean | null
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          material: string
          name: string
          price: number
          sizes: string
          slug: string
          subtitle?: string | null
          updated_at?: string
        }
        Update: {
          care_instructions?: string | null
          category?: string
          colors?: string | null
          compare_at_price?: number | null
          created_at?: string
          description?: string
          details?: string | null
          fit?: string
          id?: number
          images?: string
          in_stock?: boolean | null
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          material?: string
          name?: string
          price?: number
          sizes?: string
          slug?: string
          subtitle?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          expires_at: string | null
          id: string
          is_enabled: boolean
          minimum_order: number
          updated_at: string
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          discount_type?: string
          expires_at?: string | null
          id?: string
          is_enabled?: boolean
          minimum_order?: number
          updated_at?: string
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          expires_at?: string | null
          id?: string
          is_enabled?: boolean
          minimum_order?: number
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          comment: string
          created_at: string
          fit_feedback: string | null
          id: number
          product_id: number
          rating: number
          title: string
          verified_purchase: boolean | null
        }
        Insert: {
          author_name: string
          comment: string
          created_at?: string
          fit_feedback?: string | null
          id?: number
          product_id: number
          rating: number
          title: string
          verified_purchase?: boolean | null
        }
        Update: {
          author_name?: string
          comment?: string
          created_at?: string
          fit_feedback?: string | null
          id?: number
          product_id?: number
          rating?: number
          title?: string
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          id: string
          is_enabled: boolean
          label: string
          platform: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          id?: string
          is_enabled?: boolean
          label: string
          platform: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Update: {
          id?: string
          is_enabled?: boolean
          label?: string
          platform?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      store_page_views: {
        Row: {
          created_at: string
          id: string
          path: string
          visit_id: string
        }
        Insert: {
          created_at?: string
          id: string
          path: string
          visit_id: string
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_page_views_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "store_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      store_visits: {
        Row: {
          id: string
          started_at: string
        }
        Insert: {
          id: string
          started_at?: string
        }
        Update: {
          id?: string
          started_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_store_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      record_store_view: {
        Args: { p_event: string; p_path: string; p_visit: string }
        Returns: undefined
      }
      reset_store: { Args: never; Returns: undefined }
      store_traffic_stats: { Args: never; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
