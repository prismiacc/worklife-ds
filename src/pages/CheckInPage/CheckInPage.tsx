import { useState } from 'react'
import { DailyCheckInStepper } from '@/components/organisms/DailyCheckInStepper'
import { PageHeader }          from '@/components/organisms/PageHeader'
import { Card }                from '@/components/atoms/Card'
import { WellbeingScore }      from '@/components/product/WellbeingScore'
import styles from './CheckInPage.module.css'

export function CheckInPage() {
  const [done, setDone] = useState(false)
  const [score, setScore] = useState(0)

  if (done) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Check-in concluído"
          subtitle="Seu bem-estar foi registrado com sucesso"
          onBack={() => setDone(false)}
        />
        <div className={styles.result}>
          <Card variant="default" padding="xl" className={styles.scoreCard}>
            <div className={styles.scoreTitle}>Score de hoje</div>
            <WellbeingScore score={score} size="xl" label="Bem-estar" animate />
            <p className={styles.scoreMsg}>
              {score >= 80
                ? 'Excelente! Continue assim.'
                : score >= 60
                ? 'Bom ritmo. Pequenos ajustes podem ajudar!'
                : score >= 40
                ? 'Atenção à sua energia. Considere uma pausa.'
                : 'Cuide-se hoje. Você merece descanso.'}
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Check-in diário"
        subtitle="Como você está hoje?"
        breadcrumb={[
          { label: 'Dashboard', href: '/' },
          { label: 'Check-in' },
        ]}
      />
      <div className={styles.stepperWrap}>
        <DailyCheckInStepper
          onComplete={(payload) => {
            // Calculate a rough score from the payload domains
            const avg = payload.domains
              ? Object.values(payload.domains).reduce((s: number, v) => s + (v as number), 0) /
                Math.max(1, Object.values(payload.domains).length) * 20
              : 72
            setScore(Math.round(avg))
            setDone(true)
          }}
        />
      </div>
    </div>
  )
}
