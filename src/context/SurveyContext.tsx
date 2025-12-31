import { createContext, useContext, useState, ReactNode } from 'react';
import { SurveyResponse } from '../types/survey';

interface SurveyContextType {
  responses: SurveyResponse[];
  addResponse: (response: SurveyResponse) => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  // Load from localStorage on mount
  const [responses, setResponses] = useState<SurveyResponse[]>(() => {
    const stored = localStorage.getItem('surveyResponses');
    return stored ? JSON.parse(stored) : [];
  });

  const addResponse = (response: SurveyResponse) => {
    const newResponses = [...responses, response];
    setResponses(newResponses);
    localStorage.setItem('surveyResponses', JSON.stringify(newResponses));
  };

  return (
    <SurveyContext.Provider value={{ responses, addResponse }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}

