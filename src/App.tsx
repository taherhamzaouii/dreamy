import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/landing/LandingPage';
import { CalendarView } from './components/calendar/CalendarView';
import { DreamChat } from './components/chat/DreamChat';
import './App.css';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/dream/:date" element={<DreamChat />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
