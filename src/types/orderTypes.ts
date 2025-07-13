// src/types/orderTypes.ts
export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  userId: number;
  address: string;
  createdAt: string;
  updatedAt: string;
}
