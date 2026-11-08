import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import Landing from './pages/Landing'

const Overview = lazy(() => import('./pages/Overview'))
const Ems = lazy(() => import('./pages/Ems'))
const Pharmacy = lazy(() => import('./pages/Pharmacy'))
const Medicine = lazy(() => import('./pages/Medicine'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function PageFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <span className="size-7 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" />
        <span className="text-xs font-medium text-ink-400">กำลังโหลดข้อมูล…</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/dashboard/ems" element={<Ems />} />
            <Route path="/dashboard/pharmacy" element={<Pharmacy />} />
            <Route path="/dashboard/medicine" element={<Medicine />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
