import { useState, useMemo, type ReactNode } from 'react'
import { Brain, Dumbbell, BookOpen, Leaf } from 'lucide-react'
import { Button } from '../../components/atoms/Button/Button'
import { GoalCard } from '../../components/product/GoalCard/GoalCard'
import type { GoalStatus } from '../../components/product/GoalCard/GoalCard'
import styles from './GoalsPage.module.css'

interface GoalData {
  title: string
  description?: string
  progress: number
  status: GoalStatus
  target?: string
  current?: string
  dueDate?: string
  icon: ReactNode
  milestones?: { id: string; label: string; done: boolean }[]
}

const GOALS: GoalData[] = [
  {
    title: 'Meditar diariamente',
    description: 'Manter uma pratica diaria de meditacao de pelo menos 15 minutos',
    progress: 73,
    status: 'on-track',
    target: '15 min/dia',
    current: '11 min/dia',
    dueDate: '30/06/2026',
    icon: <Brain size={20} />,
    milestones: [
      { id: 'm1', label: 'Primeira semana completa', done: true },
      { id: 'm2', label: '30 dias consecutivos', done: true },
      { id: 'm3', label: '90 dias consecutivos', done: false },
    ],
  },
  {
    title: 'Exercicio fisico',
    description: 'Praticar exercicio fisico pelo menos 4 vezes por semana',
    progress: 40,
    status: 'at-risk',
    target: '4x/semana',
    current: '1.6x/semana',
    dueDate: '31/12/2026',
    icon: <Dumbbell size={20} />,
  },
  {
    title: 'Leitura mensal',
    description: 'Ler pelo menos 2 livros por mes',
    progress: 100,
    status: 'completed',
    target: '2 livros/mes',
    icon: <BookOpen size={20} />,
  },
  {
    title: 'Alimentacao saudavel',
    description: 'Melhorar a qualidade da alimentacao diaria',
    progress: 55,
    status: 'paused',
    icon: <Leaf size={20} />,
    milestones: [
      { id: 'm4', label: 'Eliminar refrigerantes', done: true },
      { id: 'm5', label: 'Incluir 5 porcoes de frutas/dia', done: false },
    ],
  },
]

type FilterKey = 'all' | 'on-track' | 'at-risk' | 'completed'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'on-track', label: 'No prazo' },
  { key: 'at-risk', label: 'Em risco' },
  { key: 'completed', label: 'Concluidas' },
]

export function GoalsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  const filteredGoals = useMemo(
    () =>
      activeFilter === 'all'
        ? GOALS
        : GOALS.filter((g) => g.status === activeFilter),
    [activeFilter],
  )

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Minhas Metas</h1>
        <Button variant="primary" size="sm">
          Nova meta
        </Button>
      </div>

      {/* Filter row */}
      <div className={styles.filterRow}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={[
              styles.filterBtn,
              activeFilter === f.key ? styles.filterBtnActive : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Goals grid */}
      <div className={styles.goalsGrid}>
        {filteredGoals.map((goal) => (
          <GoalCard
            key={goal.title}
            title={goal.title}
            description={goal.description}
            progress={goal.progress}
            status={goal.status}
            target={goal.target}
            current={goal.current}
            dueDate={goal.dueDate}
            icon={goal.icon}
            milestones={goal.milestones}
          />
        ))}
      </div>
    </div>
  )
}
