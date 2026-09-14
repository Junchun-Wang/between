import { Check, Loader2, Sparkles } from 'lucide-react'
import { useMemoryStore } from '../store/useMemoryStore'

export function AiOrganizing() {
  const memories = useMemoryStore((state) => state.memories)
  const memoryCount = Math.max(memories.length, 6)

  return (
    <section className="screen-content hifi-page ai-organizing-page">
      <p className="eyebrow">正在整理</p>
      <h1 className="hifi-title">正在整理关系线索</h1>
      <p className="hifi-subtitle">它不会定义你们，只是把反复出现的细节放到一起。</p>

      <article className="glass-card organizing-main-card">
        <span className="organizing-glow">
          <Sparkles size={20} strokeWidth={1.8} />
        </span>
        <h2>正在读懂你的 {memoryCount} 条记忆</h2>
        <p>Between 正在把零散的片段整理成更容易回看的线索。</p>
        <div className="organizing-progress">
          <span />
        </div>
        <small>大概还需要 8 秒</small>
      </article>

      <div className="organizing-steps">
        <article className="glass-card organizing-step done">
          <Check size={15} strokeWidth={2} />
          <div>
            <h2>读取最近的记录</h2>
            <p>文字、时间、人物</p>
          </div>
        </article>
        <article className="glass-card organizing-step active">
          <Loader2 size={15} strokeWidth={2} />
          <div>
            <h2>归纳重复线索</h2>
            <p>正在寻找反复出现的主题</p>
          </div>
        </article>
        <article className="glass-card organizing-step">
          <Sparkles size={15} strokeWidth={1.8} />
          <div>
            <h2>生成洞察</h2>
            <p>让你用自己的节奏回看</p>
          </div>
        </article>
      </div>
    </section>
  )
}
