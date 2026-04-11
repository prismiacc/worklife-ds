/**
 * DailyCheckInStepper.tsx — WorkLife Hub
 *
 * Orquestra o processo de check-in diário em 4 steps sequenciais:
 *   Step 0 — Mood          (integra MoodSelector)
 *   Step 1 — WorkLife Balance (slider)
 *   Step 2 — Domínios       (checkboxes)
 *   Step 3 — Nota Livre     (textarea)
 *
 * Requisitos de acessibilidade implementados:
 *   - role="group" no container + aria-label
 *   - aria-live="polite" anunciando mudança de step
 *   - Focus gerenciado ao navegar: heading do novo step recebe focus
 *   - ProgressBar com role="progressbar" + aria-valuenow/min/max
 *   - Todos os controles acessíveis por teclado
 */

import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react';
import { MoodSelector } from '../MoodSelector/MoodSelector';
import styles from './DailyCheckInStepper.module.css';
import { useDailyCheckIn } from './useDailyCheckIn';
import { Briefcase, Activity, Users, BookOpen, Gamepad2, Wallet, Timer } from 'lucide-react';
import type {
  BalanceScore,
  DailyCheckInStepperProps,
  DomainKey,
  DomainOption,
} from './types';

// ---------------------------------------------------------------------------
// Constantes de dados
// ---------------------------------------------------------------------------

const DOMAIN_OPTIONS: DomainOption[] = [
  { key: 'work',          label: 'Trabalho',   icon: <Briefcase size={18} /> },
  { key: 'health',        label: 'Saúde',       icon: <Activity  size={18} /> },
  { key: 'relationships', label: 'Relações',    icon: <Users     size={18} /> },
  { key: 'learning',      label: 'Aprendizado', icon: <BookOpen  size={18} /> },
  { key: 'leisure',       label: 'Lazer',       icon: <Gamepad2  size={18} /> },
  { key: 'finances',      label: 'Finanças',    icon: <Wallet    size={18} /> },
];

const TOTAL_STEPS = 4;

const STEP_LABELS = ['Humor', 'Equilíbrio', 'Domínios', 'Nota'];

const NOTE_MAX_CHARS = 500;

// ---------------------------------------------------------------------------
// Utilitário: data local no formato YYYY-MM-DD
// ---------------------------------------------------------------------------

function getTodayLocalDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ---------------------------------------------------------------------------
// Sub-componente: Step 1 — Humor (wrapper do MoodSelector)
// ---------------------------------------------------------------------------

interface MoodStepProps {
  value: ReturnType<typeof useDailyCheckIn>['mood'];
  onChange: ReturnType<typeof useDailyCheckIn>['setMood'];
  headingId: string;
  headingRef: React.RefObject<HTMLHeadingElement>;
}

function MoodStep({ value, onChange, headingId, headingRef }: MoodStepProps) {
  return (
    <div className={styles.stepper__step}>
      {/* Badge de duração estimada — mostrado apenas no step inicial */}
      <div className={styles.stepper__introBadge} aria-hidden="true">
        <Timer size={14} aria-hidden="true" />
        <span>Leva cerca de 2 minutos</span>
      </div>

      <h2
        id={headingId}
        ref={headingRef}
        className={styles.stepper__stepHeading}
        /*
         * ACESSIBILIDADE: tabIndex=-1 permite focus programático
         * sem inserir o heading na ordem de tab natural.
         */
        tabIndex={-1}
      >
        Como você está se sentindo?
      </h2>
      <p className={styles.stepper__stepDescription}>
        Escolha o humor que melhor descreve como você está agora.
      </p>

      <MoodSelector value={value} onChange={onChange} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-componente: Step 2 — Equilíbrio trabalho-vida
// ---------------------------------------------------------------------------

interface BalanceStepProps {
  value: BalanceScore | null;
  onChange: (v: BalanceScore) => void;
  headingId: string;
  headingRef: React.RefObject<HTMLHeadingElement>;
  stepDescId: string;
}

function BalanceStep({
  value,
  onChange,
  headingId,
  headingRef,
  stepDescId,
}: BalanceStepProps) {
  const currentValue = value ?? 5;
  // Percentual de preenchimento do track do slider
  const fillPercent = ((currentValue - 1) / 9) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value) as BalanceScore;
    onChange(v);
  };

  return (
    <div className={styles.stepper__step}>
      <h2
        id={headingId}
        ref={headingRef}
        className={styles.stepper__stepHeading}
        tabIndex={-1}
      >
        Equilíbrio trabalho-vida
      </h2>
      <p id={stepDescId} className={styles.stepper__stepDescription}>
        Como você avalia o equilíbrio entre trabalho e vida pessoal hoje?
      </p>

      <div className={styles.balanceStep__sliderWrap}>
        {/* Valor numérico grande como feedback visual */}
        <div className={styles.balanceStep__valueDisplay} aria-hidden="true">
          <span className={styles.balanceStep__valueBig}>{currentValue}</span>
          <span className={styles.balanceStep__valueMax}>/10</span>
        </div>

        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={currentValue}
          onChange={handleChange}
          className={styles.balanceStep__slider}
          aria-label="Equilíbrio trabalho-vida de 1 a 10"
          aria-describedby={stepDescId}
          aria-valuenow={currentValue}
          aria-valuemin={1}
          aria-valuemax={10}
          /*
           * style inline para o preenchimento dinâmico do track.
           * CSS puro não tem acesso ao valor do input sem JS.
           */
          style={{ '--fill-percent': `${fillPercent}%` } as React.CSSProperties}
        />

        <div className={styles.balanceStep__labels} aria-hidden="true">
          <span>Muito desequilibrado</span>
          <span>Muito equilibrado</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-componente: Step 3 — Domínios de bem-estar
// ---------------------------------------------------------------------------

interface DomainsStepProps {
  selected: DomainKey[];
  onToggle: (key: DomainKey) => void;
  headingId: string;
  headingRef: React.RefObject<HTMLHeadingElement>;
  groupId: string;
}

function DomainsStep({
  selected,
  onToggle,
  headingId,
  headingRef,
  groupId,
}: DomainsStepProps) {
  return (
    <div className={styles.stepper__step}>
      <h2
        id={headingId}
        ref={headingRef}
        className={styles.stepper__stepHeading}
        tabIndex={-1}
      >
        Domínios em foco
      </h2>
      <p className={styles.stepper__stepDescription}>
        Selecione as áreas da vida que estão mais presentes para você hoje.
        (Opcional — pode selecionar quantos quiser)
      </p>

      {/*
       * ACESSIBILIDADE: fieldset + legend é o padrão semântico para
       * grupo de checkboxes. legend está visually-hidden para não duplicar
       * o heading visível, mas o fieldset cria o contexto de grupo.
       */}
      <fieldset
        role="group"
        aria-labelledby={headingId}
        id={groupId}
        style={{ border: 'none', padding: 0, margin: 0 }}
      >
        <legend className={styles.srOnly}>Domínios de bem-estar</legend>

        <ul className={styles.domainsStep__grid} role="list">
          {DOMAIN_OPTIONS.map((domain) => {
            const inputId = `${groupId}-domain-${domain.key}`;
            const isChecked = selected.includes(domain.key);

            return (
              <li key={domain.key} className={styles.domainChip}>
                <input
                  type="checkbox"
                  id={inputId}
                  name="domains"
                  value={domain.key}
                  checked={isChecked}
                  onChange={() => onToggle(domain.key)}
                  className={styles.domainChip__input}
                  aria-label={`${domain.label} — ${isChecked ? 'selecionado' : 'não selecionado'}`}
                />
                <label htmlFor={inputId} className={styles.domainChip__label}>
                  <span
                    className={styles.domainChip__emoji}
                    aria-hidden="true"
                  >
                    {domain.icon}
                  </span>
                  {domain.label}
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-componente: Step 4 — Nota livre
// ---------------------------------------------------------------------------

interface NoteStepProps {
  value: string;
  onChange: (v: string) => void;
  headingId: string;
  headingRef: React.RefObject<HTMLHeadingElement>;
  textareaId: string;
}

function NoteStep({
  value,
  onChange,
  headingId,
  headingRef,
  textareaId,
}: NoteStepProps) {
  const remaining = NOTE_MAX_CHARS - value.length;
  const isNearLimit = remaining <= 50;

  return (
    <div className={styles.stepper__step}>
      <h2
        id={headingId}
        ref={headingRef}
        className={styles.stepper__stepHeading}
        tabIndex={-1}
      >
        Uma nota para você mesmo
      </h2>
      <p className={styles.stepper__stepDescription}>
        Escreva livremente — uma intenção, uma gratidão, algo que ficou em você.
        (Opcional)
      </p>

      <div className={styles.noteStep__textareaWrap}>
        <label htmlFor={textareaId} className={styles.srOnly}>
          Nota livre do check-in
        </label>

        <textarea
          id={textareaId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={NOTE_MAX_CHARS}
          placeholder="O que está em sua mente hoje?"
          className={styles.noteStep__textarea}
          aria-label="Nota livre opcional"
          rows={5}
        />

        {/* Contador de caracteres — informativo, não bloqueante */}
        <p
          className={[
            styles.noteStep__charCount,
            isNearLimit && styles['noteStep__charCount--warn'],
          ]
            .filter(Boolean)
            .join(' ')}
          aria-live="polite"
          aria-atomic="true"
        >
          {remaining} caracteres restantes
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal: DailyCheckInStepper
// ---------------------------------------------------------------------------

/**
 * DailyCheckInStepper
 *
 * Orquestra o check-in diário em 4 steps com transição slide horizontal,
 * persistência de rascunho e gerenciamento de foco acessível.
 *
 * @example
 * ```tsx
 * <DailyCheckInStepper
 *   userId="user-abc-123"
 *   onComplete={(payload) => console.log(payload)}
 * />
 * ```
 */
export function DailyCheckInStepper({
  userId,
  onComplete,
  date,
  className,
}: DailyCheckInStepperProps) {
  const resolvedDate = date ?? getTodayLocalDate();
  /*
   * useId() em React 18 gera strings com ":" (ex: ":r0:").
   * Substituímos por "-" para produzir IDs válidos como atributo HTML
   * e seguros para uso em seletores CSS se necessário no futuro.
   */
  const rawId = useId();
  const componentId = rawId.replace(/:/g, '-');

  const {
    currentStep,
    mood,
    balance,
    domains,
    freeNote,
    canGoBack,
    isLastStep,
    progressPercent,
    setMood,
    setBalance,
    toggleDomain,
    setFreeNote,
    goNext,
    goPrev,
    complete,
  } = useDailyCheckIn(userId, resolvedDate);

  // -------------------------------------------------------------------------
  // Refs para os headings de cada step — usados no focus management
  // -------------------------------------------------------------------------

  const headingRefs = useRef<Array<React.RefObject<HTMLHeadingElement>>>(
    Array.from({ length: TOTAL_STEPS }, () =>
      React.createRef<HTMLHeadingElement>(),
    ),
  );

  // -------------------------------------------------------------------------
  // IDs derivados para ARIA
  // -------------------------------------------------------------------------

  const progressBarId = `${componentId}-progressbar`;
  const liveRegionId = `${componentId}-live`;
  const stepHeadingIds = Array.from(
    { length: TOTAL_STEPS },
    (_, i) => `${componentId}-step-${i}-heading`,
  );
  const balanceDescId = `${componentId}-balance-desc`;
  const domainsGroupId = `${componentId}-domains-group`;
  const textareaId = `${componentId}-free-note`;

  // -------------------------------------------------------------------------
  // ACESSIBILIDADE: Focus management ao mudar de step
  // Aguarda 1 frame de renderização antes de mover o foco, para garantir
  // que o DOM já reflete o novo step.
  // -------------------------------------------------------------------------

  const prevStepRef = useRef<number>(currentStep);

  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      prevStepRef.current = currentStep;

      // requestAnimationFrame garante que o DOM foi pintado
      const raf = requestAnimationFrame(() => {
        headingRefs.current[currentStep]?.current?.focus();
      });

      return () => cancelAnimationFrame(raf);
    }
  }, [currentStep]);

  // -------------------------------------------------------------------------
  // Handlers de navegação
  // -------------------------------------------------------------------------

  const handleNext = useCallback(() => {
    if (isLastStep) {
      const payload = complete();
      onComplete(payload);
    } else {
      goNext();
    }
  }, [isLastStep, complete, onComplete, goNext]);

  const handlePrev = useCallback(() => {
    goPrev();
  }, [goPrev]);

  // -------------------------------------------------------------------------
  // Label do botão de avanço
  // -------------------------------------------------------------------------

  const nextButtonLabel = isLastStep ? 'Concluir' : 'Próximo';
  const nextButtonClass = [
    styles.btn,
    isLastStep ? styles['btn--complete'] : styles['btn--primary'],
  ].join(' ');

  // -------------------------------------------------------------------------
  // Cálculo do offset de translação do track de steps
  // Cada step ocupa 100% da largura — translateX move o track N×100%
  // -------------------------------------------------------------------------

  const trackTranslateX = `translateX(calc(-${currentStep} * 100%))`;

  // -------------------------------------------------------------------------
  // Texto de anúncio para aria-live
  // -------------------------------------------------------------------------

  const liveAnnouncement = `Passo ${currentStep + 1} de ${TOTAL_STEPS}: ${STEP_LABELS[currentStep]}`;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    /*
     * ACESSIBILIDADE: role="group" + aria-label identificam o componente
     * como uma unidade coesa para leitores de tela.
     */
    <div
      role="group"
      aria-label="Assistente de check-in diário"
      className={[styles.stepper, className].filter(Boolean).join(' ')}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Região live — anuncia mudanças de step sem interromper leitura      */}
      {/* ------------------------------------------------------------------ */}
      <p
        id={liveRegionId}
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {liveAnnouncement}
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* Header: título, contagem de step e progress bar                     */}
      {/* ------------------------------------------------------------------ */}
      <header className={styles.stepper__header}>
        <div className={styles.stepper__headerMeta}>
          <p className={styles.stepper__title}>Check-in diário</p>
          <span className={styles.stepper__stepCount} aria-hidden="true">
            Passo {currentStep + 1} de {TOTAL_STEPS}
          </span>
        </div>

        {/*
         * ACESSIBILIDADE: role="progressbar" com aria-valuenow/min/max
         * comunica o progresso sem depender da representação visual.
         * aria-label é necessário pois não há texto visível associado.
         */}
        <div
          id={progressBarId}
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label={`Progresso: passo ${currentStep + 1} de ${TOTAL_STEPS}`}
          className={styles.stepper__progressBar}
        >
          <div
            className={styles.stepper__progressFill}
            style={{ width: `${progressPercent}%` }}
            aria-hidden="true"
          />
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Viewport + Track com slide horizontal                               */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={styles.stepper__viewport}
        /*
         * aria-live aqui é intencional em nível de viewport para cobrir
         * conteúdo dinâmico que não é capturado pelo live region do header.
         * "off" evita anúncios duplos — o live region acima já anuncia.
         */
        aria-live="off"
      >
        <div
          className={styles.stepper__track}
          style={{ transform: trackTranslateX }}
          /*
           * aria-hidden="false" é redundante mas garante que nenhum
           * override de stylesheet esconda o track para ATs.
           */
        >
          {/* Step 0: Mood */}
          <MoodStep
            value={mood}
            onChange={setMood}
            headingId={stepHeadingIds[0]}
            headingRef={headingRefs.current[0]}
          />

          {/* Step 1: Balance */}
          <BalanceStep
            value={balance}
            onChange={setBalance}
            headingId={stepHeadingIds[1]}
            headingRef={headingRefs.current[1]}
            stepDescId={balanceDescId}
          />

          {/* Step 2: Domains */}
          <DomainsStep
            selected={domains}
            onToggle={toggleDomain}
            headingId={stepHeadingIds[2]}
            headingRef={headingRefs.current[2]}
            groupId={domainsGroupId}
          />

          {/* Step 3: Free Note */}
          <NoteStep
            value={freeNote}
            onChange={setFreeNote}
            headingId={stepHeadingIds[3]}
            headingRef={headingRefs.current[3]}
            textareaId={textareaId}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Footer: botões de navegação                                         */}
      {/* ------------------------------------------------------------------ */}
      <footer className={styles.stepper__footer}>
        {/*
         * Botão Anterior — ghost. Presente sempre mas desabilitado no step 0
         * para manter o layout estável (evita shift ao mudar de step).
         */}
        <button
          type="button"
          className={`${styles.btn} ${styles['btn--ghost']}`}
          onClick={handlePrev}
          disabled={!canGoBack}
          aria-label="Voltar para o passo anterior"
          /*
           * aria-hidden quando desabilitado no primeiro step — evita que
           * leitores de tela anunciem um controle que não pode ser usado.
           */
          aria-hidden={!canGoBack || undefined}
        >
          Anterior
        </button>

        <button
          type="button"
          className={nextButtonClass}
          onClick={handleNext}
          aria-label={
            isLastStep
              ? 'Concluir check-in diário'
              : `Avançar para o passo ${currentStep + 2}: ${STEP_LABELS[currentStep + 1] ?? ''}`
          }
        >
          {nextButtonLabel}
        </button>
      </footer>
    </div>
  );
}

export default DailyCheckInStepper;
