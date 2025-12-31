import { Routes, Route } from 'react-router-dom';
import SurveyForm from './pages/SurveyForm';
import Impact from './pages/Impact';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SurveyForm />} />
      <Route path="/impact" element={<Impact />} />
    </Routes>
  );
}

export default App;

