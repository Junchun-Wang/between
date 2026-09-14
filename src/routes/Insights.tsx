import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { getPrimaryInsight } from '../data/productRules'
import { useMemoryStore } from '../store/useMemoryStore'

export function Insights() {
  const memories = useMemoryStore((state) => state.memories)
  const people = useMemoryStore((state) => state.people)
  const primaryInsight = getPrimaryInsight(people, memories)
  const waitingPerson = primaryInsight.type === 'waiting' ? primaryInsight.person : undefined
  const personName = primaryInsight.type === 'repeated-person' ? primaryInsight.person.name : waitingPerson?.name ?? '开始记录'
  const nextTo = waitingPerson ? '/capture' : '/onboarding'

  return (
    <section className="screen-content hifi-page insights-hifi with-nav">
      <p className="eyebrow">关系洞察</p>
      <h1 className="hifi-title">洞察</h1>
      <p className="hifi-subtitle">不替你下判断，只把反复出现的关系线索安静整理出来</p>

      {primaryInsight.type === 'repeated-person' ? (
        <>
          <Link className="glass-card insight-hero-card" to="/insights/repeated-person">
            <div className="insight-hero-copy">
              <span>来自最近 {primaryInsight.count} 条相关记忆</span>
              <h2>
                <span className="insight-person-prefix">你最近反复想到</span>
                <span className="insight-person-name">{personName}</span>
              </h2>
              <p>这些记录大多围绕同一个问题：怎样做出更安心的判断。</p>
            </div>
            <div className="insight-hero-avatar">{personName.slice(0, 1)}</div>
            <div className="insight-next-cta">
              下一步该怎么做
              <ArrowRight size={15} strokeWidth={2} />
            </div>
          </Link>

          <h2 className="section-title insight-section-title">最近浮现的线索</h2>
          <Link className="glass-card clue-card" to="/insights/repeated-person">
            <h3>你经常提到 {personName}</h3>
            <p>同一个人已经出现在多条记录里</p>
          </Link>
          {people.length > 1 ? (
            <Link className="glass-card clue-card" to="/insights/reconnect-person">
              <h3>也可以轻轻问候另一个人</h3>
              <p>关系线索会随着更多记录慢慢浮现</p>
            </Link>
          ) : null}
        </>
      ) : (
        <Link className="glass-card insight-hero-card insight-empty-card" to={nextTo}>
          <div className="insight-hero-copy">
            <span>{waitingPerson ? `来自最近 ${primaryInsight.memoryCount} 条记忆` : '还没有关系记忆'}</span>
            <h2>
              <span className="insight-person-prefix">{waitingPerson ? '洞察还在等待更多线索' : '先添加一个重要的人'}</span>
              <span className="insight-person-name">{personName}</span>
            </h2>
            <p>{waitingPerson ? `再记录 ${primaryInsight.missingCount || 1} 个和同一个人有关的瞬间，Between 就能更稳地整理出关系线索。` : '关系洞察会从第一个人、第一条记忆开始。'}</p>
          </div>
          <div className="insight-hero-avatar">{waitingPerson ? personName.slice(0, 1) : '+'}</div>
          <div className="insight-next-cta">
            {waitingPerson ? '继续记录' : '添加人物'}
            <ArrowRight size={15} strokeWidth={2} />
          </div>
        </Link>
      )}

      <BottomNav />
    </section>
  )
}
