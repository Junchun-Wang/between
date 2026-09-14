import { Link } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { sortMemoriesByRecent } from '../data/productRules'
import { useMemoryStore } from '../store/useMemoryStore'

function formatTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

export function Today() {
  const memories = useMemoryStore((state) => state.memories)
  const people = useMemoryStore((state) => state.people)
  const savedMoments = sortMemoriesByRecent(memories).map((memory) => {
        const person = people.find((item) => item.id === memory.peopleIds[0])
        return {
          id: memory.id,
          personName: person?.name ?? '未命名的人',
          content: memory.content,
          time: formatTime(memory.createdAt),
        }
      })
  const hasPeople = people.length > 0
  const captureTarget = hasPeople ? '/capture' : '/onboarding'
  const captureState = hasPeople ? { flow: 'today' as const } : undefined

  return (
    <section className="screen-content hifi-page today-hifi with-nav">
      <p className="date-label">7月23日</p>
      <h1 className="hifi-title today-main-title">今天</h1>
      <p className="hifi-subtitle single-line">你和谁之间，发生了什么值得记住的事？</p>

      <article className="glass-card today-prompt-card">
        <div>
          <h2>写下一个瞬间</h2>
          <p>一句话就可以。那些很小的细节，之后会变成关系的线索</p>
        </div>
        <Link className="mini-cta" to={captureTarget} state={captureState}>
          {hasPeople ? '记录' : '添加'}
        </Link>
      </article>

      <h2 className="section-title recent-title">最近的瞬间</h2>
      <div className="recent-stack">
        {savedMoments.length ? savedMoments.map((moment) => (
          <Link className="glass-card recent-memory-card" key={moment.id} to={`/memories/${moment.id}`}>
            <span>{moment.personName}</span>
            <h3>{moment.content}</h3>
            <time>{moment.time}</time>
          </Link>
        )) : (
          <article className="glass-card recent-memory-card today-empty-memory">
            <span>{hasPeople ? '还没有记录' : '先从一个人开始'}</span>
            <h3>{hasPeople ? '写下一句话，今天就会出现在这里。' : '添加一个重要的人之后，再记下第一个瞬间。'}</h3>
            <time>等待第一条记忆</time>
          </article>
        )}
      </div>

      <p className="soft-note-pill">我正在慢慢了解你的关系世界</p>
      <BottomNav />
    </section>
  )
}
