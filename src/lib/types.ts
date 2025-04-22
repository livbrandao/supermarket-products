// Define os tipos de dados para o sistema
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  brand: Brand;
  brandId: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilter {
  name?: string;
  page: number;
  limit: number;
}
