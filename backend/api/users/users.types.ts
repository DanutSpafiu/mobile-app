// User types and DTOs (Data Transfer Objects)

// User response type (without password)
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// DTO for updating user profile
export interface UpdateUserDto {
  username?: string;
  email?: string;
}

// DTO for updating password
export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// Query parameters for user endpoints
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Response type for user list
export interface UsersListResponse {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
}

