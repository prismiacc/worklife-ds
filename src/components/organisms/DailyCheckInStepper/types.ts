/**
 * types.ts — WorkLife Hub · DailyCheckInStepper
 *
 * Tipos centrais compartilhados entre o stepper, o hook de estado
 * e os componentes de step individuais.
 */

import { type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Mood
// ---------------------------------------------------------------------------

/** Cinco níveis de humor suportados pelo MoodSelector */
export type MoodValue = 'great' | 'good' | 'okay' | 'low' | 'struggling';

/** Metadados estáticos de cada opção de humor */
export interface MoodOption {
  value: MoodValue;
  icon: ReactNode;
  label: string;
  /** Cor de destaque em hex — usada para ring e feedback visual */
  color: string;
  /** Descrição longa para aria-label — deve ser autoexplicativa sem contexto extra */
  ariaDescription: string;
}

// ---------------------------------------------------------------------------
// Work-Life Balance
// ---------------------------------------------------------------------------

/** Escala de 1-10 para equilíbrio trabalho-vida */
export type BalanceScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// ---------------------------------------------------------------------------
// Domínios de bem-estar
// ---------------------------------------------------------------------------

export type DomainKey =
  | 'work'
  | 'health'
  | 'relationships'
  | 'learning'
  | 'leisure'
  | 'finances';

export interface DomainOption {
  key: DomainKey;
  label: string;
  icon: ReactNode;
}

// ---------------------------------------------------------------------------
// Payload final do check-in
// ---------------------------------------------------------------------------

/**
 * Estrutura completa enviada ao callback onComplete quando o
 * usuário conclui todos os 4 steps do DailyCheckInStepper.
 */
export interface CheckInPayload {
  /** ISO 8601 — dia do check-in (YYYY-MM-DD) */
  date: string;
  /** Humor registrado no step 1 */
  mood: MoodValue | null;
  /** Score de equilíbrio (1-10) registrado no step 2 */
  balance: BalanceScore | null;
  /** Domínios marcados como foco no step 3 */
  domains: DomainKey[];
  /** Nota livre digitada no step 4 */
  freeNote: string;
  /** Timestamp ISO 8601 da conclusão */
  completedAt: string;
}

// ---------------------------------------------------------------------------
// Estado interno do stepper
// ---------------------------------------------------------------------------

/** Índice de cada step (0-based) */
export type StepIndex = 0 | 1 | 2 | 3;

/** Snapshot do estado persistido em localStorage */
export interface DraftState {
  /** Versão do schema — permite migração futura */
  schemaVersion: 1;
  /** Data do rascunho (YYYY-MM-DD) */
  date: string;
  /** Step em que o usuário estava ao fechar */
  currentStep: StepIndex;
  mood: MoodValue | null;
  balance: BalanceScore | null;
  domains: DomainKey[];
  freeNote: string;
}

// ---------------------------------------------------------------------------
// Props dos componentes
// ---------------------------------------------------------------------------

export interface MoodSelectorProps {
  /** Valor atualmente selecionado */
  value: MoodValue | null;
  /** Chamado quando o usuário seleciona um humor */
  onChange: (mood: MoodValue) => void;
  /** Desabilita toda interação (ex.: enquanto salva) */
  disabled?: boolean;
}

export interface DailyCheckInStepperProps {
  /**
   * ID único do usuário — usado como chave de namespace
   * no localStorage para isolamento entre contas.
   */
  userId: string;
  /**
   * Chamado com o payload completo quando o usuário
   * clica em "Concluir" no último step.
   */
  onComplete: (payload: CheckInPayload) => void;
  /**
   * Data do check-in. Padrão: data local do sistema.
   * Formato esperado: YYYY-MM-DD
   */
  date?: string;
  /** Classe CSS opcional para personalização do container raiz */
  className?: string;
}

// ---------------------------------------------------------------------------
// Retorno do hook useDailyCheckIn
// ---------------------------------------------------------------------------

export interface UseDailyCheckInReturn {
  currentStep: StepIndex;
  mood: MoodValue | null;
  balance: BalanceScore | null;
  domains: DomainKey[];
  freeNote: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isLastStep: boolean;
  progressPercent: number;
  setMood: (v: MoodValue) => void;
  setBalance: (v: BalanceScore) => void;
  toggleDomain: (key: DomainKey) => void;
  setFreeNote: (v: string) => void;
  goNext: () => void;
  goPrev: () => void;
  complete: () => CheckInPayload;
}
