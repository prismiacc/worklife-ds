import type { ImgHTMLAttributes } from 'react'
import styles from './Avatar.module.css'

export type AvatarSize   = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline'

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** URL da imagem */
  src?:     string
  /** Nome completo — gera iniciais quando sem imagem */
  name?:    string
  size?:    AvatarSize
  status?:  AvatarStatus
  /** Borda colorida (ex.: destaque de seleção) */
  ring?:    boolean
}

/** Extrai até 2 iniciais de um nome completo */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function Avatar({
  src,
  name,
  size   = 'md',
  status,
  ring   = false,
  className,
  alt,
  ...rest
}: AvatarProps) {
  const initials = name ? getInitials(name) : '?'
  const label    = alt ?? (name ?? 'Avatar')

  return (
    <span
      className={[
        styles.avatar,
        styles[`avatar--${size}`],
        ring && styles['avatar--ring'],
        className,
      ].filter(Boolean).join(' ')}
      role="img"
      aria-label={label}
    >
      {src ? (
        <img
          {...rest}
          src={src}
          alt=""
          className={styles.img}
          loading="lazy"
        />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {initials}
        </span>
      )}

      {status && (
        <span
          className={[styles.statusDot, styles[`statusDot--${status}`]].join(' ')}
          aria-label={status}
        />
      )}
    </span>
  )
}
