import { Link } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { sortMemoriesByRecent } from '../data/productRules'
import { useMemoryStore } from '../store/useMemoryStore'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(value))
}

export function Timeline() {
  const memories = useMemoryStore((state) => state.memories)
  const people = useMemoryStore((state) => state.people)
  const hasPeople = people.length > 0
  const savedItems = sortMemoriesByRecent(memories).map((memory) => {
        const person = people.find((item) => item.id === memory.peopleIds[0])
        return {
          id: memory.id,
          date: formatDate(memory.createdAt),
          name: person?.name ?? '未命名的人',
          title: memory.content,
          body: '这条记忆已经被保存下来',
        }
      })

  return (
    <section className="screen-content hifi-page timeline-hifi with-nav">
      <button className="hifi-top-action" type="button" aria-label="灵感">
        ✧
      </button>
      <p className="eyebrow">MEMORY TIMELINE</p>
      <h1 className="hifi-title">时间线</h1>
      <p className="hifi-subtitle single-line">那些小小的瞬间，会慢慢连成关系的形状</p>

      <div className="timeline-filter-row">
        <div className="filter-pill">全部记忆 · 最近优先</div>
        <Link className="overview-mini-link" to={savedItems.length ? '/timeline/overview' : hasPeople ? '/capture' : '/onboarding'}>
          {savedItems.length ? '总览' : '开始'}
        </Link>
      </div>

      <div className="timeline-scroll" aria-label="记忆时间线">
        <div className="timeline-thread" />
        <div className="timeline-items">
          {savedItems.length ? savedItems.map((item, index) => (
            <Link className="glass-card timeline-bubble" key={`${item.date}-${item.title}`} to={`/memories/${item.id}`}>
              <span>{index === 0 ? '今天' : item.date}</span>
              <h2>{item.title}</h2>
              <p>{item.name} · {item.body}</p>
            </Link>
          )) : (
            <article className="glass-card timeline-bubble timeline-empty-bubble">
              <span>还没有时间点</span>
              <h2>保存第一条记忆后，时间线会从这里开始。</h2>
              <p>那些很小的瞬间，会按日期慢慢连起来。</p>
            </article>
          )}
        </div>
      </div>

      <BottomNav />
    </section>
  )
}
