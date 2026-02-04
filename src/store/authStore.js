import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      profile: null,

      setUser: (user) => set({ user }),

      setProfile: (profile) => set({ profile }),

      logout: () => set({ user: null, profile: null }),

      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null
      }))
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
