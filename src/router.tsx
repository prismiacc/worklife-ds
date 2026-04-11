import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout }     from '@/layouts/AppLayout'
import { DashboardPage, HabitsPage, GoalsPage, TeamPage } from '@/pages'
import { CheckInPage }   from '@/pages/CheckInPage/CheckInPage'
import { NotFoundPage }  from '@/pages/NotFoundPage/NotFoundPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* App shell — all real pages live inside AppLayout */}
        <Route element={<AppLayout />}>
          <Route index             element={<DashboardPage />} />
          <Route path="checkin"    element={<CheckInPage />} />
          <Route path="habitos"    element={<HabitsPage />} />
          <Route path="metas"      element={<GoalsPage />} />
          <Route path="equipe"     element={<TeamPage />} />
          {/* Catch-all redirects unknown /xxx to 404 */}
          <Route path="*"          element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
