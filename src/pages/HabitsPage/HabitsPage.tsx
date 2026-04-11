import { useMemo } from 'react'
import { Button } from '../../components/atoms/Button/Button'
import { Brain, Dumbbell, BookOpen } from 'lucide-react'
import { HabitTracker } from '../../components/product/HabitTracker/HabitTracker'
import type { HabitEntry } from '../../components/product/HabitTracker/HabitTracker'
import styles from './HabitsPage.module.css'

function genEntries(days: number, rate: number, seed: number): HabitEntry[] {
  const arr: HabitEntry[] = []
  const now = new Date()
  // Simple seeded pseudo-random to keep stable across calls with same seed
  let s = seed
  function rand() {
    s = (s * 16807 + 0) % 2147483647
    return (s & 0x7fffffff) / 0x7fffffff
  }
  for (let i = 0; i < days; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    if (rand() < rate) {
      arr.push({
        date: d.toISOString().slice(0, 10),
        completed: true,
        value: Math.floor(rand() * 60) + 5,
      })
    }
  }
  return arr
}

export function HabitsPage() {
  const meditationEntries = useMemo(() => genEntries(90, 0.75, 42), [])
  const exerciseEntries = useMemo(() => genEntries(90, 0.55, 137), [])
  const readingEntries = useMemo(() => genEntries(90, 0.65, 256), [])

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Meus Habitos</h1>
        <Button variant="primary" size="sm">
          Novo habito
        </Button>
      </div>

      <HabitTracker
        name="Meditacao"
        icon={<Brain size={20} />}
        color="var(--wlh-navy-500)"
        streak={12}
        bestStreak={34}
        completionRate={78}
        entries={meditationEntries}
      />

      <HabitTracker
        name="Exercicio"
        icon={<Dumbbell size={20} />}
        color="var(--wlh-green-500)"
        streak={3}
        bestStreak={21}
        completionRate={55}
        entries={exerciseEntries}
      />

      <HabitTracker
        name="Leitura"
        icon={<BookOpen size={20} />}
        color="var(--wlh-amber-500)"
        streak={7}
        bestStreak={15}
        completionRate={65}
        entries={readingEntries}
      />
    </div>
  )
}
