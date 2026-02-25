export type UserRole = "penyewa" | "pemilik";

export type KostType = "putra" | "putri" | "campur";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Kost {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  price_monthly: number;
  type: KostType;
  facilities: string[];
  rules: string[];
  images: string[];
  total_rooms: number;
  available_rooms: number;
  rating: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  kost_id: string;
  name: string;
  price_monthly: number;
  facilities: string[];
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  kost_id: string;
  room_id: string | null;
  renter_id: string;
  owner_id: string;
  check_in: string;
  duration_months: number;
  total_price: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  kost_id: string;
  renter_id: string;
  booking_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

// Joined types
export interface KostWithOwner extends Kost {
  profiles: Pick<Profile, "full_name" | "phone" | "avatar_url">;
}

export interface BookingWithKost extends Booking {
  kosts: Pick<Kost, "name" | "address" | "city" | "images">;
}

export interface BookingWithDetails extends Booking {
  kosts: Pick<Kost, "name" | "address" | "city" | "images">;
  renter: Pick<Profile, "full_name" | "phone" | "avatar_url">;
}

export interface ReviewWithRenter extends Review {
  profiles: Pick<Profile, "full_name" | "avatar_url">;
}
