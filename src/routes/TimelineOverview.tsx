import { CalendarDays, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { getPersonSummaries, sortMemoriesByRecent } from '../data/productRules'
import { useMemoryStore } from '../store/useMemoryStore'

function formatMonth(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
  }).format(new Date(value))
}

export function TimelineOverview() {
  const memories = useMemoryStore((state) => state.memories)
  const people = useMemoryStore((state) => state.people)
  const sortedMemories = sortMemoriesByRecent(memories)
  const personSummaries = getPersonSummaries(people, memories)
  const topPerson = personSummaries[0]?.person.name ?? '等待第一条'
  const commonClue = personSummaries[0]?.memoryCount && personSummaries[0].memoryCount >= 2 ? '反复想到同一个人' : '继续记录'
  const monthRows = Object.values(
    sortedMemories.reduce<Record<string, { month: string; count: number; focus: string; note: string }>>((rows, memory) => {
      const month = formatMonth(memory.createdAt)
      const person = people.find((item) => item.id === memory.peopleIds[0])

      rows[month] ??= {
        month,
        count: 0,
        focus: person?.name ?? '未命名的人',
        note: '这一月保存下来的关系瞬间，会在这里慢慢汇总。',
      }
      rows[month].count += 1

      return rows
    }, {}),
  )

  return (
    <section className="screen-content hifi-page timeline-overview-page with-nav">
      <p className="eyebrow">MEMORY OVERVIEW</p>
      <h1 className="hifi-title">总览</h1>
      <p className="hifi-subtitle">把分散的日期、人物和线索放在一张关系地图里。</p>

      <article className="glass-card overview-hero-card">
        <span className="overview-hero-icon">
          <CalendarDays size={18} strokeWidth={1.8} />
        </span>
        <div>
          <strong>{memories.length}</strong>
          <p>条被保存下来的关系瞬间</p>
        </div>
      </article>

      <div className="overview-stats-grid">
        <article className="glass-card">
          <span>最近反复出现</span>
          <strong>{topPerson}</strong>
        </article>
        <article className="glass-card">
          <span>最常见线索</span>
          <strong>{commonClue}</strong>
        </article>
      </div>

      <h2 className="section-title overview-section-title">按月份看</h2>
      <div className="overview-month-list">
        {monthRows.length ? monthRows.map((item) => (
          <Link className="glass-card overview-month-row" key={item.month} to="/timeline">
            <div>
              <span>{item.month}</span>
              <h3>{item.count} 条记忆 · {item.focus}</h3>
              <p>{item.note}</p>
            </div>
            <ChevronRight size={17} strokeWidth={1.8} />
          </Link>
        )) : (
          <Link className="glass-card overview-month-row" to={people.length ? '/capture' : '/onboarding'}>
            <div>
              <span>还没有月份</span>
              <h3>保存第一条记忆后，这里会出现月度总览</h3>
              <p>先从一句话开始，之后再慢慢连成关系地图。</p>
            </div>
            <ChevronRight size={17} strokeWidth={1.8} />
          </Link>
        )}
      </div>

      <BottomNav />
    </section>
  )
}
