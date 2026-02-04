import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      currentRole: 'penyewa',
      loading: true,

      setUser: (user) => set({ user }),
      setProfile: (profile) => {
        const defaultRole = profile?.role === 'pemilik' ? 'pemilik' : 'penyewa'
        set({ profile, currentRole: defaultRole })
      },
      setLoading: (loading) => set({ loading }),

      switchRole: (role) => {
        const { profile } = get()
        if (profile?.role === 'both') {
          set({ currentRole: role })
        }
      },

      logout: () => set({ user: null, profile: null, currentRole: 'penyewa' })
    }),
    {
      name: 'kostkoin-auth',
      partialize: (state) => ({ currentRole: state.currentRole })
    }
  )
)

export const useMapStore = create((set) => ({
  userLocation: null,
  mapCenter: [-6.12, 106.15],
  mapZoom: 11,
  nearbyKosts: [],

  setUserLocation: (location) => set({ 
    userLocation: location,
    mapCenter: [location.lat, location.lng],
    mapZoom: 13
  }),
  setNearbyKosts: (kosts) => set({ nearbyKosts: kosts })
}))
