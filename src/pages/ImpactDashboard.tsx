import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
} from 'recharts';
import { useSurvey } from '../context/SurveyContext';
import {
  calculateOSS,
  calculateModuleImpact,
  calculateImpactAlignment,
  calculateTimeSavedNumeric,
  calculateErrorReductionNumeric,
  calculateCollectionEfficiency,
  calculateRealityScore,
} from '../utils/metrics';
import { Module, MODULES } from '../types/survey';

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

  return {
    'Farmer Onboarding': onboardingRealityScore,
    'Bank Panel': bankRealityScore,
    'Input Panel': inputRealityScore,
    'Collection Panel': collectionRealityScore,
    'Deposit & Bank Settlement': depositRealityScore,
    'ERP / Dashboards': erpRealityScore,
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
function determineAlignmentQuadrant(surveyImpactPercentage: number, realityScorePercentage: number): string {
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
  const { responses } = useSurvey();
  const moduleRealityScores = calculateModuleRealityScores();

  // Calculate key metrics from survey responses
  const overallSatisfactionScore = calculateOSS(responses);
  const moduleImpactScores = calculateModuleImpact(responses);

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
    .map((module) => ({
      moduleName: module.length > 20 ? module.substring(0, 20) + '...' : module,
      fullModuleName: module,
      impactPercentage: moduleImpactScores[module],
    }))
    .filter((item) => item.impactPercentage > 0);

  // Chart 3: Before vs After Time Comparison
  const timeComparisonData = responses
    .filter((response) => response.timeSpentBefore && response.timeSpentAfter)
    .map((response, index) => ({
      responseLabel: `Response ${index + 1}`,
      hoursBeforeOGRO: convertTimeStringToHours(response.timeSpentBefore),
      hoursAfterOGRO: convertTimeStringToHours(response.timeSpentAfter),
    }));

  // Chart 4: Perception vs Reality Comparison
  const perceptionVsRealityData = MODULES
    .map((module) => ({
      moduleName: module.length > 15 ? module.substring(0, 15) + '...' : module,
      fullModuleName: module,
      surveyImpactPercentage: moduleImpactScores[module],
      realityScorePercentage: moduleRealityScores[module],
    }))
    .filter((item) => item.surveyImpactPercentage > 0 || item.realityScorePercentage > 0);

  // Chart 5: Impact Alignment Scatter Plot
  const alignmentScatterData = MODULES
    .map((module) => {
      const surveyImpactPercentage = moduleImpactScores[module];
      const realityScorePercentage = moduleRealityScores[module];
      const alignmentScore = calculateImpactAlignment(
        (surveyImpactPercentage / 100) * 5, // Convert 0-100 to 1-5 scale for function
        realityScorePercentage
      );
      return {
        moduleName: module.length > 15 ? module.substring(0, 15) + '...' : module,
        fullModuleName: module,
        surveyImpactPercentage,
        realityScorePercentage,
        alignmentScore,
        quadrant: determineAlignmentQuadrant(surveyImpactPercentage, realityScorePercentage),
      };
    })
    .filter((item) => item.surveyImpactPercentage > 0 || item.realityScorePercentage > 0);

  return (
    <div className="impact-dashboard">
      <h1>OGRO Impact Dashboard</h1>
      <p className="dashboard-subtitle">
        Analyzing {responses.length} survey response{responses.length !== 1 ? 's' : ''} against real-world metrics
      </p>

      {/* Executive Summary Section */}
      <div className="summary-section">
        <h2>Executive Summary</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-label">Overall Satisfaction</div>
            <div className="summary-value">{overallSatisfactionScore.toFixed(1)}%</div>
            <div className="summary-description">
              {overallSatisfactionScore >= 70
                ? 'Strong user satisfaction across all key impact areas'
                : overallSatisfactionScore >= 50
                ? 'Moderate satisfaction with room for improvement'
                : 'Low satisfaction - requires immediate attention'}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Strongest Module</div>
            <div className="summary-value">
              {strongestModule ? strongestModule.module : 'N/A'}
            </div>
            <div className="summary-description">
              {strongestModule
                ? `Highest perceived impact at ${strongestModule.score.toFixed(1)}%`
                : 'No survey data available'}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Weakest Module</div>
            <div className="summary-value">
              {weakestModule ? weakestModule.module : 'N/A'}
            </div>
            <div className="summary-description">
              {weakestModule
                ? `Lowest perceived impact at ${weakestModule.score.toFixed(1)}% - needs focus`
                : 'No survey data available'}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Perception vs Reality Gap</div>
            <div className="summary-value">{averagePerceptionRealityGap.toFixed(1)}%</div>
            <div className="summary-description">
              {averagePerceptionRealityGap <= 10
                ? 'Excellent alignment - users accurately perceive impact'
                : averagePerceptionRealityGap <= 20
                ? 'Good alignment with minor gaps to address'
                : 'Significant gap - review communication and training'}
            </div>
          </div>
        </div>
      </div>

      {/* Chart 1: Overall Satisfaction (Donut) */}
      <div className="chart-container">
        <h2>1. Overall Satisfaction Score (OSS)</h2>
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
              {satisfactionDonutData.map((entry, index) => (
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
          <strong>Business Insight:</strong> The Overall Satisfaction Score aggregates user perceptions across five critical impact areas:
          reduced manual work, daily time savings, improved data accuracy, easier tracking, and overall efficiency gains.
          Scores above 70% indicate strong user satisfaction and validate OGRO's value proposition. Lower scores suggest
          areas where additional training, feature improvements, or communication may be needed to maximize perceived value.
        </p>
      </div>

      {/* Chart 2: Module Impact Bar Chart */}
      <div className="chart-container">
        <h2>2. Module Impact (Survey Responses)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={moduleImpactBarData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="moduleName"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              label={{ value: 'OGRO Modules', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Survey Impact %', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="custom-tooltip">
                      <p><strong>{data.fullModuleName}</strong></p>
                      <p>Impact: {data.impactPercentage.toFixed(1)}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="impactPercentage" fill={CHART_COLORS[1]} name="Impact %" />
          </BarChart>
        </ResponsiveContainer>
        <p className="chart-insight">
          <strong>Business Insight:</strong> This visualization shows the average perceived impact of each OGRO module based on
          user survey responses. Higher bars indicate modules where users report stronger positive impact, suggesting successful
          adoption and value realization. Modules with lower scores may benefit from targeted training, feature enhancements, or
          better communication about their benefits. This data helps prioritize which modules to promote, improve, or provide
          additional support for.
        </p>
      </div>

      {/* Chart 3: Before vs After Time Chart */}
      <div className="chart-container">
        <h2>3. Time Spent: Before vs After OGRO</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={timeComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="responseLabel"
              label={{ value: 'Survey Responses', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Hours Spent', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="hoursBeforeOGRO" fill={CHART_COLORS[3]} name="Before OGRO" />
            <Bar dataKey="hoursAfterOGRO" fill={CHART_COLORS[1]} name="After OGRO" />
          </BarChart>
        </ResponsiveContainer>
        <p className="chart-insight">
          <strong>Business Insight:</strong> This comparison demonstrates the tangible time savings achieved through OGRO implementation.
          The reduction in time spent (difference between bars) quantifies efficiency gains and validates the ROI of the platform.
          Consistent reductions across multiple responses indicate reliable, measurable time savings. This data is valuable for
          demonstrating value to stakeholders, justifying continued investment, and identifying which workflows benefit most
          from automation.
        </p>
      </div>

      {/* Chart 4: Perception vs Reality Dual Bar */}
      <div className="chart-container">
        <h2>4. Perception vs Reality</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={perceptionVsRealityData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="moduleName"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              label={{ value: 'OGRO Modules', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Impact %', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="custom-tooltip">
                      <p><strong>{data.fullModuleName}</strong></p>
                      <p>Survey Impact: {data.surveyImpactPercentage.toFixed(1)}%</p>
                      <p>Reality Score: {data.realityScorePercentage.toFixed(1)}%</p>
                      <p>Gap: {Math.abs(data.surveyImpactPercentage - data.realityScorePercentage).toFixed(1)}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="surveyImpactPercentage" fill={CHART_COLORS[0]} name="Survey Impact (Perception)" />
            <Bar dataKey="realityScorePercentage" fill={CHART_COLORS[2]} name="Reality Score (Metrics)" />
          </BarChart>
        </ResponsiveContainer>
        <p className="chart-insight">
          <strong>Business Insight:</strong> This critical comparison reveals alignment between user perceptions (from surveys) and
          actual measured impact (from system analytics). When bars are similar, user perceptions accurately reflect reality,
          indicating good communication and user awareness. Large gaps suggest opportunities: when perception is higher than reality,
          users may be overestimating value (training needed). When reality exceeds perception, users may be undervaluing the system
          (communication/training gap). This analysis helps identify where to invest in user education, feature promotion, or
          product improvements.
        </p>
      </div>

      {/* Chart 5: Impact Alignment Scatter Plot */}
      <div className="chart-container">
        <h2>5. Impact Alignment Analysis</h2>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="surveyImpactPercentage"
              name="Survey Impact"
              label={{ value: 'Survey Impact % (User Perception)', position: 'insideBottom', offset: -5 }}
              domain={[0, 100]}
            />
            <YAxis
              type="number"
              dataKey="realityScorePercentage"
              name="Reality Score"
              label={{ value: 'Reality Score % (Measured Impact)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <ReferenceLine x={50} stroke="#666" strokeDasharray="3 3" label={{ value: '50%', position: 'top' }} />
            <ReferenceLine y={50} stroke="#666" strokeDasharray="3 3" label={{ value: '50%', position: 'right' }} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="custom-tooltip">
                      <p><strong>{data.fullModuleName}</strong></p>
                      <p>Survey Impact: {data.surveyImpactPercentage.toFixed(1)}%</p>
                      <p>Reality Score: {data.realityScorePercentage.toFixed(1)}%</p>
                      <p>Quadrant: {data.quadrant}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter dataKey="realityScorePercentage" data={alignmentScatterData} fill={CHART_COLORS[4]}>
              {alignmentScatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="quadrant-labels">
          <div className="quadrant-label top-left">
            <strong>High–Low:</strong> Training gap (users don't see the value despite strong metrics)
          </div>
          <div className="quadrant-label top-right">
            <strong>High–High:</strong> Strong success (perception matches reality - ideal state)
          </div>
          <div className="quadrant-label bottom-left">
            <strong>Low–Low:</strong> Product issue (needs improvement in both perception and reality)
          </div>
          <div className="quadrant-label bottom-right">
            <strong>Low–High:</strong> UX / comms gap (value exists but not communicated effectively)
          </div>
        </div>
        <p className="chart-insight">
          <strong>Business Insight:</strong> This strategic scatter plot maps each module's position based on survey perception
          (X-axis) and measured reality (Y-axis). Points in the top-right quadrant (High–High) represent successful modules where
          both perception and reality are strong - these are success stories to replicate. The other quadrants highlight areas
          needing targeted intervention: High–Low suggests training gaps where users don't recognize value, Low–High indicates
          communication gaps where value exists but isn't perceived, and Low–Low signals product issues requiring feature improvements.
          This visualization helps leadership prioritize resource allocation across training, communication, and product development.
        </p>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>Follow me on GitHub</p>
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
