import { Routes, Route } from 'react-router-dom';
import { SurveyProvider } from './context/SurveyContext';
import SurveyForm from './pages/SurveyForm';
import ImpactDashboard from './pages/ImpactDashboard';
import './App.css';

function App() {
  return (
    <SurveyProvider>
      <Routes>
        <Route path="/" element={<SurveyForm />} />
        <Route path="/impact" element={<ImpactDashboard />} />
      </Routes>
    </SurveyProvider>
  );
}

export default App;

