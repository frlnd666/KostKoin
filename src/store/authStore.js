import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      loading: true,
      
      setUser: (user) => set({ user }),
      
      setProfile: (profile) => set({ profile }),
      
      setLoading: (loading) => set({ loading }),
      
      logout: () => set({ user: null, profile: null }),
      
      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null
      })),
      
      getCurrentRole: () => {
        const state = get()
        return state.profile?.role || 'penyewa'
      },
      
      isProfileComplete: () => {
        const state = get()
        if (!state.profile) return false
        
        const { full_name, role } = state.profile
        return !!(
          full_name && 
          full_name !== 'User' && 
          full_name !== 'User Baru' && 
          full_name.trim() !== '' &&
          role
        )
      }
    }),
    {
      name: 'kostkoin-v3-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile
      })
    }
  )
)
