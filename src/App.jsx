import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import AITutor from './pages/AITutor';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="ai-tutor" element={<AITutor />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
