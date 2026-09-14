import { Check, Sparkles, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from '../store/useSettingsStore'

export function AiPermission() {
  const navigate = useNavigate()
  const setAiOrganizingEnabled = useSettingsStore((state) => state.setAiOrganizingEnabled)
  const markAiPermissionSeen = useSettingsStore((state) => state.markAiPermissionSeen)

  function allowAiOrganizing() {
    setAiOrganizingEnabled(true)
    markAiPermissionSeen()
    navigate('/states/organizing')
  }

  return (
    <section className="screen-content hifi-page ai-permission-page">
      <p className="eyebrow">权限确认</p>
      <h1 className="hifi-title">允许 AI 整理线索</h1>
      <p className="hifi-subtitle">你可以决定，Between 要不要帮你整理保存过的关系记忆。</p>

      <article className="glass-card ai-permission-hero">
        <span className="ai-permission-spark">
          <Sparkles size={20} strokeWidth={1.8} />
        </span>
        <h2>它只整理你保存过的记忆</h2>
        <p>不会替你评价一段关系，也不会给别人看。</p>
      </article>

      <article className="glass-card permission-row">
        <Check size={16} strokeWidth={2} />
        <div>
          <h2>会做什么</h2>
          <p>把反复出现的人、主题、情绪线索放到一起。</p>
        </div>
      </article>
      <article className="glass-card permission-row">
        <X size={16} strokeWidth={2} />
        <div>
          <h2>不会做什么</h2>
          <p>不会替你下判断，也不会自动发送给任何人。</p>
        </div>
      </article>

      <div className="permission-bottom-actions">
        <button className="ghost-button" type="button" onClick={() => navigate('/settings')}>
          暂不允许
        </button>
        <button className="primary-button" type="button" onClick={allowAiOrganizing}>
          允许整理
        </button>
      </div>
    </section>
  )
}
