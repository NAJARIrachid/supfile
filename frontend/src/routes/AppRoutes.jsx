/**
 * Configuration React Router — routes publiques et protégées
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import GuestRoute from '@/components/common/GuestRoute';
import MainLayout from '@/components/layout/MainLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import FilesPage from '@/pages/FilesPage';
import SharedPage from '@/pages/SharedPage';
import TrashPage from '@/pages/TrashPage';
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import PublicSharePage from '@/pages/PublicSharePage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth publique */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/share/:token" element={<PublicSharePage />} />

      {/* Application protégée */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/files" element={<FilesPage />} />
        <Route path="/shared" element={<SharedPage />} />
        <Route path="/trash" element={<TrashPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/files" replace />} />
      <Route path="*" element={<Navigate to="/files" replace />} />
    </Routes>
  );
}
