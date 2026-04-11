/**
 * MoodSelector.tsx — WorkLife Hub
 *
 * Componente de seleção de humor com 5 opções.
 * Implementa padrão ARIA radiogroup com navegação por teclado completa.
 *
 * Archetype Companion:
 *   - Sem vermelho, sem urgência agressiva
 *   - Animações stagger de entrada que "respiram"
 *   - Feedback háptico sutil no mobile
 */

import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { Laugh, Smile, Meh, Frown, Angry } from 'lucide-react';
import type { MoodOption, MoodSelectorProps, MoodValue } from '../../DailyCheckInStepper/types';
import styles from './MoodSelector.module.css';

// ---------------------------------------------------------------------------
// Dados estáticos das opções de humor
// ---------------------------------------------------------------------------

const MOOD_OPTIONS: MoodOption[] = [
  { value: 'great',      icon: <Laugh  size={32} />, label: 'Ótimo!',   color: '#F59E0B', ariaDescription: 'Ótimo — estou me sentindo muito bem hoje' },
  { value: 'good',       icon: <Smile  size={32} />, label: 'Bem',      color: '#10B981', ariaDescription: 'Bem — estou me sentindo bem hoje' },
  { value: 'okay',       icon: <Meh    size={32} />, label: 'Ok',       color: '#64748B', ariaDescription: 'Ok — estou mais ou menos hoje' },
  { value: 'low',        icon: <Frown  size={32} />, label: 'Cansado',  color: '#64748B', ariaDescription: 'Cansado — estou com pouca energia hoje' },
  { value: 'struggling', icon: <Angry  size={32} />, label: 'Difícil',  color: '#1A2B4A', ariaDescription: 'Difícil — estou passando por um momento pesado hoje' },
];

/** Delay de stagger entre cada mood na animação de entrada (ms) */
const STAGGER_DELAY_MS = 50;

/** Tempo até "Registrado ✓" aparecer após seleção (ms) */
const CONFIRMATION_DELAY_MS = 1500;

/** Duração mínima do feedback de confirmação antes de sumir (ms) */
const CONFIRMATION_DURATION_MS = 2500;

// ---------------------------------------------------------------------------
// Utilidade: vibração háptica sutil no mobile
// ---------------------------------------------------------------------------

function triggerHaptic(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(10);
    } catch {
      // Navegadores podem lançar exceção em contextos sem permissão
    }
  }
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * MoodSelector
 *
 * Exibe 5 opções de humor como um grupo de rádio acessível.
 * Suporta navegação por teclado, animação stagger de entrada,
 * e confirmação visual após seleção.
 *
 * @example
 * ```tsx
 * const [mood, setMood] = useState<MoodValue | null>(null);
 * <MoodSelector value={mood} onChange={setMood} />
 * ```
 */
export function MoodSelector({
  value,
  onChange,
  disabled = false,
}: MoodSelectorProps) {
  const rawId = useId();
  const groupId = rawId.replace(/:/g, '-');
  const legendId = `${groupId}-legend`;

  /**
   * Refs para cada botão de mood — necessários para gerenciar focus
   * programático na navegação por teclas Arrow.
   */
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>(
    Array(MOOD_OPTIONS.length).fill(null),
  );

  /**
   * Controla quais botões já passaram pelo stagger de entrada.
   * Array de booleans indexado igual a MOOD_OPTIONS.
   */
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    Array(MOOD_OPTIONS.length).fill(false),
  );

  /** Controla exibição do texto "Registrado ✓" */
  const [showConfirmation, setShowConfirmation] = useState(false);
  const confirmationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmationHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------------------------------------------------------------------------
  // Animação stagger de entrada — dispara uma única vez ao montar
  // -------------------------------------------------------------------------

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    MOOD_OPTIONS.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleItems((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      }, index * STAGGER_DELAY_MS);

      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []); // [] — intencional: só executa na montagem

  // -------------------------------------------------------------------------
  // Feedback de confirmação após seleção
  // -------------------------------------------------------------------------

  useEffect(() => {
    // Limpa timers anteriores se o usuário mudar de opção rapidamente
    if (confirmationTimerRef.current) clearTimeout(confirmationTimerRef.current);
    if (confirmationHideRef.current) clearTimeout(confirmationHideRef.current);

    if (value !== null) {
      // Aguarda 1.5s antes de mostrar confirmação
      confirmationTimerRef.current = setTimeout(() => {
        setShowConfirmation(true);

        // Esconde a confirmação após sua duração
        confirmationHideRef.current = setTimeout(() => {
          setShowConfirmation(false);
        }, CONFIRMATION_DURATION_MS);
      }, CONFIRMATION_DELAY_MS);
    } else {
      setShowConfirmation(false);
    }

    return () => {
      if (confirmationTimerRef.current) clearTimeout(confirmationTimerRef.current);
      if (confirmationHideRef.current) clearTimeout(confirmationHideRef.current);
    };
  }, [value]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  const handleSelect = useCallback(
    (mood: MoodValue) => {
      if (disabled) return;
      triggerHaptic();
      onChange(mood);
    },
    [disabled, onChange],
  );

  /**
   * Navegação por teclado no padrão ARIA radiogroup:
   *   ArrowRight / ArrowDown → próxima opção
   *   ArrowLeft  / ArrowUp   → opção anterior
   *   Space / Enter          → selecionar opção focada
   *   Home                   → primeira opção
   *   End                    → última opção
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      if (disabled) return;

      const total = MOOD_OPTIONS.length;
      let targetIndex: number | null = null;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          targetIndex = (currentIndex + 1) % total;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          targetIndex = (currentIndex - 1 + total) % total;
          break;
        case 'Home':
          event.preventDefault();
          targetIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          targetIndex = total - 1;
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          handleSelect(MOOD_OPTIONS[currentIndex].value);
          return;
        default:
          return;
      }

      if (targetIndex !== null) {
        buttonRefs.current[targetIndex]?.focus();
        // Seleciona automaticamente ao navegar com Arrow (padrão ARIA radiogroup)
        handleSelect(MOOD_OPTIONS[targetIndex].value);
      }
    },
    [disabled, handleSelect],
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div
      /*
       * ACESSIBILIDADE: role="radiogroup" identifica o container como
       * um grupo de botões de rádio para leitores de tela.
       * aria-labelledby aponta para o elemento <legend> visível.
       */
      role="radiogroup"
      aria-labelledby={legendId}
      aria-label="Como você está hoje?"
      aria-disabled={disabled || undefined}
      className={styles.moodSelector}
    >
      <span
        id={legendId}
        className={styles.moodSelector__legend}
        aria-hidden="true" /* Evita dupla leitura — o grupo já tem aria-label */
      >
        Como você está hoje?
      </span>

      {/* Lista semântica de opções */}
      <ul className={styles.moodSelector__list} role="presentation">
        {MOOD_OPTIONS.map((option, index) => {
          const isSelected = value === option.value;
          const isDimmed = value !== null && !isSelected;

          /*
           * Determina a classe de estado do botão compondo os
           * modificadores BEM — sem depender de lógica ternária aninhada.
           */
          const buttonClassName = [
            styles.moodSelector__button,
            visibleItems[index] && styles['moodSelector__button--visible'],
            isSelected && styles['moodSelector__button--selected'],
            isDimmed && styles['moodSelector__button--dimmed'],
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <li
              key={option.value}
              className={styles.moodSelector__item}
              role="presentation"
            >
              <button
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                type="button"
                /*
                 * ACESSIBILIDADE: role="radio" + aria-checked comunicam
                 * estado de seleção sem depender apenas de cor.
                 * aria-label descreve a opção de forma autônoma.
                 */
                role="radio"
                aria-checked={isSelected}
                aria-label={option.ariaDescription}
                disabled={disabled}
                className={buttonClassName}
                /*
                 * --mood-color é consumida pelo CSS para ring e checkmark.
                 * Isolado em propriedade inline para não poluir o CSS global.
                 */
                style={{ '--mood-color': option.color } as React.CSSProperties}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                /*
                 * tabIndex: no padrão roving tabindex para radiogroup,
                 * apenas o item selecionado (ou o primeiro se nenhum)
                 * recebe tabIndex=0. Os demais ficam em -1.
                 */
                tabIndex={
                  isSelected || (value === null && index === 0) ? 0 : -1
                }
              >
                <span className={styles.moodSelector__emojiWrap} aria-hidden="true">
                  <span
                    className={styles.moodSelector__emoji}
                    role="img"
                    aria-hidden="true"
                  >
                    {option.icon}
                  </span>

                  {/*
                   * ACESSIBILIDADE: Checkmark visual (não-cor) que confirma
                   * seleção. aria-hidden pois aria-checked já comunica estado.
                   */}
                  <span
                    className={styles.moodSelector__check}
                    aria-hidden="true"
                  >
                    <svg
                      className={styles.moodSelector__checkIcon}
                      viewBox="0 0 12 12"
                      focusable="false"
                    >
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  </span>
                </span>

                {/* Label visível — aria-hidden pois o botão já tem aria-label */}
                <span className={styles.moodSelector__label} aria-hidden="true">
                  {option.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/*
       * ACESSIBILIDADE: aria-live="polite" garante que leitores de tela
       * anunciem a confirmação sem interromper a leitura atual.
       * O contêiner existe sempre para evitar layout shift.
       */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className={[
          styles.moodSelector__confirmation,
          showConfirmation && styles['moodSelector__confirmation--visible'],
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {showConfirmation ? 'Registrado ✓' : ''}
      </p>
    </div>
  );
}

export default MoodSelector;
