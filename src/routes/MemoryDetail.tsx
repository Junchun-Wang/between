import { Lock, Plus, Save, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMemoryStore } from '../store/useMemoryStore'

const demoMemories: Record<string, { personName: string; title: string; body: string; time: string }> = {
  'mvp-flow': {
    personName: '王俊淳',
    title: '聊到 MVP 用户流程',
    body: '今天下午和王俊淳聊到 MVP 用户流程。他提醒我先把最小闭环跑通，不要一开始就追求完美。第一周，先证明这件事能不能继续。',
    time: '13:20',
  },
  'soft-space': {
    personName: '王俊淳',
    title: '认真告别留白空间',
    body: '今天想到她说话前会先停一下，好像在认真替别人留空间。这个很小的瞬间，值得之后再慢慢补充。',
    time: '10:42',
  },
  'small-greeting': {
    personName: 'Maya',
    title: '一次很轻的问候',
    body: '可以先发一句很轻的问候，不用一下子解释太多。关系也可以从很小的回应继续。',
    time: '昨天',
  },
  'safe-reply': {
    personName: '林然',
    title: '简短却安心的回答',
    body: '一句“可以”，让我没有那么焦虑。那些很短的回应，有时候反而能让关系稳定下来。',
    time: '7/22',
  },
  'product-direction': {
    personName: 'Maya',
    title: '第一次聊产品方向',
    body: '那天开始，我觉得这件事可以继续。不是因为一下子想清楚了，而是因为有人认真接住了这个想法。',
    time: '6/18',
  },
}

function formatMemoryTime(value?: string) {
  if (!value) {
    return '今天 22:18'
  }

  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

function getSourceLabel(sourceType?: 'text' | 'voice' | 'photo') {
  if (sourceType === 'voice') {
    return '语音'
  }

  if (sourceType === 'photo') {
    return '照片'
  }

  return '文字'
}

export function MemoryDetail() {
  const navigate = useNavigate()
  const { memoryId } = useParams()
  const memories = useMemoryStore((state) => state.memories)
  const people = useMemoryStore((state) => state.people)
  const updateMemory = useMemoryStore((state) => state.updateMemory)
  const memory = memories.find((item) => item.id === memoryId)
  const demoMemory = memoryId ? demoMemories[memoryId] : undefined
  const person = memory ? people.find((item) => item.id === memory.peopleIds[0]) : undefined
  const [contentDraft, setContentDraft] = useState(memory?.content ?? '')
  const [noteDraft, setNoteDraft] = useState(memory?.note ?? '')
  const canEdit = Boolean(memory)

  const detail = useMemo(
    () => ({
      personName: person?.name ?? demoMemory?.personName ?? '王俊淳',
      title: memory?.content ? memory.content.slice(0, 18) : demoMemory?.title ?? '聊到 MVP 用户流程',
      body:
        memory?.content ??
        demoMemory?.body ??
        '今天下午和王俊淳聊到 MVP 用户流程。他提醒我先把最小闭环跑通，不要一开始就追求完美。第一周，先证明这件事能不能继续。',
      time: memory ? formatMemoryTime(memory.createdAt) : demoMemory?.time ?? '今天 22:18',
      sourceLabel: getSourceLabel(memory?.sourceType),
      photoUri: memory?.photoUris[0],
    }),
    [demoMemory, memory, person],
  )

  useEffect(() => {
    setContentDraft(memory?.content ?? '')
    setNoteDraft(memory?.note ?? '')
  }, [memory])

  function handleSave() {
    if (memory && contentDraft.trim()) {
      updateMemory(memory.id, {
        content: contentDraft,
        note: noteDraft,
      })
    }

    navigate('/timeline')
  }

  return (
    <section className="screen-content hifi-page memory-detail-page">
      <button className="hifi-top-action memory-detail-lock" type="button" aria-label="私密记忆">
        <Lock size={16} strokeWidth={1.8} />
      </button>
      <p className="eyebrow">记忆详情</p>
      <h1 className="hifi-title memory-detail-title">{detail.title}</h1>
      <p className="hifi-subtitle memory-detail-meta">
        {detail.personName} · {detail.time} · {detail.sourceLabel}
      </p>

      <article className="glass-card memory-detail-card">
        {detail.photoUri ? <img className="memory-detail-photo" src={detail.photoUri} alt="记忆照片" /> : null}
        {canEdit ? (
          <textarea
            className="memory-detail-textarea"
            aria-label="记忆正文"
            value={contentDraft}
            onChange={(event) => setContentDraft(event.target.value)}
          />
        ) : (
          <p>{detail.body}</p>
        )}
      </article>

      <article className="glass-card memory-action-row memory-note-row">
        <span className="memory-action-icon">
          <Plus size={16} strokeWidth={2} />
        </span>
        <div>
          <h2>补充相关备注</h2>
          {canEdit ? (
            <textarea
              aria-label="补充相关备注"
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              placeholder="比如当时没写完的背景、下一次要问的事，或一个只给自己看的提醒。"
            />
          ) : (
            <p>示例记忆不能编辑。保存真实记录后，可以在这里补充备注。</p>
          )}
        </div>
        <Lock size={13} strokeWidth={1.8} />
      </article>

      <article className="glass-card memory-action-row">
        <span className="memory-action-icon soft">
          <Sparkles size={16} strokeWidth={1.8} />
        </span>
        <div>
          <h2>Between 的小总结</h2>
          <p>这条记忆可能和“下一步判断”有关。</p>
        </div>
      </article>

      <Link className="glass-card memory-action-row memory-delete-row" to="/states/delete-confirmation" state={{ memoryId: memory?.id }}>
        <span className="memory-action-icon danger">
          <Trash2 size={15} strokeWidth={1.9} />
        </span>
        <div>
          <h2>删除这条记忆</h2>
          <p>如果它不该被保留，可以从这里删除。</p>
        </div>
      </Link>

      <button className="primary-button fixed-bottom-action detail-save-button" type="button" onClick={handleSave}>
        <Save size={16} strokeWidth={2} />
        {canEdit ? '保存修改' : '回到时间线'}
      </button>
    </section>
  )
}
