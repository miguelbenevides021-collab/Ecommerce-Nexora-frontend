import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
  highlight?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  oldPrice: number;
  currentPrice: number;
  discount: number;
  installment: string;
  badge?: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}
export interface ApiProduct {
  id: number;
  categoriaId: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  brand: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "CLIENT" | "ADMIN";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

export interface Address {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  estado: string;
  complemento?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  cpf: string;
  address: Address;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  createdAt: string;
  address: Address[];
}

export interface JwtPayload {
  id: number;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: ApiProduct;
}

export interface Cart {
  id?: number;
  userId?: number;
  cartItem: CartItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  product: ApiProduct;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  total: string;
  orderItem: OrderItem[];
  user?: User;
}
