import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { ImpactLevel, Module, MODULES, SurveyResponse } from '../types/survey';

interface SurveyContextType {
  responses: SurveyResponse[];
  addResponse: (response: SurveyResponse) => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshResponses: () => Promise<void>;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  // Load from localStorage immediately (synchronous)
  const [responses, setResponses] = useState<SurveyResponse[]>(() => {
    try {
      const stored = localStorage.getItem('surveyResponses');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load responses from Supabase on mount (async, non-blocking)
  const loadResponses = async () => {
    // Skip if Supabase is not configured
    if (!isSupabaseConfigured()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('survey_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Transform Supabase data to SurveyResponse format
      const transformedResponses: SurveyResponse[] = (data || []).map((row: any) => {
        // Initialize moduleImpact with all modules set to null if database value is missing/null
        // This ensures proper structure and prevents undefined values in calculations
        const dbModuleImpact = row.module_impact;
        const moduleImpact: Record<Module, ImpactLevel | null> = {} as Record<Module, ImpactLevel | null>;
        MODULES.forEach((module) => {
          // If database has value for this module (must be 1-5), use it; otherwise set to null
          const value = dbModuleImpact?.[module];
          moduleImpact[module] = (typeof value === 'number' && value >= 1 && value <= 5) 
            ? (value as ImpactLevel) 
            : null;
        });

        return {
          name: row.name || '',
          role: row.role || '',
          usageDuration: row.usage_duration || '',
          modulesUsed: row.modules_used || [],
          reducedManualWork: row.reduced_manual_work,
          savesTimeDaily: row.saves_time_daily,
          dataAccuracyImproved: row.data_accuracy_improved,
          easierTracking: row.easier_tracking,
          improvedEfficiency: row.improved_efficiency,
          moduleImpact,
          timeSpentBefore: row.time_spent_before || '',
          timeSpentAfter: row.time_spent_after || '',
          errorFrequencyBefore: row.error_frequency_before || '',
          errorFrequencyAfter: row.error_frequency_after || '',
          trustOGROData: row.trust_ogro_data,
          lessExcelWhatsApp: row.less_excel_whatsapp,
          preferOGROOverOldTools: row.prefer_ogro_over_old_tools,
          biggestImprovement: row.biggest_improvement || '',
          oneImprovementNeeded: row.one_improvement_needed || '',
        };
      });

      setResponses(transformedResponses);
    } catch (err: any) {
      console.error('Error loading survey responses:', err);
      setError(err.message || 'Failed to load survey responses');
      // Fallback to localStorage if Supabase fails
      const stored = localStorage.getItem('surveyResponses');
      if (stored) {
        setResponses(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResponses();
  }, []);

  const addResponse = async (response: SurveyResponse) => {
    try {
      setError(null);

      // Always save to localStorage first
      const newResponses = [response, ...responses];
      setResponses(newResponses);
      localStorage.setItem('surveyResponses', JSON.stringify(newResponses));

      // If Supabase is not configured, skip database save
      if (!isSupabaseConfigured()) {
        return;
      }

      // Transform SurveyResponse to Supabase format
      const supabaseData = {
        name: response.name || null,
        role: response.role || null,
        usage_duration: response.usageDuration || null,
        modules_used: response.modulesUsed,
        reduced_manual_work: response.reducedManualWork,
        saves_time_daily: response.savesTimeDaily,
        data_accuracy_improved: response.dataAccuracyImproved,
        easier_tracking: response.easierTracking,
        improved_efficiency: response.improvedEfficiency,
        module_impact: response.moduleImpact,
        time_spent_before: response.timeSpentBefore || null,
        time_spent_after: response.timeSpentAfter || null,
        error_frequency_before: response.errorFrequencyBefore || null,
        error_frequency_after: response.errorFrequencyAfter || null,
        trust_ogro_data: response.trustOGROData,
        less_excel_whatsapp: response.lessExcelWhatsApp,
        prefer_ogro_over_old_tools: response.preferOGROOverOldTools,
        biggest_improvement: response.biggestImprovement || null,
        one_improvement_needed: response.oneImprovementNeeded || null,
      };

      const { error: insertError } = await supabase
        .from('survey_responses')
        .insert([supabaseData]);

      if (insertError) {
        // If Supabase fails, data is already saved to localStorage
        console.warn('Supabase save failed, but data saved to localStorage:', insertError);
        // Don't throw error - data is already saved locally
      }
    } catch (err: any) {
      console.error('Error saving survey response:', err);
      setError(err.message || 'Failed to save survey response');
      // Data is already saved to localStorage, so we don't need to throw
    }
  };

  return (
    <SurveyContext.Provider 
      value={{ 
        responses, 
        addResponse, 
        loading, 
        error,
        refreshResponses: loadResponses,
      }}
    >
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

