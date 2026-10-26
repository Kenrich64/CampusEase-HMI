import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { CalendarPage } from './pages/CalendarPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { GradesPage } from './pages/GradesPage';
import { ProfilePage } from './pages/ProfilePage';
import { FeedbackPage } from './pages/FeedbackPage';
import { FacultyInsightsPage } from './pages/FacultyInsightsPage';
import { HmiPrinciplesPage } from './pages/HmiPrinciplesPage';
import { UsabilityEvaluationPage } from './pages/UsabilityEvaluationPage';
import { HelpGuidancePage } from './pages/HelpGuidancePage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Dashboard Shell */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:id" element={<CourseDetailPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="faculty-insights" element={<FacultyInsightsPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="grades" element={<GradesPage />} />
            <Route path="preferences" element={<ProfilePage />} />
            <Route path="hmi-principles" element={<HmiPrinciplesPage />} />
            <Route path="usability-evaluation" element={<UsabilityEvaluationPage />} />
            <Route path="help" element={<HelpGuidancePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
