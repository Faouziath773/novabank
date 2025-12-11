import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { MFAPage } from './pages/MFAPage';
import { DashboardPage } from './pages/DashboardPage';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SimulationsPage } from './pages/SimulationsPage';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isMFAVerified } = useAuth();
  
  // Vérifier aussi le localStorage pour éviter les problèmes de synchronisation
  const storedAuth = localStorage.getItem('novabank_auth');
  const storedMFA = localStorage.getItem('novabank_mfa');
  const isAuthFromStorage = !!storedAuth;
  const isMFAFromStorage = storedMFA === 'true';
  
  // Utiliser l'état ou le localStorage (le localStorage est la source de vérité)
  const authenticated = isAuthenticated || isAuthFromStorage;
  const mfaVerified = isMFAVerified || isMFAFromStorage;
  
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!mfaVerified) {
    return <Navigate to="/mfa" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mfa" element={<MFAPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments"
          element={
            <ProtectedRoute>
              <InvestmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/simulations"
          element={
            <ProtectedRoute>
              <SimulationsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
