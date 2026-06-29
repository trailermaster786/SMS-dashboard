import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isOpen: boolean
  isMobileOpen: boolean
  activeItem: string | null
  expandedItems: string[]
  toggleSidebar: () => void
  closeSidebar: () => void
  openSidebar: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  setActiveItem: (id: string | null) => void
  toggleExpandedItem: (id: string) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      isMobileOpen: false,
      activeItem: null,
      expandedItems: [],

      toggleSidebar: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },

      closeSidebar: () => {
        set({ isOpen: false })
      },

      openSidebar: () => {
        set({ isOpen: true })
      },

      toggleMobileSidebar: () => {
        set((state) => ({ isMobileOpen: !state.isMobileOpen }))
      },

      closeMobileSidebar: () => {
        set({ isMobileOpen: false })
      },

      setActiveItem: (id: string | null) => {
        set({ activeItem: id })
      },

      toggleExpandedItem: (id: string) => {
        set((state) => {
          const isExpanded = state.expandedItems.includes(id)
          return {
            expandedItems: isExpanded
              ? state.expandedItems.filter((item) => item !== id)
              : [...state.expandedItems, id],
          }
        })
      },
    }),
    {
      name: 'sms-sidebar-storage',
      partialize: (state) => ({
        isOpen: state.isOpen,
        expandedItems: state.expandedItems,
      }),
    }
  )
)
