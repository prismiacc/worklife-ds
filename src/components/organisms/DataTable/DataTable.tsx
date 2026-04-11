import { useState, useMemo, useCallback, type ReactNode, type CSSProperties } from 'react'
import { Checkbox } from '../../atoms/Checkbox/Checkbox'
import { Spinner }  from '../../atoms/Spinner/Spinner'
import { EmptyState } from '../../molecules/EmptyState/EmptyState'
import styles from './DataTable.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type SortDir = 'asc' | 'desc' | null

export interface Column<T = Record<string, unknown>> {
  key:        string
  header:     string
  sortable?:  boolean
  width?:     string | number
  align?:     'left' | 'center' | 'right'
  render?:    (value: unknown, row: T, index: number) => ReactNode
  /** Accessor: string key OR fn */
  accessor?:  ((row: T) => unknown) | keyof T
}

export interface BulkAction {
  label:    string
  icon?:    ReactNode
  danger?:  boolean
  onClick:  (selectedIds: string[]) => void
}

export interface DataTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns:        Column<T>[]
  data:           T[]
  rowKey:         keyof T | ((row: T) => string)
  isLoading?:     boolean
  selectable?:    boolean
  selectedIds?:   string[]
  onSelectChange?: (ids: string[]) => void
  bulkActions?:   BulkAction[]
  emptyTitle?:    string
  emptyDescription?: string
  stickyHeader?:  boolean
  striped?:       boolean
  compact?:       boolean
  caption?:       string
  className?:     string
}

/* ── Sort icon ──────────────────────────────────────────────────── */
function SortIcon({ dir }: { dir: SortDir }) {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v10M4 7l4-4 4 4" opacity={dir === 'asc' ? 1 : 0.3} />
      <path d="M4 9l4 4 4-4" opacity={dir === 'desc' ? 1 : 0.3} />
    </svg>
  )
}

/* ── getValue ───────────────────────────────────────────────────── */
function getValue<T extends Record<string, unknown>>(row: T, col: Column<T>): unknown {
  if (col.accessor) {
    return typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor as keyof T]
  }
  return row[col.key as keyof T]
}

/* ── getRowKey ──────────────────────────────────────────────────── */
function getRowKey<T extends Record<string, unknown>>(row: T, rowKey: DataTableProps<T>['rowKey']): string {
  return typeof rowKey === 'function' ? rowKey(row) : String(row[rowKey])
}

/* ── DataTable ──────────────────────────────────────────────────── */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  isLoading       = false,
  selectable      = false,
  selectedIds: controlledSelected,
  onSelectChange,
  bulkActions     = [],
  emptyTitle      = 'Nenhum dado encontrado',
  emptyDescription,
  stickyHeader    = false,
  striped         = false,
  compact         = false,
  caption,
  className,
}: DataTableProps<T>) {
  /* ── Sort state ────────────────────────────────────────────────── */
  const [sortKey, setSortKey]   = useState<string | null>(null)
  const [sortDir, setSortDir]   = useState<SortDir>(null)

  /* ── Selection state ───────────────────────────────────────────── */
  const [internalSelected, setInternalSelected] = useState<string[]>([])
  const isControlled = controlledSelected !== undefined
  const selected = isControlled ? controlledSelected : internalSelected

  const setSelected = useCallback((ids: string[]) => {
    if (!isControlled) setInternalSelected(ids)
    onSelectChange?.(ids)
  }, [isControlled, onSelectChange])

  /* ── Sorted data ───────────────────────────────────────────────── */
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return data
    return [...data].sort((a, b) => {
      const col = columns.find(c => c.key === sortKey)
      if (!col) return 0
      const av = getValue(a, col)
      const bv = getValue(b, col)
      const cmp = String(av ?? '').localeCompare(String(bv ?? ''), 'pt-BR', { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir, columns])

  /* ── Sort handler ──────────────────────────────────────────────── */
  const handleSort = (key: string) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return }
    if (sortDir === 'asc')  { setSortDir('desc'); return }
    setSortKey(null); setSortDir(null)
  }

  /* ── Select all ────────────────────────────────────────────────── */
  const allIds = sorted.map(r => getRowKey(r, rowKey))
  const allSelected = allIds.length > 0 && allIds.every(id => selected.includes(id))
  const someSelected = selected.length > 0 && !allSelected

  const toggleAll = () => setSelected(allSelected ? [] : allIds)
  const toggleRow = (id: string) =>
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])

  /* ── Render ────────────────────────────────────────────────────── */
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {/* Bulk action bar */}
      {selected.length > 0 && bulkActions.length > 0 && (
        <div className={styles.bulkBar} role="toolbar" aria-label="Ações em lote">
          <span className={styles.bulkCount}>{selected.length} selecionados</span>
          <div className={styles.bulkActions}>
            {bulkActions.map((action, i) => (
              <button
                key={i}
                type="button"
                className={[styles.bulkBtn, action.danger ? styles['bulkBtn--danger'] : ''].filter(Boolean).join(' ')}
                onClick={() => action.onClick(selected)}
              >
                {action.icon && <span>{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
          <button type="button" className={styles.bulkClear} onClick={() => setSelected([])}>
            Limpar seleção
          </button>
        </div>
      )}

      {/* Table wrapper */}
      <div className={styles.tableWrapper}>
        <table
          className={[
            styles.table,
            stickyHeader ? styles['table--sticky'] : '',
            striped      ? styles['table--striped'] : '',
            compact      ? styles['table--compact'] : '',
          ].filter(Boolean).join(' ')}
        >
          {caption && <caption className={styles.caption}>{caption}</caption>}

          <thead className={styles.thead}>
            <tr>
              {selectable && (
                <th className={[styles.th, styles['th--check']].join(' ')} scope="col">
                  <Checkbox
                    label="Selecionar todos"
                    hideLabel
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  scope="col"
                  className={[
                    styles.th,
                    col.sortable ? styles['th--sortable'] : '',
                    col.align ? styles[`th--${col.align}`] : '',
                  ].filter(Boolean).join(' ')}
                  style={{ width: col.width } as CSSProperties}
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === 'asc' ? 'ascending' : 'descending'
                      : col.sortable ? 'none' : undefined
                  }
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className={styles.sortBtn}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.header}
                      <SortIcon dir={sortKey === col.key ? sortDir : null} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={styles.tbody}>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className={styles.loadingCell}>
                  <Spinner size="md" label="Carregando dados..." />
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className={styles.emptyCell}>
                  <EmptyState size="sm" title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              sorted.map((row, ri) => {
                const id = getRowKey(row, rowKey)
                const isSelected = selected.includes(id)
                return (
                  <tr
                    key={id}
                    className={[
                      styles.tr,
                      isSelected ? styles['tr--selected'] : '',
                    ].filter(Boolean).join(' ')}
                    aria-selected={selectable ? isSelected : undefined}
                  >
                    {selectable && (
                      <td className={[styles.td, styles['td--check']].join(' ')}>
                        <Checkbox
                          label={`Selecionar linha ${ri + 1}`}
                          hideLabel
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                        />
                      </td>
                    )}
                    {columns.map(col => {
                      const value = getValue(row, col)
                      return (
                        <td
                          key={col.key}
                          className={[
                            styles.td,
                            col.align ? styles[`td--${col.align}`] : '',
                          ].filter(Boolean).join(' ')}
                        >
                          {col.render ? col.render(value, row, ri) : String(value ?? '—')}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
