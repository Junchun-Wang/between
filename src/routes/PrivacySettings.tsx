import { Bot, Cloud, Download, Fingerprint, Lock, Trash2 } from 'lucide-react'
import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { useMemoryStore } from '../store/useMemoryStore'
import { useSettingsStore } from '../store/useSettingsStore'

type SettingRowProps = {
  title: string
  body: string
  enabled: boolean
  onToggle: () => void
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
}

function SettingRow({ title, body, enabled, onToggle, icon: Icon }: SettingRowProps) {
  return (
    <article className="glass-card privacy-row">
      <span className="privacy-row-icon">
        <Icon size={16} strokeWidth={1.8} />
      </span>
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <button className={`soft-switch${enabled ? ' enabled' : ''}`} type="button" aria-pressed={enabled} onClick={onToggle}>
        <span />
      </button>
    </article>
  )
}

export function PrivacySettings() {
  const memories = useMemoryStore((state) => state.memories)
  const people = useMemoryStore((state) => state.people)
  const faceIdEnabled = useSettingsStore((state) => state.faceIdEnabled)
  const aiOrganizingEnabled = useSettingsStore((state) => state.aiOrganizingEnabled)
  const cloudSyncEnabled = useSettingsStore((state) => state.cloudSyncEnabled)
  const setFaceIdEnabled = useSettingsStore((state) => state.setFaceIdEnabled)
  const setAiOrganizingEnabled = useSettingsStore((state) => state.setAiOrganizingEnabled)
  const setCloudSyncEnabled = useSettingsStore((state) => state.setCloudSyncEnabled)

  function exportLocalData() {
    const payload = {
      app: 'Between',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        people,
        memories,
        settings: {
          faceIdEnabled,
          aiOrganizingEnabled,
          cloudSyncEnabled,
        },
      },
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `between-export-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="screen-content hifi-page privacy-settings-page">
      <p className="eyebrow">隐私优先</p>
      <h1 className="hifi-title">隐私与记忆</h1>
      <p className="hifi-subtitle">你可以决定哪些记忆可以被整理，哪些只留给自己。</p>

      <article className="glass-card privacy-hero-card">
        <span className="privacy-hero-icon">
          <Lock size={18} strokeWidth={1.8} />
        </span>
        <div>
          <h2>你的记忆只属于你</h2>
          <p>Between 会优先把内容保存在本地，敏感记忆不会被默认分享。</p>
        </div>
      </article>

      <div className="privacy-list">
        <SettingRow
          title="使用 Face ID"
          body="打开 App 时先确认是你本人。"
          enabled={faceIdEnabled}
          onToggle={() => setFaceIdEnabled(!faceIdEnabled)}
          icon={Fingerprint}
        />
        <SettingRow
          title="允许 AI 整理线索"
          body="只整理你保存过的内容，不替你评价关系。"
          enabled={aiOrganizingEnabled}
          onToggle={() => setAiOrganizingEnabled(!aiOrganizingEnabled)}
          icon={Bot}
        />
        <SettingRow
          title="开启云同步"
          body="之后可以在多台设备继续查看。"
          enabled={cloudSyncEnabled}
          onToggle={() => setCloudSyncEnabled(!cloudSyncEnabled)}
          icon={Cloud}
        />
      </div>

      <button className="export-soft-button" type="button" onClick={exportLocalData}>
        <Download size={15} strokeWidth={1.9} />
        导出本地数据
      </button>

      <Link className="danger-soft-button" to="/states/delete-confirmation" state={{ mode: 'all' }}>
        <Trash2 size={15} strokeWidth={1.9} />
        清空本地数据
      </Link>
    </section>
  )
}
