import { useMemo, type ReactNode } from 'react'
import styles from './Pagination.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export interface PaginationProps {
  page:          number
  totalPages:    number
  onPageChange:  (page: number) => void
  siblings?:     number   // páginas ao redor da atual (default 1)
  showEdges?:    boolean  // exibe primeira e última sempre
  showInfo?:     boolean  // "Página X de Y"
  size?:         'sm' | 'md'
  className?:    string
}

const ELLIPSIS = '...'

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/* ── Hook: páginas a exibir ─────────────────────────────────────── */
function usePages(page: number, total: number, siblings: number): (number | '...')[] {
  return useMemo(() => {
    const totalSlots = siblings * 2 + 5 // siblings + current + 2 edges + 2 ellipsis

    if (total <= totalSlots) return range(1, total)

    const leftSibling  = Math.max(page - siblings, 1)
    const rightSibling = Math.min(page + siblings, total)

    const showLeftEllipsis  = leftSibling > 2
    const showRightEllipsis = rightSibling < total - 1

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = range(1, 3 + siblings * 2)
      return [...leftRange, ELLIPSIS, total]
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = range(total - (2 + siblings * 2), total)
      return [1, ELLIPSIS, ...rightRange]
    }

    return [1, ELLIPSIS, ...range(leftSibling, rightSibling), ELLIPSIS, total]
  }, [page, total, siblings])
}

/* ── ChevronLeft / Right icons ──────────────────────────────────── */
function ChevronLeft() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="10,4 6,8 10,12" />
    </svg>
  )
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6,4 10,8 6,12" />
    </svg>
  )
}

/* ── Pagination ─────────────────────────────────────────────────── */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblings   = 1,
  showEdges  = true,
  showInfo   = false,
  size       = 'md',
  className,
}: PaginationProps) {
  const pages = usePages(page, totalPages, siblings)

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return
    onPageChange(p)
  }

  return (
    <nav
      role="navigation"
      aria-label="Paginação"
      className={[styles.root, styles[`root--${size}`], className].filter(Boolean).join(' ')}
    >
      {showInfo && (
        <span className={styles.info}>
          Página {page} de {totalPages}
        </span>
      )}

      <ul className={styles.list}>
        {/* Anterior */}
        <li>
          <button
            className={[styles.btn, styles['btn--nav']].join(' ')}
            onClick={() => goTo(page - 1)}
            disabled={page <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft />
          </button>
        </li>

        {/* Páginas */}
        {pages.map((p, i) =>
          p === ELLIPSIS ? (
            <li key={`ellipsis-${i}`} aria-hidden="true">
              <span className={styles.ellipsis}>…</span>
            </li>
          ) : (
            <li key={p}>
              <button
                className={[
                  styles.btn,
                  p === page ? styles['btn--active'] : '',
                ].filter(Boolean).join(' ')}
                onClick={() => goTo(p as number)}
                aria-label={`Ir para a página ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            </li>
          ),
        )}

        {/* Próxima */}
        <li>
          <button
            className={[styles.btn, styles['btn--nav']].join(' ')}
            onClick={() => goTo(page + 1)}
            disabled={page >= totalPages}
            aria-label="Próxima página"
          >
            <ChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  )
}
