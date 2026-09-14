import Dexie, { type Table } from 'dexie'
import type { Memory, Person } from '../store/useMemoryStore'

export type Insight = {
  id: string
  title: string
  body: string
  relatedMemoryIds: string[]
  createdAt: string
  status: 'pending' | 'ready' | 'failed'
}

class BetweenDatabase extends Dexie {
  memories!: Table<Memory, string>
  people!: Table<Person, string>
  insights!: Table<Insight, string>

  constructor() {
    super('between-mvp')
    this.version(1).stores({
      memories: 'id, createdAt, updatedAt, sourceType, aiProcessed',
      people: 'id, name, createdAt',
      insights: 'id, createdAt, status',
    })
  }
}

export const db = new BetweenDatabase()
