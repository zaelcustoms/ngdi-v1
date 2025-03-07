import { UserRole } from "@prisma/client"

export interface UserProfile {
  id: string
  name: string | null
  email: string
  role: UserRole
  emailVerified: string | null
  createdAt: string
  updatedAt: string
}

export interface UserUpdateRequest {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
  organization?: string
  department?: string
  phone?: string
}

export interface UserSearchParams {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface UserListResponse {
  users: UserProfile[]
  total: number
  currentPage: number
  totalPages: number
  limit: number
}
