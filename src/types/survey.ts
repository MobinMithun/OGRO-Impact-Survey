export type Role = 
  | 'Field Officer (FO)'
  | 'Area Manager (AM)'
  | 'Regional Manager (RM)'
  | 'Operations'
  | 'Finance & Accounts';

export type UsageDuration = 
  | '< 3 months'
  | '3–6 months'
  | '6–12 months'
  | '12+ months';

export type Module = 
  | 'Farmer Onboarding'
  | 'Bank Panel'
  | 'Input Panel'
  | 'Collection Panel'
  | 'Deposit & Bank Settlement'
  | 'ERP / Dashboards';

export type LikertScale = 1 | 2 | 3 | 4 | 5;

export type ImpactLevel = 1 | 2 | 3 | 4 | 5;

export type TimeBefore = 
  | '4–6 hrs'
  | '2–4 hrs'
  | '<2 hrs';

export type TimeAfter = 
  | '<1 hr'
  | '1–2 hrs'
  | '2+ hrs';

export type ErrorFrequencyBefore = 
  | 'Very high'
  | 'High'
  | 'Medium'
  | 'Low';

export type ErrorFrequencyAfter = 
  | 'Very low'
  | 'Low'
  | 'Medium';

export interface SurveyResponse {
  // Section A - Context
  role: Role | '';
  usageDuration: UsageDuration | '';
  modulesUsed: Module[];

  // Section B - Satisfaction (Likert 1-5)
  reducedManualWork: LikertScale | null;
  savesTimeDaily: LikertScale | null;
  dataAccuracyImproved: LikertScale | null;
  easierTracking: LikertScale | null;
  improvedEfficiency: LikertScale | null;

  // Section C - Module Impact Matrix
  moduleImpact: Record<Module, ImpactLevel | null>;

  // Section D - Before vs After
  timeSpentBefore: TimeBefore | '';
  timeSpentAfter: TimeAfter | '';
  errorFrequencyBefore: ErrorFrequencyBefore | '';
  errorFrequencyAfter: ErrorFrequencyAfter | '';

  // Section E - Confidence (Likert 1-5)
  trustOGROData: LikertScale | null;
  lessExcelWhatsApp: LikertScale | null;
  preferOGROOverOldTools: LikertScale | null;

  // Section F - Optional Text
  biggestImprovement: string;
  oneImprovementNeeded: string;
}

export const MODULES: Module[] = [
  'Farmer Onboarding',
  'Bank Panel',
  'Input Panel',
  'Collection Panel',
  'Deposit & Bank Settlement',
  'ERP / Dashboards',
];

export const ROLES: Role[] = [
  'Field Officer (FO)',
  'Area Manager (AM)',
  'Regional Manager (RM)',
  'Operations',
  'Finance & Accounts',
];

export const USAGE_DURATIONS: UsageDuration[] = [
  '< 3 months',
  '3–6 months',
  '6–12 months',
  '12+ months',
];

export const TIME_BEFORE_OPTIONS: TimeBefore[] = [
  '4–6 hrs',
  '2–4 hrs',
  '<2 hrs',
];

export const TIME_AFTER_OPTIONS: TimeAfter[] = [
  '<1 hr',
  '1–2 hrs',
  '2+ hrs',
];

export const ERROR_FREQUENCY_BEFORE_OPTIONS: ErrorFrequencyBefore[] = [
  'Very high',
  'High',
  'Medium',
  'Low',
];

export const ERROR_FREQUENCY_AFTER_OPTIONS: ErrorFrequencyAfter[] = [
  'Very low',
  'Low',
  'Medium',
];

