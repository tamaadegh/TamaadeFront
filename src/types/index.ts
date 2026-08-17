export interface ProductImage {
  id: number;
  url: string | null;
  file_id: string | null;
  is_primary: boolean;
  order: number;
}

export interface ProductVideo {
  id: number;
  url: string | null;
  file_id: string | null;
  is_primary: boolean;
  order: number;
}

export interface Product {
  id: number;
  slug: string;
  variantId: number | null;
  seller: string;
  category: string;
  name: string;
  desc: string;
  image: string | null;
  video: string | null;
  price: string;
  compare_at_price: string | null;
  discount_percent: number | null;
  promo_label: string;
  brand: string;
  is_new: boolean;
  is_express: boolean;
  sale_ends_at: string | null;
  quantity: number;
  images: ProductImage[];
  videos: ProductVideo[];
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface HeroBanner {
  id: number;
  title: string;
  image: string | null;
  link: string;
  order: number;
  is_active?: boolean;
}

export interface PriceTier {
  id: number;
  amount: number;
  order: number;
  is_active?: boolean;
}

export interface StorefrontPromo {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  highlight: string;
  cta_label: string;
  link: string;
  is_active?: boolean;
  order: number;
}

export interface MerchTile {
  id: number;
  placement: "main" | "featured" | "bottom";
  title: string;
  image: string | null;
  link: string;
  badge: string;
  highlight: boolean;
  order: number;
}

export interface HomeSection {
  id: number;
  key: string;
  location: "home" | "deals";
  title: string;
  subtitle: string;
  cta_label: string;
  link: string;
  product_source: "newest" | "featured" | "bestsellers";
  order: number;
}

export interface NavLink {
  id: number;
  label: string;
  link: string;
  has_dropdown: boolean;
  order: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface OrderItem {
  id: number;
  order: number;
  product: number;
  quantity: number;
  price: string;
  cost: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  buyer: string;
  shipping_address: number | null;
  billing_address: number | null;
  payment: number | null;
  order_items: OrderItem[];
  total_cost: number;
  status: "P" | "C";
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  buyer: string;
  status: "P" | "C" | "F";
  payment_option: "S" | "P" | "H";
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: number;
  user: string;
  address_type: "S" | "B";
  default: boolean;
  country: string;
  city: string;
  street_address: string;
  apartment_address: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  avatar: string | null;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  phone_number: string | null;
  first_name: string;
  last_name: string;
  is_active: boolean;
  profile: Profile;
  addresses: Address[];
}

export interface AuthTokens {
  access?: string;
  refresh?: string;
  access_token?: string;
  refresh_token?: string;
}

export interface LoginCredentials {
  email?: string;
  phone_number?: string;
  password: string;
}

export interface RegisterPayload {
  email?: string;
  phone_number?: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
}
