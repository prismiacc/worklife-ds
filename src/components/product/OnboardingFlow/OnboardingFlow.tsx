import { useState, useCallback, useMemo, type ReactNode } from 'react'
import { Brain, Timer, Moon, Dumbbell, Users, Scale, BookOpen, Heart, Droplets, PenLine, Activity } from 'lucide-react'
import styles from './OnboardingFlow.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type OnboardingStepId =
  | 'welcome'
  | 'profile'
  | 'goals'
  | 'habits'
  | 'notifications'
  | 'complete'

export interface OnboardingGoal {
  id: string
  label: string
  icon: ReactNode
  description: string
}

export interface OnboardingHabit {
  id: string
  label: string
  icon: ReactNode
  frequency: 'daily' | 'weekdays' | 'weekly'
}

export interface OnboardingData {
  displayName: string
  role: string
  goals: string[]
  habits: string[]
  notifyCheckin: boolean
  notifyInsights: boolean
  notifyTeam: boolean
}

export interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
  onSkip?: () => void
  contained?: boolean
  className?: string
}

/* ── Constants ─────────────────────────────────────────────────── */
const STEPS: OnboardingStepId[] = [
  'welcome',
  'profile',
  'goals',
  'habits',
  'notifications',
  'complete',
]

const ROLE_OPTIONS = [
  'Engenharia',
  'Design',
  'Produto',
  'Marketing',
  'RH',
  'Operações',
  'Liderança',
  'Outro',
] as const

const GOALS: OnboardingGoal[] = [
  { id: 'reduce-stress',  icon: <Brain    size={20} />, label: 'Reduzir estresse',          description: 'Técnicas de mindfulness e pausas estratégicas' },
  { id: 'more-focus',     icon: <Timer    size={20} />, label: 'Melhorar foco',             description: 'Sessões Pomodoro e gestão de distrações' },
  { id: 'better-sleep',   icon: <Moon     size={20} />, label: 'Dormir melhor',             description: 'Rotinas e monitoramento do sono' },
  { id: 'move-more',      icon: <Dumbbell size={20} />, label: 'Exercitar mais',            description: 'Metas de movimento e lembretes' },
  { id: 'team-connection',icon: <Users    size={20} />, label: 'Conexão com equipe',        description: 'Check-ins e feedback contínuo' },
  { id: 'work-life',      icon: <Scale    size={20} />, label: 'Equilíbrio trabalho-vida',  description: 'Limites saudáveis e desconexão' },
]

const HABITS: (OnboardingHabit & { label: string })[] = [
  { id: 'meditation', icon: <Brain    size={18} />, label: 'Meditação',       frequency: 'daily'    },
  { id: 'exercise',   icon: <Dumbbell size={18} />, label: 'Exercício físico', frequency: 'weekdays' },
  { id: 'reading',    icon: <BookOpen size={18} />, label: 'Leitura',         frequency: 'daily'    },
  { id: 'gratitude',  icon: <Heart    size={18} />, label: 'Gratidão',        frequency: 'daily'    },
  { id: 'hydration',  icon: <Droplets size={18} />, label: 'Hidratação',      frequency: 'daily'    },
  { id: 'walk',       icon: <Activity size={18} />, label: 'Caminhada',       frequency: 'daily'    },
  { id: 'journal',    icon: <PenLine  size={18} />, label: 'Diário',          frequency: 'daily'    },
  { id: 'stretch',    icon: <Activity size={18} />, label: 'Alongamento',     frequency: 'weekdays' },
]

const FREQUENCY_LABELS: Record<OnboardingHabit['frequency'], string> = {
  daily: 'Diário',
  weekdays: 'Dias úteis',
  weekly: 'Semanal',
}

const MAX_GOALS = 3

const INITIAL_DATA: OnboardingData = {
  displayName: '',
  role: '',
  goals: [],
  habits: [],
  notifyCheckin: true,
  notifyInsights: true,
  notifyTeam: false,
}

/* ── Component ─────────────────────────────────────────────────── */
export function OnboardingFlow({
  onComplete,
  onSkip,
  contained = false,
  className,
}: OnboardingFlowProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA)

  const currentStep = STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === STEPS.length - 1
  const showBack = !isFirst && !isLast
  const showSkip = stepIndex >= 1 && stepIndex <= 4

  const progressPercent = useMemo(
    () => (stepIndex / (STEPS.length - 1)) * 100,
    [stepIndex],
  )

  const canAdvance = useMemo(() => {
    if (currentStep === 'profile') return data.displayName.trim().length > 0
    return true
  }, [currentStep, data.displayName])

  const goNext = useCallback(() => {
    if (stepIndex < STEPS.length - 1) setStepIndex(i => i + 1)
  }, [stepIndex])

  const goBack = useCallback(() => {
    if (stepIndex > 0) setStepIndex(i => i - 1)
  }, [stepIndex])

  const updateField = useCallback(
    <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
      setData(prev => ({ ...prev, [key]: value }))
    },
    [],
  )

  const toggleGoal = useCallback((goalId: string) => {
    setData(prev => {
      const selected = prev.goals
      if (selected.includes(goalId)) {
        return { ...prev, goals: selected.filter(g => g !== goalId) }
      }
      if (selected.length < MAX_GOALS) {
        return { ...prev, goals: [...selected, goalId] }
      }
      // FIFO: drop the oldest, add the new one
      return { ...prev, goals: [...selected.slice(1), goalId] }
    })
  }, [])

  const toggleHabit = useCallback((habitId: string) => {
    setData(prev => {
      const selected = prev.habits
      if (selected.includes(habitId)) {
        return { ...prev, habits: selected.filter(h => h !== habitId) }
      }
      return { ...prev, habits: [...selected, habitId] }
    })
  }, [])

  const handleComplete = useCallback(() => {
    onComplete(data)
  }, [onComplete, data])

  /* ── Step renderers ─────────────────────────────────────────── */

  function renderWelcome() {
    return (
      <>
        <span className={styles.welcomeLogo}>WorkLife Hub</span>
        <h1 className={styles.headline}>Bem-vindo ao WorkLife Hub</h1>
        <p className={styles.subtitle}>
          A plataforma de bem-estar que transforma dados em ação. Vamos configurar
          tudo em menos de 3 minutos.
        </p>
        <div className={styles.footer}>
          <button className={styles.primaryBtn} type="button" onClick={goNext}>
            Começar
          </button>
        </div>
        <span className={styles.version}>v2.0</span>
      </>
    )
  }

  function renderProfile() {
    return (
      <>
        <h2 className={styles.headline}>Conte um pouco sobre você</h2>
        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="ob-name">
              Como quer ser chamado?
            </label>
            <input
              id="ob-name"
              className={styles.input}
              type="text"
              placeholder="Seu nome"
              value={data.displayName}
              onChange={e => updateField('displayName', e.target.value)}
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="ob-role">
              Qual sua área?
            </label>
            <select
              id="ob-role"
              className={styles.select}
              value={data.role}
              onChange={e => updateField('role', e.target.value)}
            >
              <option value="">Selecione...</option>
              {ROLE_OPTIONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.footer}>
          <button
            className={styles.primaryBtn}
            type="button"
            disabled={!canAdvance}
            onClick={goNext}
          >
            Continuar
          </button>
        </div>
      </>
    )
  }

  function renderGoals() {
    return (
      <>
        <h2 className={styles.headline}>Quais são seus objetivos?</h2>
        <p className={styles.subtitle}>Selecione até 3</p>
        <div className={styles.selGrid}>
          {GOALS.map(goal => {
            const selected = data.goals.includes(goal.id)
            const dimmed = !selected && data.goals.length >= MAX_GOALS
            return (
              <button
                key={goal.id}
                type="button"
                className={[
                  styles.selCard,
                  selected ? styles['selCard--selected'] : '',
                  dimmed ? styles['selCard--dimmed'] : '',
                ].join(' ')}
                onClick={() => toggleGoal(goal.id)}
                aria-pressed={selected}
              >
                <span className={styles.selCardIcon}>{goal.icon}</span>
                <span className={styles.selCardLabel}>{goal.label}</span>
                <span className={styles.selCardDesc}>{goal.description}</span>
              </button>
            )
          })}
        </div>
        <div className={styles.footer}>
          <button className={styles.primaryBtn} type="button" onClick={goNext}>
            Continuar
          </button>
        </div>
      </>
    )
  }

  function renderHabits() {
    return (
      <>
        <h2 className={styles.headline}>Que hábitos quer construir?</h2>
        <p className={styles.subtitle}>Selecione os que parecem alcançáveis agora</p>
        <div className={styles.selGrid}>
          {HABITS.map(habit => {
            const selected = data.habits.includes(habit.id)
            return (
              <button
                key={habit.id}
                type="button"
                className={[
                  styles.selCard,
                  selected ? styles['selCard--selected'] : '',
                ].join(' ')}
                onClick={() => toggleHabit(habit.id)}
                aria-pressed={selected}
              >
                <span className={styles.selCardIcon}>{habit.icon}</span>
                <span className={styles.selCardLabel}>{habit.label}</span>
                <span className={styles.selCardFreq}>
                  {FREQUENCY_LABELS[habit.frequency]}
                </span>
              </button>
            )
          })}
        </div>
        <div className={styles.footer}>
          <button className={styles.primaryBtn} type="button" onClick={goNext}>
            Continuar
          </button>
        </div>
      </>
    )
  }

  function renderNotifications() {
    return (
      <>
        <h2 className={styles.headline}>Configure seus lembretes</h2>
        <div className={styles.toggleGroup}>
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Lembrete de check-in diário</span>
              <span className={styles.toggleDesc}>
                Receba um lembrete para registrar seu bem-estar
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.notifyCheckin}
              className={styles.toggle}
              onClick={() => updateField('notifyCheckin', !data.notifyCheckin)}
            >
              <span className={styles.toggleCircle} />
            </button>
          </div>
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Insights personalizados</span>
              <span className={styles.toggleDesc}>
                Análises e sugestões baseadas nos seus dados
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.notifyInsights}
              className={styles.toggle}
              onClick={() => updateField('notifyInsights', !data.notifyInsights)}
            >
              <span className={styles.toggleCircle} />
            </button>
          </div>
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Atualizações da equipe</span>
              <span className={styles.toggleDesc}>
                Fique por dentro do bem-estar coletivo
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.notifyTeam}
              className={styles.toggle}
              onClick={() => updateField('notifyTeam', !data.notifyTeam)}
            >
              <span className={styles.toggleCircle} />
            </button>
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.primaryBtn} type="button" onClick={goNext}>
            Continuar
          </button>
        </div>
      </>
    )
  }

  function renderComplete() {
    const goalCount = data.goals.length
    const habitCount = data.habits.length
    return (
      <>
        <div className={styles.completeIcon} aria-hidden="true">{'\u2713'}</div>
        <h2 className={styles.headline}>Tudo pronto!</h2>
        <p className={styles.subtitle}>
          Você escolheu {goalCount} objetivo{goalCount !== 1 ? 's' : ''} e{' '}
          {habitCount} hábito{habitCount !== 1 ? 's' : ''}. Seu primeiro check-in
          está te esperando.
        </p>
        <div className={styles.footer}>
          <button
            className={styles.primaryBtn}
            type="button"
            onClick={handleComplete}
          >
            Ir para o Dashboard
          </button>
          <button className={styles.secondaryBtn} type="button" onClick={handleComplete}>
            Ver minha agenda
          </button>
        </div>
      </>
    )
  }

  const STEP_RENDERERS: Record<OnboardingStepId, () => JSX.Element> = {
    welcome: renderWelcome,
    profile: renderProfile,
    goals: renderGoals,
    habits: renderHabits,
    notifications: renderNotifications,
    complete: renderComplete,
  }

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div
      className={[
        styles.root,
        contained ? styles['root--contained'] : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Progress bar */}
      <div
        className={[
          styles.progressBar,
          isFirst ? styles['progressBar--hidden'] : '',
        ].join(' ')}
      >
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso do onboarding"
        />
      </div>

      {/* Header: back + skip */}
      <div className={styles.header}>
        <button
          type="button"
          className={[
            styles.backBtn,
            !showBack ? styles['backBtn--hidden'] : '',
          ].join(' ')}
          onClick={goBack}
          aria-label="Voltar"
          tabIndex={showBack ? 0 : -1}
        >
          {'\u2039'}
        </button>
        <button
          type="button"
          className={[
            styles.skipBtn,
            !showSkip ? styles['skipBtn--hidden'] : '',
          ].join(' ')}
          onClick={onSkip}
          tabIndex={showSkip ? 0 : -1}
        >
          Pular
        </button>
      </div>

      {/* Step content */}
      <div className={styles.body}>
        <div className={styles.content} key={currentStep}>
          {STEP_RENDERERS[currentStep]()}
        </div>
      </div>
    </div>
  )
}
