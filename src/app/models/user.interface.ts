export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  job?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse {
  data: User;
  support?: {
    url: string;
    text: string;
  };
}

export interface UsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support?: {
    url: string;
    text: string;
  };
}

export interface CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  job: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}