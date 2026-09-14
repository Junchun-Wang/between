import { Mic, Pause } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMemoryStore } from '../store/useMemoryStore'

const waveformBars = [22, 34, 46, 30, 58, 72, 48, 62, 86, 54, 38, 64, 42, 28, 50, 36]

export function VoiceCapture() {
  const navigate = useNavigate()
  const people = useMemoryStore((state) => state.people)
  const activePersonId = useMemoryStore((state) => state.activePersonId)
  const setDraftMemory = useMemoryStore((state) => state.setDraftMemory)
  const setDraftSourceType = useMemoryStore((state) => state.setDraftSourceType)
  const activePerson = people.find((person) => person.id === activePersonId) ?? people[0]
  const personName = activePerson?.name ?? '一个人'
  const transcript = `今天关于${personName}，我想先记下这个感觉。说话前可以停一下，认真给彼此留一点空间。`

  function finishVoiceCapture() {
    setDraftMemory(transcript)
    setDraftSourceType('voice')
    navigate('/capture')
  }

  return (
    <section className="screen-content hifi-page voice-capture-page">
      <p className="eyebrow">语音记录</p>
      <h1 className="hifi-title">正在听你说</h1>
      <p className="hifi-subtitle">说到哪里都可以，Between 会先替你轻轻记下来。</p>

      <article className="glass-card voice-transcript-card">
        <span>今天关于 {personName}</span>
        <p>{transcript}</p>
        <small>正在转成文字…</small>
      </article>

      <article className="glass-card waveform-card">
        <strong>00:28</strong>
        <div className="waveform" aria-label="录音波形">
          {waveformBars.map((height, index) => (
            <span key={`${height}-${index}`} style={{ height }} />
          ))}
        </div>
      </article>

      <button className="voice-pause-button" type="button" aria-label="暂停录音">
        <Pause size={18} fill="currentColor" strokeWidth={0} />
      </button>

      <div className="voice-bottom-actions">
        <button className="ghost-button" type="button" onClick={() => navigate('/capture')}>
          取消
        </button>
        <button className="primary-button" type="button" onClick={finishVoiceCapture}>
          <Mic size={15} strokeWidth={1.8} />
          完成
        </button>
      </div>
    </section>
  )
}
