import {
  useState, useRef, useEffect, useCallback, useId,
  type ReactNode,
} from 'react'
import { Tag } from '../../atoms/Tag'
import styles from './FilterBar.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export interface FilterOption {
  id:       string
  label:    string
  count?:   number
}

export interface FilterGroup {
  id:       string
  label:    string
  type:     'tags' | 'select' | 'date-range'
  options?: FilterOption[]
}

export interface ActiveFilter {
  groupId: string
  value:   string
  label:   string
}

export interface FilterBarProps {
  groups:            FilterGroup[]
  activeFilters:     ActiveFilter[]
  onFilterChange:    (filters: ActiveFilter[]) => void
  searchValue?:      string
  onSearch?:         (q: string) => void
  searchPlaceholder?: string
  resultCount?:      number
  className?:        string
}

/* ── Popover (internal, avoids circular Dropdown import) ────────── */
function FilterPopover({
  group,
  activeFilters,
  onToggle,
  onClose,
}: {
  group: FilterGroup
  activeFilters: ActiveFilter[]
  onToggle: (option: FilterOption, checked: boolean) => void
  onClose: () => void
}) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!group.options?.length) return null

  const isMulti = group.type === 'tags'
  const activeValues = activeFilters
    .filter(f => f.groupId === group.id)
    .map(f => f.value)

  return (
    <div ref={popoverRef} className={styles.popover} role="listbox" aria-label={group.label}>
      {group.options.map(option => {
        const isActive = activeValues.includes(option.id)
        const inputId = `filter-${group.id}-${option.id}`

        return (
          <label key={option.id} className={styles.popoverOption} htmlFor={inputId}>
            <input
              id={inputId}
              type={isMulti ? 'checkbox' : 'radio'}
              name={`filter-group-${group.id}`}
              checked={isActive}
              onChange={(e) => onToggle(option, e.target.checked)}
              className={styles.popoverInput}
            />
            <span className={styles.popoverLabel}>
              {option.label}
              {option.count !== undefined && (
                <span className={styles.popoverCount}>{option.count}</span>
              )}
            </span>
          </label>
        )
      })}
    </div>
  )
}

/* ── FilterBar ──────────────────────────────────────────────────── */
export function FilterBar({
  groups,
  activeFilters,
  onFilterChange,
  searchValue,
  onSearch,
  searchPlaceholder = 'Buscar...',
  resultCount,
  className,
}: FilterBarProps) {
  const [openGroupId, setOpenGroupId] = useState<string | null>(null)
  const searchId = useId()

  const handleToggleGroup = useCallback((groupId: string) => {
    setOpenGroupId(prev => prev === groupId ? null : groupId)
  }, [])

  const handleClosePopover = useCallback(() => {
    setOpenGroupId(null)
  }, [])

  const handleToggleOption = useCallback((
    group: FilterGroup,
    option: FilterOption,
    checked: boolean,
  ) => {
    const isMulti = group.type === 'tags'

    if (isMulti) {
      if (checked) {
        onFilterChange([
          ...activeFilters,
          { groupId: group.id, value: option.id, label: option.label },
        ])
      } else {
        onFilterChange(
          activeFilters.filter(f => !(f.groupId === group.id && f.value === option.id))
        )
      }
    } else {
      // Single select: replace existing for this group
      const withoutGroup = activeFilters.filter(f => f.groupId !== group.id)
      if (checked) {
        onFilterChange([
          ...withoutGroup,
          { groupId: group.id, value: option.id, label: option.label },
        ])
      } else {
        onFilterChange(withoutGroup)
      }
      setOpenGroupId(null)
    }
  }, [activeFilters, onFilterChange])

  const handleRemoveFilter = useCallback((filter: ActiveFilter) => {
    onFilterChange(activeFilters.filter(f => !(f.groupId === filter.groupId && f.value === filter.value)))
  }, [activeFilters, onFilterChange])

  const handleClearAll = useCallback(() => {
    onFilterChange([])
  }, [onFilterChange])

  const rootClasses = [styles.root, className].filter(Boolean).join(' ')

  return (
    <div className={rootClasses}>
      {/* Search field */}
      {onSearch && (
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="4" />
              <line x1="10" y1="10" x2="13.5" y2="13.5" />
            </svg>
          </span>
          <input
            id={searchId}
            type="search"
            role="searchbox"
            value={searchValue ?? ''}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className={styles.searchInput}
            aria-label={searchPlaceholder}
            autoComplete="off"
          />
        </div>
      )}

      {/* Filter group buttons */}
      {groups.map(group => {
        const activeCount = activeFilters.filter(f => f.groupId === group.id).length
        const isOpen = openGroupId === group.id

        return (
          <div key={group.id} className={styles.groupWrapper}>
            <button
              type="button"
              className={[
                styles.groupBtn,
                activeCount > 0 ? styles['groupBtn--active'] : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleToggleGroup(group.id)}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
            >
              <span>{group.label}</span>
              {activeCount > 0 && (
                <span className={styles.groupCount}>{activeCount}</span>
              )}
              <svg viewBox="0 0 10 6" width="10" height="6" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true"
                className={isOpen ? styles.chevronOpen : styles.chevron}>
                <polyline points="1 1 5 5 9 1" />
              </svg>
            </button>

            {isOpen && group.type !== 'date-range' && (
              <FilterPopover
                group={group}
                activeFilters={activeFilters}
                onToggle={(option, checked) => handleToggleOption(group, option, checked)}
                onClose={handleClosePopover}
              />
            )}
          </div>
        )
      })}

      {/* Active filter chips */}
      {activeFilters.map(filter => (
        <Tag
          key={`${filter.groupId}-${filter.value}`}
          label={filter.label}
          variant="primary"
          size="sm"
          onRemove={() => handleRemoveFilter(filter)}
        />
      ))}

      {/* Clear all */}
      {activeFilters.length > 0 && (
        <button
          type="button"
          className={styles.clearAll}
          onClick={handleClearAll}
        >
          Limpar tudo
        </button>
      )}

      {/* Result count */}
      {resultCount !== undefined && (
        <span className={styles.resultCount} aria-live="polite">
          {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
        </span>
      )}
    </div>
  )
}
