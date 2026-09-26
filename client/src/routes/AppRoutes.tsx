import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SkillsPage } from '../pages/SkillsPage';
import { AssessmentsPage } from '../pages/AssessmentsPage';
import { AssessmentPage } from '../pages/AssessmentPage';
import { AssessmentResultPage } from '../pages/AssessmentResultPage';
import { CareersPage } from '../pages/CareersPage';
import { CareerDetailPage } from '../pages/CareerDetailPage';
import { SkillGapsPage } from '../pages/SkillGapsPage';
import { RoadmapPage } from '../pages/RoadmapPage';
import { LearningPlanPage } from '../pages/LearningPlanPage';
import { MarketTrendsPage } from '../pages/MarketTrendsPage';
import { CoachPage } from '../pages/CoachPage';
import { CareerComparisonPage } from '../pages/CareerComparisonPage';
import { SettingsPage } from '../pages/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Route */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes Guard */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/assessments/:assessmentId" element={<AssessmentPage />} />
          <Route path="/assessments/:assessmentId/result" element={<AssessmentResultPage />} />
          <Route path="/skills/assessment" element={<AssessmentsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:careerId" element={<CareerDetailPage />} />
          <Route path="/compare-careers" element={<CareerComparisonPage />} />
          <Route path="/skill-gaps" element={<SkillGapsPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/learning-plan" element={<LearningPlanPage />} />
          <Route path="/market-trends" element={<MarketTrendsPage />} />
          <Route path="/coach" element={<CoachPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
