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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      api_rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          ip_address: unknown | null
          request_count: number | null
          updated_at: string | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address?: unknown | null
          request_count?: number | null
          updated_at?: string | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: unknown | null
          request_count?: number | null
          updated_at?: string | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      camera_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          authorized: boolean
          camera_id: string | null
          id: string
          ip_address: unknown | null
          project_id: string | null
          session_duration: unknown | null
          stream_url_accessed: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          authorized?: boolean
          camera_id?: string | null
          id?: string
          ip_address?: unknown | null
          project_id?: string | null
          session_duration?: unknown | null
          stream_url_accessed?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          authorized?: boolean
          camera_id?: string | null
          id?: string
          ip_address?: unknown | null
          project_id?: string | null
          session_duration?: unknown | null
          stream_url_accessed?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "camera_access_log_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "cameras"
            referencedColumns: ["id"]
          },
        ]
      }
      cameras: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          project_id: string | null
          stream_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          project_id?: string | null
          stream_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          project_id?: string | null
          stream_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cameras_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          actual_delivery_time: string | null
          builder_id: string | null
          created_at: string
          delivery_address: string
          delivery_date: string | null
          driver_name: string | null
          driver_phone: string | null
          estimated_delivery_time: string | null
          id: string
          material_type: string
          notes: string | null
          pickup_address: string
          pickup_date: string | null
          project_id: string | null
          quantity: number
          status: string | null
          supplier_id: string | null
          tracking_number: string | null
          updated_at: string
          vehicle_details: string | null
          weight_kg: number | null
        }
        Insert: {
          actual_delivery_time?: string | null
          builder_id?: string | null
          created_at?: string
          delivery_address: string
          delivery_date?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          estimated_delivery_time?: string | null
          id?: string
          material_type: string
          notes?: string | null
          pickup_address: string
          pickup_date?: string | null
          project_id?: string | null
          quantity: number
          status?: string | null
          supplier_id?: string | null
          tracking_number?: string | null
          updated_at?: string
          vehicle_details?: string | null
          weight_kg?: number | null
        }
        Update: {
          actual_delivery_time?: string | null
          builder_id?: string | null
          created_at?: string
          delivery_address?: string
          delivery_date?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          estimated_delivery_time?: string | null
          id?: string
          material_type?: string
          notes?: string | null
          pickup_address?: string
          pickup_date?: string | null
          project_id?: string | null
          quantity?: number
          status?: string | null
          supplier_id?: string | null
          tracking_number?: string | null
          updated_at?: string
          vehicle_details?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_access_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          sensitive_fields_accessed: string[] | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          sensitive_fields_accessed?: string[] | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          sensitive_fields_accessed?: string[] | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      delivery_acknowledgements: {
        Row: {
          acknowledged_by: string
          acknowledgement_date: string
          acknowledger_id: string
          comments: string | null
          created_at: string
          delivery_note_id: string
          digital_signature: string
          id: string
          payment_method: string | null
          payment_reference: string | null
          payment_status: string
          signed_document_path: string | null
          updated_at: string
        }
        Insert: {
          acknowledged_by: string
          acknowledgement_date?: string
          acknowledger_id: string
          comments?: string | null
          created_at?: string
          delivery_note_id: string
          digital_signature: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          signed_document_path?: string | null
          updated_at?: string
        }
        Update: {
          acknowledged_by?: string
          acknowledgement_date?: string
          acknowledger_id?: string
          comments?: string | null
          created_at?: string
          delivery_note_id?: string
          digital_signature?: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          signed_document_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_acknowledgements_acknowledger_id_fkey"
            columns: ["acknowledger_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_acknowledgements_delivery_note_id_fkey"
            columns: ["delivery_note_id"]
            isOneToOne: false
            referencedRelation: "delivery_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_communications: {
        Row: {
          content: string | null
          created_at: string
          delivery_request_id: string | null
          id: string
          message_type: string
          metadata: Json | null
          read_by: Json | null
          sender_id: string
          sender_name: string
          sender_type: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          delivery_request_id?: string | null
          id?: string
          message_type: string
          metadata?: Json | null
          read_by?: Json | null
          sender_id: string
          sender_name: string
          sender_type: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          delivery_request_id?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          read_by?: Json | null
          sender_id?: string
          sender_name?: string
          sender_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_communications_delivery_request_id_fkey"
            columns: ["delivery_request_id"]
            isOneToOne: false
            referencedRelation: "delivery_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_note_signatures: {
        Row: {
          created_at: string
          delivery_note_id: string
          id: string
          signature_data: string
          signed_at: string
          signer_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_note_id: string
          id?: string
          signature_data: string
          signed_at?: string
          signer_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_note_id?: string
          id?: string
          signature_data?: string
          signed_at?: string
          signer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_note_signatures_delivery_note_id_fkey"
            columns: ["delivery_note_id"]
            isOneToOne: false
            referencedRelation: "delivery_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_note_signatures_signer_id_fkey"
            columns: ["signer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_notes: {
        Row: {
          content_type: string | null
          created_at: string
          delivery_note_number: string
          dispatch_date: string
          expected_delivery_date: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          notes: string | null
          purchase_order_id: string
          supplier_id: string
          updated_at: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          delivery_note_number: string
          dispatch_date: string
          expected_delivery_date?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          notes?: string | null
          purchase_order_id: string
          supplier_id: string
          updated_at?: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          delivery_note_number?: string
          dispatch_date?: string
          expected_delivery_date?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          notes?: string | null
          purchase_order_id?: string
          supplier_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      delivery_notifications: {
        Row: {
          builder_id: string
          created_at: string
          delivery_address: string
          delivery_latitude: number | null
          delivery_longitude: number | null
          id: string
          material_details: Json
          notification_radius_km: number | null
          pickup_address: string
          pickup_latitude: number | null
          pickup_longitude: number | null
          priority_level: string | null
          request_id: string
          request_type: string
          special_instructions: string | null
          status: string
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          builder_id: string
          created_at?: string
          delivery_address: string
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          id?: string
          material_details?: Json
          notification_radius_km?: number | null
          pickup_address: string
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          priority_level?: string | null
          request_id: string
          request_type: string
          special_instructions?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          builder_id?: string
          created_at?: string
          delivery_address?: string
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          id?: string
          material_details?: Json
          notification_radius_km?: number | null
          pickup_address?: string
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          priority_level?: string | null
          request_id?: string
          request_type?: string
          special_instructions?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_notifications_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_orders: {
        Row: {
          builder_id: string
          created_at: string
          delivery_address: string
          id: string
          materials: Json
          notes: string | null
          order_number: string
          pickup_address: string
          project_id: string | null
          qr_code_generated: boolean | null
          qr_code_url: string | null
          qr_coded_items: number
          status: string
          supplier_id: string
          total_items: number
          updated_at: string
        }
        Insert: {
          builder_id: string
          created_at?: string
          delivery_address: string
          id?: string
          materials?: Json
          notes?: string | null
          order_number: string
          pickup_address: string
          project_id?: string | null
          qr_code_generated?: boolean | null
          qr_code_url?: string | null
          qr_coded_items?: number
          status?: string
          supplier_id: string
          total_items?: number
          updated_at?: string
        }
        Update: {
          builder_id?: string
          created_at?: string
          delivery_address?: string
          id?: string
          materials?: Json
          notes?: string | null
          order_number?: string
          pickup_address?: string
          project_id?: string | null
          qr_code_generated?: boolean | null
          qr_code_url?: string | null
          qr_coded_items?: number
          status?: string
          supplier_id?: string
          total_items?: number
          updated_at?: string
        }
        Relationships: []
      }
      delivery_provider_listings: {
        Row: {
          capacity_kg: number | null
          created_at: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          per_km_rate: number | null
          provider_id: string
          provider_name: string
          provider_type: string
          rating: number | null
          service_areas: string[] | null
          total_deliveries: number | null
          updated_at: string | null
          vehicle_types: string[] | null
        }
        Insert: {
          capacity_kg?: number | null
          created_at?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          per_km_rate?: number | null
          provider_id: string
          provider_name: string
          provider_type?: string
          rating?: number | null
          service_areas?: string[] | null
          total_deliveries?: number | null
          updated_at?: string | null
          vehicle_types?: string[] | null
        }
        Update: {
          capacity_kg?: number | null
          created_at?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          per_km_rate?: number | null
          provider_id?: string
          provider_name?: string
          provider_type?: string
          rating?: number | null
          service_areas?: string[] | null
          total_deliveries?: number | null
          updated_at?: string | null
          vehicle_types?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_provider_listings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: true
            referencedRelation: "delivery_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_provider_queue: {
        Row: {
          contacted_at: string | null
          created_at: string | null
          id: string
          provider_id: string
          queue_position: number
          request_id: string
          responded_at: string | null
          status: string
          timeout_at: string | null
          updated_at: string | null
        }
        Insert: {
          contacted_at?: string | null
          created_at?: string | null
          id?: string
          provider_id: string
          queue_position: number
          request_id: string
          responded_at?: string | null
          status?: string
          timeout_at?: string | null
          updated_at?: string | null
        }
        Update: {
          contacted_at?: string | null
          created_at?: string | null
          id?: string
          provider_id?: string
          queue_position?: number
          request_id?: string
          responded_at?: string | null
          status?: string
          timeout_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_provider_queue_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "delivery_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_provider_queue_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "delivery_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_provider_responses: {
        Row: {
          created_at: string
          distance_km: number | null
          estimated_cost: number | null
          estimated_duration_hours: number | null
          id: string
          notification_id: string
          provider_id: string
          responded_at: string
          response: string
          response_message: string | null
        }
        Insert: {
          created_at?: string
          distance_km?: number | null
          estimated_cost?: number | null
          estimated_duration_hours?: number | null
          id?: string
          notification_id: string
          provider_id: string
          responded_at?: string
          response: string
          response_message?: string | null
        }
        Update: {
          created_at?: string
          distance_km?: number | null
          estimated_cost?: number | null
          estimated_duration_hours?: number | null
          id?: string
          notification_id?: string
          provider_id?: string
          responded_at?: string
          response?: string
          response_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_provider_responses_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "delivery_notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_provider_responses_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "delivery_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_providers: {
        Row: {
          address: string | null
          availability_schedule: Json | null
          capacity_kg: number | null
          contact_person: string | null
          created_at: string
          current_latitude: number | null
          current_longitude: number | null
          cv_document_path: string | null
          cv_verified: boolean | null
          documents_complete: boolean | null
          driving_license_class: string | null
          driving_license_document_path: string | null
          driving_license_expiry: string | null
          driving_license_number: string | null
          driving_license_verified: boolean | null
          email: string | null
          good_conduct_document_path: string | null
          good_conduct_verified: boolean | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_location_update: string | null
          national_id_document_path: string | null
          national_id_verified: boolean | null
          per_km_rate: number | null
          phone: string
          provider_name: string
          provider_type: string
          rating: number | null
          service_areas: string[] | null
          total_deliveries: number | null
          updated_at: string
          user_id: string
          vehicle_types: string[] | null
        }
        Insert: {
          address?: string | null
          availability_schedule?: Json | null
          capacity_kg?: number | null
          contact_person?: string | null
          created_at?: string
          current_latitude?: number | null
          current_longitude?: number | null
          cv_document_path?: string | null
          cv_verified?: boolean | null
          documents_complete?: boolean | null
          driving_license_class?: string | null
          driving_license_document_path?: string | null
          driving_license_expiry?: string | null
          driving_license_number?: string | null
          driving_license_verified?: boolean | null
          email?: string | null
          good_conduct_document_path?: string | null
          good_conduct_verified?: boolean | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_location_update?: string | null
          national_id_document_path?: string | null
          national_id_verified?: boolean | null
          per_km_rate?: number | null
          phone: string
          provider_name: string
          provider_type?: string
          rating?: number | null
          service_areas?: string[] | null
          total_deliveries?: number | null
          updated_at?: string
          user_id: string
          vehicle_types?: string[] | null
        }
        Update: {
          address?: string | null
          availability_schedule?: Json | null
          capacity_kg?: number | null
          contact_person?: string | null
          created_at?: string
          current_latitude?: number | null
          current_longitude?: number | null
          cv_document_path?: string | null
          cv_verified?: boolean | null
          documents_complete?: boolean | null
          driving_license_class?: string | null
          driving_license_document_path?: string | null
          driving_license_expiry?: string | null
          driving_license_number?: string | null
          driving_license_verified?: boolean | null
          email?: string | null
          good_conduct_document_path?: string | null
          good_conduct_verified?: boolean | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_location_update?: string | null
          national_id_document_path?: string | null
          national_id_verified?: boolean | null
          per_km_rate?: number | null
          phone?: string
          provider_name?: string
          provider_type?: string
          rating?: number | null
          service_areas?: string[] | null
          total_deliveries?: number | null
          updated_at?: string
          user_id?: string
          vehicle_types?: string[] | null
        }
        Relationships: []
      }
      delivery_providers_public: {
        Row: {
          capacity_kg: number | null
          created_at: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          per_km_rate: number | null
          provider_id: string
          provider_name: string
          provider_type: string
          rating: number | null
          service_areas: string[] | null
          total_deliveries: number | null
          updated_at: string | null
          vehicle_types: string[] | null
        }
        Insert: {
          capacity_kg?: number | null
          created_at?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          per_km_rate?: number | null
          provider_id: string
          provider_name: string
          provider_type?: string
          rating?: number | null
          service_areas?: string[] | null
          total_deliveries?: number | null
          updated_at?: string | null
          vehicle_types?: string[] | null
        }
        Update: {
          capacity_kg?: number | null
          created_at?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          per_km_rate?: number | null
          provider_id?: string
          provider_name?: string
          provider_type?: string
          rating?: number | null
          service_areas?: string[] | null
          total_deliveries?: number | null
          updated_at?: string | null
          vehicle_types?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_providers_public_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: true
            referencedRelation: "delivery_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_requests: {
        Row: {
          attempted_providers: string[] | null
          auto_rotation_enabled: boolean | null
          budget_range: string | null
          builder_id: string
          created_at: string
          delivery_address: string
          delivery_latitude: number | null
          delivery_longitude: number | null
          id: string
          material_type: string
          max_rotation_attempts: number | null
          pickup_address: string
          pickup_date: string
          pickup_latitude: number | null
          pickup_longitude: number | null
          preferred_time: string | null
          provider_id: string | null
          provider_response: string | null
          quantity: number
          required_vehicle_type: string | null
          response_date: string | null
          response_notes: string | null
          rotation_completed_at: string | null
          special_instructions: string | null
          status: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          attempted_providers?: string[] | null
          auto_rotation_enabled?: boolean | null
          budget_range?: string | null
          builder_id: string
          created_at?: string
          delivery_address: string
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          id?: string
          material_type: string
          max_rotation_attempts?: number | null
          pickup_address: string
          pickup_date: string
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          preferred_time?: string | null
          provider_id?: string | null
          provider_response?: string | null
          quantity: number
          required_vehicle_type?: string | null
          response_date?: string | null
          response_notes?: string | null
          rotation_completed_at?: string | null
          special_instructions?: string | null
          status?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          attempted_providers?: string[] | null
          auto_rotation_enabled?: boolean | null
          budget_range?: string | null
          builder_id?: string
          created_at?: string
          delivery_address?: string
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          id?: string
          material_type?: string
          max_rotation_attempts?: number | null
          pickup_address?: string
          pickup_date?: string
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          preferred_time?: string | null
          provider_id?: string | null
          provider_response?: string | null
          quantity?: number
          required_vehicle_type?: string | null
          response_date?: string | null
          response_notes?: string | null
          rotation_completed_at?: string | null
          special_instructions?: string | null
          status?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_requests_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_status_updates: {
        Row: {
          created_at: string
          delivery_request_id: string | null
          id: string
          location_latitude: number | null
          location_longitude: number | null
          notes: string | null
          status: string
          updated_by_id: string
          updated_by_name: string
          updated_by_type: string
        }
        Insert: {
          created_at?: string
          delivery_request_id?: string | null
          id?: string
          location_latitude?: number | null
          location_longitude?: number | null
          notes?: string | null
          status: string
          updated_by_id: string
          updated_by_name: string
          updated_by_type: string
        }
        Update: {
          created_at?: string
          delivery_request_id?: string | null
          id?: string
          location_latitude?: number | null
          location_longitude?: number | null
          notes?: string | null
          status?: string
          updated_by_id?: string
          updated_by_name?: string
          updated_by_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_status_updates_delivery_request_id_fkey"
            columns: ["delivery_request_id"]
            isOneToOne: false
            referencedRelation: "delivery_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_tracking: {
        Row: {
          accuracy: number | null
          created_at: string
          delivery_request_id: string
          estimated_arrival: string | null
          heading: number | null
          id: string
          latitude: number
          longitude: number
          notes: string | null
          provider_id: string
          speed: number | null
          status: string
          updated_at: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          delivery_request_id: string
          estimated_arrival?: string | null
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          notes?: string | null
          provider_id: string
          speed?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          delivery_request_id?: string
          estimated_arrival?: string | null
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          notes?: string | null
          provider_id?: string
          speed?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_tracking_delivery_request_id_fkey"
            columns: ["delivery_request_id"]
            isOneToOne: false
            referencedRelation: "delivery_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_tracking_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "delivery_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_updates: {
        Row: {
          created_at: string
          delivery_id: string | null
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          created_at?: string
          delivery_id?: string | null
          id?: string
          notes?: string | null
          status: string
        }
        Update: {
          created_at?: string
          delivery_id?: string | null
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_updates_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_updates_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "secure_delivery_view"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_contact_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          authorized: boolean
          business_justification: string | null
          delivery_id: string | null
          delivery_status: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          authorized?: boolean
          business_justification?: string | null
          delivery_id?: string | null
          delivery_status?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          authorized?: boolean
          business_justification?: string | null
          delivery_id?: string | null
          delivery_status?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_contact_access_log_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_contact_access_log_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "secure_delivery_view"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_info_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          delivery_id: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          delivery_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          delivery_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_info_access_log_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_info_access_log_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "secure_delivery_view"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          category: string | null
          comment: string | null
          created_at: string
          delivery_id: string | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          comment?: string | null
          created_at?: string
          delivery_id?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          comment?: string | null
          created_at?: string
          delivery_id?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "secure_delivery_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goods_received_notes: {
        Row: {
          additional_notes: string | null
          builder_id: string
          created_at: string
          delivery_id: string | null
          delivery_note_reference: string | null
          discrepancies: string | null
          grn_number: string
          id: string
          items: Json
          overall_condition: string
          project_id: string | null
          received_by: string
          received_date: string
          status: string
          supplier_name: string
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          builder_id: string
          created_at?: string
          delivery_id?: string | null
          delivery_note_reference?: string | null
          discrepancies?: string | null
          grn_number: string
          id?: string
          items?: Json
          overall_condition?: string
          project_id?: string | null
          received_by: string
          received_date: string
          status?: string
          supplier_name: string
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          builder_id?: string
          created_at?: string
          delivery_id?: string | null
          delivery_note_reference?: string | null
          discrepancies?: string | null
          grn_number?: string
          id?: string
          items?: Json
          overall_condition?: string
          project_id?: string | null
          received_by?: string
          received_date?: string
          status?: string
          supplier_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string
          custom_invoice_path: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issuer_id: string
          items: Json
          notes: string | null
          payment_terms: string | null
          purchase_order_id: string | null
          status: string
          subtotal: number
          supplier_id: string
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_invoice_path?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issuer_id: string
          items?: Json
          notes?: string | null
          payment_terms?: string | null
          purchase_order_id?: string | null
          status?: string
          subtotal?: number
          supplier_id: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_invoice_path?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issuer_id?: string
          items?: Json
          notes?: string | null
          payment_terms?: string | null
          purchase_order_id?: string | null
          status?: string
          subtotal?: number
          supplier_id?: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_issuer_id_fkey"
            columns: ["issuer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      location_data_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          data_fields_accessed: string[] | null
          delivery_id: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          data_fields_accessed?: string[] | null
          delivery_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          data_fields_accessed?: string[] | null
          delivery_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_data_access_log_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_data_access_log_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "secure_delivery_view"
            referencedColumns: ["id"]
          },
        ]
      }
      material_qr_codes: {
        Row: {
          batch_number: string | null
          created_at: string | null
          dispatched_at: string | null
          generated_at: string | null
          id: string
          material_type: string
          purchase_order_id: string | null
          qr_code: string
          quantity: number
          received_at: string | null
          status: string | null
          supplier_id: string | null
          unit: string | null
          updated_at: string | null
          verified_at: string | null
        }
        Insert: {
          batch_number?: string | null
          created_at?: string | null
          dispatched_at?: string | null
          generated_at?: string | null
          id?: string
          material_type: string
          purchase_order_id?: string | null
          qr_code: string
          quantity: number
          received_at?: string | null
          status?: string | null
          supplier_id?: string | null
          unit?: string | null
          updated_at?: string | null
          verified_at?: string | null
        }
        Update: {
          batch_number?: string | null
          created_at?: string | null
          dispatched_at?: string | null
          generated_at?: string | null
          id?: string
          material_type?: string
          purchase_order_id?: string | null
          qr_code?: string
          quantity?: number
          received_at?: string | null
          status?: string | null
          supplier_id?: string | null
          unit?: string | null
          updated_at?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_qr_codes_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_materials: {
        Row: {
          batch_number: string | null
          created_at: string
          id: string
          is_qr_coded: boolean
          is_scanned: boolean
          material_type: string
          order_id: string
          qr_code: string | null
          quantity: number
          unit: string
          updated_at: string
        }
        Insert: {
          batch_number?: string | null
          created_at?: string
          id?: string
          is_qr_coded?: boolean
          is_scanned?: boolean
          material_type: string
          order_id: string
          qr_code?: string | null
          quantity: number
          unit?: string
          updated_at?: string
        }
        Update: {
          batch_number?: string | null
          created_at?: string
          id?: string
          is_qr_coded?: boolean
          is_scanned?: boolean
          material_type?: string
          order_id?: string
          qr_code?: string | null
          quantity?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_materials_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "delivery_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_info_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          acknowledgement_id: string | null
          id: string
          ip_address: unknown | null
          payment_fields_accessed: string[] | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          acknowledgement_id?: string | null
          id?: string
          ip_address?: unknown | null
          payment_fields_accessed?: string[] | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          acknowledgement_id?: string | null
          id?: string
          ip_address?: unknown | null
          payment_fields_accessed?: string[] | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_info_access_log_acknowledgement_id_fkey"
            columns: ["acknowledgement_id"]
            isOneToOne: false
            referencedRelation: "delivery_acknowledgements"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_preferences: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          payment_details: Json | null
          payment_method: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          payment_details?: Json | null
          payment_method: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          payment_details?: Json | null
          payment_method?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          id: string
          phone_number: string | null
          provider: string
          provider_response: Json | null
          reference: string
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          phone_number?: string | null
          provider: string
          provider_response?: Json | null
          reference: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          phone_number?: string | null
          provider?: string
          provider_response?: Json | null
          reference?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profile_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          viewed_profile_id: string | null
          viewer_user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          viewed_profile_id?: string | null
          viewer_user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          viewed_profile_id?: string | null
          viewer_user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_license: string | null
          company_name: string | null
          company_registration: string | null
          created_at: string
          full_name: string | null
          id: string
          is_professional: boolean | null
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_license?: string | null
          company_name?: string | null
          company_registration?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_professional?: boolean | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_license?: string | null
          company_name?: string | null
          company_registration?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_professional?: boolean | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          access_code: string | null
          builder_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          name: string
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          access_code?: string | null
          builder_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          access_code?: string | null
          builder_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          accessed_fields: string[] | null
          business_justification: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          viewed_provider_id: string
          viewer_user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          accessed_fields?: string[] | null
          business_justification?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          viewed_provider_id: string
          viewer_user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          accessed_fields?: string[] | null
          business_justification?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          viewed_provider_id?: string
          viewer_user_id?: string | null
        }
        Relationships: []
      }
      purchase_orders: {
        Row: {
          buyer_id: string
          created_at: string
          delivery_address: string
          delivery_date: string
          delivery_notes: string | null
          delivery_requested_at: string | null
          delivery_required: boolean | null
          id: string
          items: Json
          payment_terms: string | null
          po_number: string
          qr_code_generated: boolean | null
          qr_code_url: string | null
          quotation_request_id: string | null
          special_instructions: string | null
          status: string
          supplier_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          delivery_address: string
          delivery_date: string
          delivery_notes?: string | null
          delivery_requested_at?: string | null
          delivery_required?: boolean | null
          id?: string
          items?: Json
          payment_terms?: string | null
          po_number: string
          qr_code_generated?: boolean | null
          qr_code_url?: string | null
          quotation_request_id?: string | null
          special_instructions?: string | null
          status?: string
          supplier_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          delivery_address?: string
          delivery_date?: string
          delivery_notes?: string | null
          delivery_requested_at?: string | null
          delivery_required?: boolean | null
          id?: string
          items?: Json
          payment_terms?: string | null
          po_number?: string
          qr_code_generated?: boolean | null
          qr_code_url?: string | null
          quotation_request_id?: string | null
          special_instructions?: string | null
          status?: string
          supplier_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      purchase_receipts: {
        Row: {
          buyer_id: string
          created_at: string
          delivery_address: string | null
          delivery_notes: string | null
          delivery_requested_at: string | null
          delivery_required: boolean | null
          id: string
          items: Json
          payment_method: string
          payment_reference: string | null
          receipt_number: string
          special_instructions: string | null
          status: string
          supplier_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          delivery_address?: string | null
          delivery_notes?: string | null
          delivery_requested_at?: string | null
          delivery_required?: boolean | null
          id?: string
          items?: Json
          payment_method: string
          payment_reference?: string | null
          receipt_number: string
          special_instructions?: string | null
          status?: string
          supplier_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          delivery_address?: string | null
          delivery_notes?: string | null
          delivery_requested_at?: string | null
          delivery_required?: boolean | null
          id?: string
          items?: Json
          payment_method?: string
          payment_reference?: string | null
          receipt_number?: string
          special_instructions?: string | null
          status?: string
          supplier_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      quotation_requests: {
        Row: {
          created_at: string
          delivery_address: string
          id: string
          material_name: string
          preferred_delivery_date: string | null
          project_description: string | null
          quantity: number
          quote_amount: number | null
          quote_valid_until: string | null
          requester_id: string
          special_requirements: string | null
          status: string
          supplier_id: string
          supplier_notes: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_address: string
          id?: string
          material_name: string
          preferred_delivery_date?: string | null
          project_description?: string | null
          quantity: number
          quote_amount?: number | null
          quote_valid_until?: string | null
          requester_id: string
          special_requirements?: string | null
          status?: string
          supplier_id: string
          supplier_notes?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_address?: string
          id?: string
          material_name?: string
          preferred_delivery_date?: string | null
          project_description?: string | null
          quantity?: number
          quote_amount?: number | null
          quote_valid_until?: string | null
          requester_id?: string
          special_requirements?: string | null
          status?: string
          supplier_id?: string
          supplier_notes?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      receipt_uploads: {
        Row: {
          content_type: string | null
          created_at: string
          delivery_id: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          notes: string | null
          receipt_type: string | null
          scanned_supply_id: string | null
          shared_with_builder: boolean | null
          supplier_id: string | null
          updated_at: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          delivery_id?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          notes?: string | null
          receipt_type?: string | null
          scanned_supply_id?: string | null
          shared_with_builder?: boolean | null
          supplier_id?: string | null
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          delivery_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          notes?: string | null
          receipt_type?: string | null
          scanned_supply_id?: string | null
          shared_with_builder?: boolean | null
          supplier_id?: string | null
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipt_uploads_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_uploads_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "secure_delivery_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_uploads_scanned_supply_id_fkey"
            columns: ["scanned_supply_id"]
            isOneToOne: false
            referencedRelation: "scanned_supplies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_uploads_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      scanned_receivables: {
        Row: {
          batch_number: string | null
          condition: string | null
          delivery_id: string | null
          delivery_order_id: string | null
          id: string
          matched_supply_id: string | null
          material_type: string
          notes: string | null
          project_id: string | null
          qr_code: string
          quantity: number | null
          received_at: string
          received_by: string | null
          received_status: string | null
          scanned_by: string | null
          supplier_info: string | null
          unit: string | null
          verified: boolean | null
        }
        Insert: {
          batch_number?: string | null
          condition?: string | null
          delivery_id?: string | null
          delivery_order_id?: string | null
          id?: string
          matched_supply_id?: string | null
          material_type: string
          notes?: string | null
          project_id?: string | null
          qr_code: string
          quantity?: number | null
          received_at?: string
          received_by?: string | null
          received_status?: string | null
          scanned_by?: string | null
          supplier_info?: string | null
          unit?: string | null
          verified?: boolean | null
        }
        Update: {
          batch_number?: string | null
          condition?: string | null
          delivery_id?: string | null
          delivery_order_id?: string | null
          id?: string
          matched_supply_id?: string | null
          material_type?: string
          notes?: string | null
          project_id?: string | null
          qr_code?: string
          quantity?: number | null
          received_at?: string
          received_by?: string | null
          received_status?: string | null
          scanned_by?: string | null
          supplier_info?: string | null
          unit?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "scanned_receivables_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scanned_receivables_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "secure_delivery_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scanned_receivables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      scanned_supplies: {
        Row: {
          batch_number: string | null
          delivery_order_id: string | null
          dispatch_status: string | null
          dispatched_at: string | null
          dispatched_by: string | null
          id: string
          material_type: string
          notes: string | null
          qr_code: string
          quantity: number | null
          scanned_at: string
          scanned_by: string | null
          scanned_for_dispatch: boolean | null
          status: string | null
          supplier_id: string | null
          supplier_info: string | null
          unit: string | null
        }
        Insert: {
          batch_number?: string | null
          delivery_order_id?: string | null
          dispatch_status?: string | null
          dispatched_at?: string | null
          dispatched_by?: string | null
          id?: string
          material_type: string
          notes?: string | null
          qr_code: string
          quantity?: number | null
          scanned_at?: string
          scanned_by?: string | null
          scanned_for_dispatch?: boolean | null
          status?: string | null
          supplier_id?: string | null
          supplier_info?: string | null
          unit?: string | null
        }
        Update: {
          batch_number?: string | null
          delivery_order_id?: string | null
          dispatch_status?: string | null
          dispatched_at?: string | null
          dispatched_by?: string | null
          id?: string
          material_type?: string
          notes?: string | null
          qr_code?: string
          quantity?: number | null
          scanned_at?: string
          scanned_by?: string | null
          scanned_for_dispatch?: boolean | null
          status?: string | null
          supplier_id?: string | null
          supplier_info?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scanned_supplies_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          created_at: string
          details: Json | null
          device_fingerprint: Json | null
          event_type: string
          id: string
          severity: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          device_fingerprint?: Json | null
          event_type: string
          id?: string
          severity: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          device_fingerprint?: Json | null
          event_type?: string
          id?: string
          severity?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      supplier_contact_access_audit: {
        Row: {
          access_granted: boolean
          access_type: string
          accessed_fields: string[] | null
          business_justification: string | null
          created_at: string
          id: string
          ip_address: unknown | null
          supplier_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_granted?: boolean
          access_type: string
          accessed_fields?: string[] | null
          business_justification?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          supplier_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_granted?: boolean
          access_type?: string
          accessed_fields?: string[] | null
          business_justification?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          supplier_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      supplier_contact_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          accessed_fields: string[] | null
          id: string
          ip_address: unknown | null
          supplier_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          accessed_fields?: string[] | null
          id?: string
          ip_address?: unknown | null
          supplier_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          accessed_fields?: string[] | null
          id?: string
          ip_address?: unknown | null
          supplier_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_contact_access_log_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          company_name: string
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          is_verified: boolean | null
          materials_offered: string[] | null
          phone: string | null
          rating: number | null
          specialties: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_verified?: boolean | null
          materials_offered?: string[] | null
          phone?: string | null
          rating?: number | null
          specialties?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_verified?: boolean | null
          materials_offered?: string[] | null
          phone?: string | null
          rating?: number | null
          specialties?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_updates: {
        Row: {
          created_at: string
          delivery_id: string | null
          id: string
          location: string | null
          notes: string | null
          status: string
        }
        Insert: {
          created_at?: string
          delivery_id?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          status: string
        }
        Update: {
          created_at?: string
          delivery_id?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_updates_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracking_updates_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "secure_delivery_view"
            referencedColumns: ["id"]
          },
        ]
      }
      trusted_devices: {
        Row: {
          created_at: string
          device_name: string | null
          fingerprint_hash: string
          id: string
          is_active: boolean | null
          last_used_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_name?: string | null
          fingerprint_hash: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_name?: string | null
          fingerprint_hash?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      secure_delivery_view: {
        Row: {
          actual_delivery_time: string | null
          builder_id: string | null
          created_at: string | null
          delivery_address: string | null
          delivery_date: string | null
          driver_name: string | null
          driver_phone: string | null
          estimated_delivery_time: string | null
          id: string | null
          material_type: string | null
          notes: string | null
          pickup_address: string | null
          pickup_date: string | null
          project_id: string | null
          quantity: number | null
          status: string | null
          supplier_id: string | null
          tracking_number: string | null
          updated_at: string | null
          vehicle_details: string | null
          weight_kg: number | null
        }
        Insert: {
          actual_delivery_time?: string | null
          builder_id?: string | null
          created_at?: string | null
          delivery_address?: never
          delivery_date?: string | null
          driver_name?: never
          driver_phone?: never
          estimated_delivery_time?: string | null
          id?: string | null
          material_type?: string | null
          notes?: string | null
          pickup_address?: never
          pickup_date?: string | null
          project_id?: string | null
          quantity?: number | null
          status?: string | null
          supplier_id?: string | null
          tracking_number?: string | null
          updated_at?: string | null
          vehicle_details?: string | null
          weight_kg?: number | null
        }
        Update: {
          actual_delivery_time?: string | null
          builder_id?: string | null
          created_at?: string | null
          delivery_address?: never
          delivery_date?: string | null
          driver_name?: never
          driver_phone?: never
          estimated_delivery_time?: string | null
          id?: string | null
          material_type?: string | null
          notes?: string | null
          pickup_address?: never
          pickup_date?: string | null
          project_id?: string | null
          quantity?: number | null
          status?: string | null
          supplier_id?: string | null
          tracking_number?: string | null
          updated_at?: string | null
          vehicle_details?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_access_driver_contact: {
        Args: {
          delivery_record: Database["public"]["Tables"]["deliveries"]["Row"]
        }
        Returns: boolean
      }
      can_access_driver_info: {
        Args: {
          delivery_record: Database["public"]["Tables"]["deliveries"]["Row"]
        }
        Returns: boolean
      }
      can_access_grn: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      can_access_location_data: {
        Args: {
          delivery_record: Database["public"]["Tables"]["deliveries"]["Row"]
        }
        Returns: boolean
      }
      can_access_payment_info: {
        Args: {
          acknowledgement_record: Database["public"]["Tables"]["delivery_acknowledgements"]["Row"]
        }
        Returns: boolean
      }
      can_access_provider_contact: {
        Args: { provider_uuid: string }
        Returns: boolean
      }
      can_access_supplier_contact: {
        Args: { supplier_uuid: string }
        Returns: boolean
      }
      create_missing_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_access_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_material_qr_code: {
        Args: {
          _batch_number?: string
          _material_type: string
          _purchase_order_id?: string
          _quantity?: number
          _supplier_id?: string
          _unit?: string
        }
        Returns: string
      }
      get_camera_stream_access: {
        Args: { camera_uuid: string }
        Returns: {
          access_level: string
          access_message: string
          camera_id: string
          camera_name: string
          can_access_stream: boolean
          stream_url: string
        }[]
      }
      get_current_user_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_delivery_info_secure: {
        Args: { delivery_uuid: string }
        Returns: {
          actual_delivery_time: string
          builder_id: string
          can_view_driver_details: boolean
          created_at: string
          delivery_address: string
          delivery_date: string
          driver_contact_access_message: string
          driver_display_info: string
          estimated_delivery_time: string
          has_driver_assigned: boolean
          id: string
          material_type: string
          notes: string
          pickup_address: string
          pickup_date: string
          project_id: string
          quantity: number
          security_level: string
          status: string
          supplier_id: string
          tracking_number: string
          updated_at: string
          vehicle_details: string
          weight_kg: number
        }[]
      }
      get_delivery_summaries: {
        Args: Record<PropertyKey, never>
        Returns: {
          actual_delivery_time: string
          builder_id: string
          created_at: string
          estimated_delivery_time: string
          general_delivery_area: string
          general_pickup_area: string
          has_driver_assigned: boolean
          id: string
          material_type: string
          project_id: string
          quantity: number
          status: string
          supplier_id: string
          tracking_number: string
          updated_at: string
          weight_kg: number
        }[]
      }
      get_delivery_with_secure_driver_info: {
        Args: { delivery_uuid: string }
        Returns: {
          actual_delivery_time: string
          builder_id: string
          can_view_driver_contact: boolean
          created_at: string
          delivery_address: string
          delivery_date: string
          driver_contact_info: string
          driver_display_name: string
          estimated_delivery_time: string
          id: string
          material_type: string
          notes: string
          pickup_address: string
          pickup_date: string
          project_id: string
          quantity: number
          security_message: string
          status: string
          supplier_id: string
          tracking_number: string
          updated_at: string
          vehicle_details: string
          weight_kg: number
        }[]
      }
      get_delivery_with_ultra_secure_driver_info: {
        Args: { delivery_uuid: string }
        Returns: {
          actual_delivery_time: string
          builder_id: string
          can_view_driver_contact: boolean
          created_at: string
          delivery_address: string
          delivery_date: string
          driver_contact_info: string
          driver_display_name: string
          estimated_delivery_time: string
          id: string
          material_type: string
          notes: string
          pickup_address: string
          pickup_date: string
          project_id: string
          quantity: number
          security_message: string
          status: string
          supplier_id: string
          tracking_number: string
          updated_at: string
          vehicle_details: string
          weight_kg: number
        }[]
      }
      get_my_provider_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          availability_schedule: Json
          capacity_kg: number
          created_at: string
          driving_license_class: string
          driving_license_document_path: string
          driving_license_expiry: string
          driving_license_number: string
          driving_license_verified: boolean
          email: string
          hourly_rate: number
          id: string
          is_active: boolean
          is_verified: boolean
          per_km_rate: number
          phone: string
          provider_name: string
          provider_type: string
          rating: number
          service_areas: string[]
          total_deliveries: number
          updated_at: string
          vehicle_types: string[]
        }[]
      }
      get_provider_business_info: {
        Args: { provider_uuid: string }
        Returns: {
          capacity_kg: number
          id: string
          is_active: boolean
          is_verified: boolean
          provider_name: string
          provider_type: string
          rating: number
          service_areas: string[]
          total_deliveries: number
          vehicle_types: string[]
        }[]
      }
      get_provider_contact_for_delivery: {
        Args: { delivery_request_uuid: string }
        Returns: {
          can_contact: boolean
          phone: string
          provider_name: string
        }[]
      }
      get_provider_rotation_queue: {
        Args: {
          _max_providers?: number
          _pickup_lat: number
          _pickup_lng: number
          _request_id: string
        }
        Returns: {
          distance_km: number
          priority_score: number
          provider_id: string
          provider_name: string
          rating: number
        }[]
      }
      get_public_supplier_info: {
        Args: { supplier_row: Database["public"]["Tables"]["suppliers"]["Row"] }
        Returns: {
          company_name: string
          created_at: string
          id: string
          is_verified: boolean
          materials_offered: string[]
          rating: number
          specialties: string[]
          updated_at: string
        }[]
      }
      get_safe_camera_directory: {
        Args: Record<PropertyKey, never>
        Returns: {
          access_requirements: string
          can_request_access: boolean
          general_location: string
          id: string
          is_active: boolean
          name: string
          project_id: string
        }[]
      }
      get_safe_delivery_listings: {
        Args: Record<PropertyKey, never>
        Returns: {
          builder_id: string
          created_at: string
          delivery_date: string
          estimated_delivery_time: string
          general_location: string
          has_driver_assigned: boolean
          id: string
          material_type: string
          pickup_date: string
          quantity: number
          status: string
          supplier_id: string
          tracking_number: string
        }[]
      }
      get_secure_acknowledgement: {
        Args: { acknowledgement_uuid: string }
        Returns: {
          acknowledged_by: string
          acknowledgement_date: string
          acknowledger_id: string
          can_view_payment: boolean
          comments: string
          created_at: string
          delivery_note_id: string
          digital_signature: string
          id: string
          payment_method: string
          payment_reference: string
          payment_status: string
          signed_document_path: string
          updated_at: string
        }[]
      }
      get_secure_camera_info: {
        Args: { camera_uuid: string }
        Returns: {
          can_view_stream: boolean
          created_at: string
          general_location: string
          id: string
          is_active: boolean
          location: string
          name: string
          project_id: string
          stream_access_message: string
          updated_at: string
        }[]
      }
      get_secure_camera_stream: {
        Args: { camera_uuid: string }
        Returns: {
          access_message: string
          camera_id: string
          camera_name: string
          can_access: boolean
          stream_url: string
        }[]
      }
      get_secure_delivery: {
        Args: { delivery_uuid: string }
        Returns: {
          actual_delivery_time: string
          builder_id: string
          can_view_driver_contact: boolean
          can_view_locations: boolean
          created_at: string
          delivery_address: string
          delivery_date: string
          driver_name: string
          driver_phone: string
          estimated_delivery_time: string
          id: string
          material_type: string
          notes: string
          pickup_address: string
          pickup_date: string
          project_id: string
          quantity: number
          status: string
          supplier_id: string
          tracking_number: string
          updated_at: string
          vehicle_details: string
          weight_kg: number
        }[]
      }
      get_secure_delivery_info: {
        Args: { delivery_uuid: string }
        Returns: {
          actual_delivery_time: string
          builder_id: string
          can_view_driver_contact: boolean
          created_at: string
          delivery_address: string
          delivery_date: string
          driver_contact_info: string
          driver_display_name: string
          estimated_delivery_time: string
          id: string
          material_type: string
          notes: string
          pickup_address: string
          pickup_date: string
          project_id: string
          quantity: number
          security_message: string
          status: string
          supplier_id: string
          tracking_number: string
          updated_at: string
          vehicle_details: string
          weight_kg: number
        }[]
      }
      get_secure_delivery_listings: {
        Args: Record<PropertyKey, never>
        Returns: {
          builder_id: string
          can_request_driver_contact: boolean
          created_at: string
          delivery_date: string
          estimated_delivery_time: string
          general_location: string
          has_driver_assigned: boolean
          id: string
          material_type: string
          pickup_date: string
          quantity: number
          status: string
          supplier_id: string
          tracking_number: string
        }[]
      }
      get_secure_delivery_request: {
        Args: { request_uuid: string }
        Returns: {
          budget_range: string
          builder_id: string
          can_view_addresses: boolean
          created_at: string
          delivery_address: string
          delivery_latitude: number
          delivery_longitude: number
          id: string
          material_type: string
          pickup_address: string
          pickup_date: string
          pickup_latitude: number
          pickup_longitude: number
          preferred_time: string
          provider_id: string
          provider_response: string
          quantity: number
          required_vehicle_type: string
          response_date: string
          response_notes: string
          special_instructions: string
          status: string
          updated_at: string
          weight_kg: number
        }[]
      }
      get_secure_driver_contact: {
        Args: { delivery_uuid: string }
        Returns: {
          can_view_driver_contact: boolean
          driver_contact_info: string
          driver_display_name: string
          security_message: string
        }[]
      }
      get_secure_provider_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          capacity_kg: number
          created_at: string
          email: string
          id: string
          is_active: boolean
          is_verified: boolean
          phone: string
          provider_name: string
          provider_type: string
          rating: number
          service_areas: string[]
          total_deliveries: number
          updated_at: string
          vehicle_types: string[]
        }[]
      }
      get_secure_provider_info: {
        Args: { provider_uuid: string }
        Returns: {
          address: string
          can_view_contact: boolean
          capacity_kg: number
          email: string
          hourly_rate: number
          id: string
          is_active: boolean
          is_verified: boolean
          per_km_rate: number
          phone: string
          provider_name: string
          provider_type: string
          rating: number
          service_areas: string[]
          total_deliveries: number
          vehicle_types: string[]
        }[]
      }
      get_secure_purchase_order: {
        Args: { order_uuid: string }
        Returns: {
          buyer_id: string
          can_view_address: boolean
          created_at: string
          delivery_address: string
          delivery_date: string
          id: string
          items: Json
          payment_terms: string
          po_number: string
          qr_code_generated: boolean
          qr_code_url: string
          quotation_request_id: string
          special_instructions: string
          status: string
          supplier_id: string
          total_amount: number
          updated_at: string
        }[]
      }
      get_secure_supplier_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          company_name: string
          contact_person: string
          created_at: string
          email: string
          id: string
          is_verified: boolean
          materials_offered: string[]
          phone: string
          rating: number
          specialties: string[]
          updated_at: string
        }[]
      }
      get_secure_supplier_info: {
        Args: { supplier_uuid: string }
        Returns: {
          address: string
          can_view_contact: boolean
          company_name: string
          contact_person: string
          created_at: string
          email: string
          id: string
          is_verified: boolean
          materials_offered: string[]
          phone: string
          rating: number
          specialties: string[]
        }[]
      }
      get_secure_suppliers_directory: {
        Args: Record<PropertyKey, never>
        Returns: {
          business_verified: boolean
          company_name: string
          contact_info_status: string
          created_at: string
          id: string
          is_verified: boolean
          materials_offered: string[]
          rating: number
          specialties: string[]
          updated_at: string
        }[]
      }
      get_supplier_business_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          company_name: string
          contact_person: string
          created_at: string
          email: string
          id: string
          is_verified: boolean
          materials_offered: string[]
          phone: string
          rating: number
          specialties: string[]
          updated_at: string
          user_id: string
        }[]
      }
      get_supplier_contact_secure: {
        Args: { supplier_uuid: string }
        Returns: {
          address: string
          can_view_contact: boolean
          company_name: string
          contact_access_reason: string
          contact_person: string
          created_at: string
          email: string
          id: string
          is_verified: boolean
          materials_offered: string[]
          phone: string
          rating: number
          specialties: string[]
          updated_at: string
        }[]
      }
      get_supplier_directory_for_builders: {
        Args: Record<PropertyKey, never>
        Returns: {
          company_name: string
          id: string
          is_verified: boolean
          location_city: string
          materials_offered: string[]
          rating: number
          specialties: string[]
        }[]
      }
      get_supplier_qr_codes: {
        Args: { _supplier_id: string }
        Returns: {
          created_at: string
          dispatched_at: string
          material_type: string
          po_number: string
          qr_code: string
          quantity: number
          received_at: string
          status: string
          unit: string
        }[]
      }
      get_supplier_with_contact: {
        Args: { supplier_id: string }
        Returns: {
          address: string
          can_view_contact: boolean
          company_name: string
          contact_person: string
          created_at: string
          email: string
          id: string
          is_verified: boolean
          materials_offered: string[]
          phone: string
          rating: number
          specialties: string[]
          updated_at: string
        }[]
      }
      get_supplier_with_secure_contact: {
        Args: { supplier_uuid: string }
        Returns: {
          address: string
          can_view_contact: boolean
          company_name: string
          contact_access_reason: string
          contact_person: string
          created_at: string
          email: string
          id: string
          is_verified: boolean
          materials_offered: string[]
          phone: string
          rating: number
          specialties: string[]
          updated_at: string
        }[]
      }
      get_suppliers_directory: {
        Args: Record<PropertyKey, never>
        Returns: {
          company_name: string
          contact_info_status: string
          created_at: string
          id: string
          is_verified: boolean
          materials_offered: string[]
          rating: number
          specialties: string[]
          updated_at: string
        }[]
      }
      get_suppliers_directory_secure: {
        Args: Record<PropertyKey, never>
        Returns: {
          company_name: string
          contact_info_status: string
          created_at: string
          id: string
          is_verified: boolean
          materials_offered: string[]
          rating: number
          specialties: string[]
          updated_at: string
        }[]
      }
      get_user_deliveries: {
        Args: Record<PropertyKey, never>
        Returns: {
          actual_delivery_time: string
          builder_id: string
          can_view_driver_contact: boolean
          can_view_locations: boolean
          created_at: string
          delivery_address: string
          delivery_date: string
          driver_name: string
          driver_phone: string
          estimated_delivery_time: string
          id: string
          material_type: string
          notes: string
          pickup_address: string
          pickup_date: string
          project_id: string
          quantity: number
          status: string
          supplier_id: string
          tracking_number: string
          updated_at: string
          vehicle_details: string
          weight_kg: number
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: string
      }
      handle_provider_rejection: {
        Args: { _provider_id: string; _request_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_builder: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_builder: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_supplier: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_supplier: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_delivery_access: {
        Args: {
          action_param: string
          fields_param?: string[]
          resource_id_param?: string
          resource_type_param: string
        }
        Returns: undefined
      }
      log_driver_info_access: {
        Args: { access_type_param: string; delivery_uuid: string }
        Returns: undefined
      }
      log_location_data_access: {
        Args: {
          access_type_param: string
          delivery_uuid: string
          fields_accessed?: string[]
        }
        Returns: undefined
      }
      log_payment_info_access: {
        Args: {
          access_type_param: string
          acknowledgement_uuid: string
          fields_accessed?: string[]
        }
        Returns: undefined
      }
      log_profile_access: {
        Args: { access_type_param: string; viewed_profile_uuid: string }
        Returns: undefined
      }
      log_provider_access: {
        Args: {
          access_type_param: string
          fields_accessed?: string[]
          justification?: string
          provider_uuid: string
        }
        Returns: undefined
      }
      log_supplier_business_access: {
        Args: { access_type_param: string; supplier_uuid: string }
        Returns: undefined
      }
      log_supplier_contact_access: {
        Args: {
          access_type_param: string
          fields_accessed?: string[]
          supplier_uuid: string
        }
        Returns: undefined
      }
      log_supplier_contact_access_enhanced: {
        Args: {
          access_type_param: string
          business_justification?: string
          fields_accessed?: string[]
          supplier_uuid: string
        }
        Returns: undefined
      }
      notify_nearby_delivery_providers: {
        Args: {
          _delivery_lat: number
          _delivery_lng: number
          _notification_id: string
          _pickup_lat: number
          _pickup_lng: number
          _radius_km?: number
        }
        Returns: {
          distance_km: number
          provider_id: string
        }[]
      }
      setup_provider_rotation_queue: {
        Args: { _request_id: string }
        Returns: number
      }
      update_qr_status: {
        Args: { _new_status: string; _qr_code: string }
        Returns: boolean
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
    Enums: {},
  },
} as const
