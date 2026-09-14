import type { Memory } from '../store/useMemoryStore'
import type { Insight } from './db'

export function generateMockInsights(memories: Memory[]): Insight[] {
  if (memories.length < 3) {
    return []
  }

  const now = new Date().toISOString()
  const recentIds = memories.slice(0, 3).map((memory) => memory.id)

  return [
    {
      id: 'mock-repeated-person',
      title: '有些名字最近常常出现',
      body: '这些记忆里反复出现的人，可能正占据你最近很柔软的一部分注意力。',
      relatedMemoryIds: recentIds,
      createdAt: now,
      status: 'ready',
    },
    {
      id: 'mock-soft-theme',
      title: '安心感是一条小线索',
      body: '有些细节不是结论，只是在提醒你：哪些时刻让你觉得被接住。',
      relatedMemoryIds: recentIds,
      createdAt: now,
      status: 'ready',
    },
  ]
}
