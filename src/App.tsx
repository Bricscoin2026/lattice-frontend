import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import CookieBanner from './components/shared/CookieBanner'
import { useStore } from './lib/store'

const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const CertifyPage = lazy(() => import('./pages/CertifyPage'))
const PulsePage = lazy(() => import('./pages/PulsePage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ExplorerPage = lazy(() => import('./pages/ExplorerPage'))
const LNSPage = lazy(() => import('./pages/LNSPage'))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useStore(s => s.isAuthenticated)
  if (!isAuth) return <Navigate to="/login" replace />
  return <>{children}</>
}

function Loading() {
  return <div className="flex items-center justify-center min-h-screen" style={{ background: '#0a0a0f', color: '#6b6b80' }}>Caricamento...</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <CookieBanner />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/certify" element={<ProtectedRoute><CertifyPage /></ProtectedRoute>} />
          <Route path="/pulse" element={<ProtectedRoute><PulsePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/explorer" element={<ProtectedRoute><ExplorerPage /></ProtectedRoute>} />
          <Route path="/lns" element={<ProtectedRoute><LNSPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
