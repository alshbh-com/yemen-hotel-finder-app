
export interface Hotels {
  id: string;
  created_at: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  price_per_night: number;
  stars: number;
  rating?: number | null;
  review_count?: number | null;
  featured?: boolean | null;
  coordinates?: { lat: number; lng: number } | null;
  amenities: string[];
  images: string[];
}

export interface Rooms {
  id: string;
  created_at: string;
  hotel_id: string;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  amenities: string[];
  images: string[];
}

export interface Bookings {
  id: string;
  created_at: string;
  user_id: string;
  hotel_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
}

export interface Profiles {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  is_admin: boolean | null;
}
