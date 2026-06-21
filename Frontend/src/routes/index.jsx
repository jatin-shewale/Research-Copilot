import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import HomePage from '../pages/Home'
import DashboardPage from '../pages/Dashboard'
import SearchPage from '../pages/Search'
import LandscapePage from '../pages/Landscape'
import KnowledgeGraphPage from '../pages/KnowledgeGraph'
import ReadingMapPage from '../pages/ReadingMap'
import TimelinePage from '../pages/Timeline'
import ResearchChatPage from '../pages/ResearchChat'
import PaperDetailsPage from '../pages/PaperDetails'
import NotFoundPage from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/landscape" element={<LandscapePage />} />
          <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
          <Route path="/reading-map" element={<ReadingMapPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/chat" element={<ResearchChatPage />} />
          <Route path="/papers" element={<Navigate to="/dashboard" replace />} />
          <Route path="/paper/:paperId" element={<PaperDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
