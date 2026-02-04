import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// AUTH
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getCurrentProfile = async () => {
  const user = await getCurrentUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

export const signInWithOTP = async (phone) => {
  const { data, error } = await supabase.auth.signInWithOtp({ phone })
  if (error) throw error
  return data
}

export const verifyOTP = async (phone, token) => {
  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const createProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, ...profileData }])
    .select()
    .single()

  if (error) throw error
  return data
}

// KOSTS
export const searchNearbyKosts = async (lat, lng, radiusKm = 20) => {
  const { data, error } = await supabase.rpc('search_kosts_nearby', {
    user_lat: lat,
    user_lng: lng,
    radius_km: radiusKm
  })
  if (error) throw error
  return data || []
}

export const getKostBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('kosts')
    .select(`
      *,
      owner:profiles!kosts_owner_id_fkey(full_name, phone, avatar_url),
      rooms(id, room_number, room_type, status)
    `)
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export const getKostById = async (kostId) => {
  const { data, error } = await supabase
    .from('kosts')
    .select('*')
    .eq('id', kostId)
    .single()

  if (error) throw error
  return data
}

export const getOwnerKosts = async (ownerId) => {
  const { data, error } = await supabase
    .from('kosts')
    .select('*, rooms(count)')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateKost = async (kostId, updates) => {
  const { data, error } = await supabase
    .from('kosts')
    .update(updates)
    .eq('id', kostId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteKost = async (kostId) => {
  const { error } = await supabase
    .from('kosts')
    .delete()
    .eq('id', kostId)

  if (error) throw error
}

// ROOMS
export const getAvailableRooms = async (kostId, startTime, endTime) => {
  const { data, error } = await supabase.rpc('get_available_rooms', {
    p_kost_id: kostId,
    p_start_time: startTime,
    p_end_time: endTime
  })
  if (error) throw error
  return data || []
}

// BOOKINGS
export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select(`
      *,
      kost:kosts(name, address, city),
      room:rooms(room_number, room_type)
    `)
    .single()

  if (error) throw error
  return data
}

export const getUserBookings = async (userId, status = null) => {
  let query = supabase
    .from('bookings')
    .select(`
      *,
      kost:kosts(name, address, city, photos),
      room:rooms(room_number, room_type)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) throw error
  return data
}

export const getActiveBooking = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      kost:kosts(name, address, city, photos),
      room:rooms(room_number, room_type)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('start_time', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export const getOwnerBookings = async (ownerId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      kost:kosts!inner(name, address, owner_id),
      room:rooms(room_number, room_type),
      user:profiles(full_name, phone)
    `)
    .eq('kost.owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getBookingById = async (bookingId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      kost:kosts(name, address, city, photos),
      room:rooms(room_number, room_type),
      user:profiles(full_name, phone)
    `)
    .eq('id', bookingId)
    .single()

  if (error) throw error
  return data
}

export const updateBooking = async (bookingId, updates) => {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single()

  if (error) throw error
  return data
}

// FAVORITES
export const addFavorite = async (userId, kostId) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, kost_id: kostId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const removeFavorite = async (userId, kostId) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('kost_id', kostId)

  if (error) throw error
}

export const isFavorite = async (userId, kostId) => {
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('kost_id', kostId)
    .maybeSingle()

  return !!data
}

// REVIEWS
export const getKostReviews = async (kostId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:profiles(full_name, avatar_url)
    `)
    .eq('kost_id', kostId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
