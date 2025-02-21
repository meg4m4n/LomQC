export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      product_types: {
        Row: {
          id: string
          description: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      controllers: {
        Row: {
          id: string
          name: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      quality_controls: {
        Row: {
          id: string
          control_ref: string
          date: string
          model_ref: string
          brand: string
          description: string | null
          state: string
          color: string | null
          size: string | null
          product_type_id: string | null
          controller_id: string | null
          observations: string | null
          result: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          control_ref?: string
          date: string
          model_ref: string
          brand: string
          description?: string | null
          state: string
          color?: string | null
          size?: string | null
          product_type_id?: string | null
          controller_id?: string | null
          observations?: string | null
          result?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          control_ref?: string
          date?: string
          model_ref?: string
          brand?: string
          description?: string | null
          state?: string
          color?: string | null
          size?: string | null
          product_type_id?: string | null
          controller_id?: string | null
          observations?: string | null
          result?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      measurements: {
        Row: {
          id: string
          quality_control_id: string
          description: string
          expected_value: number
          actual_value: number | null
          tolerance: number
          unit: string
          size: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quality_control_id: string
          description: string
          expected_value: number
          actual_value?: number | null
          tolerance: number
          unit?: string
          size: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quality_control_id?: string
          description?: string
          expected_value?: number
          actual_value?: number | null
          tolerance?: number
          unit?: string
          size?: string
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          quality_control_id: string
          url: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quality_control_id: string
          url: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quality_control_id?: string
          url?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      photo_markings: {
        Row: {
          id: string
          photo_id: string
          x: number
          y: number
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          photo_id: string
          x: number
          y: number
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          photo_id?: string
          x?: number
          y?: number
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_control_ref: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}