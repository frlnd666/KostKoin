import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      profile: null,
      loading: true, // ✅ TAMBAH INI
      
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (loading) => set({ loading }), // ✅ TAMBAH INI
      
      logout: () => set({ user: null, profile: null }),
      
      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null
      })),
      
      // ✅ TAMBAH currentRole sebagai computed value
      get currentRole() {
        const state = useAuthStore.getState()
        return state.profile?.role || 'penyewa'
      }
    }),
    {
      name: 'kostkoin-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile
      })
    }
  )
)
