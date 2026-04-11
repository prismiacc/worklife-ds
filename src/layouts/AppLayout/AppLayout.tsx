import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Sidebar }       from '@/components/organisms/Sidebar'
import { Navbar, NavbarIconButton, NavbarDivider } from '@/components/organisms/Navbar'
import { NotificationCenter } from '@/components/organisms/NotificationCenter'
import type { Notification }  from '@/components/organisms/NotificationCenter'
import { Avatar }        from '@/components/atoms/Avatar/Avatar'
import { Button }        from '@/components/atoms/Button/Button'
import { ThemeToggle }   from '@/components/atoms/ThemeToggle'
import { CommandMenu, CommandProvider, useCommand } from '@/components/organisms/CommandMenu'
import styles from './AppLayout.module.css'

/* ── Icons ──────────────────────────────────────────────────────── */
const icon = (d: string) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d={d} />
  </svg>
)
const HomeIcon     = () => icon('M2 7l6-5 6 5v8H10v-4H6v4H2z')
const CheckIcon    = () => icon('M3 8l3 3 7-7')
const TargetIcon   = () => icon('M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3zM8 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z')
const CalendarIcon = () => icon('M4 2v2m8-2v2M2 6h12M3 4h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z')
const ChartIcon    = () => icon('M2 12l4-4 3 3 5-7')
const UsersIcon    = () => icon('M5 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM1 15a5 5 0 0 1 8-4 5 5 0 0 1 6 4')
const SettingsIcon = () => icon('M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm4.9-1H14m-2.1-3.9.7-.7M9 3.1V2M5.1 5.1l-.7-.7M3 9H1.1m2 3.9-.7.7M7 12.9V14m3.9-.1.7.7')

/* ── Route → Sidebar id mapping ─────────────────────────────────── */
const ROUTE_MAP: Record<string, string> = {
  '/':          'dashboard',
  '/habitos':   'habitos',
  '/metas':     'metas',
  '/equipe':    'equipe',
  '/checkin':   'checkin',
  '/analytics': 'analytics',
}

/* ── Inner layout (needs useCommand) ───────────────────────────── */
function InnerLayout() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { open: openCmd, isOpen: cmdOpen, close: closeCmd } = useCommand()

  const activeId = ROUTE_MAP[location.pathname] ?? 'dashboard'

  const [notifs, setNotifs] = useState<Notification[]>([
    { id: '1', title: 'Check-in concluído', body: 'Seu check-in diário foi registrado.', variant: 'success', read: false, timestamp: new Date(Date.now() - 5 * 60_000) },
    { id: '2', title: 'Meta atingida!',  body: '7 dias consecutivos de bem-estar acima de 8.',  variant: 'info',    read: false, timestamp: new Date(Date.now() - 2 * 3_600_000) },
    { id: '3', title: 'Lembrete',        body: 'Você ainda não fez seu check-in desta semana.', variant: 'warning', read: true,  timestamp: new Date(Date.now() - 24 * 3_600_000) },
  ])

  function handleNavigate(id: string) {
    const route = Object.entries(ROUTE_MAP).find(([, v]) => v === id)?.[0] ?? '/'
    navigate(route)
  }

  return (
    <div className={styles.root}>
      {/* Sidebar */}
      <Sidebar
        activeId={activeId}
        onNavigate={handleNavigate}
        logo={
          <span className={styles.logo}>WorkLife Hub</span>
        }
        groups={[
          {
            id: 'main',
            items: [
              { id: 'dashboard', label: 'Dashboard',  icon: <HomeIcon /> },
              { id: 'checkin',   label: 'Check-in',   icon: <CheckIcon />, badge: 1 },
              { id: 'metas',     label: 'Metas',      icon: <TargetIcon /> },
              { id: 'habitos',   label: 'Hábitos',    icon: <CalendarIcon /> },
            ],
          },
          {
            id: 'reports',
            label: 'Relatórios',
            items: [
              { id: 'analytics', label: 'Analytics', icon: <ChartIcon /> },
              { id: 'equipe',    label: 'Equipe',    icon: <UsersIcon />, badge: 2 },
            ],
          },
          {
            id: 'config',
            label: 'Sistema',
            items: [
              { id: 'settings', label: 'Configurações', icon: <SettingsIcon /> },
            ],
          },
        ]}
      />

      {/* Main content */}
      <div className={styles.main}>
        {/* Navbar */}
        <Navbar
          logo={null}
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={openCmd} className={styles.searchBtn}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="14" height="14"><circle cx="6.5" cy="6.5" r="4"/><line x1="10" y1="10" x2="13.5" y2="13.5"/></svg>
                Buscar
                <kbd className={styles.kbd}>⌘K</kbd>
              </Button>
              <NavbarDivider />
              <ThemeToggle size="sm" />
              <NavbarDivider />
              <NotificationCenter
                notifications={notifs}
                onMarkRead={id => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))}
                onMarkAllRead={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
                onDismiss={id => setNotifs(n => n.filter(x => x.id !== id))}
                trigger={
                  <NavbarIconButton
                    label="Notificações"
                    badge={notifs.filter(n => !n.read).length}
                    icon={<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="18" height="18"><path d="M8 2a5 5 0 0 0-5 5v2l-1.5 3h13L13 9V7a5 5 0 0 0-5-5Z"/><path d="M6.5 13a1.5 1.5 0 0 0 3 0"/></svg>}
                  />
                }
              />
              <NavbarDivider />
              <Avatar name="Ana Souza" size="sm" status="online" />
            </>
          }
        />

        {/* Page content */}
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>

      {/* Command Menu */}
      <CommandMenu
        isOpen={cmdOpen}
        onClose={closeCmd}
        items={[
          { id: 'dash',      label: 'Dashboard',          group: 'Navegar',     icon: <HomeIcon />,     shortcut: ['G','D'],  onSelect: () => { navigate('/');          closeCmd() } },
          { id: 'checkin',   label: 'Check-in diário',    group: 'Navegar',     icon: <CheckIcon />,    shortcut: ['G','C'],  onSelect: () => { navigate('/checkin');   closeCmd() } },
          { id: 'metas',     label: 'Minhas metas',       group: 'Navegar',     icon: <TargetIcon />,   shortcut: ['G','M'],  onSelect: () => { navigate('/metas');     closeCmd() } },
          { id: 'habitos',   label: 'Hábitos',            group: 'Navegar',     icon: <CalendarIcon />, shortcut: ['G','H'],  onSelect: () => { navigate('/habitos');   closeCmd() } },
          { id: 'equipe',    label: 'Equipe',             group: 'Navegar',     icon: <UsersIcon />,    shortcut: ['G','E'],  onSelect: () => { navigate('/equipe');    closeCmd() } },
          { id: 'new-check', label: 'Novo check-in',      group: 'Ações rápidas', icon: <CheckIcon />,  shortcut: ['⌘','N'],  onSelect: () => { navigate('/checkin');   closeCmd() } },
          { id: 'settings',  label: 'Configurações',      group: 'Ações rápidas', icon: <SettingsIcon />, shortcut: ['⌘',','], onSelect: () => { closeCmd() } },
        ]}
      />
    </div>
  )
}

/* ── AppLayout ──────────────────────────────────────────────────── */
export function AppLayout() {
  return (
    <CommandProvider>
      <InnerLayout />
    </CommandProvider>
  )
}
