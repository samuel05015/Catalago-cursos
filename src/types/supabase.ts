// Definição de tipos gerada pela Supabase
// Representa a estrutura do banco de dados

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_clicks: {
        Row: {
          clicked_at: string
          course_id: string
          id: number
          ip_hash: string | null
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          course_id: string
          id?: number
          ip_hash?: string | null
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          course_id?: string
          id?: number
          ip_hash?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_clicks_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      course_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      course_tag_map: {
        Row: {
          course_id: string
          tag_id: string
        }
        Insert: {
          course_id: string
          tag_id: string
        }
        Update: {
          course_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_tag_map_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_tag_map_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "course_tags"
            referencedColumns: ["id"]
          }
        ]
      }
      course_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category_id: string | null
          created_at: string
          full_description: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          is_published: boolean
          owner_id: string
          payment_url: string | null
          price_display: string | null
          published_at: string | null
          short_description: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          full_description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          owner_id: string
          payment_url?: string | null
          price_display?: string | null
          published_at?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          full_description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          owner_id?: string
          payment_url?: string | null
          price_display?: string | null
          published_at?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "course_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_published_courses: {
        Args: {
          search_query?: string
          category_slug?: string
          tag_slug?: string
          page_number?: number
          page_size?: number
        }
        Returns: {
          id: string
          title: string
          slug: string
          short_description: string
          image_url: string
          price_display: string
          is_featured: boolean
          category_id: string
          category_name: string
          category_slug: string
          created_at: string
          total_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos para os retornos da API do Supabase
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]