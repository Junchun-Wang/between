import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { CSSProperties, ReactNode } from 'react'

type AppShellProps = {
  children: ReactNode
}

const DESIGN_WIDTH = 390
const DESIGN_HEIGHT = 844
const SHELL_MODE_STORAGE_KEY = 'between-shell-mode'
const STANDALONE_VIEW_VALUES = ['app', 'standalone', 'webview']
const PREVIEW_VIEW_VALUES = ['preview', 'frame']

function getPreviewScale() {
  if (typeof window === 'undefined') {
    return 1
  }

  const viewportWidth = window.visualViewport?.width ?? window.innerWidth
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight
  const gutter = viewportWidth < 520 ? 16 : 56
  const widthScale = (viewportWidth - gutter) / DESIGN_WIDTH
  const heightScale = (viewportHeight - gutter) / DESIGN_HEIGHT

  return Math.max(0.72, Math.min(1, widthScale, heightScale))
}

function getStoredShellMode() {
  if (typeof window === 'undefined') {
    return 'preview'
  }

  return window.localStorage.getItem(SHELL_MODE_STORAGE_KEY) ?? 'preview'
}

function getExplicitShellMode(search: string) {
  const view = new URLSearchParams(search).get('view')?.toLowerCase()

  if (view && STANDALONE_VIEW_VALUES.includes(view)) {
    return 'app'
  }

  if (view && PREVIEW_VIEW_VALUES.includes(view)) {
    return 'preview'
  }

  return null
}

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [previewScale, setPreviewScale] = useState(getPreviewScale)
  const [storedShellMode, setStoredShellMode] = useState(getStoredShellMode)
  const rootLevelPaths = ['/', '/today', '/people', '/timeline', '/insights']
  const canGoBack = !rootLevelPaths.includes(location.pathname)
  const explicitShellMode = getExplicitShellMode(location.search)
  const shellMode = explicitShellMode ?? storedShellMode
  const isStandaloneMode = shellMode === 'app'
  const previewStyle = {
    '--phone-scale': previewScale,
    width: `${DESIGN_WIDTH * previewScale}px`,
    height: `${DESIGN_HEIGHT * previewScale}px`,
  } as CSSProperties

  useEffect(() => {
    const updateScale = () => setPreviewScale(getPreviewScale())

    window.addEventListener('resize', updateScale)
    window.visualViewport?.addEventListener('resize', updateScale)
    return () => {
      window.removeEventListener('resize', updateScale)
      window.visualViewport?.removeEventListener('resize', updateScale)
    }
  }, [])

  useEffect(() => {
    if (!explicitShellMode) {
      return
    }

    window.localStorage.setItem(SHELL_MODE_STORAGE_KEY, explicitShellMode)
    setStoredShellMode(explicitShellMode)
  }, [explicitShellMode])

  return (
    <main className={`app-stage ${isStandaloneMode ? 'app-stage-standalone' : ''}`}>
      <div
        className={`phone-viewport ${isStandaloneMode ? 'phone-viewport-standalone' : ''}`}
        style={isStandaloneMode ? undefined : previewStyle}
      >
        <section
          className={`phone-shell ${isStandaloneMode ? 'phone-shell-standalone' : ''}`}
          aria-label="Between app preview"
        >
          <div className="ambient-blue" />
          <div className="ambient-lilac" />
          <div className="status-bar">
            <span>9:41</span>
            <span className="dynamic-island" />
            <span className="status-icons" aria-hidden="true">
              <span className="signal">
                <span />
                <span />
                <span />
              </span>
              <span className="battery">
                <span />
              </span>
            </span>
          </div>
          {canGoBack ? (
            <button className="back-button" type="button" aria-label="返回" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} strokeWidth={1.8} />
            </button>
          ) : null}
          {children}
          <span className="home-indicator" aria-hidden="true" />
        </section>
      </div>
    </main>
  )
}
