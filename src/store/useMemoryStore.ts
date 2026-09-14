import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Memory = {
  id: string
  content: string
  note?: string
  createdAt: string
  updatedAt: string
  peopleIds: string[]
  tags: string[]
  sourceType: 'text' | 'voice' | 'photo'
  photoUris: string[]
  transcriptStatus?: 'none' | 'recording' | 'transcribing' | 'done' | 'failed'
  aiProcessed: boolean
}

export type Person = {
  id: string
  name: string
  relationLabel?: string
  createdAt: string
  memoryIds: string[]
}

type AddMemoryInput = {
  content: string
  personId?: string
  sourceType?: Memory['sourceType']
  photoUris?: string[]
}

type UpdateMemoryInput = {
  content?: string
  note?: string
  tags?: string[]
}

type UpdatePersonInput = {
  name?: string
  relationLabel?: string
}

type MemoryState = {
  memories: Memory[]
  people: Person[]
  activePersonId?: string
  draftMemory: string
  draftSourceType: Memory['sourceType']
  draftPhotoUris: string[]
  createPerson: (name: string, relationLabel?: string) => Person
  setActivePerson: (personId: string) => void
  setDraftMemory: (content: string) => void
  setDraftSourceType: (sourceType: Memory['sourceType']) => void
  setDraftPhotoUris: (photoUris: string[]) => void
  addMemory: (input: AddMemoryInput) => Memory
  updateMemory: (memoryId: string, input: UpdateMemoryInput) => void
  deleteMemory: (memoryId: string) => void
  clearAllData: () => void
  updatePerson: (personId: string, input: UpdatePersonInput) => void
  clearDraftMemory: () => void
}

function createId() {
  if ('crypto' in window && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set, get) => ({
      memories: [],
      people: [],
      activePersonId: undefined,
      draftMemory: '',
      draftSourceType: 'text',
      draftPhotoUris: [],

      createPerson: (name, relationLabel) => {
        const now = new Date().toISOString()
        const existing = get().people.find((person) => person.name.trim() === name.trim())

        if (existing) {
          set({ activePersonId: existing.id })
          return existing
        }

        const person: Person = {
          id: createId(),
          name: name.trim(),
          relationLabel,
          createdAt: now,
          memoryIds: [],
        }

        set((state) => ({
          people: [person, ...state.people],
          activePersonId: person.id,
        }))

        return person
      },

      setActivePerson: (personId) => set({ activePersonId: personId }),

      setDraftMemory: (content) => set({ draftMemory: content }),

      setDraftSourceType: (sourceType) => set({ draftSourceType: sourceType }),

      setDraftPhotoUris: (photoUris) => set({ draftPhotoUris: photoUris }),

      addMemory: ({ content, personId, sourceType = 'text', photoUris = [] }) => {
        const now = new Date().toISOString()
        const finalPersonId = personId ?? get().activePersonId
        const memory: Memory = {
          id: createId(),
          content: content.trim(),
          note: '',
          createdAt: now,
          updatedAt: now,
          peopleIds: finalPersonId ? [finalPersonId] : [],
          tags: [],
          sourceType,
          photoUris,
          transcriptStatus: sourceType === 'voice' ? 'done' : 'none',
          aiProcessed: false,
        }

        set((state) => ({
          memories: [memory, ...state.memories],
          people: state.people.map((person) =>
            person.id === finalPersonId ? { ...person, memoryIds: [memory.id, ...person.memoryIds] } : person,
          ),
          draftMemory: '',
          draftSourceType: 'text',
          draftPhotoUris: [],
        }))

        return memory
      },

      updateMemory: (memoryId, input) => {
        const now = new Date().toISOString()

        set((state) => ({
          memories: state.memories.map((memory) =>
            memory.id === memoryId
              ? {
                  ...memory,
                  content: input.content?.trim() ?? memory.content,
                  note: input.note?.trim() ?? memory.note,
                  tags: input.tags ?? memory.tags,
                  updatedAt: now,
                }
              : memory,
          ),
        }))
      },

      deleteMemory: (memoryId) => {
        set((state) => ({
          memories: state.memories.filter((memory) => memory.id !== memoryId),
          people: state.people.map((person) => ({
            ...person,
            memoryIds: person.memoryIds.filter((id) => id !== memoryId),
          })),
        }))
      },

      clearAllData: () => {
        set({
          memories: [],
          people: [],
          activePersonId: undefined,
          draftMemory: '',
          draftSourceType: 'text',
          draftPhotoUris: [],
        })
      },

      updatePerson: (personId, input) => {
        set((state) => ({
          people: state.people.map((person) =>
            person.id === personId
              ? {
                  ...person,
                  name: input.name?.trim() || person.name,
                  relationLabel: input.relationLabel?.trim() || person.relationLabel,
                }
              : person,
          ),
        }))
      },

      clearDraftMemory: () => set({ draftMemory: '', draftSourceType: 'text', draftPhotoUris: [] }),
    }),
    {
      name: 'between-memory-store',
      partialize: (state) => ({
        memories: state.memories,
        people: state.people,
        activePersonId: state.activePersonId,
        draftMemory: state.draftMemory,
        draftSourceType: state.draftSourceType,
        draftPhotoUris: state.draftPhotoUris,
      }),
    },
  ),
)
