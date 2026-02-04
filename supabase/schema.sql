-- ============================================
-- KOSTKOIN DATABASE SCHEMA
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Types
CREATE TYPE user_role AS ENUM ('penyewa', 'pemilik', 'both');
CREATE TYPE booking_status AS ENUM ('booked', 'active', 'completed', 'cancelled');
CREATE TYPE room_status AS ENUM ('available', 'occupied', 'cleaning');

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'penyewa',
  avatar_url TEXT,
  total_bookings INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kosts
CREATE TABLE kosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(50) NOT NULL,
  province VARCHAR(50) DEFAULT 'Banten',
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  description TEXT,
  facilities JSONB DEFAULT '[]'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  price_per_hour INTEGER NOT NULL CHECK (price_per_hour > 0),
  min_duration_hours INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  rating_avg NUMERIC(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX kosts_location_idx ON kosts USING GIST(location);
CREATE INDEX kosts_city_idx ON kosts(city);
CREATE INDEX kosts_owner_idx ON kosts(owner_id);

-- Rooms
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kost_id UUID NOT NULL REFERENCES kosts(id) ON DELETE CASCADE,
  room_number VARCHAR(20) NOT NULL,
  room_type VARCHAR(50) DEFAULT 'Standard',
  status room_status DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(kost_id, room_number)
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_code VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kost_id UUID NOT NULL REFERENCES kosts(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_hours INTEGER NOT NULL,
  price_per_hour INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  status booking_status DEFAULT 'booked',
  checkin_code VARCHAR(30) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX bookings_user_idx ON bookings(user_id);
CREATE INDEX bookings_kost_idx ON bookings(kost_id);
CREATE INDEX bookings_status_idx ON bookings(status);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  kost_id UUID NOT NULL REFERENCES kosts(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kost_id UUID NOT NULL REFERENCES kosts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, kost_id)
);

-- Triggers
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_code := 'KK-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_code BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION generate_booking_code();

CREATE OR REPLACE FUNCTION generate_checkin_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'booked' THEN
    NEW.checkin_code := 'CHK-' || SUBSTRING(NEW.id::TEXT, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_checkin_code BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION generate_checkin_code();

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Active kosts visible" ON kosts FOR SELECT USING (is_active = true);
CREATE POLICY "Owners manage kosts" ON kosts FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Rooms visible" ON rooms FOR SELECT USING (true);
CREATE POLICY "Owners manage rooms" ON rooms FOR ALL USING (
  EXISTS (SELECT 1 FROM kosts WHERE kosts.id = rooms.kost_id AND kosts.owner_id = auth.uid())
);

CREATE POLICY "Users view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners view kost bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM kosts WHERE kosts.id = bookings.kost_id AND kosts.owner_id = auth.uid())
);
CREATE POLICY "Users create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own" ON bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners update kost bookings" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM kosts WHERE kosts.id = bookings.kost_id AND kosts.owner_id = auth.uid())
);

CREATE POLICY "Reviews visible" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage favorites" ON favorites FOR ALL USING (auth.uid() = user_id);
