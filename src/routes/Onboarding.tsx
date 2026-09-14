import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMemoryStore } from '../store/useMemoryStore'

const relationTags = ['朋友', '导师', '同学', '家人', '其他', '自定义']

export function Onboarding() {
  const navigate = useNavigate()
  const createPerson = useMemoryStore((state) => state.createPerson)
  const people = useMemoryStore((state) => state.people)
  const setDraftMemory = useMemoryStore((state) => state.setDraftMemory)
  const initialRelation = people[0]?.relationLabel ?? '家人'
  const [name, setName] = useState(people[0]?.name ?? '王俊淳')
  const [relation, setRelation] = useState(relationTags.includes(initialRelation) ? initialRelation : '自定义')
  const [customRelation, setCustomRelation] = useState(relationTags.includes(initialRelation) ? '' : initialRelation)

  function handleContinue() {
    const finalRelation = relation === '自定义' ? customRelation.trim() || '自定义关系' : relation
    const person = createPerson(name || '王俊淳', finalRelation)
    setDraftMemory('')
    navigate('/capture', { state: { personId: person.id, flow: 'onboarding' } })
  }

  return (
    <section className="screen-content page-layout onboarding-page">
      <div className="step-pill">1 / 4 · 重要的人</div>
      <button className="sparkle-button" type="button" aria-label="灵感">
        ✧
      </button>
      <p className="eyebrow">RELATION MEMORY</p>
      <h1 className="screen-title onboarding-title">
        现在，谁对你
        <br />
        很重要？
      </h1>
      <p className="screen-copy onboarding-copy">先从一个人开始。名字、关系和一点原因，之后都可以慢慢补</p>

      <article className="glass-card form-card onboarding-card">
        <label className="field-label" htmlFor="person-name">
          名字或昵称
        </label>
        <input
          className="soft-input name-input"
          id="person-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label className="field-label relation-label">你们是什么关系？</label>
        <div className="chip-row" aria-label="关系标签">
          {relationTags.map((tag) => (
            <button
              className={`chip${relation === tag ? ' selected' : ''}`}
              key={tag}
              type="button"
              onClick={() => setRelation(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {relation === '自定义' ? (
          <label className="custom-relation-field" htmlFor="custom-relation">
            <span>自定义关系</span>
            <input
              id="custom-relation"
              value={customRelation}
              onChange={(event) => setCustomRelation(event.target.value)}
              placeholder="比如合伙人、前同事、很懂你的人"
            />
          </label>
        ) : null}

        <p className="relation-soft-note">你可以只先记住一个名字，关系会慢慢长出来</p>
      </article>

      <button className="primary-button fixed-bottom-action" type="button" onClick={handleContinue}>
        继续
      </button>
    </section>
  )
}
