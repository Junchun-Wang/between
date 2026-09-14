import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SettingsState = {
  faceIdEnabled: boolean
  aiOrganizingEnabled: boolean
  cloudSyncEnabled: boolean
  hasSeenAiPermission: boolean
  setFaceIdEnabled: (enabled: boolean) => void
  setAiOrganizingEnabled: (enabled: boolean) => void
  setCloudSyncEnabled: (enabled: boolean) => void
  markAiPermissionSeen: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      faceIdEnabled: true,
      aiOrganizingEnabled: true,
      cloudSyncEnabled: false,
      hasSeenAiPermission: false,
      setFaceIdEnabled: (enabled) => set({ faceIdEnabled: enabled }),
      setAiOrganizingEnabled: (enabled) => set({ aiOrganizingEnabled: enabled }),
      setCloudSyncEnabled: (enabled) => set({ cloudSyncEnabled: enabled }),
      markAiPermissionSeen: () => set({ hasSeenAiPermission: true }),
    }),
    {
      name: 'between-settings-store',
      partialize: (state) => ({
        faceIdEnabled: state.faceIdEnabled,
        aiOrganizingEnabled: state.aiOrganizingEnabled,
        cloudSyncEnabled: state.cloudSyncEnabled,
        hasSeenAiPermission: state.hasSeenAiPermission,
      }),
    },
  ),
)
