import { Image, Mic } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useMemoryStore } from '../store/useMemoryStore'

type CaptureLocationState = {
  personId?: string
  personName?: string
  relationLabel?: string
  flow?: 'onboarding' | 'today' | 'insight' | 'profile'
}

const PHOTO_DRAFT_TEXT = '保存了一张值得记住的照片。'

export function Capture() {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = location.state as CaptureLocationState | null
  const people = useMemoryStore((state) => state.people)
  const activePersonId = useMemoryStore((state) => state.activePersonId)
  const createPerson = useMemoryStore((state) => state.createPerson)
  const setActivePerson = useMemoryStore((state) => state.setActivePerson)
  const draftMemory = useMemoryStore((state) => state.draftMemory)
  const draftPhotoUris = useMemoryStore((state) => state.draftPhotoUris)
  const setDraftMemory = useMemoryStore((state) => state.setDraftMemory)
  const setDraftSourceType = useMemoryStore((state) => state.setDraftSourceType)
  const setDraftPhotoUris = useMemoryStore((state) => state.setDraftPhotoUris)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const routedPerson = people.find((person) => person.id === routeState?.personId)
  const storedActivePerson = people.find((person) => person.id === activePersonId)
  const activePerson = routedPerson ?? storedActivePerson ?? people[0]
  const capturePersonName = routedPerson?.name ?? routeState?.personName ?? activePerson?.name ?? '一个人'

  useEffect(() => {
    if (routeState?.personId) {
      setActivePerson(routeState.personId)
      return
    }

    if (routeState?.personName) {
      createPerson(routeState.personName, routeState.relationLabel)
    }
  }, [createPerson, routeState?.personId, routeState?.personName, routeState?.relationLabel, setActivePerson])

  function handleSave() {
    navigate('/states/save')
  }

  function handleTextChange(value: string) {
    setDraftMemory(value)

    if (!draftPhotoUris.length) {
      setDraftSourceType('text')
    }
  }

  function handlePhotoSelect(files: FileList | null) {
    const file = files?.[0]

    if (!file || !file.type.startsWith('image/')) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraftPhotoUris([reader.result])
        setDraftSourceType('photo')
        if (!draftMemory.trim()) {
          setDraftMemory(PHOTO_DRAFT_TEXT)
        }
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <section className="screen-content page-layout capture-page capture-standalone">
      <p className="eyebrow">FIRST MEMORY</p>
      <h1 className="screen-title capture-title">
        一个值得
        <br />
        记住的瞬间
      </h1>
      <p className="screen-copy capture-copy">不需要完整，只要先留下今天想到的一点点</p>

      <article className="glass-card capture-card">
        <div className="capture-meta">
          <span>今天关于{capturePersonName}，你想记住什么？</span>
        </div>
        <textarea
          className="capture-textarea"
          aria-label="记忆内容"
          value={draftMemory}
          onChange={(event) => handleTextChange(event.target.value)}
          placeholder="比如一句话、一个场景，或者一种当时的感觉"
        />
        {draftPhotoUris.length ? (
          <div className="capture-photo-preview">
            <img src={draftPhotoUris[0]} alt="已选择的记忆照片" />
            <button
              type="button"
              onClick={() => {
                setDraftPhotoUris([])
                setDraftSourceType('text')
                if (draftMemory === PHOTO_DRAFT_TEXT) {
                  setDraftMemory('')
                }
              }}
            >
              移除
            </button>
          </div>
        ) : null}
        <div className="capture-tools" aria-label="记录方式">
          <button className={`tool-pill${draftPhotoUris.length ? ' active' : ''}`} type="button" onClick={() => photoInputRef.current?.click()}>
            <Image size={16} />
            照片
          </button>
          <span className="tool-pill">
            <Mic size={16} />
            语音
          </span>
        </div>
        <input
          ref={photoInputRef}
          className="visually-hidden-input"
          type="file"
          accept="image/*"
          onChange={(event) => handlePhotoSelect(event.target.files)}
        />
      </article>

      <Link className="ghost-button memory-hint-card" to="/states/voice-capture">
        也可以先说出来
      </Link>
      <button className="primary-button fixed-bottom-action" type="button" onClick={handleSave}>
        记住
      </button>
    </section>
  )
}
