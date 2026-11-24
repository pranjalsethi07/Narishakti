import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './pages/DashboardLayout';
import Home from './pages/dashboard/Home';
import Learn from './pages/dashboard/Learn';
import DailyQuestion from './pages/dashboard/DailyQuestion';
import TestKnowledge from './pages/dashboard/TestKnowledge';
import Schemes from './pages/dashboard/Schemes';
import Community from './pages/dashboard/Community';
import Scanner from './pages/dashboard/Scanner';
import AskAI from './pages/dashboard/AskAI';
import Profile from './pages/dashboard/Profile';
import WhatsApp from './pages/dashboard/WhatsApp';
import Tracker from './pages/dashboard/Tracker';
import DigitalDoctor from './pages/dashboard/DigitalDoctor';
import OpportunitiesWomen from './pages/dashboard/OpportunitiesWomen';
import Progress from './pages/dashboard/Progress';
import Games from './pages/dashboard/Games';
import GamePlay from './pages/dashboard/GamePlay';
import GameLevels from './pages/dashboard/GameLevels';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="ask" element={<AskAI />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/:courseId" element={<Learn />} />
          <Route path="daily-question" element={<DailyQuestion />} />
          <Route path="test" element={<TestKnowledge />} />
          <Route path="community" element={<Community />} />
          <Route path="schemes" element={<Schemes />} />
          <Route path="scanner" element={<Scanner />} />
          <Route path="profile" element={<Profile />} />
          <Route path="whatsapp" element={<WhatsApp />} />
          <Route path="tracker" element={<Tracker />} />
          <Route path="digital-doctor" element={<DigitalDoctor />} />
          <Route path="opportunities-women" element={<OpportunitiesWomen />} />
          <Route path="progress" element={<Progress />} />
          <Route path="games" element={<Games />} />
          <Route path="games/:type" element={<GameLevels />} />
          <Route path="games/:type/:level" element={<GamePlay />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
