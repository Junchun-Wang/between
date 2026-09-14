import { Search, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { getPersonSummaries, getQuietPersonSummaries, shouldShowAlphabetIndex } from '../data/productRules'
import { useMemoryStore } from '../store/useMemoryStore'

const alphabetIndex = ['A', 'C', 'L', 'M', 'W', '#']

export function People() {
  const people = useMemoryStore((state) => state.people)
  const memories = useMemoryStore((state) => state.memories)
  const personSummaries = getPersonSummaries(people, memories)
  const recentSummaries = personSummaries.slice(0, 3)
  const quietSummaries = getQuietPersonSummaries(people, memories)
  const hasPeople = people.length > 0
  const showAlphabetIndex = shouldShowAlphabetIndex(people)

  return (
    <section className="screen-content hifi-page people-hifi with-nav">
      <button className="hifi-top-action" type="button" aria-label="灵感">
        ✧
      </button>
      <p className="eyebrow">RELATION MEMORY</p>
      <h1 className="hifi-title">人物</h1>
      <p className="hifi-subtitle single-line">那些对你重要的人，都安静地在这里</p>

      <div className="search-pill">
        <Search size={15} />
        <span>搜索人名、关系或记忆</span>
      </div>

      {hasPeople ? (
        <>
          <h2 className="section-title people-section-main">最近重要的人</h2>
          {recentSummaries.map((summary, index) => (
            <Link className="glass-card person-row" key={summary.person.id} to={`/people/${summary.person.id}`}>
              <div className={`person-avatar ${index === 0 ? 'pink' : index === 1 ? 'blue' : 'lilac'}`}>
                {summary.person.name.slice(0, 1)}
              </div>
              <div>
                <h3>{summary.person.name}</h3>
                <p>{summary.person.relationLabel ?? '朋友'} · {summary.memoryCount} 条记忆</p>
              </div>
              <span>{summary.statusLabel}</span>
            </Link>
          ))}

          {quietSummaries.length ? (
            <>
              <h2 className="section-title people-section-secondary">好久没联系</h2>
              {quietSummaries.slice(0, 2).map((summary) => (
                <Link className="glass-card person-row" key={summary.person.id} to={`/people/${summary.person.id}`}>
                  <div className="person-avatar lilac">{summary.person.name.slice(0, 1)}</div>
                  <div>
                    <h3>{summary.person.name}</h3>
                    <p>{summary.person.relationLabel ?? '朋友'} · {summary.memoryCount} 条记忆</p>
                  </div>
                  <span>可以问候</span>
                </Link>
              ))}
            </>
          ) : null}
        </>
      ) : (
        <article className="glass-card empty-primary-card people-empty-card">
          <span className="empty-primary-icon">
            <UserPlus size={18} strokeWidth={2} />
          </span>
          <h2>还没有重要的人</h2>
          <p>先从一个名字开始。关系、原因和更多细节，之后都可以慢慢补。</p>
          <Link className="mini-cta empty-primary-action" to="/onboarding">
            添加一个人
          </Link>
        </article>
      )}

      {showAlphabetIndex ? <div className="people-alpha-index" aria-label="按首字母快速定位">
        {alphabetIndex.map((letter) => (
          <span key={letter}>{letter}</span>
        ))}
      </div> : null}

      <BottomNav />
    </section>
  )
}
