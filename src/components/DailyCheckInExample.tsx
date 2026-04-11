/**
 * DailyCheckInExample.tsx — WorkLife Hub
 *
 * Demonstração de uso integrado dos dois componentes:
 *   - MoodSelector (uso autônomo)
 *   - DailyCheckInStepper (fluxo completo de 4 steps)
 *
 * Este arquivo NÃO é para produção — serve como referência de integração
 * e pode ser deletado ou movido para uma pasta /examples.
 */

import React, { useState } from 'react';
import { MoodSelector } from './MoodSelector';
import { DailyCheckInStepper } from './DailyCheckInStepper';
import type { CheckInPayload, MoodValue } from './DailyCheckInStepper';

// ---------------------------------------------------------------------------
// Exemplo 1: MoodSelector autônomo
// ---------------------------------------------------------------------------

/**
 * Uso do MoodSelector de forma independente, fora do stepper.
 * Útil em widgets de humor rápido no dashboard.
 */
function StandaloneMoodExample() {
  const [mood, setMood] = useState<MoodValue | null>(null);

  return (
    <section
      style={{
        padding: '1.5rem',
        maxWidth: '400px',
        margin: '0 auto 2rem',
        background: '#fff',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(15,27,53,0.08)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-heading, Plus Jakarta Sans, system-ui)',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--color-navy-900, #0F1B35)',
          marginBottom: '1rem',
        }}
      >
        Widget de humor rápido
      </h2>

      {/* MoodSelector autônomo — sem stepper */}
      <MoodSelector value={mood} onChange={setMood} />

      {/* Exibe o valor selecionado para debug/demonstração */}
      {mood && (
        <p
          style={{
            marginTop: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--color-slate-500, #64748B)',
            fontFamily: 'var(--font-body, Inter, system-ui)',
          }}
        >
          Humor selecionado: <strong>{mood}</strong>
        </p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Exemplo 2: DailyCheckInStepper completo
// ---------------------------------------------------------------------------

/**
 * Fluxo completo de check-in.
 * Em produção, userId viria do contexto de autenticação.
 */
function FullCheckInExample() {
  const [completedPayload, setCompletedPayload] =
    useState<CheckInPayload | null>(null);

  const handleComplete = (payload: CheckInPayload) => {
    // Em produção: enviar ao backend, atualizar estado global, etc.
    console.log('[WorkLife Hub] Check-in concluído:', payload);
    setCompletedPayload(payload);
  };

  // Exibe resultado após conclusão
  if (completedPayload) {
    return (
      <section
        style={{
          padding: '1.5rem',
          maxWidth: '480px',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(15,27,53,0.08)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-heading, Plus Jakarta Sans, system-ui)',
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--color-navy-900, #0F1B35)',
            marginBottom: '1rem',
          }}
        >
          Check-in concluído
        </h2>

        {/* Resumo do payload para demonstração */}
        <dl
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontFamily: 'var(--font-body, Inter, system-ui)',
            fontSize: '0.875rem',
          }}
        >
          <div>
            <dt style={{ color: 'var(--color-slate-500)', fontWeight: 500 }}>
              Data
            </dt>
            <dd style={{ color: 'var(--color-navy-900)', margin: 0 }}>
              {completedPayload.date}
            </dd>
          </div>
          <div>
            <dt style={{ color: 'var(--color-slate-500)', fontWeight: 500 }}>
              Humor
            </dt>
            <dd style={{ color: 'var(--color-navy-900)', margin: 0 }}>
              {completedPayload.mood ?? '—'}
            </dd>
          </div>
          <div>
            <dt style={{ color: 'var(--color-slate-500)', fontWeight: 500 }}>
              Equilíbrio
            </dt>
            <dd style={{ color: 'var(--color-navy-900)', margin: 0 }}>
              {completedPayload.balance ?? '—'}/10
            </dd>
          </div>
          <div>
            <dt style={{ color: 'var(--color-slate-500)', fontWeight: 500 }}>
              Domínios
            </dt>
            <dd style={{ color: 'var(--color-navy-900)', margin: 0 }}>
              {completedPayload.domains.length > 0
                ? completedPayload.domains.join(', ')
                : '—'}
            </dd>
          </div>
          <div>
            <dt style={{ color: 'var(--color-slate-500)', fontWeight: 500 }}>
              Nota
            </dt>
            <dd style={{ color: 'var(--color-navy-900)', margin: 0 }}>
              {completedPayload.freeNote || '—'}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => setCompletedPayload(null)}
          style={{
            marginTop: '1.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '9999px',
            border: '2px solid var(--color-slate-300, #CBD5E1)',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'var(--font-body, Inter, system-ui)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-slate-500, #64748B)',
          }}
        >
          Novo check-in
        </button>
      </section>
    );
  }

  return (
    <DailyCheckInStepper
      userId="demo-user-001"
      onComplete={handleComplete}
      // date prop omitida: usa a data local do sistema
    />
  );
}

// ---------------------------------------------------------------------------
// Página de demonstração completa
// ---------------------------------------------------------------------------

/**
 * WorkLifeDemoPage
 *
 * Coloca os dois componentes em um layout de demonstração com os
 * design tokens do WorkLife Hub aplicados ao :root.
 *
 * Em produção, os design tokens seriam importados do arquivo global
 * de CSS (ex.: globals.css ou design-tokens.css).
 */
export function WorkLifeDemoPage() {
  return (
    <>
      {/*
       * Design tokens injetados via style tag para demonstração isolada.
       * Em produção: importe no CSS global do projeto.
       */}
      <style>{`
        :root {
          --color-navy-900: #0F1B35;
          --color-navy-800: #1A2B4A;
          --color-amber-500: #F59E0B;
          --color-amber-400: #FBB83F;
          --color-amber-300: #FDD07A;
          --color-slate-500: #64748B;
          --color-slate-300: #CBD5E1;
          --color-slate-100: #F1F5F9;
          --color-green-500: #10B981;
          --color-green-300: #6EE7B7;
          --color-white: #FFFFFF;
          --font-heading: 'Plus Jakarta Sans', system-ui, sans-serif;
          --font-body: 'Inter', system-ui, sans-serif;
          --radius-full: 9999px;
          --radius-xl: 1rem;
          --radius-lg: 0.75rem;
          --duration-normal: 250ms;
          --duration-gentle: 600ms;
          --easing-gentle: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          --easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background-color: var(--color-slate-100);
          font-family: var(--font-body);
        }
      `}</style>

      <main
        style={{
          minHeight: '100vh',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
        }}
      >
        {/* Seção 1: MoodSelector autônomo */}
        <section aria-labelledby="standalone-heading">
          <h1
            id="standalone-heading"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-navy-900)',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            MoodSelector — uso autônomo
          </h1>
          <StandaloneMoodExample />
        </section>

        {/* Seção 2: DailyCheckInStepper completo */}
        <section aria-labelledby="stepper-heading">
          <h1
            id="stepper-heading"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-navy-900)',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            DailyCheckInStepper — fluxo completo
          </h1>
          <FullCheckInExample />
        </section>
      </main>
    </>
  );
}

export default WorkLifeDemoPage;
