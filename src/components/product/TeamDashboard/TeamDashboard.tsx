import { useCallback } from 'react'
import { Flame, AlertTriangle } from 'lucide-react'
import styles from './TeamDashboard.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type MemberStatus = 'active' | 'away' | 'at-risk' | 'no-data'

export interface TeamMember {
  id:             string
  name:           string
  role:           string
  avatarInitials: string
  wellbeingScore: number
  checkInStreak:  number
  lastCheckIn?:   string
  trend?:         number
  status:         MemberStatus
  department?:    string
}

export interface TeamMetrics {
  avgScore:          number
  avgScoreTrend?:    number
  participationRate: number
  atRiskCount:       number
  topHabit?:         string
  checkinToday:      number
  totalMembers:      number
}

export interface TeamDashboardProps {
  teamName:       string
  members:        TeamMember[]
  metrics:        TeamMetrics
  period?:        string
  onMemberClick?: (id: string) => void
  onExport?:      () => void
  className?:     string
}

/* ── Helpers ───────────────────────────────────────────────────── */
function scoreColor(score: number): string {
  if (score >= 80) return 'var(--wlh-green-600)'
  if (score >= 60) return 'var(--wlh-green-400)'
  if (score >= 40) return 'var(--wlh-amber-500)'
  return 'var(--wlh-red-500)'
}

const STATUS_CLASS: Record<MemberStatus, string> = {
  'active':  styles.statusActive,
  'away':    styles.statusAway,
  'at-risk': styles.statusAtRisk,
  'no-data': styles.statusNoData,
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  } catch {
    return iso
  }
}

/* ── TrendArrow ────────────────────────────────────────────────── */
function TrendArrow({ value, className }: { value: number; className?: string }) {
  const positive = value >= 0
  return (
    <span
      className={[
        className,
        positive ? styles.metricTrendUp : styles.metricTrendDown,
      ].filter(Boolean).join(' ')}
    >
      {positive ? '↑' : '↓'} {Math.abs(value)} pts
    </span>
  )
}

/* ── MemberCard ────────────────────────────────────────────────── */
function MemberCard({
  member,
  onClick,
}: {
  member: TeamMember
  onClick?: (id: string) => void
}) {
  const clickable = !!onClick
  const hasScore  = member.wellbeingScore >= 0

  const handleClick = useCallback(() => {
    onClick?.(member.id)
  }, [onClick, member.id])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick?.(member.id)
      }
    },
    [onClick, member.id],
  )

  return (
    <div
      className={[
        styles.memberCard,
        clickable ? styles.memberCardClickable : '',
      ].filter(Boolean).join(' ')}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? handleClick : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
    >
      {/* Top row: avatar + name + status */}
      <div className={styles.memberTop}>
        <div className={styles.avatar} aria-hidden="true">
          {member.avatarInitials}
        </div>
        <div className={styles.memberInfo}>
          <div className={styles.memberName}>{member.name}</div>
          <div className={styles.memberRole}>{member.role}</div>
        </div>
        <div
          className={[styles.statusDot, STATUS_CLASS[member.status]].join(' ')}
          aria-label={member.status}
        />
      </div>

      {/* Score + trend */}
      <div className={styles.scoreRow}>
        {hasScore ? (
          <>
            <span className={styles.scoreValue} style={{ color: scoreColor(member.wellbeingScore) }}>
              {member.wellbeingScore}
            </span>
            <span className={styles.scoreUnit}>pts</span>
            {member.trend !== undefined && (
              <TrendArrow
                value={member.trend}
                className={styles.memberTrend}
              />
            )}
          </>
        ) : (
          <span className={styles.noData}>Sem dados</span>
        )}
      </div>

      {/* Bottom row: streak + last check-in */}
      <div className={styles.memberBottom}>
        <span className={styles.streak}>
          <Flame size={12} aria-hidden="true" /> {member.checkInStreak} dias
        </span>
        {member.lastCheckIn && (
          <span className={styles.lastCheckIn}>
            {formatDate(member.lastCheckIn)}
          </span>
        )}
      </div>
    </div>
  )
}

/* ── TeamDashboard ─────────────────────────────────────────────── */
export function TeamDashboard({
  teamName,
  members,
  metrics,
  period = 'Esta semana',
  onMemberClick,
  onExport,
  className,
}: TeamDashboardProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {/* ── Zone 1: Header ──────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.teamName}>{teamName}</h2>
          <span className={styles.periodChip}>{period}</span>
        </div>
        {onExport && (
          <button type="button" className={styles.exportButton} onClick={onExport}>
            Exportar
          </button>
        )}
      </div>

      {/* ── Zone 2: Metrics ─────────────────────────────────────── */}
      <div className={styles.metricsGrid}>
        {/* 1. Score medio */}
        <div className={styles.metricCard}>
          <span className={styles.metricValue}>{metrics.avgScore}</span>
          <span className={styles.metricLabel}>Score medio</span>
          {metrics.avgScoreTrend !== undefined && (
            <TrendArrow value={metrics.avgScoreTrend} className={styles.metricTrend} />
          )}
        </div>

        {/* 2. Participacao */}
        <div className={styles.metricCard}>
          <span className={styles.metricValue}>{metrics.participationRate}%</span>
          <span className={styles.metricLabel}>Participacao</span>
          <span className={styles.metricLabel}>esta semana</span>
        </div>

        {/* 3. Em risco */}
        <div className={styles.metricCard}>
          <span
            className={[
              styles.metricValue,
              metrics.atRiskCount > 0 ? styles.metricValueRed : '',
            ].filter(Boolean).join(' ')}
          >
            {metrics.atRiskCount}
          </span>
          <span className={styles.metricLabel}>Em risco</span>
        </div>

        {/* 4. Check-ins hoje */}
        <div className={styles.metricCard}>
          <span className={styles.metricValue}>
            {metrics.checkinToday}/{metrics.totalMembers}
          </span>
          <span className={styles.metricLabel}>Check-ins hoje</span>
        </div>

        {/* 5. Habito top */}
        <div className={styles.metricCard}>
          <span className={styles.metricHabitValue}>
            {metrics.topHabit ?? '\u2014'}
          </span>
          <span className={styles.metricLabel}>Habito top</span>
        </div>
      </div>

      {/* ── Risk banner ─────────────────────────────────────────── */}
      {metrics.atRiskCount > 0 && (
        <div className={styles.riskBanner} role="alert">
          <AlertTriangle size={14} aria-hidden="true" className={styles.riskIcon} />
          <span className={styles.riskText}>
            {metrics.atRiskCount} colaborador{metrics.atRiskCount > 1 ? 'es' : ''} precisam de atencao
          </span>
          <button type="button" className={styles.riskButton}>
            Ver detalhes
          </button>
        </div>
      )}

      {/* ── Zone 3: Member grid ─────────────────────────────────── */}
      {members.length === 0 ? (
        <div className={styles.empty}>
          Nenhum colaborador na equipe ainda.
        </div>
      ) : (
        <div className={styles.memberGrid}>
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={onMemberClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
