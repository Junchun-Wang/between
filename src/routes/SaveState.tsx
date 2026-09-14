import { Check, CircleAlert, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMemoryStore } from '../store/useMemoryStore'

type SavePhase = 'saving' | 'done' | 'empty'

export function SaveState() {
  const navigate = useNavigate()
  const draftMemory = useMemoryStore((state) => state.draftMemory)
  const draftSourceType = useMemoryStore((state) => state.draftSourceType)
  const draftPhotoUris = useMemoryStore((state) => state.draftPhotoUris)
  const activePersonId = useMemoryStore((state) => state.activePersonId)
  const addMemory = useMemoryStore((state) => state.addMemory)
  const [phase, setPhase] = useState<SavePhase>('saving')
  const hasSavedRef = useRef(false)
  const initialDraftRef = useRef(draftMemory.trim())
  const initialSourceTypeRef = useRef(draftSourceType ?? 'text')
  const initialPhotoUrisRef = useRef(draftPhotoUris)
  const isEmpty = !initialDraftRef.current && !initialPhotoUrisRef.current.length
  const sourceLabel = initialSourceTypeRef.current === 'photo' ? '照片' : initialSourceTypeRef.current === 'voice' ? '语音' : '文字'
  const previewText = initialDraftRef.current || (initialPhotoUrisRef.current.length ? '这张照片已经准备好被保存。' : '还没有输入内容，先回去写下一点点。')

  useEffect(() => {
    const saveTimer = window.setTimeout(() => {
      if (isEmpty) {
        setPhase('empty')
        return
      }

      if (!isEmpty && !hasSavedRef.current) {
        hasSavedRef.current = true
        addMemory({
          content: initialDraftRef.current || '保存了一张值得记住的照片。',
          personId: activePersonId,
          sourceType: initialSourceTypeRef.current,
          photoUris: initialPhotoUrisRef.current,
        })
      }

      setPhase('done')
    }, 720)

    const navigateTimer = window.setTimeout(() => {
      navigate(isEmpty ? '/capture' : '/today', { replace: true })
    }, isEmpty ? 1150 : 1550)

    return () => {
      window.clearTimeout(saveTimer)
      window.clearTimeout(navigateTimer)
    }
  }, [activePersonId, addMemory, isEmpty, navigate])

  return (
    <section className="screen-content hifi-page save-feedback-page">
      <p className="eyebrow">保存状态</p>
      <h1 className="hifi-title">保存反馈</h1>
      <p className="hifi-subtitle">{isEmpty ? '先留下一句话，Between 才能替你收好。' : '这段记忆正在被好好收下。'}</p>

      <article className="glass-card save-input-card">
        <span>输入中</span>
        <p>{previewText}</p>
        {initialPhotoUrisRef.current.length ? <img className="save-photo-preview" src={initialPhotoUrisRef.current[0]} alt="准备保存的照片" /> : null}
        <em>{sourceLabel}</em>
      </article>

      <article className={`glass-card save-feedback-row save-feedback-current ${phase === 'done' ? 'done' : phase === 'empty' ? 'empty' : 'active'}`}>
        <span className={`save-feedback-icon${phase === 'done' ? ' done' : phase === 'empty' ? ' failed' : ''}`}>
          {phase === 'done' ? <Check size={16} strokeWidth={2} /> : phase === 'empty' ? <CircleAlert size={16} strokeWidth={2} /> : <Loader2 size={16} strokeWidth={2} />}
        </span>
        <div>
          <h2>{phase === 'done' ? '已经记住' : phase === 'empty' ? '还没有内容' : '正在保存'}</h2>
          <p>{phase === 'done' ? '马上回到今天。' : phase === 'empty' ? '回到上一页，先写下一句话。' : '先等一下，Between 正在把它收好。'}</p>
        </div>
        <strong>{phase === 'done' ? '完成' : phase === 'empty' ? '返回' : '稍等'}</strong>
      </article>
    </section>
  )
}
