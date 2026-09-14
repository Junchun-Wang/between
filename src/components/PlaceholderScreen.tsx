import { Link } from 'react-router-dom'
import { BottomNav } from './BottomNav'

type PlaceholderScreenProps = {
  eyebrow: string
  title: string
  body: string
  nextLabel?: string
  nextTo?: string
  showNav?: boolean
}

export function PlaceholderScreen({
  eyebrow,
  title,
  body,
  nextLabel,
  nextTo,
  showNav = false,
}: PlaceholderScreenProps) {
  return (
    <>
      <section className="screen-content placeholder-layout">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="screen-title">{title}</h1>
        <p className="screen-copy single-line">{body}</p>
        <article className="glass-card placeholder-card">
          <h2>先保留在这里</h2>
          <p>这一页会继续按照 Figma 的视觉标准补齐完整状态</p>
        </article>
        {nextLabel && nextTo ? (
          <Link className={`primary-button placeholder-action${showNav ? ' placeholder-action-above-nav' : ''}`} to={nextTo}>
            {nextLabel}
          </Link>
        ) : null}
      </section>
      {showNav ? <BottomNav /> : null}
    </>
  )
}
