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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      payroll_entries: {
        Row: {
          created_at: string
          employee_id: string
          gross_pay: number
          hourly_rate: number
          hours_worked: number
          id: string
          notes: string | null
          paid: boolean
          paid_at: string | null
          period_end: string
          period_start: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          gross_pay?: number
          hourly_rate?: number
          hours_worked?: number
          id?: string
          notes?: string | null
          paid?: boolean
          paid_at?: string | null
          period_end: string
          period_start: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          gross_pay?: number
          hourly_rate?: number
          hours_worked?: number
          id?: string
          notes?: string | null
          paid?: boolean
          paid_at?: string | null
          period_end?: string
          period_start?: string
          updated_at?: string
        }
        Relationships: []
      }
      price_submissions: {
        Row: {
          ai_estimate_high: number | null
          ai_estimate_low: number | null
          ai_reasoning: string | null
          brand: string
          category: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          photos: string[]
          size: string
          status: Database["public"]["Enums"]["submission_status"]
          use_description: string
        }
        Insert: {
          ai_estimate_high?: number | null
          ai_estimate_low?: number | null
          ai_reasoning?: string | null
          brand: string
          category?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          photos?: string[]
          size: string
          status?: Database["public"]["Enums"]["submission_status"]
          use_description: string
        }
        Update: {
          ai_estimate_high?: number | null
          ai_estimate_low?: number | null
          ai_reasoning?: string | null
          brand?: string
          category?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          photos?: string[]
          size?: string
          status?: Database["public"]["Enums"]["submission_status"]
          use_description?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          ai_suggested_price: number | null
          brand: string | null
          category: string
          condition: Database["public"]["Enums"]["product_condition"]
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_hot: boolean
          name: string
          photos: string[]
          price: number
          size: string | null
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
        }
        Insert: {
          ai_suggested_price?: number | null
          brand?: string | null
          category: string
          condition?: Database["public"]["Enums"]["product_condition"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_hot?: boolean
          name: string
          photos?: string[]
          price: number
          size?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Update: {
          ai_suggested_price?: number | null
          brand?: string | null
          category?: string
          condition?: Database["public"]["Enums"]["product_condition"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_hot?: boolean
          name?: string
          photos?: string[]
          price?: number
          size?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      shifts: {
        Row: {
          created_at: string
          employee_id: string
          end_time: string
          id: string
          notes: string | null
          role: string | null
          shift_date: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          end_time: string
          id?: string
          notes?: string | null
          role?: string | null
          shift_date: string
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          end_time?: string
          id?: string
          notes?: string | null
          role?: string | null
          shift_date?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          permission: Database["public"]["Enums"]["app_permission"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          permission: Database["public"]["Enums"]["app_permission"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["app_permission"]
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      has_permission: {
        Args: {
          _permission: Database["public"]["Enums"]["app_permission"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_permission:
        | "post_to_feed"
        | "use_estimation"
        | "manage_payroll"
        | "manage_schedule"
      app_role: "admin" | "employee"
      product_condition: "Excellent" | "Good" | "Fair"
      product_status: "draft" | "published" | "sold"
      submission_status: "pending" | "reviewed" | "declined"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_permission: [
        "post_to_feed",
        "use_estimation",
        "manage_payroll",
        "manage_schedule",
      ],
      app_role: ["admin", "employee"],
      product_condition: ["Excellent", "Good", "Fair"],
      product_status: ["draft", "published", "sold"],
      submission_status: ["pending", "reviewed", "declined"],
    },
  },
} as const
