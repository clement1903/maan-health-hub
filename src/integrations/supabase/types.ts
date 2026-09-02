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
      care_journeys: {
        Row: {
          condition_en: string
          condition_fr: string
          created_at: string
          delivery: Json | null
          doctor_id: string | null
          domain: string
          follow_up: Json
          id: string
          order_id: string | null
          photos_enabled: boolean
          plan: Json | null
          progress: Json | null
          questionnaire_id: string | null
          stage_index: number
          stages: Json
          status: string
          title: string
          treatment: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          condition_en?: string
          condition_fr?: string
          created_at?: string
          delivery?: Json | null
          doctor_id?: string | null
          domain?: string
          follow_up?: Json
          id?: string
          order_id?: string | null
          photos_enabled?: boolean
          plan?: Json | null
          progress?: Json | null
          questionnaire_id?: string | null
          stage_index?: number
          stages?: Json
          status?: string
          title: string
          treatment?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          condition_en?: string
          condition_fr?: string
          created_at?: string
          delivery?: Json | null
          doctor_id?: string | null
          domain?: string
          follow_up?: Json
          id?: string
          order_id?: string | null
          photos_enabled?: boolean
          plan?: Json | null
          progress?: Json | null
          questionnaire_id?: string | null
          stage_index?: number
          stages?: Json
          status?: string
          title?: string
          treatment?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_journeys_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_journeys_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_journeys_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          active: boolean
          big: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          role_en: string
          role_fr: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          big?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          role_en?: string
          role_fr?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          big?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          role_en?: string
          role_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          id: string
          issued_at: string
          issued_by: string | null
          kind: string
          order_id: string | null
          summary: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          kind?: string
          order_id?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          kind?: string
          order_id?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          created_at: string
          id: string
          note: string | null
          order_id: string | null
          scheduled_for: string
          status: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string | null
          scheduled_for: string
          status?: string
          topic?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string | null
          scheduled_for?: string
          status?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_actions: {
        Row: {
          created_at: string
          cta_en: string
          cta_fr: string
          desc_en: string
          desc_fr: string
          done: boolean
          due_en: string | null
          due_fr: string | null
          id: string
          journey_id: string | null
          priority: string
          target: string
          title_en: string
          title_fr: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cta_en?: string
          cta_fr?: string
          desc_en?: string
          desc_fr?: string
          done?: boolean
          due_en?: string | null
          due_fr?: string | null
          id?: string
          journey_id?: string | null
          priority?: string
          target?: string
          title_en: string
          title_fr: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cta_en?: string
          cta_fr?: string
          desc_en?: string
          desc_fr?: string
          done?: boolean
          due_en?: string | null
          due_fr?: string | null
          id?: string
          journey_id?: string | null
          priority?: string
          target?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_actions_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "care_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_measurements: {
        Row: {
          created_at: string
          id: string
          journey_id: string
          kind: string
          recorded_at: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          journey_id: string
          kind?: string
          recorded_at?: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          journey_id?: string
          kind?: string
          recorded_at?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "journey_measurements_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "care_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_messages: {
        Row: {
          author: string
          author_name: string | null
          body_en: string
          body_fr: string
          created_at: string
          id: string
          journey_id: string | null
          read_at: string | null
          request: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          author: string
          author_name?: string | null
          body_en: string
          body_fr: string
          created_at?: string
          id?: string
          journey_id?: string | null
          read_at?: string | null
          request?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          author?: string
          author_name?: string | null
          body_en?: string
          body_fr?: string
          created_at?: string
          id?: string
          journey_id?: string | null
          read_at?: string | null
          request?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_messages_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "care_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_photos: {
        Row: {
          created_at: string
          id: string
          journey_id: string
          label_en: string
          label_fr: string
          src: string | null
          taken_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          journey_id: string
          label_en?: string
          label_fr?: string
          src?: string | null
          taken_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          journey_id?: string
          label_en?: string
          label_fr?: string
          src?: string | null
          taken_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_photos_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "care_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          order_id: string | null
          read_at: string | null
          sender_id: string
          sender_role: string
          topic: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          order_id?: string | null
          read_at?: string | null
          sender_id: string
          sender_role: string
          topic?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          order_id?: string | null
          read_at?: string | null
          sender_id?: string
          sender_role?: string
          topic?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          channel: string
          created_at: string
          error: string | null
          id: string
          order_id: string | null
          recipient: string | null
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          channel?: string
          created_at?: string
          error?: string | null
          id?: string
          order_id?: string | null
          recipient?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          error?: string | null
          id?: string
          order_id?: string | null
          recipient?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_events: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          label: string
          order_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          label: string
          order_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          label?: string
          order_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_cents: number
          carrier: string | null
          created_at: string
          delivery_address: Json | null
          delivery_eta_max_days: number | null
          delivery_eta_min_days: number | null
          delivery_method: string
          id: string
          paid_at: string | null
          payment_reference: string | null
          payment_status: string
          questionnaire_id: string | null
          reference: string
          status: string
          tracking_number: string | null
          treatment: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents?: number
          carrier?: string | null
          created_at?: string
          delivery_address?: Json | null
          delivery_eta_max_days?: number | null
          delivery_eta_min_days?: number | null
          delivery_method?: string
          id?: string
          paid_at?: string | null
          payment_reference?: string | null
          payment_status?: string
          questionnaire_id?: string | null
          reference: string
          status?: string
          tracking_number?: string | null
          treatment: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          carrier?: string | null
          created_at?: string
          delivery_address?: Json | null
          delivery_eta_max_days?: number | null
          delivery_eta_min_days?: number | null
          delivery_method?: string
          id?: string
          paid_at?: string | null
          payment_reference?: string | null
          payment_status?: string
          questionnaire_id?: string | null
          reference?: string
          status?: string
          tracking_number?: string | null
          treatment?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_notifications: {
        Row: {
          created_at: string
          id: string
          journey_id: string | null
          read: boolean
          title_en: string
          title_fr: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          journey_id?: string | null
          read?: boolean
          title_en: string
          title_fr: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          journey_id?: string | null
          read?: boolean
          title_en?: string
          title_fr?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_notifications_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "care_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          notify_email: boolean
          notify_sms: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          notify_email?: boolean
          notify_sms?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          notify_email?: boolean
          notify_sms?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      questionnaire_drafts: {
        Row: {
          answers: Json
          created_at: string
          current_question_id: string | null
          definition_id: string
          id: string
          updated_at: string
          user_id: string
          version: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          current_question_id?: string | null
          definition_id: string
          id?: string
          updated_at?: string
          user_id: string
          version: string
        }
        Update: {
          answers?: Json
          created_at?: string
          current_question_id?: string | null
          definition_id?: string
          id?: string
          updated_at?: string
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      questionnaires: {
        Row: {
          answers: Json
          category: string
          created_at: string
          definition_id: string | null
          edit_log: Json
          id: string
          overall_signal: string
          shown_questions: Json
          status: string
          submitted_at: string | null
          triggered_rules: Json
          updated_at: string
          user_id: string
          version: string | null
        }
        Insert: {
          answers?: Json
          category: string
          created_at?: string
          definition_id?: string | null
          edit_log?: Json
          id?: string
          overall_signal?: string
          shown_questions?: Json
          status?: string
          submitted_at?: string | null
          triggered_rules?: Json
          updated_at?: string
          user_id: string
          version?: string | null
        }
        Update: {
          answers?: Json
          category?: string
          created_at?: string
          definition_id?: string | null
          edit_log?: Json
          id?: string
          overall_signal?: string
          shown_questions?: Json
          status?: string
          submitted_at?: string | null
          triggered_rules?: Json
          updated_at?: string
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      queue_notification: {
        Args: {
          _body: string
          _order_id: string
          _subject: string
          _user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "patient"
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
      app_role: ["admin", "patient"],
    },
  },
} as const
