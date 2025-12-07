// Authentication types and DTOs (Data Transfer Objects)

// DTO for user registration
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

// DTO for user login
export interface LoginDto {
  email: string;
  password: string;
}

// User response type (without password)
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication response (includes user and token)
export interface AuthResponse {
  message: string;
  user: UserResponse;
  token: string;
}

// JWT token payload
export interface JwtPayload {
  userId: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

// Error response type
export interface ErrorResponse {
  error: string;
}

