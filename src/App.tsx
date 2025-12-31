import { Routes, Route } from 'react-router-dom';
import { SurveyProvider } from './context/SurveyContext';
import SurveyForm from './pages/SurveyForm';
import ImpactDashboard from './pages/ImpactDashboard';
import SnowfallLayer from './components/SnowfallLayer';
import './App.css';

function App() {
  return (
    <SurveyProvider>
      <SnowfallLayer />
      <Routes>
        <Route path="/" element={<SurveyForm />} />
        <Route path="/impact" element={<ImpactDashboard />} />
      </Routes>
    </SurveyProvider>
  );
}

export default App;

