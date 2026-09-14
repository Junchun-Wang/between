import type { Memory, Person } from '../store/useMemoryStore'

const INSIGHT_MIN_MEMORY_COUNT = 2
const REPEATED_PERSON_MIN_MEMORY_COUNT = 2
const QUIET_PERSON_DAYS = 7

export type PersonSummary = {
  person: Person
  memoryCount: number
  latestMemory?: Memory
  latestMemoryAt?: string
  statusLabel: string
}

export type RepeatedPersonInsight = {
  type: 'repeated-person'
  person: Person
  count: number
  memories: Memory[]
}

export type WaitingInsight = {
  type: 'waiting'
  person?: Person
  memoryCount: number
  missingCount: number
}

export type PrimaryInsight = RepeatedPersonInsight | WaitingInsight

function getTime(value?: string) {
  return value ? new Date(value).getTime() : 0
}

function daysSince(value?: string) {
  if (!value) {
    return Number.POSITIVE_INFINITY
  }

  return Math.floor((Date.now() - getTime(value)) / 86_400_000)
}

export function sortMemoriesByRecent(memories: Memory[]) {
  return [...memories].sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt))
}

export function getMemoriesForPerson(memories: Memory[], personId?: string) {
  if (!personId) {
    return []
  }

  return sortMemoriesByRecent(memories.filter((memory) => memory.peopleIds.includes(personId)))
}

export function getPersonSummaries(people: Person[], memories: Memory[]) {
  const sortedMemories = sortMemoriesByRecent(memories)

  return people
    .map<PersonSummary>((person) => {
      const personMemories = sortedMemories.filter((memory) => memory.peopleIds.includes(person.id))
      const latestMemory = personMemories[0]
      const quietDays = daysSince(latestMemory?.createdAt)

      return {
        person,
        memoryCount: personMemories.length,
        latestMemory,
        latestMemoryAt: latestMemory?.createdAt,
        statusLabel: latestMemory ? (quietDays >= QUIET_PERSON_DAYS ? '可以问候' : '最近更新') : '等待第一条',
      }
    })
    .sort((a, b) => {
      const latestDelta = getTime(b.latestMemoryAt) - getTime(a.latestMemoryAt)

      if (latestDelta !== 0) {
        return latestDelta
      }

      return getTime(b.person.createdAt) - getTime(a.person.createdAt)
    })
}

export function getQuietPersonSummaries(people: Person[], memories: Memory[]) {
  return getPersonSummaries(people, memories).filter((summary) => summary.memoryCount > 0 && daysSince(summary.latestMemoryAt) >= QUIET_PERSON_DAYS)
}

export function shouldShowAlphabetIndex(people: Person[]) {
  return people.length >= 8
}

export function getPrimaryInsight(people: Person[], memories: Memory[]): PrimaryInsight {
  const sortedPeople = getPersonSummaries(people, memories)
  const repeatedPerson = sortedPeople.find((summary) => summary.memoryCount >= REPEATED_PERSON_MIN_MEMORY_COUNT)

  if (memories.length >= INSIGHT_MIN_MEMORY_COUNT && repeatedPerson) {
    return {
      type: 'repeated-person',
      person: repeatedPerson.person,
      count: repeatedPerson.memoryCount,
      memories: getMemoriesForPerson(memories, repeatedPerson.person.id),
    }
  }

  return {
    type: 'waiting',
    person: sortedPeople[0]?.person,
    memoryCount: memories.length,
    missingCount: Math.max(INSIGHT_MIN_MEMORY_COUNT - memories.length, 0),
  }
}
