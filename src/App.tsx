import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/landing/LandingPage';
import { CalendarView } from './components/calendar/CalendarView';
import './App.css';

function App() {
  // Mock dream dates for now - in a real app this would come from a database
  const mockDreamDates = [
    new Date(2025, 0, 15), // January 15, 2025
    new Date(2025, 0, 12), // January 12, 2025
    new Date(2025, 0, 8),  // January 8, 2025
  ];

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/calendar" element={<CalendarView dreamDates={mockDreamDates} />} />
          <Route path="/dream/:date" element={<div>Dream Chat Coming Soon...</div>} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
