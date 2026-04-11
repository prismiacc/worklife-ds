import { useState, type ReactNode } from 'react'
import styles from './Sidebar.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export interface NavItem {
  id:       string
  label:    string
  icon:     ReactNode
  badge?:   string | number
  href?:    string
  disabled?: boolean
  children?: NavItem[]
}

export interface NavGroup {
  id:     string
  label?: string
  items:  NavItem[]
}

export interface SidebarProps {
  groups:       NavGroup[]
  activeId?:    string
  onNavigate?:  (id: string) => void
  collapsed?:   boolean
  onCollapse?:  (v: boolean) => void
  logo?:        ReactNode
  footer?:      ReactNode
  className?:   string
}

/* ── Chevron ────────────────────────────────────────────────────── */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 200ms' }}>
      <polyline points="6,4 10,8 6,12" />
    </svg>
  )
}

/* ── CollapseIcon ───────────────────────────────────────────────── */
function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
      <polyline points="10,4 6,8 10,12" />
    </svg>
  )
}

/* ── NavItemRow ─────────────────────────────────────────────────── */
function NavItemRow({
  item, active, collapsed, depth = 0, onNavigate,
}: {
  item: NavItem
  active: boolean
  collapsed: boolean
  depth?: number
  onNavigate: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  const handleClick = () => {
    if (item.disabled) return
    if (hasChildren) { setOpen(o => !o); return }
    onNavigate(item.id)
  }

  return (
    <>
      <li>
        <button
          type="button"
          onClick={handleClick}
          aria-current={active ? 'page' : undefined}
          aria-disabled={item.disabled}
          aria-expanded={hasChildren ? open : undefined}
          title={collapsed ? item.label : undefined}
          className={[
            styles.item,
            active       ? styles['item--active']   : '',
            item.disabled ? styles['item--disabled'] : '',
            depth > 0    ? styles['item--child']    : '',
          ].filter(Boolean).join(' ')}
          style={depth > 0 ? { paddingLeft: `calc(var(--wlh-spacing-4) + ${depth * 12}px)` } : undefined}
        >
          <span className={styles.item__icon}>{item.icon}</span>

          {!collapsed && (
            <>
              <span className={styles.item__label}>{item.label}</span>
              {item.badge !== undefined && (
                <span className={styles.item__badge}>{item.badge}</span>
              )}
              {hasChildren && <ChevronIcon open={open} />}
            </>
          )}

          {collapsed && item.badge !== undefined && (
            <span className={styles.item__badgeDot} aria-hidden="true" />
          )}
        </button>
      </li>

      {/* Children */}
      {hasChildren && open && !collapsed && item.children!.map(child => (
        <NavItemRow
          key={child.id}
          item={child}
          active={false}
          collapsed={collapsed}
          depth={depth + 1}
          onNavigate={onNavigate}
        />
      ))}
    </>
  )
}

/* ── Sidebar ────────────────────────────────────────────────────── */
export function Sidebar({
  groups,
  activeId,
  onNavigate,
  collapsed = false,
  onCollapse,
  logo,
  footer,
  className,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed)
  const isCollapsed = onCollapse !== undefined ? collapsed : internalCollapsed

  const toggleCollapse = () => {
    const next = !isCollapsed
    if (onCollapse) onCollapse(next)
    else setInternalCollapsed(next)
  }

  const handleNavigate = (id: string) => onNavigate?.(id)

  return (
    <aside
      className={[
        styles.sidebar,
        isCollapsed ? styles['sidebar--collapsed'] : '',
        className,
      ].filter(Boolean).join(' ')}
      aria-label="Navegação principal"
    >
      {/* Logo */}
      {logo && (
        <div className={styles.logoArea}>
          <div className={styles.logo}>{logo}</div>
        </div>
      )}

      {/* Nav groups */}
      <nav className={styles.nav} aria-label="Menu">
        {groups.map((group, gi) => (
          <div key={group.id} className={styles.group}>
            {group.label && !isCollapsed && (
              <span className={styles.groupLabel}>{group.label}</span>
            )}
            {group.label && isCollapsed && gi > 0 && (
              <div className={styles.groupDivider} aria-hidden="true" />
            )}
            <ul className={styles.list} role="list">
              {group.items.map(item => (
                <NavItemRow
                  key={item.id}
                  item={item}
                  active={activeId === item.id}
                  collapsed={isCollapsed}
                  onNavigate={handleNavigate}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && !isCollapsed && (
        <div className={styles.footer}>{footer}</div>
      )}

      {/* Collapse toggle */}
      <button
        type="button"
        className={styles.collapseBtn}
        onClick={toggleCollapse}
        aria-label={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
      >
        <CollapseIcon collapsed={isCollapsed} />
        {!isCollapsed && <span>Colapsar</span>}
      </button>
    </aside>
  )
}
