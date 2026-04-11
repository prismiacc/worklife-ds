import { useState, useEffect, useCallback } from 'react'
import styles from './ThemeToggle.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type Theme = 'light' | 'dark'
export type ThemeToggleSize = 'sm' | 'md' | 'lg'

export interface ThemeToggleProps {
  size?:      ThemeToggleSize
  className?: string
}

/* ── Storage / DOM helpers ─────────────────────────────────────── */
const STORAGE_KEY = 'wlh-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(STORAGE_KEY, theme)
}

/* ── useTheme hook ─────────────────────────────────────────────── */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  } as const
}

/* ── Sun icon ──────────────────────────────────────────────────── */
function SunIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2"  x2="12" y2="5"  />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"  />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2"  y1="12" x2="5"  y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66" />
      <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  />
    </svg>
  )
}

/* ── Moon icon ─────────────────────────────────────────────────── */
function MoonIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

/* ── ThemeToggle ───────────────────────────────────────────────── */
export function ThemeToggle({ size = 'md', className }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button
      type="button"
      className={[styles.root, styles[`root--${size}`], className].filter(Boolean).join(' ')}
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      aria-pressed={isDark}
    >
      <span className={[styles.iconWrap, isDark ? styles['iconWrap--hidden'] : ''].join(' ')}>
        <MoonIcon />
      </span>
      <span className={[styles.iconWrap, isDark ? '' : styles['iconWrap--hidden']].join(' ')}>
        <SunIcon />
      </span>
    </button>
  )
}
