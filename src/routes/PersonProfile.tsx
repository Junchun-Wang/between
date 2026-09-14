import { CalendarDays, MessageCircle, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { useMemoryStore } from '../store/useMemoryStore'

const demoPeople: Record<string, { id: string; name: string; relationLabel: string; memoryCount: number }> = {
  chen: { id: 'chen', name: '王俊淳', relationLabel: '家人', memoryCount: 8 },
  linran: { id: 'linran', name: '林然', relationLabel: '朋友', memoryCount: 4 },
  maya: { id: 'maya', name: 'Maya', relationLabel: '朋友', memoryCount: 2 },
}

const relationOptions = ['朋友', '家人', '导师', '同学', '同事', '其他']

export function PersonProfile() {
  const { personId } = useParams()
  const people = useMemoryStore((state) => state.people)
  const memories = useMemoryStore((state) => state.memories)
  const updatePerson = useMemoryStore((state) => state.updatePerson)
  const person = people.find((item) => item.id === personId)
  const demoPerson = personId ? demoPeople[personId] : undefined
  const fallbackPerson = people[0]
  const personName = person?.name ?? demoPerson?.name ?? fallbackPerson?.name ?? '王俊淳'
  const relation = person?.relationLabel ?? demoPerson?.relationLabel ?? fallbackPerson?.relationLabel ?? '家人'
  const profilePersonId = person?.id ?? demoPerson?.id ?? fallbackPerson?.id ?? 'chen'
  const memoryCount = person?.memoryIds.length ?? demoPerson?.memoryCount ?? fallbackPerson?.memoryIds.length ?? 8
  const relatedMemories = person ? memories.filter((memory) => memory.peopleIds.includes(person.id)).slice(0, 3) : []

  const fallbackMemories = [
    { id: 'mvp-flow', title: '今天和 Maya 聊了一会儿。她说最近有点累，但还是记得我之前提到的那个计划。', body: '这条记忆已经被保存下来。' },
    { id: 'soft-space', title: '今天想到她说话前会先停一下，好像在认真替别人留空间。', body: '来自 7月24日。' },
    { id: 'small-greeting', title: '333', body: '来自 7月24日。' },
  ]
  const memoryItems = relatedMemories.length
    ? relatedMemories.map((memory) => ({ id: memory.id, title: memory.content, body: '这条记忆已经被保存下来。' }))
    : person
      ? [{ id: 'empty-profile-memory', title: '还没有和 TA 相关的瞬间', body: '记录一次之后，这里会变成你们的共同时间。' }]
      : fallbackMemories
  const relationSummary =
    person && !relatedMemories.length
      ? '还没有和 TA 相关的记录。先写下一句话，Between 会慢慢帮你整理你们之间的线索。'
      : '你最近几次记录都和“下一步怎么做”有关。这个人像是一个能让你慢下来、重新整理判断的人。'

  return (
    <section className="screen-content hifi-page person-profile-page with-nav">
      <button className="hifi-top-action" type="button" aria-label="更多">
        ✧
      </button>

      <div className="person-profile-scroll">
        <div className="person-profile-avatar">{personName.slice(0, 1)}</div>
        <h1 className="hifi-title person-profile-title">{personName}</h1>
        <p className="person-profile-meta">
          {relation} · {memoryCount} 条记忆
        </p>

        <article className="glass-card relation-summary-card">
          <h2>关系记忆</h2>
          <p>{relationSummary}</p>
          {person ? (
            <div className="profile-relation-editor" aria-label="修改关系">
              {relationOptions.map((option) => (
                <button
                  className={relation === option ? 'active' : ''}
                  key={option}
                  type="button"
                  onClick={() => updatePerson(person.id, { relationLabel: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </article>

        <div className="section-heading-row person-profile-section">
          <h2 className="section-title">共同时间</h2>
          <Link to={`/people/${profilePersonId}/timeline`}>
            总览
            <CalendarDays size={14} strokeWidth={1.8} />
          </Link>
        </div>
        <div className="profile-memory-list">
          {memoryItems.map((memory) => (
            <Link className="glass-card profile-memory-row" key={memory.id} to={memory.id === 'empty-profile-memory' ? '/capture' : `/memories/${memory.id}`} state={memory.id === 'empty-profile-memory' ? { personId: person?.id, flow: 'profile' } : undefined}>
              <Sparkles size={15} strokeWidth={1.8} />
              <div>
                <h3>{memory.title}</h3>
                <p>{memory.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link
        className="ghost-button profile-message-button"
        to="/capture"
        state={{ personId: person?.id, personName, relationLabel: relation, flow: 'profile' }}
      >
        <MessageCircle size={15} strokeWidth={1.8} />
        记录和 TA 相关的瞬间
      </Link>
      <BottomNav />
    </section>
  )
}
