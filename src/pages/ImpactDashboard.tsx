import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useSurvey } from '../context/SurveyContext';
import { impactCopy, Language } from '../data/impactCopy';
import { surveyCopy } from '../data/surveyCopy';
import { getSupabaseConfigStatus } from '../lib/supabase';
import { Module, MODULES } from '../types/survey';
import {
  calculateCollectionEfficiency,
  calculateErrorReductionNumeric,
  calculateImpactAlignment,
  calculateModuleImpact,
  calculateOSS,
  calculateRealityScore,
  calculateTimeSavedNumeric,
} from '../utils/metrics';

/**
 * Mock analytics data source
 * 
 * Replace this object with real OGRO analytics API later.
 * This structure represents real-world metrics from OGRO system usage.
 */
const mockAnalyticsData = {
  onboarding: {
    beforeTime: 15,      // Hours before OGRO
    afterTime: 0.5,       // Hours after OGRO
    errorBefore: 0.20,    // 20% error rate before
    errorAfter: 0.03,     // 3% error rate after
  },
  bank: {
    cycleDaysBefore: 4,   // Days before OGRO
    cycleDaysAfter: 1,    // Days after OGRO
  },
  input: {
    mismatches: 12,       // Number of mismatches
    total: 600,            // Total transactions
  },
  collection: {
    collected: 920000,    // Amount collected
    due: 1000000,         // Amount due
  },
  deposit: {
    reconciliationBeforeMins: 2880,  // Minutes before (48 hours)
    reconciliationAfterMins: 30,     // Minutes after (0.5 hours)
  },
  erp: {
    reportBeforeMins: 300,  // Minutes before (5 hours)
    reportAfterMins: 10,    // Minutes after (0.17 hours)
  },
  fieldForceMonitoring: {
    checkInBeforeMins: 120,  // Minutes before (2 hours)
    checkInAfterMins: 5,     // Minutes after (0.08 hours)
    trackingAccuracy: 0.95,  // 95% tracking accuracy
  },
};

/**
 * Converts mock analytics data to normalized reality scores per module
 * Uses metrics.ts functions to calculate efficiency gains
 */
function calculateModuleRealityScores() {
  // Farmer Onboarding module
  const onboardingTimeSaved = calculateTimeSavedNumeric(
    mockAnalyticsData.onboarding.beforeTime,
    mockAnalyticsData.onboarding.afterTime
  );
  const onboardingErrorReduction = calculateErrorReductionNumeric(
    mockAnalyticsData.onboarding.errorBefore,
    mockAnalyticsData.onboarding.errorAfter
  );
  const onboardingRealityScore = calculateRealityScore({
    timeSaved: onboardingTimeSaved,
    errorReduction: onboardingErrorReduction,
  });

  // Bank Panel module
  const bankTimeSaved = calculateTimeSavedNumeric(
    mockAnalyticsData.bank.cycleDaysBefore * 8,
    mockAnalyticsData.bank.cycleDaysAfter * 8
  );
  const bankRealityScore = calculateRealityScore({
    timeSaved: bankTimeSaved,
  });

  // Input Panel module
  const inputAccuracy = ((mockAnalyticsData.input.total - mockAnalyticsData.input.mismatches) / mockAnalyticsData.input.total) * 100;
  const inputRealityScore = calculateRealityScore({
    accuracy: inputAccuracy,
  });

  // Collection Panel module
  const collectionEfficiency = calculateCollectionEfficiency(
    mockAnalyticsData.collection.collected,
    mockAnalyticsData.collection.due
  );
  const collectionRealityScore = calculateRealityScore({
    collectionEfficiency: collectionEfficiency,
  });

  // Deposit & Bank Settlement module
  const depositTimeSaved = calculateTimeSavedNumeric(
    mockAnalyticsData.deposit.reconciliationBeforeMins / 60,
    mockAnalyticsData.deposit.reconciliationAfterMins / 60
  );
  const depositRealityScore = calculateRealityScore({
    timeSaved: depositTimeSaved,
  });

  // ERP / Dashboards module
  const erpTimeSaved = calculateTimeSavedNumeric(
    mockAnalyticsData.erp.reportBeforeMins / 60,
    mockAnalyticsData.erp.reportAfterMins / 60
  );
  const erpRealityScore = calculateRealityScore({
    timeSaved: erpTimeSaved,
  });

  // Field Force Monitoring module
  const fieldForceTimeSaved = calculateTimeSavedNumeric(
    mockAnalyticsData.fieldForceMonitoring.checkInBeforeMins / 60,
    mockAnalyticsData.fieldForceMonitoring.checkInAfterMins / 60
  );
  const fieldForceRealityScore = calculateRealityScore({
    timeSaved: fieldForceTimeSaved,
    accuracy: mockAnalyticsData.fieldForceMonitoring.trackingAccuracy * 100,
  });

  return {
    'Farmer Onboarding': onboardingRealityScore,
    'Bank Panel': bankRealityScore,
    'Input Panel': inputRealityScore,
    'Collection Panel': collectionRealityScore,
    'Deposit & Bank Settlement': depositRealityScore,
    'ERP / Dashboards': erpRealityScore,
    'Field Force Monitoring': fieldForceRealityScore,
  };
}

/**
 * Converts time string responses to numeric hours for visualization
 * Uses midpoint of ranges for accurate representation
 */
function convertTimeStringToHours(timeString: string): number {
  if (timeString.includes('4–6')) return 5; // Midpoint of 4-6 hours
  if (timeString.includes('2–4')) return 3; // Midpoint of 2-4 hours
  if (timeString.includes('1–2')) return 1.5; // Midpoint of 1-2 hours
  if (timeString === '<2 hrs') return 1;
  if (timeString === '<1 hr') return 0.5;
  if (timeString === '2+ hrs') return 3;
  return 0;
}

/**
 * Determines which quadrant a module falls into based on survey perception vs reality
 * Helps identify areas needing attention: training, communication, or product improvement
 */
function determineAlignmentQuadrant(surveyImpactPercentage: number, realityScorePercentage: number): 'High–High' | 'High–Low' | 'Low–High' | 'Low–Low' {
  if (surveyImpactPercentage >= 50 && realityScorePercentage >= 50) return 'High–High';
  if (surveyImpactPercentage >= 50 && realityScorePercentage < 50) return 'High–Low';
  if (surveyImpactPercentage < 50 && realityScorePercentage >= 50) return 'Low–High';
  return 'Low–Low';
}

// Vibrant colors optimized for dark mode
const CHART_COLORS = [
  '#60a5fa', // Blue - primary
  '#34d399', // Green - success
  '#fbbf24', // Amber - warning
  '#f87171', // Red - attention
  '#a78bfa', // Purple - accent
  '#22d3ee', // Cyan - highlight
];

export default function ImpactDashboard() {
  const { responses, loading, error, refreshResponses } = useSurvey();
  const [language, setLanguage] = useState<Language>('bn'); // Default: Bangla
  const [isRefreshing, setIsRefreshing] = useState(false);
  const moduleRealityScores = calculateModuleRealityScores();
  const copy = impactCopy[language];
  const surveyCopyLang = surveyCopy[language];
  const supabaseStatus = getSupabaseConfigStatus();

  // Note: Data is automatically loaded by SurveyContext on mount, so we don't need to call refreshResponses here
  // This prevents race conditions where both context and dashboard try to load simultaneously

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshResponses();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className={`impact-dashboard ${language === 'bn' ? 'bangla-font' : ''}`}>
        <div className="loading-state">
          <h1>{copy.title}</h1>
          <p>{language === 'bn' ? 'ডেটা লোড হচ্ছে...' : 'Loading data...'}</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error (but still show dashboard with localStorage data)
  if (error) {
    console.warn('Supabase error (using localStorage fallback):', error);
  }

  // Calculate key metrics from survey responses
  // Ensure responses array is valid
  const validResponses = Array.isArray(responses) ? responses : [];
  const overallSatisfactionScore = calculateOSS(validResponses);
  const moduleImpactScores = calculateModuleImpact(validResponses);

  // Find strongest and weakest modules based on survey impact
  const modulesWithImpact = Object.entries(moduleImpactScores)
    .filter(([_, score]) => score > 0)
    .map(([module, score]) => ({ module, score }));
  
  const strongestModule = modulesWithImpact.length > 0
    ? modulesWithImpact.reduce((max, current) => current.score > max.score ? current : max)
    : null;
  
  const weakestModule = modulesWithImpact.length > 0
    ? modulesWithImpact.reduce((min, current) => current.score < min.score ? current : min)
    : null;

  // Calculate average perception vs reality gap
  const perceptionRealityGaps = MODULES
    .filter((module) => moduleImpactScores[module] > 0 || moduleRealityScores[module] > 0)
    .map((module) => {
      const surveyImpact = moduleImpactScores[module];
      const realityScore = moduleRealityScores[module];
      return Math.abs(surveyImpact - realityScore);
    });
  
  const averagePerceptionRealityGap = perceptionRealityGaps.length > 0
    ? perceptionRealityGaps.reduce((sum, gap) => sum + gap, 0) / perceptionRealityGaps.length
    : 0;

  // Prepare data for charts
  // Chart 1: Overall Satisfaction (Donut)
  const satisfactionDonutData = [
    { name: 'Satisfaction', value: overallSatisfactionScore },
    { name: 'Remaining', value: 100 - overallSatisfactionScore },
  ];

  // Chart 2: Module Impact Bar Chart
  const moduleImpactBarData = MODULES
    .map((module) => {
      const translatedName = surveyCopyLang.options.modules[module] || module;
      return {
        moduleName: translatedName.length > 20 ? translatedName.substring(0, 20) + '...' : translatedName,
        fullModuleName: translatedName,
        impactPercentage: moduleImpactScores[module],
      };
    })
    .filter((item) => item.impactPercentage > 0);

  // Chart 3: Before vs After Time Comparison
  const timeComparisonData = responses
    .filter((response) => response.timeSpentBefore && response.timeSpentAfter)
    .map((response, index) => ({
      responseLabel: language === 'bn' ? `রেসপন্স ${index + 1}` : `Response ${index + 1}`,
      hoursBeforeOGRO: convertTimeStringToHours(response.timeSpentBefore),
      hoursAfterOGRO: convertTimeStringToHours(response.timeSpentAfter),
    }));

  // Chart 4: Perception vs Reality Comparison
  const perceptionVsRealityData = MODULES
    .map((module) => {
      const translatedName = surveyCopyLang.options.modules[module] || module;
      return {
        moduleName: translatedName.length > 15 ? translatedName.substring(0, 15) + '...' : translatedName,
        fullModuleName: translatedName,
        surveyImpactPercentage: moduleImpactScores[module],
        realityScorePercentage: moduleRealityScores[module],
      };
    })
    .filter((item) => item.surveyImpactPercentage > 0 || item.realityScorePercentage > 0);

  // Chart 5: Impact Alignment Scatter Plot
  const alignmentScatterData = MODULES
    .map((module) => {
      const surveyImpactPercentage = moduleImpactScores[module];
      const realityScorePercentage = moduleRealityScores[module];
      const alignmentScore = calculateImpactAlignment(
        (surveyImpactPercentage / 100) * 4 + 1, // Convert 0-100% to 1-5 Likert scale
        realityScorePercentage
      );
      const translatedName = surveyCopyLang.options.modules[module] || module;
      return {
        moduleName: translatedName.length > 15 ? translatedName.substring(0, 15) + '...' : translatedName,
        fullModuleName: translatedName,
        surveyImpactPercentage,
        realityScorePercentage,
        alignmentScore,
        quadrant: determineAlignmentQuadrant(surveyImpactPercentage, realityScorePercentage),
      };
    })
    .filter((item) => item.surveyImpactPercentage > 0 || item.realityScorePercentage > 0);

  // Handle empty state (only show after loading completes)
  if (!loading && validResponses.length === 0) {
    return (
      <div className={`impact-dashboard ${language === 'bn' ? 'bangla-font' : ''}`}>
        {/* Language Toggle and Refresh Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="language-toggle">
            <button
              className={`lang-btn ${language === 'bn' ? 'active' : ''}`}
              onClick={() => setLanguage('bn')}
              type="button"
            >
              বাংলা
            </button>
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              type="button"
            >
              English
            </button>
          </div>
          
          {/* Refresh Button and Data Source Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {!supabaseStatus.isConfigured && (
              <span style={{ color: '#fbbf24', fontSize: '0.85rem' }} title={language === 'bn' ? 'Supabase কনফিগার করা হয়নি' : 'Supabase not configured'}>
                {language === 'bn' ? '⚠️ Supabase কনফিগার নেই' : '⚠️ Supabase not configured'}
              </span>
            )}
            {error && supabaseStatus.isConfigured && (
              <span style={{ color: '#f87171', fontSize: '0.85rem' }} title={error}>
                {language === 'bn' ? '⚠️ localStorage ব্যবহার করা হচ্ছে' : '⚠️ Using localStorage'}
              </span>
            )}
            {!error && !loading && supabaseStatus.isConfigured && (
              <span style={{ color: '#34d399', fontSize: '0.85rem' }}>
                {language === 'bn' ? '✅ Supabase থেকে ডেটা' : '✅ Data from Supabase'}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(96, 165, 250, 0.2)',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                borderRadius: '8px',
                color: '#60a5fa',
                cursor: isRefreshing || loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                opacity: isRefreshing || loading ? 0.5 : 1,
              }}
              type="button"
            >
              {isRefreshing || loading 
                ? (language === 'bn' ? '🔄 লোড হচ্ছে...' : '🔄 Loading...')
                : (language === 'bn' ? '🔄 রিফ্রেশ' : '🔄 Refresh')
              }
            </button>
          </div>
        </div>

        <h1>{copy.title}</h1>
        <p className="dashboard-subtitle">{copy.description}</p>
        <div className="empty-state">
          <p>{copy.emptyState}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`impact-dashboard ${language === 'bn' ? 'bangla-font' : ''}`}>
      {/* Language Toggle and Refresh Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div className="language-toggle">
          <button
            className={`lang-btn ${language === 'bn' ? 'active' : ''}`}
            onClick={() => setLanguage('bn')}
            type="button"
          >
            বাংলা
          </button>
          <button
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
            type="button"
          >
            English
          </button>
        </div>
        
          {/* Refresh Button and Data Source Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {!supabaseStatus.isConfigured && (
              <span style={{ color: '#fbbf24', fontSize: '0.85rem' }} title={language === 'bn' ? 'Supabase কনফিগার করা হয়নি' : 'Supabase not configured'}>
                {language === 'bn' ? '⚠️ Supabase কনফিগার নেই' : '⚠️ Supabase not configured'}
              </span>
            )}
            {error && supabaseStatus.isConfigured && (
              <span style={{ color: '#f87171', fontSize: '0.85rem' }} title={error}>
                {language === 'bn' ? '⚠️ localStorage ব্যবহার করা হচ্ছে' : '⚠️ Using localStorage'}
              </span>
            )}
            {!error && !loading && supabaseStatus.isConfigured && (
              <span style={{ color: '#34d399', fontSize: '0.85rem' }}>
                {language === 'bn' ? '✅ Supabase থেকে ডেটা' : '✅ Data from Supabase'}
              </span>
            )}
            <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(96, 165, 250, 0.2)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              borderRadius: '8px',
              color: '#60a5fa',
              cursor: isRefreshing || loading ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              opacity: isRefreshing || loading ? 0.5 : 1,
            }}
            type="button"
          >
            {isRefreshing || loading 
              ? (language === 'bn' ? '🔄 লোড হচ্ছে...' : '🔄 Loading...')
              : (language === 'bn' ? '🔄 রিফ্রেশ' : '🔄 Refresh')
            }
          </button>
        </div>
      </div>

      <h1>{copy.title}</h1>
      <p className="dashboard-subtitle">
        {language === 'bn'
          ? `${validResponses.length}টি সার্ভে রেসপন্সের উপর বাস্তব মেট্রিক্সের ভিত্তিতে বিশ্লেষণ`
          : `Analyzing ${validResponses.length} survey response${validResponses.length !== 1 ? 's' : ''} against real-world metrics`}
      </p>

      {/* Executive Summary Section */}
      <div className="summary-section">
        <h2>{copy.executiveSummary}</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-label">{copy.kpis.overallSatisfaction}</div>
            <div className="summary-value">{overallSatisfactionScore.toFixed(1)}%</div>
            <div className="summary-description">
              {overallSatisfactionScore >= 70
                ? copy.kpiDescriptions.overallSatisfaction.high
                : overallSatisfactionScore >= 50
                ? copy.kpiDescriptions.overallSatisfaction.medium
                : copy.kpiDescriptions.overallSatisfaction.low}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">{copy.kpis.strongestModule}</div>
            <div className="summary-value">
              {strongestModule ? surveyCopyLang.options.modules[strongestModule.module as Module] || strongestModule.module : 'N/A'}
            </div>
            <div className="summary-description">
              {strongestModule
                ? (language === 'bn'
                    ? copy.kpiDescriptions.strongestModule.withScore.replace('{score}', strongestModule.score.toFixed(1))
                    : copy.kpiDescriptions.strongestModule.default.replace('{score}', strongestModule.score.toFixed(1)))
                : copy.kpiDescriptions.strongestModule.noData}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">{copy.kpis.weakestModule}</div>
            <div className="summary-value">
              {weakestModule ? surveyCopyLang.options.modules[weakestModule.module as Module] || weakestModule.module : 'N/A'}
            </div>
            <div className="summary-description">
              {weakestModule
                ? (language === 'bn'
                    ? copy.kpiDescriptions.weakestModule.withScore.replace('{score}', weakestModule.score.toFixed(1))
                    : copy.kpiDescriptions.weakestModule.default.replace('{score}', weakestModule.score.toFixed(1)))
                : copy.kpiDescriptions.weakestModule.noData}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">{copy.kpis.perceptionRealityGap}</div>
            <div className="summary-value">{averagePerceptionRealityGap.toFixed(1)}%</div>
            <div className="summary-description">
              {averagePerceptionRealityGap <= 10
                ? copy.kpiDescriptions.perceptionRealityGap.excellent
                : averagePerceptionRealityGap <= 20
                ? copy.kpiDescriptions.perceptionRealityGap.good
                : copy.kpiDescriptions.perceptionRealityGap.significant}
            </div>
          </div>
        </div>
      </div>

      {/* Chart 1: Overall Satisfaction (Donut) */}
      <div className="chart-container">
        <h2>{copy.charts.overallSatisfaction.title}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={satisfactionDonutData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              label={({ value }) => `${value.toFixed(1)}%`}
            >
              {satisfactionDonutData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? CHART_COLORS[0] : '#e0e0e0'} />
              ))}
            </Pie>
            <Tooltip />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="bold">
              {overallSatisfactionScore.toFixed(1)}%
            </text>
          </PieChart>
        </ResponsiveContainer>
        <p className="chart-insight">
          <strong>{language === 'bn' ? 'ব্যবসায়িক অন্তর্দৃষ্টি:' : 'Business Insight:'}</strong> {copy.charts.overallSatisfaction.insight}
        </p>
      </div>

      {/* Chart 2: Module Impact Bar Chart */}
      <div className="chart-container">
        <h2>{copy.charts.moduleImpact.title}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={moduleImpactBarData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="moduleName"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              label={{ value: copy.charts.moduleImpact.xAxisLabel, position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: copy.charts.moduleImpact.yAxisLabel, angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="custom-tooltip">
                      <p><strong>{data.fullModuleName}</strong></p>
                      <p>{language === 'bn' ? 'প্রভাব:' : 'Impact:'} {data.impactPercentage.toFixed(1)}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="impactPercentage" fill={CHART_COLORS[1]} name={copy.charts.moduleImpact.yAxisLabel} />
          </BarChart>
        </ResponsiveContainer>
        <p className="chart-insight">
          <strong>{language === 'bn' ? 'ব্যবসায়িক অন্তর্দৃষ্টি:' : 'Business Insight:'}</strong> {copy.charts.moduleImpact.insight}
        </p>
      </div>

      {/* Chart 3: Before vs After Time Chart */}
      <div className="chart-container">
        <h2>{copy.charts.timeComparison.title}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={timeComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="responseLabel"
              label={{ value: copy.charts.timeComparison.xAxisLabel, position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: copy.charts.timeComparison.yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="hoursBeforeOGRO" fill={CHART_COLORS[3]} name={copy.charts.timeComparison.beforeLabel} />
            <Bar dataKey="hoursAfterOGRO" fill={CHART_COLORS[1]} name={copy.charts.timeComparison.afterLabel} />
          </BarChart>
        </ResponsiveContainer>
        <p className="chart-insight">
          <strong>{language === 'bn' ? 'ব্যবসায়িক অন্তর্দৃষ্টি:' : 'Business Insight:'}</strong> {copy.charts.timeComparison.insight}
        </p>
      </div>

      {/* Chart 4: Perception vs Reality Dual Bar */}
      <div className="chart-container">
        <h2>{copy.charts.perceptionReality.title}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={perceptionVsRealityData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="moduleName"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              label={{ value: copy.charts.perceptionReality.xAxisLabel, position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: copy.charts.perceptionReality.yAxisLabel, angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="custom-tooltip">
                      <p><strong>{data.fullModuleName}</strong></p>
                      <p>{copy.charts.perceptionReality.surveyLabel}: {data.surveyImpactPercentage.toFixed(1)}%</p>
                      <p>{copy.charts.perceptionReality.realityLabel}: {data.realityScorePercentage.toFixed(1)}%</p>
                      <p>{language === 'bn' ? 'পার্থক্য:' : 'Gap:'} {Math.abs(data.surveyImpactPercentage - data.realityScorePercentage).toFixed(1)}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="surveyImpactPercentage" fill={CHART_COLORS[0]} name={copy.charts.perceptionReality.surveyLabel} />
            <Bar dataKey="realityScorePercentage" fill={CHART_COLORS[2]} name={copy.charts.perceptionReality.realityLabel} />
          </BarChart>
        </ResponsiveContainer>
        <p className="chart-insight">
          <strong>{language === 'bn' ? 'ব্যবসায়িক অন্তর্দৃষ্টি:' : 'Business Insight:'}</strong> {copy.charts.perceptionReality.insight}
        </p>
      </div>

      {/* Chart 5: Impact Alignment Scatter Plot */}
      <div className="chart-container">
        <h2>{copy.charts.alignmentAnalysis.title}</h2>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="surveyImpactPercentage"
              name={copy.charts.perceptionReality.surveyLabel}
              label={{ value: copy.charts.alignmentAnalysis.xAxisLabel, position: 'insideBottom', offset: -5 }}
              domain={[0, 100]}
            />
            <YAxis
              type="number"
              dataKey="realityScorePercentage"
              name={copy.charts.perceptionReality.realityLabel}
              label={{ value: copy.charts.alignmentAnalysis.yAxisLabel, angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <ReferenceLine x={50} stroke="#666" strokeDasharray="3 3" label={{ value: '50%', position: 'top' }} />
            <ReferenceLine y={50} stroke="#666" strokeDasharray="3 3" label={{ value: '50%', position: 'right' }} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  const quadrantText = 
                    data.quadrant === 'High–High' ? copy.charts.alignmentAnalysis.quadrants.highHigh
                    : data.quadrant === 'High–Low' ? copy.charts.alignmentAnalysis.quadrants.highLow
                    : data.quadrant === 'Low–High' ? copy.charts.alignmentAnalysis.quadrants.lowHigh
                    : copy.charts.alignmentAnalysis.quadrants.lowLow;
                  return (
                    <div className="custom-tooltip">
                      <p><strong>{data.fullModuleName}</strong></p>
                      <p>{copy.charts.perceptionReality.surveyLabel}: {data.surveyImpactPercentage.toFixed(1)}%</p>
                      <p>{copy.charts.perceptionReality.realityLabel}: {data.realityScorePercentage.toFixed(1)}%</p>
                      <p>{language === 'bn' ? 'কোয়াড্রেন্ট:' : 'Quadrant:'} {quadrantText}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter dataKey="realityScorePercentage" data={alignmentScatterData} fill={CHART_COLORS[4]}>
              {alignmentScatterData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="quadrant-labels">
          <div className="quadrant-label top-left">
            <strong>{language === 'bn' ? 'উচ্চ–কম:' : 'High–Low:'}</strong> {copy.charts.alignmentAnalysis.quadrants.highLow}
          </div>
          <div className="quadrant-label top-right">
            <strong>{language === 'bn' ? 'উচ্চ–উচ্চ:' : 'High–High:'}</strong> {copy.charts.alignmentAnalysis.quadrants.highHigh}
          </div>
          <div className="quadrant-label bottom-left">
            <strong>{language === 'bn' ? 'কম–কম:' : 'Low–Low:'}</strong> {copy.charts.alignmentAnalysis.quadrants.lowLow}
          </div>
          <div className="quadrant-label bottom-right">
            <strong>{language === 'bn' ? 'কম–উচ্চ:' : 'Low–High:'}</strong> {copy.charts.alignmentAnalysis.quadrants.lowHigh}
          </div>
        </div>
        <p className="chart-insight">
          <strong>{language === 'bn' ? 'ব্যবসায়িক অন্তর্দৃষ্টি:' : 'Business Insight:'}</strong> {copy.charts.alignmentAnalysis.insight}
        </p>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>{copy.footer.follow}</p>
          <a 
            href="https://github.com/MobinMithun" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>@MobinMithun</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
