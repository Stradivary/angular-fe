export interface LoginResponse {
  id: string;
  email: string;
  token: string;
  roles: string[];
}

export interface LoginEmailDto {
  email: string;
  password: string;
}
