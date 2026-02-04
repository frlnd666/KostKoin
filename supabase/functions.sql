-- Search nearby kosts
CREATE OR REPLACE FUNCTION search_kosts_nearby(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  slug VARCHAR,
  address TEXT,
  city VARCHAR,
  price_per_hour INTEGER,
  min_duration_hours INTEGER,
  rating_avg NUMERIC,
  total_reviews INTEGER,
  facilities JSONB,
  photos JSONB,
  distance_km NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    k.id, k.name, k.slug, k.address, k.city,
    k.price_per_hour, k.min_duration_hours,
    k.rating_avg, k.total_reviews, k.facilities, k.photos,
    ROUND(
      ST_Distance(
        k.location,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
      )::NUMERIC / 1000, 2
    ) AS distance_km
  FROM kosts k
  WHERE k.is_active = TRUE
    AND ST_DWithin(
      k.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km ASC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get available rooms
CREATE OR REPLACE FUNCTION get_available_rooms(
  p_kost_id UUID,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ
)
RETURNS TABLE (
  id UUID,
  room_number VARCHAR,
  room_type VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.room_number, r.room_type
  FROM rooms r
  WHERE r.kost_id = p_kost_id
    AND r.status = 'available'
    AND NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.room_id = r.id
        AND b.status IN ('booked', 'active')
        AND (b.start_time, b.end_time) OVERLAPS (p_start_time, p_end_time)
    )
  ORDER BY r.room_number;
END;
$$ LANGUAGE plpgsql STABLE;
