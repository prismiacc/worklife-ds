import { useMemo } from 'react'
import { Button } from '../../components/atoms/Button/Button'
import { StatCard } from '../../components/molecules/StatCard/StatCard'
import { WellbeingScore } from '../../components/product/WellbeingScore/WellbeingScore'
import { ActivityFeed } from '../../components/product/ActivityFeed/ActivityFeed'
import type { ActivityItem } from '../../components/product/ActivityFeed/ActivityFeed'
import { InsightCard } from '../../components/product/InsightCard/InsightCard'
import styles from './DashboardPage.module.css'

function buildActivityItems(): ActivityItem[] {
  const now = Date.now()
  return [
    {
      id: 'a1',
      type: 'habit',
      title: 'Meditacao concluida',
      description: '15 minutos de meditacao guiada',
      timestamp: new Date(now - 1 * 60 * 60 * 1000),
      value: '15 min',
    },
    {
      id: 'a2',
      type: 'goal',
      title: 'Meta de leitura atualizada',
      description: 'Progresso: 73% do objetivo mensal',
      timestamp: new Date(now - 2 * 60 * 60 * 1000),
      value: '73%',
    },
    {
      id: 'a3',
      type: 'mood',
      title: 'Check-in de humor registrado',
      description: 'Humor: Energizado e focado',
      timestamp: new Date(now - 3 * 60 * 60 * 1000),
      value: 'Score: 8.4',
    },
    {
      id: 'a4',
      type: 'focus',
      title: 'Sessao de foco finalizada',
      description: 'Trabalho profundo — projeto WorkLife',
      timestamp: new Date(now - 4.5 * 60 * 60 * 1000),
      value: '45 min',
    },
    {
      id: 'a5',
      type: 'achievement',
      title: 'Conquista desbloqueada!',
      description: 'Sequencia de 14 dias de check-in',
      timestamp: new Date(now - 6 * 60 * 60 * 1000),
      badge: 'Consistencia',
      highlight: true,
    },
  ]
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function DashboardPage() {
  const activityItems = useMemo(() => buildActivityItems(), [])

  const todayFormatted = useMemo(
    () =>
      new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [],
  )

  const greeting = useMemo(() => getGreeting(), [])

  return (
    <div className={styles.page}>
      {/* Row 1 — Greeting + date */}
      <div className={styles.greeting}>
        <div className={styles.greetingText}>
          <h1 className={styles.greetingTitle}>
            {greeting}, Ana
          </h1>
          <span className={styles.greetingDate}>{todayFormatted}</span>
        </div>
        <Button variant="primary" size="sm">
          Fazer check-in
        </Button>
      </div>

      {/* Row 2 — Stats */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Score hoje"
          value="8.4"
          unit="/10"
          trend={3.2}
          variant="brand"
        />
        <StatCard
          label="Sequencia"
          value={14}
          unit="dias"
          trend={2}
          variant="success"
        />
        <StatCard
          label="Habitos hoje"
          value="3"
          unit="/5"
          trend={-1}
          variant="amber"
        />
        <StatCard
          label="Meta do mes"
          value="73"
          unit="%"
          trend={8}
        />
      </div>

      {/* Row 3 — Main content */}
      <div className={styles.mainRow}>
        {/* Left column (2/3) */}
        <div className={styles.mainCol}>
          <div className={styles.scoreCard}>
            <WellbeingScore
              size="xl"
              score={84}
              trend={3}
              label="Bem-estar geral"
            />
          </div>
          <ActivityFeed items={activityItems} maxItems={5} />
        </div>

        {/* Right column (1/3) */}
        <div className={styles.insightsCol}>
          <InsightCard
            id="insight-1"
            title="Sua consistencia esta excelente"
            body="Voce manteve 14 dias consecutivos de check-in. Estudos mostram que a consistencia e o fator mais importante para o bem-estar a longo prazo. Continue assim!"
            category="wellbeing"
            priority="high"
            isNew
            metric={{
              label: 'Sequencia atual',
              value: '14 dias',
              trend: 16,
            }}
            actions={[
              { label: 'Ver detalhes', onClick: () => {} },
            ]}
          />
          <InsightCard
            id="insight-2"
            title="Habito de exercicio precisa de atencao"
            body="Sua taxa de conclusao do habito de exercicio caiu 12% esta semana. Considere ajustar a meta para algo mais alcancavel ou tentar um horario diferente."
            category="habits"
            priority="medium"
            metric={{
              label: 'Taxa de conclusao',
              value: '55%',
              trend: -12,
            }}
            actions={[
              { label: 'Ajustar meta', onClick: () => {} },
              { label: 'Ver historico', onClick: () => {} },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
