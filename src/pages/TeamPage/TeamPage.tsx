import { useState, useMemo } from 'react'
import { TeamDashboard } from '../../components/product/TeamDashboard/TeamDashboard'
import type {
  TeamMember,
  TeamMetrics,
} from '../../components/product/TeamDashboard/TeamDashboard'
import styles from './TeamPage.module.css'

const MEMBERS: TeamMember[] = [
  {
    id: 'm1',
    name: 'Ana Costa',
    role: 'Product Designer',
    avatarInitials: 'AC',
    wellbeingScore: 88,
    checkInStreak: 14,
    lastCheckIn: '2026-04-11',
    trend: 3,
    status: 'active',
    department: 'Produto',
  },
  {
    id: 'm2',
    name: 'Bruno Silva',
    role: 'Engenheiro Frontend',
    avatarInitials: 'BS',
    wellbeingScore: 72,
    checkInStreak: 7,
    lastCheckIn: '2026-04-11',
    trend: -2,
    status: 'active',
    department: 'Engenharia',
  },
  {
    id: 'm3',
    name: 'Carla Mendes',
    role: 'Engenheira Backend',
    avatarInitials: 'CM',
    wellbeingScore: 45,
    checkInStreak: 2,
    lastCheckIn: '2026-04-10',
    trend: -8,
    status: 'at-risk',
    department: 'Engenharia',
  },
  {
    id: 'm4',
    name: 'Daniel Rocha',
    role: 'Tech Lead',
    avatarInitials: 'DR',
    wellbeingScore: 81,
    checkInStreak: 21,
    lastCheckIn: '2026-04-11',
    trend: 1,
    status: 'active',
    department: 'Engenharia',
  },
  {
    id: 'm5',
    name: 'Elisa Pinto',
    role: 'UX Researcher',
    avatarInitials: 'EP',
    wellbeingScore: 67,
    checkInStreak: 5,
    lastCheckIn: '2026-04-09',
    trend: -4,
    status: 'away',
    department: 'Produto',
  },
  {
    id: 'm6',
    name: 'Felipe Santos',
    role: 'Engenheiro Mobile',
    avatarInitials: 'FS',
    wellbeingScore: 91,
    checkInStreak: 30,
    lastCheckIn: '2026-04-11',
    trend: 5,
    status: 'active',
    department: 'Engenharia',
  },
  {
    id: 'm7',
    name: 'Gabriela Lima',
    role: 'Product Manager',
    avatarInitials: 'GL',
    wellbeingScore: 76,
    checkInStreak: 10,
    lastCheckIn: '2026-04-11',
    trend: 2,
    status: 'active',
    department: 'Produto',
  },
  {
    id: 'm8',
    name: 'Henrique Alves',
    role: 'DevOps Engineer',
    avatarInitials: 'HA',
    wellbeingScore: 38,
    checkInStreak: 1,
    lastCheckIn: '2026-04-08',
    trend: -12,
    status: 'at-risk',
    department: 'Engenharia',
  },
]

const METRICS: TeamMetrics = {
  avgScore: 70,
  avgScoreTrend: -2,
  participationRate: 87,
  atRiskCount: 2,
  topHabit: 'Meditacao',
  checkinToday: 5,
  totalMembers: 8,
}

export function TeamPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedMember = useMemo(
    () => (selectedId ? MEMBERS.find((m) => m.id === selectedId) ?? null : null),
    [selectedId],
  )

  return (
    <div className={styles.page}>
      <TeamDashboard
        teamName="Equipe Produto & Engenharia"
        members={MEMBERS}
        metrics={METRICS}
        period="Semana de 07–11 Abr 2026"
        onMemberClick={setSelectedId}
      />

      {selectedMember && (
        <div className={styles.callout}>
          <div className={styles.calloutAvatar}>
            {selectedMember.avatarInitials}
          </div>
          <div className={styles.calloutInfo}>
            <span className={styles.calloutName}>{selectedMember.name}</span>
            <span className={styles.calloutDetail}>
              {selectedMember.role} &middot; {selectedMember.department} &middot;
              Score: {selectedMember.wellbeingScore} pts &middot; Sequencia:{' '}
              {selectedMember.checkInStreak} dias
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
