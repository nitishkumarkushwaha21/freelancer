import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ContactPage from './pages/ContactPage';
import ReviewsPage from './pages/ReviewsPage';
import TeamPage from './pages/TeamPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLeadsPage from './pages/admin/AdminLeadsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminTeamPage from './pages/admin/AdminTeamPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminProcessPage from './pages/admin/AdminProcessPage';
import AdminFaqPage from './pages/admin/AdminFaqPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="admin">
        <Route index element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="projects" replace />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="team" element={<AdminTeamPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="process" element={<AdminProcessPage />} />
            <Route path="faq" element={<AdminFaqPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="work" element={<WorkPage />} />
        <Route path="work/:slug" element={<ProjectDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="my-team" element={<TeamPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
