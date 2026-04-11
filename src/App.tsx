import { useState, useMemo, type ReactNode } from 'react'
import { Brain, Dumbbell, BookOpen, Leaf } from 'lucide-react'
import { Sidebar }       from './components/organisms/Sidebar'
import { Navbar, NavbarIconButton, NavbarDivider } from './components/organisms/Navbar'
import { DataTable }     from './components/organisms/DataTable'
import { CommandMenu, CommandProvider, useCommand } from './components/organisms/CommandMenu'
import { NotificationCenter } from './components/organisms/NotificationCenter'
import type { Notification } from './components/organisms/NotificationCenter'
import { Button }        from './components/atoms/Button/Button'
import { Badge }         from './components/atoms/Badge/Badge'
import { Avatar }        from './components/atoms/Avatar/Avatar'
import { Spinner }       from './components/atoms/Spinner/Spinner'
import { Skeleton }      from './components/atoms/Skeleton/Skeleton'
import { Checkbox }      from './components/atoms/Checkbox/Checkbox'
import { Toggle }        from './components/atoms/Toggle/Toggle'
import { ProgressBar }   from './components/atoms/ProgressBar/ProgressBar'
import { Radio, RadioGroup } from './components/atoms/Radio'
import { Select }        from './components/atoms/Select'
import { FormField }     from './components/molecules/FormField/FormField'
import { Callout }       from './components/molecules/Callout'
import { Tabs }          from './components/molecules/Tabs'
import { Pagination }    from './components/molecules/Pagination'
import { SearchField }   from './components/molecules/SearchField'
import { PasswordField } from './components/molecules/PasswordField'
import { DatePicker }    from './components/molecules/DatePicker'
import type { DateRange } from './components/molecules/DatePicker'
import { StatCard }      from './components/molecules/StatCard'
import { EmptyState }    from './components/molecules/EmptyState'
import { ToastProvider, useToast } from './components/organisms/Toast'
import { Modal, ModalController }  from './components/organisms/Modal'
import { Tooltip }     from './components/atoms/Tooltip'
import { Tag }         from './components/atoms/Tag'
import { ThemeToggle } from './components/atoms/ThemeToggle'
import { Card, CardHeader, CardBody, CardFooter } from './components/atoms/Card'
import { Breadcrumb }  from './components/molecules/Breadcrumb'
import { Dropdown }    from './components/molecules/Dropdown'
import { Accordion }   from './components/molecules/Accordion'
import { Stepper }     from './components/molecules/Stepper'
import { Drawer }      from './components/organisms/Drawer'
import { PageHeader }  from './components/organisms/PageHeader'
import { FilterBar }   from './components/organisms/FilterBar'
import type { ActiveFilter } from './components/organisms/FilterBar'
import { InsightCard }    from './components/product/InsightCard'
import { TeamDashboard }  from './components/product/TeamDashboard'
import type { TeamMember, TeamMetrics } from './components/product/TeamDashboard'
import { OnboardingFlow } from './components/product/OnboardingFlow'
import type { OnboardingData } from './components/product/OnboardingFlow'
import { WellbeingScore }  from './components/product/WellbeingScore'
import { GoalCard }        from './components/product/GoalCard'
import { HabitTracker }    from './components/product/HabitTracker'
import { ActivityFeed }    from './components/product/ActivityFeed'
import type { ActivityItem } from './components/product/ActivityFeed'
import { FocusTimer }      from './components/product/FocusTimer'
import { MoodHistory }     from './components/product/MoodHistory'
import type { MoodEntry, MoodLevel } from './components/product/MoodHistory'

/* ── Section header helper ──────────────────────────────────────── */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ color: 'var(--text-tertiary)', fontSize: 'var(--wlh-text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

/* ── Inner sandbox ──────────────────────────────────────────────── */
function Sandbox() {
  const { toast } = useToast()
  const [email, setEmail]       = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio]           = useState('')
  const [checked, setChecked]   = useState(false)
  const [toggle, setToggle]     = useState(false)
  const [radio, setRadio]       = useState('daily')
  const [selectVal, setSelectVal] = useState('')
  const [page, setPage]         = useState(1)
  const [searchQ, setSearchQ]   = useState('')
  const [tabVariant, setTabVariant] = useState<'line'|'pill'|'card'>('line')
  const [modalOpen, setModalOpen] = useState(false)
  const [pickerDate, setPickerDate] = useState<Date | null>(null)
  const [pickerRange, setPickerRange] = useState<DateRange>({ start: null, end: null })

  function handleEmailBlur() {
    setEmailError(email && !email.includes('@') ? 'Digite um e-mail válido' : '')
  }

  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--wlh-text-2xl)', color: 'var(--text-primary)', margin: 0 }}>
        WorkLife Hub — Design System Sandbox
      </h1>

      {/* ── Sprint 1 ─────────────────────────────────────────── */}
      <Section title="Buttons">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
          <Button variant="primary" isLoading>Carregando</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Badges">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success" dot>Ativo</Badge>
          <Badge variant="warning">Pendente</Badge>
          <Badge variant="error">Erro</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="amber">Amber</Badge>
          <Badge variant="primary" onDismiss={() => {}}>Removível</Badge>
        </div>
      </Section>

      <Section title="Avatars">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Avatar name="Ana Souza" size="xs" status="online" />
          <Avatar name="Bruno Lima" size="sm" status="away" />
          <Avatar name="Carla Mendes" size="md" status="busy" />
          <Avatar name="Diego Rocha" size="lg" status="offline" />
          <Avatar name="Equipe DS" size="xl" />
        </div>
      </Section>

      <Section title="Spinner & Skeleton">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Spinner size="xs" /><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
        </div>
        <div style={{ maxWidth: 320, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Skeleton variant="text" lines={3} />
          <Skeleton variant="rect" style={{ height: 60 }} />
        </div>
      </Section>

      <Section title="Checkbox & Toggle">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
          <Checkbox label="Lembrar de mim" checked={checked} onChange={e => setChecked(e.target.checked)} />
          <Checkbox label="Desabilitado" disabled />
          <Checkbox label="Indeterminado" indeterminate />
          <Toggle label="Notificações" checked={toggle} onChange={e => setToggle(e.target.checked)} />
        </div>
      </Section>

      {/* ── Sprint 2 ─────────────────────────────────────────── */}
      <Section title="Radio & RadioGroup">
        <RadioGroup
          name="frequency"
          label="Frequência de check-in"
          value={radio}
          onChange={setRadio}
          options={[
            { value: 'daily',   label: 'Diário',   description: 'Um check-in por dia' },
            { value: 'weekly',  label: 'Semanal',  description: 'Uma vez por semana' },
            { value: 'monthly', label: 'Mensal',   description: 'Uma vez por mês', disabled: true },
          ]}
        />
      </Section>

      <Section title="Select">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Select
            value={selectVal}
            onChange={e => setSelectVal(e.target.value)}
            placeholder="Selecione um departamento"
            options={[
              { value: 'eng',  label: 'Engenharia' },
              { value: 'des',  label: 'Design' },
              { value: 'mkt',  label: 'Marketing' },
              { value: 'rh',   label: 'RH', disabled: true },
            ]}
            style={{ minWidth: 220 }}
          />
          <Select size="sm" options={[{ value: 'a', label: 'Pequeno' }]} />
          <Select size="lg" options={[{ value: 'a', label: 'Grande' }]} status="error" />
        </div>
      </Section>

      <Section title="Progress Bar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 400 }}>
          <ProgressBar value={70}  max={100} label="Progresso geral" showLabel showValue />
          <ProgressBar value={45}  max={100} label="Amber" variant="amber" size="md" showLabel showValue />
          <ProgressBar value={90}  max={100} label="Sucesso" variant="success" size="lg" showLabel />
          <ProgressBar value={30}  max={100} label="Carregando" indeterminate size="sm" />
          <ProgressBar value={3}   type="segmented" segments={5} label="Passo 3 de 5" />
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <ProgressBar type="circular" value={72} label="Score" showValue circularSize={56} />
          <ProgressBar type="circular" value={45} label="Amber" variant="amber" showValue circularSize={48} />
          <ProgressBar type="circular" value={90} label="Sucesso" variant="success" showValue circularSize={64} strokeWidth={5} />
        </div>
      </Section>

      <Section title={`Tabs — variante: ${tabVariant}`}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {(['line','pill','card'] as const).map(v => (
            <Button key={v} size="sm" variant={tabVariant===v?'primary':'ghost'} onClick={()=>setTabVariant(v)}>{v}</Button>
          ))}
        </div>
        <Tabs
          variant={tabVariant}
          tabs={[
            { id: 'overview', label: 'Visão Geral', content: <p style={{color:'var(--text-secondary)'}}>Conteúdo da aba Visão Geral.</p> },
            { id: 'analytics', label: 'Analytics', badge: 3, content: <p style={{color:'var(--text-secondary)'}}>Conteúdo de Analytics.</p> },
            { id: 'settings', label: 'Configurações', content: <p style={{color:'var(--text-secondary)'}}>Configurações do sistema.</p> },
            { id: 'disabled', label: 'Desabilitado', disabled: true, content: null },
          ]}
        />
      </Section>

      <Section title="Pagination">
        <Pagination page={page} totalPages={12} onPageChange={setPage} showInfo />
        <Pagination page={page} totalPages={12} onPageChange={setPage} size="sm" siblings={2} />
      </Section>

      <Section title="SearchField">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
          <SearchField value={searchQ} onSearch={setSearchQ} fullWidth />
          <SearchField size="sm" placeholder="Busca pequena..." fullWidth />
          <SearchField size="lg" isLoading placeholder="Buscando..." fullWidth />
        </div>
        {searchQ && <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--wlh-text-sm)' }}>Query: "{searchQ}"</p>}
      </Section>

      <Section title="PasswordField">
        <div style={{ maxWidth: 400 }}>
          <PasswordField
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            showStrength
            hint="Mínimo 8 caracteres"
          />
        </div>
      </Section>

      <Section title="Stat Cards">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          <StatCard label="Check-ins este mês" value={24} trend={12.5} trendLabel="vs mês anterior" />
          <StatCard label="Score de bem-estar" value="8.4" unit="/10" trend={-3.2} trendInverse variant="brand" />
          <StatCard label="Hábitos completos" value="87" unit="%" trend={5} variant="amber" />
          <StatCard label="Sequência atual" value={14} unit="dias" trend={0} variant="success" isLoading={false} />
          <StatCard label="Metas alcançadas" value={3} trend={-1} trendLabel="esta semana" variant="error" />
        </div>
      </Section>

      <Section title="Empty State">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--wlh-radius-xl)' }}>
            <EmptyState
              size="sm"
              title="Nenhum check-in ainda"
              description="Comece seu primeiro check-in diário."
              primaryAction={{ label: 'Fazer check-in', onClick: () => toast({ message: 'Iniciando check-in!', variant: 'success' }) }}
            />
          </div>
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--wlh-radius-xl)' }}>
            <EmptyState
              size="md"
              title="Sem resultados"
              description={`Nenhum item encontrado para "${searchQ || 'busca'}".`}
              secondaryAction={{ label: 'Limpar filtros', onClick: () => setSearchQ('') }}
            />
          </div>
        </div>
      </Section>

      <Section title="Form Fields">
        <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="E-mail" type="email" placeholder="seu@email.com" required
            value={email} onChange={e => setEmail(e.target.value)} onBlur={handleEmailBlur} error={emailError} />
          <FormField as="textarea" label="Bio" placeholder="Conte sobre você..." value={bio}
            onChange={e => setBio(e.target.value)} maxLength={200} charCount={bio.length} rows={3} />
        </div>
      </Section>

      <Section title="Callout">
        <Callout variant="info" title="Informação">Seu plano renova em 7 dias.</Callout>
        <Callout variant="success" title="Salvo">Alterações salvas com sucesso.</Callout>
        <Callout variant="warning" title="Atenção">Ação irreversível após confirmação.</Callout>
      </Section>

      <Section title="Toast">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {(['default','success','warning','error','info'] as const).map(v => (
            <Button key={v} variant="secondary" size="sm"
              onClick={() => toast({ message: `Toast ${v}!`, variant: v })}>
              {v}
            </Button>
          ))}
          <Button variant="secondary" size="sm"
            onClick={() => toast({ message: 'Arquivo excluído.', action: { label: 'Desfazer', onClick: () => {} } })}>
            Com ação
          </Button>
        </div>
      </Section>

      <Section title="DatePicker">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: 'var(--wlh-text-xs)', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Single</span>
            <DatePicker
              label="Data de nascimento"
              value={pickerDate}
              onChange={setPickerDate}
              placeholder="Selecionar data"
              maxDate={new Date()}
            />
            {pickerDate && (
              <span style={{ fontSize: 'var(--wlh-text-xs)', color: 'var(--text-secondary)' }}>
                {pickerDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: 'var(--wlh-text-xs)', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Range + Presets</span>
            <DatePicker
              mode="range"
              label="Período de análise"
              rangeValue={pickerRange}
              onRangeChange={setPickerRange}
              showPresets
              placeholder="Selecionar período"
            />
            {(pickerRange.start || pickerRange.end) && (
              <span style={{ fontSize: 'var(--wlh-text-xs)', color: 'var(--text-secondary)' }}>
                {pickerRange.start?.toLocaleDateString('pt-BR')} → {pickerRange.end?.toLocaleDateString('pt-BR') ?? '...'}
              </span>
            )}
          </div>
        </div>
      </Section>

      <Section title="Modal">
        <Button variant="primary" onClick={() => setModalOpen(true)}>Abrir Modal</Button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Confirmar exclusão" size="sm"
          footer={<>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={() => { setModalOpen(false); toast({ message: 'Item excluído.', variant: 'success' }) }}>Excluir</Button>
          </>}>
          Tem certeza? Esta ação não pode ser desfeita.
        </Modal>
      </Section>

      {/* ── Tooltip ──────────────────────────────────────────── */}
      <Section title="Tooltip">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', paddingTop: '1rem' }}>
          <Tooltip content="Tooltip em cima (padrão)" placement="top">
            <Button variant="secondary" size="sm">Top</Button>
          </Tooltip>
          <Tooltip content="Aparece abaixo do elemento" placement="bottom">
            <Button variant="secondary" size="sm">Bottom</Button>
          </Tooltip>
          <Tooltip content="Tooltip à esquerda" placement="left">
            <Button variant="secondary" size="sm">Left</Button>
          </Tooltip>
          <Tooltip content="Tooltip à direita" placement="right">
            <Button variant="secondary" size="sm">Right</Button>
          </Tooltip>
          <Tooltip content="Sem delay" delay={0}>
            <Badge variant="info">Sem delay</Badge>
          </Tooltip>
          <Tooltip content="Disabled tooltip" disabled>
            <Button variant="ghost" size="sm">Disabled</Button>
          </Tooltip>
        </div>
      </Section>

      {/* ── Card ─────────────────────────────────────────────── */}
      <Section title="Card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          <Card variant="default">
            <CardHeader>Default</CardHeader>
            <CardBody>Conteúdo do card padrão com borda e sombra leve.</CardBody>
          </Card>
          <Card variant="outlined">
            <CardHeader>Outlined</CardHeader>
            <CardBody>Sem sombra, apenas borda levemente mais espessa.</CardBody>
          </Card>
          <Card variant="elevated">
            <CardHeader>Elevated</CardHeader>
            <CardBody>Sem borda, sombra mais pronunciada.</CardBody>
          </Card>
          <Card variant="brand">
            <CardHeader>Brand</CardHeader>
            <CardBody>Fundo navy com texto branco para destaque.</CardBody>
          </Card>
          <Card variant="default" hoverable clickable onClick={() => {}}>
            <CardBody>Clicável com efeito hover ↑</CardBody>
            <CardFooter>Rodapé do card</CardFooter>
          </Card>
          <Card variant="outlined" selected>
            <CardBody>Estado selecionado com borda accent.</CardBody>
          </Card>
        </div>
      </Section>

      {/* ── Dropdown ─────────────────────────────────────────── */}
      <Section title="Dropdown / Menu Contextual">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start', paddingBottom: '8rem' }}>
          <Dropdown
            trigger={<Button variant="secondary">Ações ▾</Button>}
            items={[
              { id: 'edit',   label: 'Editar',   icon: <span>✎</span> },
              { id: 'dup',    label: 'Duplicar',  icon: <span>⎘</span> },
              { separator: true, id: 's1' },
              { id: 'archive', label: 'Arquivar', icon: <span>⊡</span>, description: 'Move para o arquivo' },
              { separator: true, id: 's2' },
              { id: 'delete', label: 'Excluir',  icon: <span>✕</span>, danger: true },
            ]}
            onSelect={id => {}}
          />
          <Dropdown
            trigger={<Button variant="ghost" size="sm">Exportar ▾</Button>}
            placement="bottom-end"
            items={[
              { id: 'csv',  label: 'CSV'  },
              { id: 'xlsx', label: 'Excel (.xlsx)' },
              { id: 'pdf',  label: 'PDF', disabled: true },
            ]}
            onSelect={id => {}}
          />
        </div>
      </Section>

      {/* ── Accordion ────────────────────────────────────────── */}
      <Section title="Accordion">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 520 }}>
          <Accordion
            variant="default"
            items={[
              { id: 'q1', title: 'O que é o WorkLife Hub?', content: <p style={{margin:0, color:'var(--text-secondary)'}}>Plataforma de gestão de bem-estar corporativo que integra check-ins diários, metas e análises.</p> },
              { id: 'q2', title: 'Como funciona o score de bem-estar?', content: <p style={{margin:0, color:'var(--text-secondary)'}}>O score é calculado a partir de dimensões como humor, energia, relacionamentos e produtividade.</p> },
              { id: 'q3', title: 'Posso usar no celular?', content: <p style={{margin:0, color:'var(--text-secondary)'}}>Sim, o WorkLife Hub é responsivo e funciona em qualquer dispositivo.</p> },
            ]}
          />
          <Accordion
            variant="card"
            multiple
            defaultOpen={['c1']}
            items={[
              { id: 'c1', title: 'Configurações de notificação', badge: 'Novo', content: <p style={{margin:0, color:'var(--text-secondary)'}}>Gerencie como e quando receber alertas do sistema.</p> },
              { id: 'c2', title: 'Privacidade e dados', content: <p style={{margin:0, color:'var(--text-secondary)'}}>Controle quais dados são compartilhados com sua equipe.</p> },
              { id: 'c3', title: 'Integrações', content: <p style={{margin:0, color:'var(--text-secondary)'}}>Conecte com Slack, Google Calendar e outras ferramentas.</p> },
            ]}
          />
        </div>
      </Section>

      <NewComponentSections />
      <OnboardingShowcase />
      <SprintThreeSections />
      <SprintFourSections />
    </main>
  )
}

/* ── Sprint 3 sections (separado para clareza) ──────────────────── */
function SprintThreeSections() {
  const { open: openCmd, isOpen: cmdOpen, close: closeCmd } = useCommand()
  const [sidebarActive, setSidebarActive] = useState('dashboard')
  const [tableSelected, setTableSelected] = useState<string[]>([])
  const [notifs, setNotifs] = useState<Notification[]>([
    { id: '1', title: 'Check-in concluído', body: 'Seu check-in diário foi registrado com sucesso.', variant: 'success', read: false, timestamp: new Date(Date.now() - 5 * 60_000) },
    { id: '2', title: 'Meta atingida!', body: '7 dias consecutivos de bem-estar acima de 8.', variant: 'info', read: false, timestamp: new Date(Date.now() - 2 * 3_600_000), action: { label: 'Ver conquistas', onClick: () => {} } },
    { id: '3', title: 'Lembrete semanal', body: 'Você ainda não fez seu check-in desta semana.', variant: 'warning', read: true, timestamp: new Date(Date.now() - 24 * 3_600_000) },
    { id: '4', title: 'Erro de sincronização', body: 'Não foi possível sincronizar seus dados.', variant: 'error', read: true, timestamp: new Date(Date.now() - 3 * 86_400_000) },
  ])

  const tableData = [
    { id: '1', name: 'Ana Souza',    dept: 'Design',      score: 9.2, status: 'ativo',     checkins: 22 },
    { id: '2', name: 'Bruno Lima',   dept: 'Engenharia',  score: 7.8, status: 'ativo',     checkins: 18 },
    { id: '3', name: 'Carla Mendes', dept: 'Marketing',   score: 8.5, status: 'férias',    checkins: 10 },
    { id: '4', name: 'Diego Rocha',  dept: 'Produto',     score: 6.1, status: 'inativo',   checkins: 4  },
    { id: '5', name: 'Elena Castro', dept: 'Design',      score: 9.7, status: 'ativo',     checkins: 24 },
  ] as const

  return (
    <>
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <Section title="Sidebar">
        <div style={{ height: 400, display: 'flex', borderRadius: 'var(--wlh-radius-xl)', overflow: 'hidden', border: '1px solid var(--border-default)' }}>
          <Sidebar
            activeId={sidebarActive}
            onNavigate={setSidebarActive}
            logo={
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'white', fontSize: 'var(--wlh-text-md)', whiteSpace: 'nowrap' }}>
                WorkLife Hub
              </span>
            }
            groups={[
              {
                id: 'main',
                items: [
                  { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
                  { id: 'checkin',   label: 'Check-in',  icon: <CheckIcon />, badge: 1 },
                  { id: 'metas',     label: 'Metas',     icon: <TargetIcon /> },
                  { id: 'habitos',   label: 'Hábitos',   icon: <CalendarIcon /> },
                ],
              },
              {
                id: 'reports',
                label: 'Relatórios',
                items: [
                  { id: 'analytics', label: 'Analytics',  icon: <ChartIcon /> },
                  { id: 'equipe',    label: 'Equipe',     icon: <UsersIcon />, badge: 3 },
                ],
              },
              {
                id: 'config',
                label: 'Sistema',
                items: [
                  { id: 'settings',  label: 'Configurações', icon: <SettingsIcon /> },
                  { id: 'disabled',  label: 'Em breve',      icon: <LockIcon />, disabled: true },
                ],
              },
            ]}
          />
          <div style={{ flex: 1, padding: '2rem', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--wlh-text-sm)' }}>
            Ativo: <strong style={{ marginLeft: 6, color: 'var(--text-primary)' }}>{sidebarActive}</strong>
          </div>
        </div>
      </Section>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <Section title="Navbar">
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--wlh-radius-xl)', overflow: 'hidden' }}>
          <Navbar
            logo={
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--wlh-text-md)' }}>
                WorkLife Hub
              </span>
            }
            actions={
              <>
                <Button variant="ghost" size="sm" onClick={openCmd}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="6.5" cy="6.5" r="4"/><line x1="10" y1="10" x2="13.5" y2="13.5"/></svg>
                    Buscar
                    <kbd style={{ padding: '1px 5px', background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 4, fontSize: 10, color: 'var(--text-tertiary)' }}>⌘K</kbd>
                  </span>
                </Button>
                <NavbarDivider />
                <NotificationCenter
                  notifications={notifs}
                  onMarkRead={id => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))}
                  onMarkAllRead={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
                  onDismiss={id => setNotifs(n => n.filter(x => x.id !== id))}
                  trigger={
                    <NavbarIconButton
                      label="Notificações"
                      badge={notifs.filter(n => !n.read).length}
                      icon={<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="18" height="18"><path d="M8 2a5 5 0 0 0-5 5v2l-1.5 3h13L13 9V7a5 5 0 0 0-5-5Z"/><path d="M6.5 13a1.5 1.5 0 0 0 3 0"/></svg>}
                    />
                  }
                />
                <NavbarDivider />
                <Avatar name="Ana Souza" size="sm" status="online" />
              </>
            }
          />
          <div style={{ height: 80, background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--wlh-text-sm)' }}>
            Área de conteúdo da página
          </div>
        </div>
      </Section>

      {/* ── Command Menu ─────────────────────────────────────── */}
      <Section title="Command Menu (⌘K)">
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button variant="secondary" onClick={openCmd}>
            Abrir Command Menu
          </Button>
          <span style={{ fontSize: 'var(--wlh-text-xs)', color: 'var(--text-tertiary)' }}>ou pressione ⌘K / Ctrl+K</span>
        </div>
        <CommandMenu
          isOpen={cmdOpen}
          onClose={closeCmd}
          items={[
            { id: 'checkin',  label: 'Novo Check-in',        group: 'Ações', icon: <CheckIcon />, shortcut: ['⌘', 'N'], onSelect: () => {} },
            { id: 'meta',     label: 'Criar Meta',           group: 'Ações', icon: <TargetIcon />, onSelect: () => {} },
            { id: 'habito',   label: 'Registrar Hábito',     group: 'Ações', icon: <CalendarIcon />, onSelect: () => {} },
            { id: 'dash',     label: 'Ir para Dashboard',    group: 'Navegar', icon: <HomeIcon />, shortcut: ['G', 'D'], onSelect: () => setSidebarActive('dashboard') },
            { id: 'analytics',label: 'Ir para Analytics',   group: 'Navegar', icon: <ChartIcon />, onSelect: () => setSidebarActive('analytics') },
            { id: 'settings', label: 'Configurações',        group: 'Navegar', icon: <SettingsIcon />, shortcut: ['⌘', ','], onSelect: () => {} },
            { id: 'theme',    label: 'Alternar tema escuro', group: 'Preferências', icon: <SettingsIcon />, onSelect: () => {} },
          ]}
        />
      </Section>

      {/* ── DataTable ────────────────────────────────────────── */}
      <Section title="DataTable">
        <DataTable
          rowKey="id"
          selectable
          selectedIds={tableSelected}
          onSelectChange={setTableSelected}
          bulkActions={[
            { label: 'Exportar', onClick: ids => alert(`Export: ${ids.join(', ')}`) },
            { label: 'Desativar', danger: true, onClick: ids => alert(`Desativar: ${ids.join(', ')}`) },
          ]}
          columns={[
            { key: 'name',     header: 'Nome',       sortable: true },
            { key: 'dept',     header: 'Área',       sortable: true },
            { key: 'score',    header: 'Score',      sortable: true, align: 'center',
              render: v => (
                <span style={{ fontWeight: 600, color: (v as number) >= 8 ? 'var(--wlh-green-600)' : (v as number) >= 6 ? 'var(--wlh-amber-600)' : 'var(--wlh-red-500)' }}>
                  {v as number}
                </span>
              )
            },
            { key: 'status',   header: 'Status',     sortable: true, align: 'center',
              render: v => (
                <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                  background: v === 'ativo' ? 'var(--wlh-green-100)' : v === 'férias' ? 'var(--wlh-amber-100)' : 'var(--wlh-slate-100)',
                  color: v === 'ativo' ? 'var(--wlh-green-700)' : v === 'férias' ? 'var(--wlh-amber-700)' : 'var(--wlh-slate-600)',
                }}>
                  {v as string}
                </span>
              )
            },
            { key: 'checkins', header: 'Check-ins',  sortable: true, align: 'right' },
          ]}
          data={tableData as unknown as Record<string, unknown>[]}
        />
      </Section>
    </>
  )
}

/* ── OnboardingFlow showcase ────────────────────────────────────── */
function OnboardingShowcase() {
  const { toast } = useToast()
  const [showOnboarding, setShowOnboarding] = useState(false)

  if (showOnboarding) {
    return (
      <OnboardingFlow
        contained
        onComplete={(data: OnboardingData) => {
          setShowOnboarding(false)
          toast({ message: `Bem-vindo, ${data.displayName}! ${data.goals.length} objetivo(s) configurado(s).`, variant: 'success' })
        }}
        onSkip={() => {
          setShowOnboarding(false)
          toast({ message: 'Onboarding pulado', variant: 'default' })
        }}
      />
    )
  }

  return (
    <Section title="OnboardingFlow — Wizard de primeiro acesso">
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Button variant="primary" onClick={() => setShowOnboarding(true)}>
          Iniciar Onboarding
        </Button>
        <span style={{ fontSize: 'var(--wlh-text-xs)', color: 'var(--text-tertiary)' }}>
          6 etapas: Boas-vindas → Perfil → Objetivos → Hábitos → Notificações → Concluído
        </span>
      </div>
    </Section>
  )
}

/* ── New components showcase ───────────────────────────────────── */
function NewComponentSections() {
  const { toast } = useToast()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [stepperStep, setStepperStep] = useState(1)
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])

  return (
    <>
      {/* ── Breadcrumb ───────────────────────────────────────── */}
      <Section title="Breadcrumb">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Breadcrumb items={[
            { label: 'Início', onClick: () => {} },
            { label: 'Equipe', onClick: () => {} },
            { label: 'Ana Souza' },
          ]} />
          <Breadcrumb
            separator="›"
            items={[
              { label: 'Dashboard', onClick: () => {} },
              { label: 'Relatórios', onClick: () => {} },
              { label: 'Bem-estar', onClick: () => {} },
              { label: 'Abril 2026' },
            ]}
            maxItems={3}
          />
        </div>
      </Section>

      {/* ── Tag / Chip ───────────────────────────────────────── */}
      <Section title="Tag / Chip">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Tag label="Default" />
          <Tag label="Primary" variant="primary" />
          <Tag label="Success" variant="success" />
          <Tag label="Warning" variant="warning" />
          <Tag label="Error"   variant="error" />
          <Tag label="Info"    variant="info" />
          <Tag label="Amber"   variant="amber" />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Tag label="Small"  size="sm" variant="primary" />
          <Tag label="Medium" size="md" variant="primary" />
          <Tag label="Large"  size="lg" variant="primary" />
          <Tag label="Removível" variant="success" onRemove={() => toast({ message: 'Tag removida', variant: 'info' })} />
          <Tag label="Com ícone" icon={<span>✦</span>} variant="amber" />
          <Tag label="Avatar" avatar="AS" variant="primary" />
          <Tag label="Disabled" variant="primary" disabled />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Tag label="Selecionável" variant="primary" selectable />
          <Tag label="Selecionado" variant="success" selectable selected />
          <Tag label="Design"       variant="info" selectable />
          <Tag label="Engenharia"   variant="primary" selectable />
          <Tag label="Produto"      variant="amber" selectable />
        </div>
      </Section>

      {/* ── ThemeToggle ──────────────────────────────────────── */}
      <Section title="ThemeToggle — Modo escuro">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ThemeToggle size="sm" />
          <ThemeToggle size="md" />
          <ThemeToggle size="lg" />
          <span style={{ fontSize: 'var(--wlh-text-sm)', color: 'var(--text-secondary)' }}>
            Clique para alternar o tema — persiste no localStorage
          </span>
        </div>
      </Section>

      {/* ── Stepper ──────────────────────────────────────────── */}
      <Section title="Stepper — Progresso em etapas">
        <Stepper
          currentStep={stepperStep}
          onStepClick={setStepperStep}
          steps={[
            { id: 's1', label: 'Conta criada',    description: 'Dados básicos' },
            { id: 's2', label: 'Perfil',           description: 'Informações pessoais' },
            { id: 's3', label: 'Preferências',    description: 'Configure alertas' },
            { id: 's4', label: 'Equipe',           description: 'Convide colegas' },
            { id: 's5', label: 'Concluído',        description: 'Tudo pronto!' },
          ]}
        />
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button size="sm" variant="secondary" onClick={() => setStepperStep(s => Math.max(0, s - 1))}>← Anterior</Button>
          <Button size="sm" variant="primary"   onClick={() => setStepperStep(s => Math.min(4, s + 1))}>Próximo →</Button>
        </div>
        <Stepper
          currentStep={1}
          orientation="vertical"
          steps={[
            { id: 'v1', label: 'Check-in realizado',  description: 'Hoje às 09:14' },
            { id: 'v2', label: 'Score calculado',     description: 'Processando...' },
            { id: 'v3', label: 'Insight gerado',      description: 'Aguardando' },
          ]}
        />
      </Section>

      {/* ── PageHeader ───────────────────────────────────────── */}
      <Section title="PageHeader">
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--wlh-radius-xl)', overflow: 'hidden' }}>
          <PageHeader
            title="Relatório de Bem-estar"
            subtitle="Análise consolidada dos últimos 30 dias"
            breadcrumb={[
              { label: 'Dashboard', onClick: () => {} },
              { label: 'Relatórios', onClick: () => {} },
              { label: 'Bem-estar' },
            ]}
            onBack={() => {}}
            actions={
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" size="sm">Exportar</Button>
                <Button variant="primary" size="sm">Compartilhar</Button>
              </div>
            }
          />
        </div>
      </Section>

      {/* ── Drawer ───────────────────────────────────────────── */}
      <Section title="Drawer / Offcanvas">
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
            Abrir Drawer →
          </Button>
        </div>
        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Detalhes do colaborador"
          placement="right"
          size="md"
          footer={
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancelar</Button>
              <Button variant="primary" onClick={() => { setDrawerOpen(false); toast({ message: 'Salvo!', variant: 'success' }) }}>Salvar</Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Avatar name="Ana Souza" size="lg" status="online" />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Ana Souza</div>
                <div style={{ fontSize: 'var(--wlh-text-sm)', color: 'var(--text-secondary)' }}>Design · Score 9.2</div>
              </div>
            </div>
            <WellbeingScore score={92} size="md" trend={4} />
            <Callout variant="success" title="Desempenho excelente">
              Ana está com sequência de 14 dias de check-in e bem-estar acima de 8 por 3 semanas seguidas.
            </Callout>
          </div>
        </Drawer>
      </Section>

      {/* ── FilterBar ────────────────────────────────────────── */}
      <Section title="FilterBar">
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--wlh-radius-xl)', overflow: 'hidden' }}>
          <FilterBar
            groups={[
              { id: 'dept',   label: 'Área',    type: 'tags',   options: [{ id: 'eng', label: 'Engenharia', count: 12 }, { id: 'des', label: 'Design', count: 5 }, { id: 'mkt', label: 'Marketing', count: 8 }, { id: 'rh', label: 'RH', count: 3 }] },
              { id: 'status', label: 'Status',  type: 'select', options: [{ id: 'active', label: 'Ativo' }, { id: 'away', label: 'Férias' }, { id: 'inactive', label: 'Inativo' }] },
              { id: 'period', label: 'Período', type: 'date-range' },
            ]}
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
            onSearch={q => {}}
            resultCount={28}
            searchPlaceholder="Buscar colaboradores..."
          />
          <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-page)', fontSize: 'var(--wlh-text-sm)', color: 'var(--text-tertiary)' }}>
            {activeFilters.length === 0 ? 'Sem filtros ativos' : `Filtros: ${activeFilters.map(f => f.label).join(', ')}`}
          </div>
        </div>
      </Section>

      {/* ── InsightCard ──────────────────────────────────────── */}
      <Section title="InsightCard — Insights de IA">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          <InsightCard
            id="i1"
            category="wellbeing"
            priority="high"
            title="Score em queda por 3 dias seguidos"
            body="Seu score de bem-estar caiu de 8.4 para 6.1 nos últimos 3 dias. Isso pode indicar sobrecarga ou falta de descanso."
            metric={{ label: 'Score atual', value: '6.1', trend: -2.3 }}
            isNew
            actions={[
              { label: 'Ver histórico', onClick: () => {} },
              { label: 'Fazer check-in', onClick: () => toast({ message: 'Iniciando check-in', variant: 'info' }) },
            ]}
            onDismiss={() => toast({ message: 'Insight descartado', variant: 'default' })}
          />
          <InsightCard
            id="i2"
            category="habits"
            priority="medium"
            title="Sequência de meditação em risco"
            body="Você não registrou meditação hoje. Sua sequência atual de 12 dias pode ser perdida."
            metric={{ label: 'Sequência', value: '12 dias', trend: 0 }}
            actions={[{ label: 'Registrar agora', onClick: () => {} }]}
          />
          <InsightCard
            id="i3"
            category="goals"
            priority="low"
            title="Meta de leitura no caminho certo"
            body="Você está 73% no caminho para sua meta mensal de leitura. Continue assim e vai superar o objetivo!"
            metric={{ label: 'Progresso', value: '73%', trend: 5 }}
          />
          <InsightCard
            id="i4"
            category="focus"
            priority="medium"
            title="Pico de foco identificado"
            body="Seus dados mostram que você é 40% mais produtivo entre 9h e 11h. Considere agendar tarefas complexas nesse horário."
            isNew
            actions={[{ label: 'Configurar agenda', onClick: () => {} }]}
          />
        </div>
      </Section>
    </>
  )
}

/* ── Sprint 4 — Product components ─────────────────────────────── */
function SprintFourSections() {
  const { toast } = useToast()

  /* ── WellbeingScore data ─ */
  const scores: Array<{ score: number; size: 'sm'|'md'|'lg'|'xl'; trend?: number }> = [
    { score: 85, size: 'sm', trend: 3 },
    { score: 62, size: 'md', trend: -2 },
    { score: 48, size: 'lg', trend: 0 },
    { score: 22, size: 'xl', trend: 5 },
  ]

  /* ── HabitTracker entries: last 120 days random ─ */
  const habitEntries = useMemo(() => {
    const arr = []
    const now = new Date()
    for (let i = 0; i < 120; i++) {
      const d = new Date(now); d.setDate(d.getDate() - i)
      const iso = d.toISOString().slice(0, 10)
      if (Math.random() > 0.3) arr.push({ date: iso, completed: true, value: Math.floor(Math.random() * 60) + 5 })
    }
    return arr
  }, [])

  /* ── MoodHistory entries: last 30 days ─ */
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const arr: MoodEntry[] = []
    const now = new Date()
    for (let i = 1; i <= 28; i++) {
      const d = new Date(now); d.setDate(d.getDate() - i)
      arr.push({ date: d.toISOString().slice(0, 10), level: ((Math.floor(Math.random() * 5) + 1) as MoodLevel) })
    }
    return arr
  })

  /* ── ActivityFeed items ─ */
  const feedItems: ActivityItem[] = useMemo(() => [
    { id: 'a1', type: 'habit',       title: 'Meditação concluída',       timestamp: new Date(Date.now() - 10 * 60_000), value: '15 min' },
    { id: 'a2', type: 'goal',        title: 'Meta 70% completa',         description: 'Ler 20 páginas por dia', timestamp: new Date(Date.now() - 45 * 60_000), value: '70%' },
    { id: 'a3', type: 'achievement', title: 'Conquista desbloqueada!',   description: '7 dias consecutivos de check-in', timestamp: new Date(Date.now() - 2 * 3_600_000), badge: 'Sequência' },
    { id: 'a4', type: 'mood',        title: 'Humor registrado',          timestamp: new Date(Date.now() - 3 * 3_600_000), value: 'Ótimo' },
    { id: 'a5', type: 'focus',       title: 'Sessão de foco encerrada',  timestamp: new Date(Date.now() - 5 * 3_600_000), value: '50 min' },
    { id: 'a6', type: 'check-in',    title: 'Check-in diário feito',     timestamp: new Date(Date.now() - 86_400_000), value: 'Score 8.4' },
    { id: 'a7', type: 'habit',       title: 'Exercício físico',          description: 'Corrida matinal', timestamp: new Date(Date.now() - 26 * 3_600_000), value: '35 min' },
    { id: 'a8', type: 'note',        title: 'Reflexão semanal',          description: 'Semana produtiva com bons resultados em todas as metas.', timestamp: new Date(Date.now() - 2 * 86_400_000) },
  ], [])

  return (
    <>
      {/* ── WellbeingScore ───────────────────────────────────── */}
      <Section title="WellbeingScore — Gauge de Bem-estar">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-end' }}>
          {scores.map(({ score, size, trend }) => (
            <WellbeingScore
              key={size}
              score={score}
              size={size}
              trend={trend}
              label="Bem-estar"
            />
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '0.5rem' }}>
          <WellbeingScore score={95} size="md" label="Excelente" trend={8} />
          <WellbeingScore score={72} size="md" label="Com anel" showRing />
          <WellbeingScore score={35} size="md" label="Em risco" trend={-5} trendLabel="vs mês" />
          <WellbeingScore score={0}  size="md" label="Crítico" />
        </div>
      </Section>

      {/* ── GoalCard ─────────────────────────────────────────── */}
      <Section title="GoalCard — Metas">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          <GoalCard
            title="Meditar diariamente"
            description="15 minutos de meditação toda manhã para reduzir o estresse"
            progress={73}
            target="15 min/dia"
            current="11 min/dia"
            dueDate="30/06/2026"
            status="on-track"
            icon={<Brain size={20} />}
            milestones={[
              { id: 'm1', label: 'Instalar app de meditação', done: true },
              { id: 'm2', label: 'Completar 7 dias seguidos', done: true },
              { id: 'm3', label: 'Atingir média de 15 min',   done: false },
            ]}
            onEdit={() => toast({ message: 'Editando meta...', variant: 'info' })}
          />
          <GoalCard
            title="Exercício físico"
            description="Academia 4× por semana"
            progress={40}
            target="4× /semana"
            current="1.6× /semana"
            dueDate="31/12/2026"
            status="at-risk"
            icon={<Dumbbell size={20} />}
          />
          <GoalCard
            title="Leitura mensal"
            description="Ler 2 livros por mês"
            progress={100}
            target="2 livros/mês"
            current="2 livros"
            status="completed"
            icon={<BookOpen size={20} />}
          />
          <GoalCard
            title="Dieta equilibrada"
            progress={55}
            status="paused"
            icon={<Leaf size={20} />}
            milestones={[
              { id: 'x1', label: 'Consulta nutricional', done: true },
              { id: 'x2', label: 'Plano alimentar', done: false },
            ]}
          />
        </div>
      </Section>

      {/* ── HabitTracker ─────────────────────────────────────── */}
      <Section title="HabitTracker — Contribution Grid">
        <HabitTracker
          name="Meditação"
          description="15 min por dia"
          icon={<Brain size={20} />}
          color="var(--wlh-navy-500)"
          streak={12}
          bestStreak={34}
          completionRate={78}
          entries={habitEntries}
          weeks={17}
        />
        <HabitTracker
          name="Exercício"
          description="Qualquer atividade física"
          icon={<Dumbbell size={20} />}
          color="var(--wlh-green-500)"
          streak={3}
          bestStreak={21}
          completionRate={55}
          entries={habitEntries.filter((_, i) => i % 2 === 0)}
          weeks={17}
        />
      </Section>

      {/* ── ActivityFeed ─────────────────────────────────────── */}
      <Section title="ActivityFeed — Histórico de Atividades">
        <div style={{ maxWidth: 480 }}>
          <ActivityFeed
            items={feedItems}
            onItemClick={id => toast({ message: `Atividade: ${id}`, variant: 'info' })}
          />
        </div>
      </Section>

      {/* ── FocusTimer ───────────────────────────────────────── */}
      <Section title="FocusTimer — Pomodoro">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          <FocusTimer
            onPhaseEnd={(phase, round) =>
              toast({ message: `${phase === 'focus' ? 'Foco' : 'Pausa'} encerrado — rodada ${round}`, variant: 'success' })
            }
            onSessionEnd={mins =>
              toast({ message: `Sessão encerrada: ${mins} min de foco`, variant: 'info' })
            }
          />
        </div>
      </Section>

      {/* ── TeamDashboard ────────────────────────────────────── */}
      <Section title="TeamDashboard — Visão do Gestor">
        <TeamDashboard
          teamName="Equipe de Design"
          period="Esta semana"
          metrics={{
            avgScore:          78,
            avgScoreTrend:     3.2,
            participationRate: 83,
            atRiskCount:       1,
            checkinToday:      4,
            totalMembers:      6,
            topHabit:          'Meditação',
          } satisfies TeamMetrics}
          members={[
            { id: '1', name: 'Ana Souza',    role: 'Product Designer',    avatarInitials: 'AS', wellbeingScore: 92, checkInStreak: 14, lastCheckIn: new Date(Date.now()-3_600_000).toISOString(),  trend:  4,  status: 'active'   },
            { id: '2', name: 'Bruno Lima',   role: 'UX Researcher',       avatarInitials: 'BL', wellbeingScore: 71, checkInStreak:  7, lastCheckIn: new Date(Date.now()-7_200_000).toISOString(),  trend: -2,  status: 'active'   },
            { id: '3', name: 'Carla Mendes', role: 'UI Designer',         avatarInitials: 'CM', wellbeingScore: 55, checkInStreak:  2, lastCheckIn: new Date(Date.now()-86_400_000).toISOString(), trend: -8,  status: 'at-risk'  },
            { id: '4', name: 'Diego Rocha',  role: 'Motion Designer',     avatarInitials: 'DR', wellbeingScore: 88, checkInStreak: 21, lastCheckIn: new Date(Date.now()-1_800_000).toISOString(),  trend:  6,  status: 'active'   },
            { id: '5', name: 'Elena Castro', role: 'Design Lead',         avatarInitials: 'EC', wellbeingScore: 79, checkInStreak:  5, lastCheckIn: new Date(Date.now()-5_400_000).toISOString(),  trend:  1,  status: 'away'     },
            { id: '6', name: 'Felipe Nunes', role: 'Brand Designer',      avatarInitials: 'FN', wellbeingScore: -1, checkInStreak:  0, status: 'no-data' },
          ] satisfies TeamMember[]}
          onMemberClick={id => {}}
          onExport={() => {}}
        />
      </Section>

      {/* ── MoodHistory ──────────────────────────────────────── */}
      <Section title="MoodHistory — Histórico de Humor">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          <MoodHistory
            entries={moodEntries}
            view="week"
            showLogToday
            onLogMood={level => {
              const today = new Date().toISOString().slice(0, 10)
              setMoodEntries(prev => [{ date: today, level }, ...prev.filter(e => e.date !== today)])
              toast({ message: `Humor registrado: ${level}/5`, variant: 'success' })
            }}
          />
          <MoodHistory
            entries={moodEntries}
            view="month"
            showLogToday={false}
          />
        </div>
      </Section>
    </>
  )
}

/* ── Micro icons para showcase ──────────────────────────────────── */
const icon = (d: string) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d={d} />
  </svg>
)
const HomeIcon     = () => icon('M2 7l6-5 6 5v8H10v-4H6v4H2z')
const CheckIcon    = () => icon('M3 8l3 3 7-7')
const TargetIcon   = () => icon('M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3zM8 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z')
const CalendarIcon = () => icon('M4 2v2m8-2v2M2 6h12M3 4h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z')
const ChartIcon    = () => icon('M2 12l4-4 3 3 5-7')
const UsersIcon    = () => icon('M5 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM1 15a5 5 0 0 1 8-4 5 5 0 0 1 6 4')
const SettingsIcon = () => icon('M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm4.9-1H14m-2.1-3.9.7-.7M9 3.1V2M5.1 5.1l-.7-.7M3 9H1.1m2 3.9-.7.7M7 12.9V14m3.9-.1.7.7')
const LockIcon     = () => icon('M5 7V5a3 3 0 0 1 6 0v2m-7 0h8a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z')

export default function App() {
  return (
    <CommandProvider>
      <ModalController>
        <ToastProvider position="bottom-right">
          <Sandbox />
        </ToastProvider>
      </ModalController>
    </CommandProvider>
  )
}
