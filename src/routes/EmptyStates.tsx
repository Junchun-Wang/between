import { CalendarPlus, Lightbulb, Plus, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMemoryStore } from '../store/useMemoryStore'

export function EmptyStates() {
  const hasPeople = useMemoryStore((state) => state.people.length > 0)

  return (
    <section className="screen-content hifi-page empty-states-page">
      <p className="eyebrow">空状态</p>
      <h1 className="hifi-title">空状态</h1>
      <p className="hifi-subtitle">一开始什么都没有也没关系，关系会从一点点记录开始。</p>

      <article className="glass-card empty-primary-card">
        <span className="empty-primary-icon">
          <Plus size={18} strokeWidth={2} />
        </span>
        <h2>今天还没记录</h2>
        <p>一句话就可以，先把想到的那一点点留下。</p>
        <Link className="mini-cta empty-primary-action" to={hasPeople ? '/capture' : '/onboarding'}>
          {hasPeople ? '写下一条' : '添加一个人'}
        </Link>
      </article>

      <div className="empty-state-list">
        <article className="glass-card empty-state-row">
          <UsersRound size={16} strokeWidth={1.8} />
          <div>
            <h2>还没有重要的人</h2>
            <p>先添加一个最近常常想到的人。</p>
          </div>
        </article>
        <article className="glass-card empty-state-row">
          <CalendarPlus size={16} strokeWidth={1.8} />
          <div>
            <h2>时间线空空的</h2>
            <p>记录会按时间慢慢排在这里。</p>
          </div>
        </article>
        <article className="glass-card empty-state-row">
          <Lightbulb size={16} strokeWidth={1.8} />
          <div>
            <h2>洞察还在等待</h2>
            <p>多几条记忆之后，线索会浮现出来。</p>
          </div>
        </article>
      </div>
    </section>
  )
}
