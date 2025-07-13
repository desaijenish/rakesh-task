// src/types/productRateTypes.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  sku: string;
  category: number;
  currentStock: number;
  image: string[];
  averageRating: number;
  createdAt: string;
}

export interface ProductRate {
  id?: string;
  rate: number;
  productId: string;
  startDate: string;
  endDate: string;
  product?: Product;
}

export interface ProductRateListResponse {
  rates: ProductRate[];
  product: Product;
}
