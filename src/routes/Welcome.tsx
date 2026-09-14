import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'

const previewCards = [
  {
    title: '一段小小的记忆',
    time: '今天 22:18',
    body: '那些没有被说出口的细节，也值得被好好保存',
  },
  {
    title: '一次轻轻的问候',
    time: '昨天 19:40',
    body: '她说最近有点累，也许下次可以先问一句“你还好吗”',
  },
  {
    title: '一个反复出现的人',
    time: '7月21日',
    body: 'Between 会把重复出现的名字和情绪线索安静整理出来',
  },
  {
    title: '一条没有说完的话',
    time: '7月18日',
    body: '先把当时的感受放下来，之后再慢慢补充也可以',
  },
  {
    title: '关系里的小线索',
    time: '7月15日',
    body: '每一次停顿、问候和回应，都会慢慢变成关系的形状',
  },
]

const cardTravel = 220

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function Welcome() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const [progress, setProgress] = useState(0)
  const activeIndex = Math.round(progress)

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  function updateProgress() {
    const scroller = scrollRef.current
    if (!scroller) {
      return
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current)
    }

    frameRef.current = window.requestAnimationFrame(() => {
      setProgress(clamp(scroller.scrollTop / cardTravel, 0, previewCards.length - 1))
    })
  }

  function goToCard(index: number) {
    scrollRef.current?.scrollTo({
      top: clamp(index, 0, previewCards.length - 1) * cardTravel,
      behavior: 'smooth',
    })
  }

  function getCardStyle(index: number): CSSProperties {
    const depth = index - progress
    const isFarBehind = depth > 2.05
    const visibleDepth = clamp(depth, -1.15, 2.2)
    const frontExit = clamp(-visibleDepth, 0, 1)
    const behind = clamp(visibleDepth, 0, 2)
    const top = 42 - behind * 23 + frontExit * 66
    const left = behind * 15 - frontExit * 8
    const width = 274 - behind * 25 + frontExit * 18
    const zIndex = Math.round(50 - Math.abs(visibleDepth) * 10 - visibleDepth * 4)
    const opacity = isFarBehind ? 0 : visibleDepth < 0 ? 1 - frontExit : 1 - behind * 0.28
    const scale = 1 - behind * 0.035 + frontExit * 0.04
    const rotateX = visibleDepth > 0 ? -7 * behind : 5 * frontExit
    const translateY = frontExit * 18
    const contentOpacity = clamp(1 - Math.max(visibleDepth - 0.24, 0) * 3.2 - frontExit * 1.8, 0, 1)

    return {
      top,
      left,
      width,
      zIndex,
      opacity,
      transform: `translate3d(0, ${translateY}px, ${58 - behind * 32}px) rotateX(${rotateX}deg) scale(${scale})`,
      '--content-opacity': contentOpacity,
    } as CSSProperties
  }

  return (
    <section className="screen-content welcome">
      <div className="welcome-brand">Between</div>
      <h1 className="welcome-title">
        记住那些
        <br />
        重要的人
      </h1>
      <div className="welcome-types" aria-label="可记录的内容类型">
        <span>文字</span>
        <span>照片</span>
        <span>语音</span>
      </div>

      <div
        className="welcome-stack"
        aria-label="可向后滑动的记忆预览"
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            goToCard(activeIndex + 1)
          }
          if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            goToCard(activeIndex - 1)
          }
        }}
      >
        <div className="welcome-perspective-stage">
          {previewCards.map((card, index) => (
            <article
              className="glass-card memory-preview"
              style={getCardStyle(index)}
              key={card.title}
              aria-hidden={index !== activeIndex}
            >
              <div className="memory-avatar" />
              <div>
                <h2>{card.title}</h2>
                <time>{card.time}</time>
              </div>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
        <div className="welcome-gesture-scroll" ref={scrollRef} onScroll={updateProgress} aria-hidden="true">
          <div className="welcome-scroll-track">
            {previewCards.map((card) => (
              <span key={card.title} />
            ))}
          </div>
        </div>
      </div>

      <p className="welcome-note">你的记忆只属于你自己</p>
      <Link className="primary-button welcome-action" to="/onboarding">
        开始
      </Link>
    </section>
  )
}
