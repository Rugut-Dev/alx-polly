export interface User {
  id: string
  email: string
  name: string
  bio?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface AuthContextType {
  user: User | null
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
}