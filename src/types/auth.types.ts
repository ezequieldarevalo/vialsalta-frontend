export enum UserRole {
  CAMARA = 'CAMARA',
  PLANTA = 'PLANTA',
  MUNICIPIO = 'MUNICIPIO',
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  camaraId?: number;
  plantaId?: number;
  municipioId?: number;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
