export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          service_type: string
          cat_name: string
          owner_name: string
          start_date: string
          end_date: string | null
          notes: string | null
          created_at: string
          total_fees: number | null
          contact_number: string | null
        }
        Insert: {
          id?: string
          service_type: string
          cat_name: string
          owner_name: string
          start_date: string
          end_date?: string | null
          notes?: string | null
          created_at?: string
          total_fees?: number | null
          contact_number?: string | null
        }
        Update: {
          id?: string
          service_type?: string
          cat_name?: string
          owner_name?: string
          start_date?: string
          end_date?: string | null
          notes?: string | null
          created_at?: string
          total_fees?: number | null
          contact_number?: string | null
        }
      }
    }
  }
}
