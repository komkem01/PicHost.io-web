export interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  paginate: {
    page: number
    size: number
    total: number
  }
}

export interface PublicPlanSetting {
  plan_key: string
  display_name: string
  monthly_price_thb: number
  storage_limit_bytes: number
  image_limit: number
  max_upload_mb: number
  allow_private: boolean
  custom_domain: boolean
  api_access: boolean
  priority_support: boolean
  no_ads: boolean
  watermark_removal: boolean
}

export interface AdminPlanSetting extends PublicPlanSetting {
  is_enabled: boolean
  updated_at: string
}

export interface UserQuota {
  user_id: string
  image_count: number
  used_storage_bytes: number
  storage_limit_bytes: number
  file_size_limit_bytes: number
  max_images: number
  allow_private: boolean
  plan_key: string
}

export interface StorageFile {
  id: string
  user_id: string | null
  file_name: string
  original_name: string
  mime_type: string
  file_size: number
  file_url: string
  public_url?: string
  is_private: boolean
  short_code: string | null
  created_at: string
  updated_at: string
}
