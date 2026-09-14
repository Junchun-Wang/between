import { Trash2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { useMemoryStore } from '../store/useMemoryStore'

const demoPeople: Record<string, { name: string }> = {
  chen: { name: '王俊淳' },
  linran: { name: '林然' },
  maya: { name: 'Maya' },
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(value))
}

export function PersonTimeline() {
  const { personId } = useParams()
  const people = useMemoryStore((state) => state.people)
  const memories = useMemoryStore((state) => state.memories)
  const person = people.find((item) => item.id === personId)
  const demoPerson = personId ? demoPeople[personId] : undefined
  const fallbackPerson = people[0]
  const personName = person?.name ?? demoPerson?.name ?? fallbackPerson?.name ?? '王俊淳'
  const relatedMemories = person ? memories.filter((memory) => memory.peopleIds.includes(person.id)) : []
  const items = relatedMemories.length
    ? relatedMemories.map((memory) => ({
        id: memory.id,
        date: formatDate(memory.createdAt),
        title: memory.content,
        body: '这条记忆已经被保存下来。',
      }))
    : person
      ? [
          {
            id: 'empty-person-timeline',
            date: '等待第一条',
            title: '还没有和 TA 相关的共同时间',
            body: '写下一句话之后，这里会按日期慢慢整理出来。',
          },
        ]
    : [
        {
          id: 'mvp-flow',
          date: '今天',
          title: '今天和 Maya 聊了一会儿。她说最近有点累，但还是记得我之前提到的那个计划。',
          body: '一次值得保留的共同时间。',
        },
        { id: 'soft-space', date: '7/24', title: '今天想到她说话前会先停一下，好像在认真替别人留空间。', body: '关系里很小的一次停顿。' },
        { id: 'small-greeting', date: '7/24', title: '333', body: '一条还可以继续补充的短记录。' },
      ]

  return (
    <section className="screen-content hifi-page person-timeline-page with-nav">
      <p className="eyebrow">共同时间</p>
      <h1 className="hifi-title">{personName}</h1>
      <p className="hifi-subtitle">按时间看看你和 TA 之间留下过什么。</p>

      <div className="person-calendar-strip" aria-label="最近日期">
        {['今天', '7/24', '7/21', '7/15'].map((day, index) => (
          <span className={index === 0 ? 'active' : ''} key={day}>{day}</span>
        ))}
      </div>

      <div className="person-timeline-list">
        {items.map((item) => (
          <article className="glass-card person-timeline-row" key={item.id}>
            <Link to={item.id === 'empty-person-timeline' ? '/capture' : `/memories/${item.id}`} state={item.id === 'empty-person-timeline' ? { personId: person?.id, flow: 'profile' } : undefined}>
              <span>{item.date}</span>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </Link>
            {item.id === 'empty-person-timeline' ? null : <Link className="person-timeline-delete" to="/states/delete-confirmation" state={{ memoryId: relatedMemories.some((memory) => memory.id === item.id) ? item.id : undefined }} aria-label="删除这条共同时间">
              <Trash2 size={15} strokeWidth={1.8} />
            </Link>}
          </article>
        ))}
      </div>

      <BottomNav />
    </section>
  )
}
