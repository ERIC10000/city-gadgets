export type UserRole = "customer" | "vendor" | "admin";
export type ProductCondition = "new" | "refurbished";
export type ProductStatus = "draft" | "published";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "mpesa" | "whatsapp" | "card";

export type Category = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  hero_tagline: string | null;
  hero_image: string | null;
  sort_order: number;
};

export type ProductImage = {
  url: string;
  alt: string;
};

export type Product = {
  id: string;
  vendor_id: string | null;
  category_slug: string;
  slug: string;
  name: string;
  brand: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  condition: ProductCondition;
  stock_quantity: number;
  is_featured: boolean;
  badge: string | null;
  specs: Record<string, string>;
  rating: number;
  review_count: number;
  status: ProductStatus;
  images: ProductImage[];
};

export type ProductVideo = {
  id: string;
  vendor_id: string | null;
  product_id: string | null;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  category: string | null;
  view_count: number;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  loyalty_points: number;
  store_credit: number;
};

export type Address = {
  id: string;
  user_id: string;
  label: string | null;
  line1: string;
  city: string;
  phone: string | null;
  is_default: boolean;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};

export type Order = {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_method: PaymentMethod | null;
  phone_number: string | null;
  shipping_address: Record<string, string> | null;
  created_at: string;
  items?: OrderItem[];
};

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};
