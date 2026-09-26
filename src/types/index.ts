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
