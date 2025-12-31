import { SurveyResponse, Module, LikertScale } from '../types/survey';

/**
 * Converts time string to numeric hours (midpoint of range)
 * Used for time-based calculations
 */
function timeToHours(time: string): number {
  if (time.includes('4–6')) return 5; // Midpoint of 4-6
  if (time.includes('2–4')) return 3; // Midpoint of 2-4
  if (time.includes('1–2')) return 1.5; // Midpoint of 1-2
  if (time === '<2 hrs') return 1; // Conservative estimate
  if (time === '<1 hr') return 0.5; // Conservative estimate
  if (time === '2+ hrs') return 3; // Conservative estimate
  return 0;
}

/**
 * Converts error frequency string to numeric score (higher = more errors)
 * Used for error reduction calculations
 */
function errorFrequencyToScore(frequency: string): number {
  if (frequency === 'Very high') return 4;
  if (frequency === 'High') return 3;
  if (frequency === 'Medium') return 2;
  if (frequency === 'Low') return 1;
  if (frequency === 'Very low') return 0.5;
  return 0;
}

/**
 * Calculates Overall Satisfaction Score (OSS)
 * 
 * Business Insight: This metric aggregates user satisfaction across five critical impact dimensions,
 * providing a single score that represents overall user perception of OGRO's value. Scores above 70%
 * indicate strong satisfaction and validate the platform's value proposition. Lower scores suggest
 * areas where additional training, feature improvements, or communication may be needed.
 * 
 * Calculation: Averages Q4–Q8 (Likert scale 1–5) and converts to 0–100 scale
 * - Q4: Reduced manual work
 * - Q5: Saves time daily
 * - Q6: Data accuracy improved
 * - Q7: Easier tracking & follow-ups
 * - Q8: Improved overall efficiency
 * 
 * @param responses Array of survey responses
 * @returns OSS score from 0 to 100
 */
export function calculateOSS(responses: SurveyResponse[]): number {
  if (responses.length === 0) return 0;

  let totalScore = 0;
  let validResponses = 0;

  responses.forEach((response) => {
    const scores: (LikertScale | null)[] = [
      response.reducedManualWork,    // Q4
      response.savesTimeDaily,        // Q5
      response.dataAccuracyImproved,  // Q6
      response.easierTracking,        // Q7
      response.improvedEfficiency,    // Q8
    ];

    // Calculate average for this response (only if all questions answered)
    const validScores = scores.filter((s): s is LikertScale => s !== null);
    if (validScores.length === 5) {
      const avg = validScores.reduce((sum, score) => sum + score, 0) / 5;
      totalScore += avg;
      validResponses++;
    }
  });

  if (validResponses === 0) return 0;

  // Average across all responses, then convert 1-5 scale to 0-100
  // Formula: ((avg - 1) / 4) * 100
  const averageScore = totalScore / validResponses;
  return ((averageScore - 1) / 4) * 100;
}

/**
 * Calculates average impact score per module across all responses
 * 
 * Business Insight: This metric identifies which OGRO modules users perceive as having the strongest
 * impact. Higher scores indicate successful adoption and value realization. Modules with lower scores
 * may benefit from targeted training, feature enhancements, or better communication about their benefits.
 * This data helps prioritize which modules to promote, improve, or provide additional support for.
 * 
 * @param responses Array of survey responses
 * @returns Object mapping each module to its average impact percentage (0-100)
 */
export function calculateModuleImpact(
  responses: SurveyResponse[]
): Record<Module, number> {
  const moduleTotals: Record<Module, { sum: number; count: number }> = {
    'Farmer Onboarding': { sum: 0, count: 0 },
    'Bank Panel': { sum: 0, count: 0 },
    'Input Panel': { sum: 0, count: 0 },
    'Collection Panel': { sum: 0, count: 0 },
    'Deposit & Bank Settlement': { sum: 0, count: 0 },
    'ERP / Dashboards': { sum: 0, count: 0 },
  };

  // Sum up impact scores for each module
  responses.forEach((response) => {
    response.modulesUsed.forEach((module) => {
      const impact = response.moduleImpact[module];
      if (impact !== null) {
        moduleTotals[module].sum += impact;
        moduleTotals[module].count++;
      }
    });
  });

  // Calculate average per module and convert to percentage (1-5 scale to 0-100)
  const result: Record<Module, number> = {
    'Farmer Onboarding': 0,
    'Bank Panel': 0,
    'Input Panel': 0,
    'Collection Panel': 0,
    'Deposit & Bank Settlement': 0,
    'ERP / Dashboards': 0,
  };

  Object.keys(moduleTotals).forEach((module) => {
    const { sum, count } = moduleTotals[module as Module];
    if (count > 0) {
      const avg = sum / count;
      // Convert 1-5 scale to 0-100 percentage
      result[module as Module] = ((avg - 1) / 4) * 100;
    }
  });

  return result;
}

/**
 * Calculates time saved percentage
 * Formula: ((before - after) / before) * 100
 * 
 * @param before Time spent before (string format)
 * @param after Time spent after (string format)
 * @returns Percentage of time saved (0-100)
 */
export function calculateTimeSaved(
  before: string,
  after: string
): number {
  if (!before || !after) return 0;

  const beforeHours = timeToHours(before);
  const afterHours = timeToHours(after);

  if (beforeHours === 0) return 0;

  // Formula: ((before - after) / before) * 100
  const saved = ((beforeHours - afterHours) / beforeHours) * 100;
  
  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, saved));
}

/**
 * Calculates error reduction percentage
 * Uses the same formula as time saved: ((before - after) / before) * 100
 * 
 * @param before Error frequency before (string format)
 * @param after Error frequency after (string format)
 * @returns Percentage of error reduction (0-100)
 */
export function calculateErrorReduction(
  before: string,
  after: string
): number {
  if (!before || !after) return 0;

  const beforeScore = errorFrequencyToScore(before);
  const afterScore = errorFrequencyToScore(after);

  if (beforeScore === 0) return 0;

  // Formula: ((before - after) / before) * 100
  const reduction = ((beforeScore - afterScore) / beforeScore) * 100;
  
  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, reduction));
}

/**
 * Calculates time saved percentage from numeric values
 * Formula: ((before - after) / before) * 100
 * 
 * @param beforeHours Time spent before (in hours)
 * @param afterHours Time spent after (in hours)
 * @returns Percentage of time saved (0-100)
 */
export function calculateTimeSavedNumeric(
  beforeHours: number,
  afterHours: number
): number {
  if (beforeHours === 0 || beforeHours < 0 || afterHours < 0) return 0;

  // Formula: ((before - after) / before) * 100
  const saved = ((beforeHours - afterHours) / beforeHours) * 100;
  
  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, saved));
}

/**
 * Calculates error reduction percentage from numeric error rates
 * Formula: ((before - after) / before) * 100
 * 
 * @param beforeRate Error rate before (0-1 scale, e.g., 0.20 = 20%)
 * @param afterRate Error rate after (0-1 scale, e.g., 0.03 = 3%)
 * @returns Percentage of error reduction (0-100)
 */
export function calculateErrorReductionNumeric(
  beforeRate: number,
  afterRate: number
): number {
  if (beforeRate === 0 || beforeRate < 0 || afterRate < 0) return 0;

  // Formula: ((before - after) / before) * 100
  const reduction = ((beforeRate - afterRate) / beforeRate) * 100;
  
  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, reduction));
}

/**
 * Calculates collection efficiency percentage
 * Formula: (collected / due) * 100
 * 
 * @param collected Amount collected
 * @param due Amount due
 * @returns Efficiency percentage (0-100, can exceed 100 if over-collected)
 */
export function calculateCollectionEfficiency(
  collected: number,
  due: number
): number {
  if (due === 0) return 0;

  // Formula: (collected / due) * 100
  return (collected / due) * 100;
}

/**
 * Interface for reality metrics
 * Contains efficiency gains that need to be normalized
 */
export interface RealityMetrics {
  timeSaved?: number;
  errorReduction?: number;
  collectionEfficiency?: number;
  [key: string]: number | undefined;
}

/**
 * Calculates reality score by normalizing all efficiency gains to 0-100
 * and averaging them per module
 * 
 * This function takes various efficiency metrics, normalizes them to 0-100 scale,
 * and returns the average as a single reality score
 * 
 * @param metrics Object containing efficiency metrics (timeSaved, errorReduction, etc.)
 * @returns Normalized reality score from 0 to 100
 */
export function calculateRealityScore(metrics: RealityMetrics): number {
  const values: number[] = [];

  // Collect all numeric values from metrics object
  Object.values(metrics).forEach((value) => {
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
      // Normalize to 0-100 range (clamp values that exceed 100)
      const normalized = Math.max(0, Math.min(100, value));
      values.push(normalized);
    }
  });

  if (values.length === 0) return 0;

  // Average all normalized efficiency gains
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculates impact alignment score
 * 
 * Business Insight: This metric reveals the gap between user perception (from surveys) and actual
 * measured impact (from analytics). When alignment is close to zero, user perceptions accurately
 * reflect reality, indicating good communication and user awareness. Positive values suggest users
 * may be overestimating value (training needed). Negative values indicate users may be undervaluing
 * the system (communication/training gap). This analysis helps identify where to invest in user
 * education, feature promotion, or product improvements.
 * 
 * Formula: ((surveyScore / 5) * 100) - realityScore
 * - Positive values: Survey scores higher than reality (optimism)
 * - Negative values: Reality exceeds survey scores (conservative responses)
 * 
 * @param surveyScore Survey satisfaction score on 1-5 Likert scale
 * @param realityScore Reality-based efficiency score (0-100)
 * @returns Alignment score (can be negative or positive)
 */
export function calculateImpactAlignment(
  surveyScore: number,
  realityScore: number
): number {
  // Convert survey score (1-5) to 0-100 scale
  const surveyPercentage = (surveyScore / 5) * 100;
  
  // Formula: ((surveyScore / 5) * 100) - realityScore
  return surveyPercentage - realityScore;
}

