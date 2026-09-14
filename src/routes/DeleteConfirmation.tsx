import { useLocation, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useMemoryStore } from '../store/useMemoryStore'

type DeleteLocationState = {
  mode?: 'memory' | 'all'
  memoryId?: string
}

export function DeleteConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = location.state as DeleteLocationState | null
  const memories = useMemoryStore((state) => state.memories)
  const people = useMemoryStore((state) => state.people)
  const deleteMemory = useMemoryStore((state) => state.deleteMemory)
  const clearAllData = useMemoryStore((state) => state.clearAllData)
  const isClearAll = routeState?.mode === 'all'
  const memory = memories.find((item) => item.id === routeState?.memoryId)
  const person = memory ? people.find((item) => item.id === memory.peopleIds[0]) : undefined
  const isRealMemory = Boolean(memory)

  function handleDelete() {
    if (isClearAll) {
      clearAllData()
    } else if (memory) {
      deleteMemory(memory.id)
    }

    navigate('/today', { replace: true })
  }

  return (
    <section className="screen-content hifi-page delete-confirm-page">
      <p className="eyebrow">删除确认</p>
      <h1 className="hifi-title">{isClearAll ? '清空本地数据' : '删除确认'}</h1>
      <p className="hifi-subtitle">{isClearAll ? '清空后，当前浏览器里的联系人和记忆都会被移除。' : '删掉之后，这段记忆不会再出现在 Between 里。'}</p>

      <article className="glass-card delete-memory-card">
        <span>{isClearAll ? '本地数据' : '记忆详情'}</span>
        <h2>{isClearAll ? `${people.length} 个人 · ${memories.length} 条记忆` : memory?.content ?? '聊到 MVP 用户流程'}</h2>
        <p>{isClearAll ? '只影响这个浏览器里的 Between 数据' : `${person?.name ?? '王俊淳'} · 今天 22:18`}</p>
      </article>

      <article className="glass-card delete-warning-card">
        <span className="delete-icon">
          <Trash2 size={17} strokeWidth={1.9} />
        </span>
        <h2>{isClearAll ? '清空所有本地数据？' : '删除这条记忆？'}</h2>
        <p>{isClearAll ? '这会移除所有联系人、记忆、草稿和照片记录。设置开关会保留，你也可以先导出数据再清空。' : isRealMemory ? '删除后，它不会再出现在时间线和洞察里。你也可以先保留，之后再决定。' : '这是一条示例记忆，不会影响你已经保存的真实内容。'}</p>
        <div className="delete-actions">
          <button className="ghost-button" type="button" onClick={() => navigate(-1)}>
            先保留
          </button>
          <button className="primary-button danger-button" type="button" onClick={handleDelete}>
            {isClearAll ? '确认清空' : '删除'}
          </button>
        </div>
      </article>
    </section>
  )
}
