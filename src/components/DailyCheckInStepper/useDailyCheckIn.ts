/**
 * useDailyCheckIn.ts — WorkLife Hub
 *
 * Hook centraliza toda a lógica de estado do DailyCheckInStepper:
 *   - Progresso entre os 4 steps
 *   - Valores de cada step (mood, balance, domains, freeNote)
 *   - Persistência em localStorage com namespace por userId + data
 *   - Geração do CheckInPayload final
 *
 * Sem dependências externas — apenas React 18+.
 */

import { useCallback, useEffect, useReducer } from 'react';
import type {
  BalanceScore,
  CheckInPayload,
  DomainKey,
  DraftState,
  MoodValue,
  StepIndex,
  UseDailyCheckInReturn,
} from './types';

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 4;
const SCHEMA_VERSION = 1 as const;

// ---------------------------------------------------------------------------
// Chave de localStorage
// ---------------------------------------------------------------------------

function buildStorageKey(userId: string, date: string): string {
  // Namespace seguro — evita colisão entre usuários e datas
  return `worklife-checkin-draft__${userId}__${date}`;
}

// ---------------------------------------------------------------------------
// Estado interno do reducer
// ---------------------------------------------------------------------------

interface State {
  currentStep: StepIndex;
  mood: MoodValue | null;
  balance: BalanceScore | null;
  domains: DomainKey[];
  freeNote: string;
}

type Action =
  | { type: 'SET_MOOD'; payload: MoodValue }
  | { type: 'SET_BALANCE'; payload: BalanceScore }
  | { type: 'TOGGLE_DOMAIN'; payload: DomainKey }
  | { type: 'SET_FREE_NOTE'; payload: string }
  | { type: 'GO_NEXT' }
  | { type: 'GO_PREV' }
  | { type: 'RESTORE_DRAFT'; payload: State };

function buildInitialState(): State {
  return {
    currentStep: 0,
    mood: null,
    balance: null,
    domains: [],
    freeNote: '',
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MOOD':
      return { ...state, mood: action.payload };

    case 'SET_BALANCE':
      return { ...state, balance: action.payload };

    case 'TOGGLE_DOMAIN': {
      const key = action.payload;
      const exists = state.domains.includes(key);
      return {
        ...state,
        domains: exists
          ? state.domains.filter((d) => d !== key)
          : [...state.domains, key],
      };
    }

    case 'SET_FREE_NOTE':
      return { ...state, freeNote: action.payload };

    case 'GO_NEXT': {
      const next = Math.min(state.currentStep + 1, TOTAL_STEPS - 1) as StepIndex;
      return { ...state, currentStep: next };
    }

    case 'GO_PREV': {
      const prev = Math.max(state.currentStep - 1, 0) as StepIndex;
      return { ...state, currentStep: prev };
    }

    case 'RESTORE_DRAFT':
      return action.payload;

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Persistência
// ---------------------------------------------------------------------------

/**
 * Serializa o estado atual e salva no localStorage.
 * Opera em try/catch para lidar com:
 *   - localStorage desabilitado (modo anônimo em alguns browsers)
 *   - Cota de armazenamento excedida
 *   - Ambientes SSR (typeof localStorage === 'undefined')
 */
function saveDraft(state: State, userId: string, date: string): void {
  if (typeof localStorage === 'undefined') return;

  const draft: DraftState = {
    schemaVersion: SCHEMA_VERSION,
    date,
    currentStep: state.currentStep,
    mood: state.mood,
    balance: state.balance,
    domains: state.domains,
    freeNote: state.freeNote,
  };

  try {
    localStorage.setItem(buildStorageKey(userId, date), JSON.stringify(draft));
  } catch {
    // Falha silenciosa — o usuário não perde a sessão, só o rascunho
  }
}

/**
 * Lê e valida o rascunho do localStorage.
 * Retorna null em qualquer falha de leitura ou inconsistência de schema.
 */
function loadDraft(userId: string, date: string): State | null {
  if (typeof localStorage === 'undefined') return null;

  try {
    const raw = localStorage.getItem(buildStorageKey(userId, date));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<DraftState>;

    // Validação mínima de schema
    if (parsed.schemaVersion !== SCHEMA_VERSION) return null;
    if (parsed.date !== date) return null;

    return {
      currentStep: (parsed.currentStep ?? 0) as StepIndex,
      mood: parsed.mood ?? null,
      balance: parsed.balance ?? null,
      domains: Array.isArray(parsed.domains) ? parsed.domains : [],
      freeNote: typeof parsed.freeNote === 'string' ? parsed.freeNote : '',
    };
  } catch {
    return null;
  }
}

/**
 * Remove o rascunho após conclusão bem-sucedida.
 * Evita que um check-in antigo reaparece no dia seguinte (edge case:
 * mesma chave, mas data diferente — tratado na validação do loadDraft).
 */
function clearDraft(userId: string, date: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(buildStorageKey(userId, date));
  } catch {
    // Ignora
  }
}

// ---------------------------------------------------------------------------
// Hook público
// ---------------------------------------------------------------------------

/**
 * useDailyCheckIn
 *
 * Gerencia todo o estado do processo de check-in diário.
 *
 * @param userId - Identificador do usuário (namespace do rascunho)
 * @param date   - Data do check-in no formato YYYY-MM-DD
 *
 * @example
 * ```ts
 * const {
 *   currentStep, mood, setMood,
 *   goNext, goPrev, isLastStep, complete,
 * } = useDailyCheckIn('user-123', '2026-04-10');
 * ```
 */
export function useDailyCheckIn(
  userId: string,
  date: string,
): UseDailyCheckInReturn {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  // -------------------------------------------------------------------------
  // Restaurar rascunho salvo ao montar (ou quando userId/date mudam)
  // -------------------------------------------------------------------------

  useEffect(() => {
    const draft = loadDraft(userId, date);
    if (draft) {
      dispatch({ type: 'RESTORE_DRAFT', payload: draft });
    }
  }, [userId, date]);

  // -------------------------------------------------------------------------
  // Persistir rascunho em cada mudança de estado
  // -------------------------------------------------------------------------

  useEffect(() => {
    saveDraft(state, userId, date);
  }, [state, userId, date]);

  // -------------------------------------------------------------------------
  // Setters públicos
  // -------------------------------------------------------------------------

  const setMood = useCallback((v: MoodValue) => {
    dispatch({ type: 'SET_MOOD', payload: v });
  }, []);

  const setBalance = useCallback((v: BalanceScore) => {
    dispatch({ type: 'SET_BALANCE', payload: v });
  }, []);

  const toggleDomain = useCallback((key: DomainKey) => {
    dispatch({ type: 'TOGGLE_DOMAIN', payload: key });
  }, []);

  const setFreeNote = useCallback((v: string) => {
    dispatch({ type: 'SET_FREE_NOTE', payload: v });
  }, []);

  // -------------------------------------------------------------------------
  // Navegação entre steps
  // -------------------------------------------------------------------------

  const goNext = useCallback(() => {
    dispatch({ type: 'GO_NEXT' });
  }, []);

  const goPrev = useCallback(() => {
    dispatch({ type: 'GO_PREV' });
  }, []);

  // -------------------------------------------------------------------------
  // Conclusão — gera payload e limpa rascunho
  // -------------------------------------------------------------------------

  const complete = useCallback((): CheckInPayload => {
    const payload: CheckInPayload = {
      date,
      mood: state.mood,
      balance: state.balance,
      domains: state.domains,
      freeNote: state.freeNote,
      completedAt: new Date().toISOString(),
    };

    // Limpa rascunho apenas após construir o payload
    clearDraft(userId, date);

    return payload;
  }, [state, userId, date]);

  // -------------------------------------------------------------------------
  // Valores derivados
  // -------------------------------------------------------------------------

  const isLastStep = state.currentStep === TOTAL_STEPS - 1;

  const progressPercent = Math.round(
    ((state.currentStep + 1) / TOTAL_STEPS) * 100,
  );

  return {
    currentStep: state.currentStep,
    mood: state.mood,
    balance: state.balance,
    domains: state.domains,
    freeNote: state.freeNote,
    canGoBack: state.currentStep > 0,
    canGoForward: state.currentStep < TOTAL_STEPS - 1,
    isLastStep,
    progressPercent,
    setMood,
    setBalance,
    toggleDomain,
    setFreeNote,
    goNext,
    goPrev,
    complete,
  };
}
