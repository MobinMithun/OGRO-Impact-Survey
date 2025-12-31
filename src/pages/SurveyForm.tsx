import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SurveyResponse,
  Role,
  UsageDuration,
  Module,
  LikertScale,
  ImpactLevel,
  TimeBefore,
  TimeAfter,
  ErrorFrequencyBefore,
  ErrorFrequencyAfter,
  MODULES,
  ROLES,
  USAGE_DURATIONS,
  TIME_BEFORE_OPTIONS,
  TIME_AFTER_OPTIONS,
  ERROR_FREQUENCY_BEFORE_OPTIONS,
  ERROR_FREQUENCY_AFTER_OPTIONS,
} from '../types/survey';

const initialFormData: SurveyResponse = {
  role: '',
  usageDuration: '',
  modulesUsed: [],
  reducedManualWork: null,
  savesTimeDaily: null,
  dataAccuracyImproved: null,
  easierTracking: null,
  improvedEfficiency: null,
  moduleImpact: {
    'Farmer Onboarding': null,
    'Bank Panel': null,
    'Input Panel': null,
    'Collection Panel': null,
    'Deposit & Bank Settlement': null,
    'ERP / Dashboards': null,
  },
  timeSpentBefore: '',
  timeSpentAfter: '',
  errorFrequencyBefore: '',
  errorFrequencyAfter: '',
  trustOGROData: null,
  lessExcelWhatsApp: null,
  preferOGROOverOldTools: null,
  biggestImprovement: '',
  oneImprovementNeeded: '',
};

export default function SurveyForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SurveyResponse>(initialFormData);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Section A - Required
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.usageDuration) newErrors.usageDuration = 'Usage duration is required';
    if (formData.modulesUsed.length === 0) {
      newErrors.modulesUsed = 'At least one module must be selected';
    }

    // Section B - Required (Likert 1-5)
    if (formData.reducedManualWork === null) newErrors.reducedManualWork = 'Required';
    if (formData.savesTimeDaily === null) newErrors.savesTimeDaily = 'Required';
    if (formData.dataAccuracyImproved === null) newErrors.dataAccuracyImproved = 'Required';
    if (formData.easierTracking === null) newErrors.easierTracking = 'Required';
    if (formData.improvedEfficiency === null) newErrors.improvedEfficiency = 'Required';

    // Section C - Module Impact Matrix (required for selected modules)
    formData.modulesUsed.forEach((module) => {
      if (formData.moduleImpact[module] === null) {
        newErrors[`moduleImpact_${module}`] = 'Impact level required';
      }
    });

    // Section D - Required
    if (!formData.timeSpentBefore) newErrors.timeSpentBefore = 'Required';
    if (!formData.timeSpentAfter) newErrors.timeSpentAfter = 'Required';
    if (!formData.errorFrequencyBefore) newErrors.errorFrequencyBefore = 'Required';
    if (!formData.errorFrequencyAfter) newErrors.errorFrequencyAfter = 'Required';

    // Section E - Required (Likert 1-5)
    if (formData.trustOGROData === null) newErrors.trustOGROData = 'Required';
    if (formData.lessExcelWhatsApp === null) newErrors.lessExcelWhatsApp = 'Required';
    if (formData.preferOGROOverOldTools === null) newErrors.preferOGROOverOldTools = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Store response in local state
    setResponses([...responses, formData]);
    
    // Redirect to /impact
    navigate('/impact');
  };

  const handleModuleToggle = (module: Module) => {
    setFormData((prev) => ({
      ...prev,
      modulesUsed: prev.modulesUsed.includes(module)
        ? prev.modulesUsed.filter((m) => m !== module)
        : [...prev.modulesUsed, module],
      moduleImpact: prev.modulesUsed.includes(module)
        ? { ...prev.moduleImpact, [module]: null }
        : prev.moduleImpact,
    }));
  };

  const handleLikertChange = (field: keyof SurveyResponse, value: LikertScale) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImpactChange = (module: Module, value: ImpactLevel) => {
    setFormData((prev) => ({
      ...prev,
      moduleImpact: { ...prev.moduleImpact, [module]: value },
    }));
    const errorKey = `moduleImpact_${module}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleInputChange = (
    field: keyof SurveyResponse,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="survey-form-container">
      <h1>OGRO Impact Survey</h1>
      <form onSubmit={handleSubmit}>
        {/* SECTION A — CONTEXT */}
        <section className="survey-section">
          <h2>Section A — Context</h2>
          
          <div className="form-group">
            <label htmlFor="role">
              1. Role <span className="required">*</span>
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className={errors.role ? 'error' : ''}
            >
              <option value="">Select role...</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="usageDuration">
              2. Usage Duration <span className="required">*</span>
            </label>
            <select
              id="usageDuration"
              value={formData.usageDuration}
              onChange={(e) => handleInputChange('usageDuration', e.target.value)}
              className={errors.usageDuration ? 'error' : ''}
            >
              <option value="">Select duration...</option>
              {USAGE_DURATIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
            {errors.usageDuration && (
              <span className="error-message">{errors.usageDuration}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              3. Modules Used <span className="required">*</span>
            </label>
            <div className="checkbox-group">
              {MODULES.map((module) => (
                <label key={module} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.modulesUsed.includes(module)}
                    onChange={() => handleModuleToggle(module)}
                  />
                  <span>{module}</span>
                </label>
              ))}
            </div>
            {errors.modulesUsed && (
              <span className="error-message">{errors.modulesUsed}</span>
            )}
          </div>
        </section>

        {/* SECTION B — SATISFACTION */}
        <section className="survey-section">
          <h2>Section B — Satisfaction</h2>
          <p className="section-description">Rate each statement on a scale of 1–5 (1 = Strongly Disagree, 5 = Strongly Agree)</p>

          {[
            { key: 'reducedManualWork', label: '4. Reduced manual work' },
            { key: 'savesTimeDaily', label: '5. Saves time daily' },
            { key: 'dataAccuracyImproved', label: '6. Data accuracy improved' },
            { key: 'easierTracking', label: '7. Easier tracking & follow-ups' },
            { key: 'improvedEfficiency', label: '8. Improved overall efficiency' },
          ].map(({ key, label }) => (
            <div key={key} className="form-group">
              <label>{label} <span className="required">*</span></label>
              <div className="likert-scale">
                {([1, 2, 3, 4, 5] as LikertScale[]).map((value) => (
                  <label key={value} className="likert-option">
                    <input
                      type="radio"
                      name={key}
                      value={value}
                      checked={formData[key as keyof SurveyResponse] === value}
                      onChange={() => handleLikertChange(key as keyof SurveyResponse, value)}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
              {errors[key] && (
                <span className="error-message">{errors[key]}</span>
              )}
            </div>
          ))}
        </section>

        {/* SECTION C — MODULE IMPACT MATRIX */}
        <section className="survey-section">
          <h2>Section C — Module Impact Matrix</h2>
          <p className="section-description">
            Rate the impact of each module you use (1 = No impact, 5 = Very high impact)
          </p>
          <div className="impact-matrix">
            <table>
              <thead>
                <tr>
                  <th>Module</th>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                  <th>4</th>
                  <th>5</th>
                </tr>
              </thead>
              <tbody>
                {MODULES.map((module) => {
                  if (!formData.modulesUsed.includes(module)) return null;
                  return (
                    <tr key={module}>
                      <td>{module}</td>
                      {([1, 2, 3, 4, 5] as ImpactLevel[]).map((value) => (
                        <td key={value}>
                          <input
                            type="radio"
                            name={`impact_${module}`}
                            checked={formData.moduleImpact[module] === value}
                            onChange={() => handleImpactChange(module, value)}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {formData.modulesUsed.length === 0 && (
              <p className="info-message">Select modules in Section A to rate their impact</p>
            )}
            {formData.modulesUsed.map((module) => {
              const errorKey = `moduleImpact_${module}`;
              return errors[errorKey] ? (
                <span key={errorKey} className="error-message">
                  {module}: {errors[errorKey]}
                </span>
              ) : null;
            })}
          </div>
        </section>

        {/* SECTION D — BEFORE VS AFTER */}
        <section className="survey-section">
          <h2>Section D — Before vs After</h2>

          <div className="form-group">
            <label htmlFor="timeSpentBefore">
              9. Time spent BEFORE OGRO <span className="required">*</span>
            </label>
            <select
              id="timeSpentBefore"
              value={formData.timeSpentBefore}
              onChange={(e) => handleInputChange('timeSpentBefore', e.target.value)}
              className={errors.timeSpentBefore ? 'error' : ''}
            >
              <option value="">Select...</option>
              {TIME_BEFORE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.timeSpentBefore && (
              <span className="error-message">{errors.timeSpentBefore}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="timeSpentAfter">
              10. Time spent AFTER OGRO <span className="required">*</span>
            </label>
            <select
              id="timeSpentAfter"
              value={formData.timeSpentAfter}
              onChange={(e) => handleInputChange('timeSpentAfter', e.target.value)}
              className={errors.timeSpentAfter ? 'error' : ''}
            >
              <option value="">Select...</option>
              {TIME_AFTER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.timeSpentAfter && (
              <span className="error-message">{errors.timeSpentAfter}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="errorFrequencyBefore">
              11. Error frequency BEFORE <span className="required">*</span>
            </label>
            <select
              id="errorFrequencyBefore"
              value={formData.errorFrequencyBefore}
              onChange={(e) => handleInputChange('errorFrequencyBefore', e.target.value)}
              className={errors.errorFrequencyBefore ? 'error' : ''}
            >
              <option value="">Select...</option>
              {ERROR_FREQUENCY_BEFORE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.errorFrequencyBefore && (
              <span className="error-message">{errors.errorFrequencyBefore}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="errorFrequencyAfter">
              12. Error frequency AFTER <span className="required">*</span>
            </label>
            <select
              id="errorFrequencyAfter"
              value={formData.errorFrequencyAfter}
              onChange={(e) => handleInputChange('errorFrequencyAfter', e.target.value)}
              className={errors.errorFrequencyAfter ? 'error' : ''}
            >
              <option value="">Select...</option>
              {ERROR_FREQUENCY_AFTER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.errorFrequencyAfter && (
              <span className="error-message">{errors.errorFrequencyAfter}</span>
            )}
          </div>
        </section>

        {/* SECTION E — CONFIDENCE */}
        <section className="survey-section">
          <h2>Section E — Confidence</h2>
          <p className="section-description">Rate each statement on a scale of 1–5 (1 = Strongly Disagree, 5 = Strongly Agree)</p>

          {[
            { key: 'trustOGROData', label: '13. Trust OGRO data' },
            { key: 'lessExcelWhatsApp', label: '14. Less Excel / WhatsApp usage' },
            { key: 'preferOGROOverOldTools', label: '15. Prefer OGRO over old tools' },
          ].map(({ key, label }) => (
            <div key={key} className="form-group">
              <label>{label} <span className="required">*</span></label>
              <div className="likert-scale">
                {([1, 2, 3, 4, 5] as LikertScale[]).map((value) => (
                  <label key={value} className="likert-option">
                    <input
                      type="radio"
                      name={key}
                      value={value}
                      checked={formData[key as keyof SurveyResponse] === value}
                      onChange={() => handleLikertChange(key as keyof SurveyResponse, value)}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
              {errors[key] && (
                <span className="error-message">{errors[key]}</span>
              )}
            </div>
          ))}
        </section>

        {/* SECTION F — OPTIONAL TEXT */}
        <section className="survey-section">
          <h2>Section F — Optional Feedback</h2>

          <div className="form-group">
            <label htmlFor="biggestImprovement">
              16. Biggest improvement
            </label>
            <textarea
              id="biggestImprovement"
              value={formData.biggestImprovement}
              onChange={(e) => handleInputChange('biggestImprovement', e.target.value)}
              rows={4}
              placeholder="Share the biggest improvement you've experienced..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="oneImprovementNeeded">
              17. One improvement needed
            </label>
            <textarea
              id="oneImprovementNeeded"
              value={formData.oneImprovementNeeded}
              onChange={(e) => handleInputChange('oneImprovementNeeded', e.target.value)}
              rows={4}
              placeholder="What's one thing you'd like to see improved?"
            />
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Submit Survey
          </button>
        </div>
      </form>
    </div>
  );
}

