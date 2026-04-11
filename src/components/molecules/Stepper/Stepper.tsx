import { type ReactNode } from 'react'
import styles from './Stepper.module.css'

export type StepStatus = 'completed' | 'current' | 'upcoming' | 'error'
export type StepperOrientation = 'horizontal' | 'vertical'

export interface Step {
  id:           string
  label:        string
  description?: string
  status?:      StepStatus
  icon?:        ReactNode
}

export interface StepperProps {
  steps:            Step[]
  currentStep:      number
  orientation?:     StepperOrientation
  size?:            'sm' | 'md' | 'lg'
  onStepClick?:     (index: number) => void
  className?:       string
}

function resolveStatus(step: Step, index: number, currentStep: number): StepStatus {
  if (step.status) return step.status
  if (index < currentStep) return 'completed'
  if (index === currentStep) return 'current'
  return 'upcoming'
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <polyline points="3.5 8 6.5 11 12.5 5" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="4" y1="4" x2="12" y2="12" />
      <line x1="12" y1="4" x2="4" y2="12" />
    </svg>
  )
}

function StepCircle({
  status,
  index,
  icon,
}: {
  status: StepStatus
  index: number
  icon?: ReactNode
}) {
  if (icon) return <>{icon}</>

  switch (status) {
    case 'completed':
      return <CheckIcon />
    case 'error':
      return <ErrorIcon />
    case 'current':
      return <span className={styles.currentDot} aria-hidden="true" />
    case 'upcoming':
    default:
      return <span aria-hidden="true">{index + 1}</span>
  }
}

function getConnectorStatus(
  currentStatus: StepStatus,
  nextStatus: StepStatus,
): 'full' | 'half' | 'empty' {
  if (currentStatus === 'completed' && nextStatus === 'completed') return 'full'
  if (currentStatus === 'completed' && nextStatus === 'current') return 'half'
  return 'empty'
}

export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  size        = 'md',
  onStepClick,
  className,
}: StepperProps) {
  const rootClasses = [
    styles.root,
    styles[`root--${orientation}`],
    styles[`root--${size}`],
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={rootClasses} role="list">
      {steps.map((step, index) => {
        const status = resolveStatus(step, index, currentStep)
        const isLast = index === steps.length - 1
        const isClickable = onStepClick && status === 'completed'

        const nextStatus = !isLast
          ? resolveStatus(steps[index + 1], index + 1, currentStep)
          : undefined

        const connectorStatus = !isLast && nextStatus
          ? getConnectorStatus(status, nextStatus)
          : undefined

        const stepLabel = `${step.label}${
          status === 'completed' ? ' - concluído' :
          status === 'current'   ? ' - atual' :
          status === 'error'     ? ' - erro' :
          ' - pendente'
        }`

        const circleClasses = [
          styles.circle,
          styles[`circle--${status}`],
        ].filter(Boolean).join(' ')

        const circleContent = (
          <span className={circleClasses}>
            <StepCircle status={status} index={index} icon={step.icon} />
          </span>
        )

        return (
          <div
            key={step.id}
            className={styles.step}
            role="listitem"
            aria-current={status === 'current' ? 'step' : undefined}
            aria-label={stepLabel}
          >
            <div className={styles.indicator}>
              {isClickable ? (
                <button
                  type="button"
                  className={styles.clickable}
                  onClick={() => onStepClick(index)}
                  aria-label={`Ir para ${step.label}`}
                >
                  {circleContent}
                </button>
              ) : (
                circleContent
              )}

              {!isLast && connectorStatus && (
                <span
                  className={[
                    styles.connector,
                    styles[`connector--${connectorStatus}`],
                  ].filter(Boolean).join(' ')}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className={styles.content}>
              <span className={[
                styles.label,
                styles[`label--${status}`],
              ].filter(Boolean).join(' ')}>
                {step.label}
              </span>
              {step.description && (
                <span className={styles.description}>{step.description}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
