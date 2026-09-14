import { Link, useParams } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { getMemoriesForPerson, getPrimaryInsight } from '../data/productRules'
import { useMemoryStore } from '../store/useMemoryStore'

export function InsightDetail() {
  const { insightId } = useParams()
  const people = useMemoryStore((state) => state.people)
  const memories = useMemoryStore((state) => state.memories)
  const primaryInsight = getPrimaryInsight(people, memories)
  const repeatedPerson = primaryInsight.type === 'repeated-person' ? primaryInsight.person : undefined
  const reconnectPerson = people.find((person) => person.id !== repeatedPerson?.id) ?? repeatedPerson ?? people[0]
  const targetPerson = insightId?.startsWith('reconnect') ? reconnectPerson : repeatedPerson ?? people[0]
  const personName = targetPerson?.name ?? '一个人'
  const recentMemories = getMemoriesForPerson(memories, targetPerson?.id).slice(0, 2)

  return (
    <section className="screen-content hifi-page insight-detail-page with-nav">
      <div className="insight-detail-scroll">
      <p className="eyebrow">关系洞察</p>
      <h1 className="hifi-title insight-detail-title">
        也许可以
        <br />
        重新联系 {personName}
      </h1>

      <article className="glass-card insight-detail-main-card">
        <span>一个轻轻的提醒</span>
        <p>一段关系没有消失，只是有一阵子没有被更新。你可以不用解释太多，先从一句很轻的话开始。</p>
      </article>

      <h2 className="section-title insight-detail-section">为什么这么提醒你</h2>
      <div className="insight-reason-thread">
        <article className="glass-card insight-reason-card">
          <span>最近反复出现</span>
          <p>{personName} 的名字在最近的记忆里出现了几次。</p>
        </article>
        <article className="glass-card insight-reason-card">
          <span>有一段空白</span>
          <p>你已经有一段时间没有主动更新和 TA 有关的内容。</p>
        </article>
      </div>

      <div className="insight-detail-scroll-tail">
        <div className="insight-related-list">
          {recentMemories.length ? recentMemories.map((memory) => (
              <Link className="glass-card insight-related-memory" key={memory.id} to={`/memories/${memory.id}`}>
                {memory.content}
              </Link>
            )) : (
              <article className="glass-card insight-related-memory">
                还没有足够多的相关记录。先写下一次问候，线索会慢慢清晰。
              </article>
            )}
        </div>
      </div>

      </div>

      <div className="insight-detail-bottom-fade" aria-hidden="true" />
      <Link
        className="primary-button insight-record-button"
        to="/capture"
        state={{
          flow: 'insight',
          personId: targetPerson?.id,
          personName,
          relationLabel: targetPerson?.relationLabel,
        }}
      >
        记录一次问候
      </Link>
      <BottomNav />
    </section>
  )
}
