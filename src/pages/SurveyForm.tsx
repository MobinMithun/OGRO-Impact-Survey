import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../context/SurveyContext';
import { Language, surveyCopy } from '../data/surveyCopy';
import {
  ERROR_FREQUENCY_AFTER_OPTIONS,
  ERROR_FREQUENCY_BEFORE_OPTIONS,
  ImpactLevel,
  LikertScale,
  Module,
  MODULES,
  ROLES,
  SurveyResponse,
  TIME_AFTER_OPTIONS,
  TIME_BEFORE_OPTIONS,
  USAGE_DURATIONS
} from '../types/survey';

const initialFormData: SurveyResponse = {
  name: '',
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
    'Field Force Monitoring': null,
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
  const { addResponse } = useSurvey();
  const [language, setLanguage] = useState<Language>('bn'); // Default: Bangla
  const [formData, setFormData] = useState<SurveyResponse>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [missingFieldsCount, setMissingFieldsCount] = useState(0);

  const copy = surveyCopy[language];

  const validateForm = (): { isValid: boolean; errorCount: number } => {
    const newErrors: Record<string, string> = {};

    // Name - Required
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = copy.form.validation.name;
    }

    // Section A - Required
    if (!formData.role) newErrors.role = copy.form.validation.role;
    if (!formData.usageDuration) newErrors.usageDuration = copy.form.validation.usageDuration;
    if (formData.modulesUsed.length === 0) {
      newErrors.modulesUsed = copy.form.validation.modulesUsed;
    }

    // Section B - Required (Likert 1-5)
    if (formData.reducedManualWork === null) newErrors.reducedManualWork = copy.form.validation.required;
    if (formData.savesTimeDaily === null) newErrors.savesTimeDaily = copy.form.validation.required;
    if (formData.dataAccuracyImproved === null) newErrors.dataAccuracyImproved = copy.form.validation.required;
    if (formData.easierTracking === null) newErrors.easierTracking = copy.form.validation.required;
    if (formData.improvedEfficiency === null) newErrors.improvedEfficiency = copy.form.validation.required;

    // Section C - Module Impact Matrix (required for selected modules)
    formData.modulesUsed.forEach((module) => {
      if (formData.moduleImpact[module] === null) {
        newErrors[`moduleImpact_${module}`] = copy.form.validation.moduleImpact;
      }
    });

    // Section D - Required
    if (!formData.timeSpentBefore) newErrors.timeSpentBefore = copy.form.validation.required;
    if (!formData.timeSpentAfter) newErrors.timeSpentAfter = copy.form.validation.required;
    if (!formData.errorFrequencyBefore) newErrors.errorFrequencyBefore = copy.form.validation.required;
    if (!formData.errorFrequencyAfter) newErrors.errorFrequencyAfter = copy.form.validation.required;

    // Section E - Required (Likert 1-5)
    if (formData.trustOGROData === null) newErrors.trustOGROData = copy.form.validation.required;
    if (formData.lessExcelWhatsApp === null) newErrors.lessExcelWhatsApp = copy.form.validation.required;
    if (formData.preferOGROOverOldTools === null) newErrors.preferOGROOverOldTools = copy.form.validation.required;

    const errorCount = Object.keys(newErrors).length;
    setErrors(newErrors);
    return { isValid: errorCount === 0, errorCount };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) {
      // Show alert with count of missing fields
      setMissingFieldsCount(validation.errorCount);
      setShowAlert(true);
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      
      // Scroll to top to show alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      // Store response using context (now async with Supabase)
      await addResponse(formData);
      
      // Reset form
      setFormData(initialFormData);
      
      // Redirect to /impact
      navigate('/impact');
    } catch (error) {
      // Error is handled in context, but we can show a user-friendly message
      console.error('Failed to submit survey:', error);
      // Still redirect to show dashboard (data might be saved to localStorage as fallback)
      navigate('/impact');
    }
  };

  // Update missing fields count when errors change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setMissingFieldsCount(Object.keys(errors).length);
    }
  }, [errors]);

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
    <div className={`survey-form-container ${language === 'bn' ? 'bangla-font' : ''}`}>
      {/* Language Toggle */}
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

      <h1>{copy.title}</h1>
      
      {/* Global Survey Description */}
      <div className="survey-description">
        <p>{copy.description}</p>
      </div>
      
      {/* Red Alert for Missing Fields */}
      {showAlert && (
        <div className="alert-popup">
          <div className="alert-content">
            <div className="alert-icon">⚠️</div>
            <div className="alert-text">
              <strong>{copy.alert.title}</strong>
              <p>
                {language === 'bn'
                  ? copy.alert.message.replace('{count}', missingFieldsCount.toString())
                  : copy.alert.message
                      .replace('{count}', missingFieldsCount.toString())
                      .replace('{plural}', missingFieldsCount !== 1 ? 's' : '')}
              </p>
              <p className="alert-hint">{copy.alert.hint}</p>
            </div>
            <button 
              className="alert-close" 
              onClick={() => setShowAlert(false)}
              aria-label="Close alert"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* OPTIONAL NAME FIELD */}
        <div className="name-field-section">
          <div className="form-group">
            <label htmlFor="name">
              {copy.fields.name.label} <span className="required">{copy.form.required}</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={copy.fields.name.label}
              className={`name-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
            <p className="name-helper">{copy.fields.name.helper}</p>
          </div>
        </div>
        <div className="field-divider"></div>

        {/* SECTION A — CONTEXT */}
        <section className="survey-section">
          <h2>{copy.sections.a.title}</h2>
          <p className="section-description">{copy.sections.a.description}</p>
          
          <div className="form-group">
            <label htmlFor="role">
              {copy.sections.a.questions.role} <span className="required">{copy.form.required}</span>
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className={errors.role ? 'error' : ''}
            >
              <option value="">{copy.form.selectRole}</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {copy.options.roles[role]}
                </option>
              ))}
            </select>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="usageDuration">
              {copy.sections.a.questions.usageDuration} <span className="required">{copy.form.required}</span>
            </label>
            <select
              id="usageDuration"
              value={formData.usageDuration}
              onChange={(e) => handleInputChange('usageDuration', e.target.value)}
              className={errors.usageDuration ? 'error' : ''}
            >
              <option value="">{copy.form.selectDuration}</option>
              {USAGE_DURATIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {copy.options.usageDuration[duration]}
                </option>
              ))}
            </select>
            {errors.usageDuration && (
              <span className="error-message">{errors.usageDuration}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              {copy.sections.a.questions.modulesUsed} <span className="required">{copy.form.required}</span>
            </label>
            <p className="question-helper">{copy.sections.a.questions.modulesUsedHelper}</p>
            <div className="checkbox-group">
              {MODULES.map((module) => (
                <label key={module} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.modulesUsed.includes(module)}
                    onChange={() => handleModuleToggle(module)}
                  />
                  <span>{copy.options.modules[module]}</span>
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
          <h2>{copy.sections.b.title}</h2>
          <p className="section-description">{copy.sections.b.description}</p>

          {[
            { key: 'reducedManualWork', label: copy.sections.b.questions.reducedManualWork },
            { key: 'savesTimeDaily', label: copy.sections.b.questions.savesTimeDaily },
            { key: 'dataAccuracyImproved', label: copy.sections.b.questions.dataAccuracyImproved },
            { key: 'easierTracking', label: copy.sections.b.questions.easierTracking },
            { key: 'improvedEfficiency', label: copy.sections.b.questions.improvedEfficiency },
          ].map(({ key, label }) => (
            <div key={key} className="form-group">
              <label>{label} <span className="required">{copy.form.required}</span></label>
              <div className="likert-scale">
                {([1, 2, 3, 4, 5] as LikertScale[]).map((value) => (
                  <label key={value} className="likert-option" title={copy.options.likert[value]}>
                    <input
                      type="radio"
                      name={key}
                      value={value}
                      checked={formData[key as keyof SurveyResponse] === value}
                      onChange={() => handleLikertChange(key as keyof SurveyResponse, value)}
                    />
                    <span className="likert-number">{value}</span>
                    <span className="likert-label">{copy.options.likert[value]}</span>
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
          <h2>{copy.sections.c.title}</h2>
          <p className="section-description">{copy.sections.c.description}</p>
          <p className="scale-hint">{copy.sections.c.scaleHint}</p>
          <div className="impact-matrix">
            <table>
              <thead>
                <tr>
                  <th>{copy.matrix.module}</th>
                  <th title={copy.options.impact[1]}>1</th>
                  <th title={copy.options.impact[2]}>2</th>
                  <th title={copy.options.impact[3]}>3</th>
                  <th title={copy.options.impact[4]}>4</th>
                  <th title={copy.options.impact[5]}>5</th>
                </tr>
              </thead>
              <tbody>
                {MODULES.map((module) => {
                  if (!formData.modulesUsed.includes(module)) return null;
                  return (
                    <tr key={module}>
                      <td>{copy.options.modules[module]}</td>
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
              <p className="info-message">{copy.matrix.selectModules}</p>
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
          <h2>{copy.sections.d.title}</h2>
          <p className="section-description">{copy.sections.d.description}</p>

          <div className="form-group">
            <label htmlFor="timeSpentBefore">
              {copy.sections.d.questions.timeSpentBefore} <span className="required">{copy.form.required}</span>
            </label>
            <select
              id="timeSpentBefore"
              value={formData.timeSpentBefore}
              onChange={(e) => handleInputChange('timeSpentBefore', e.target.value)}
              className={errors.timeSpentBefore ? 'error' : ''}
            >
              <option value="">{copy.form.selectTime}</option>
              {TIME_BEFORE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {copy.options.timeBefore[option]}
                </option>
              ))}
            </select>
            {errors.timeSpentBefore && (
              <span className="error-message">{errors.timeSpentBefore}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="timeSpentAfter">
              {copy.sections.d.questions.timeSpentAfter} <span className="required">{copy.form.required}</span>
            </label>
            <select
              id="timeSpentAfter"
              value={formData.timeSpentAfter}
              onChange={(e) => handleInputChange('timeSpentAfter', e.target.value)}
              className={errors.timeSpentAfter ? 'error' : ''}
            >
              <option value="">{copy.form.selectTime}</option>
              {TIME_AFTER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {copy.options.timeAfter[option]}
                </option>
              ))}
            </select>
            {errors.timeSpentAfter && (
              <span className="error-message">{errors.timeSpentAfter}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="errorFrequencyBefore">
              {copy.sections.d.questions.errorFrequencyBefore} <span className="required">{copy.form.required}</span>
            </label>
            <select
              id="errorFrequencyBefore"
              value={formData.errorFrequencyBefore}
              onChange={(e) => handleInputChange('errorFrequencyBefore', e.target.value)}
              className={errors.errorFrequencyBefore ? 'error' : ''}
            >
              <option value="">{copy.form.selectTime}</option>
              {ERROR_FREQUENCY_BEFORE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {copy.options.errorBefore[option]}
                </option>
              ))}
            </select>
            {errors.errorFrequencyBefore && (
              <span className="error-message">{errors.errorFrequencyBefore}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="errorFrequencyAfter">
              {copy.sections.d.questions.errorFrequencyAfter} <span className="required">{copy.form.required}</span>
            </label>
            <select
              id="errorFrequencyAfter"
              value={formData.errorFrequencyAfter}
              onChange={(e) => handleInputChange('errorFrequencyAfter', e.target.value)}
              className={errors.errorFrequencyAfter ? 'error' : ''}
            >
              <option value="">{copy.form.selectTime}</option>
              {ERROR_FREQUENCY_AFTER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {copy.options.errorAfter[option]}
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
          <h2>{copy.sections.e.title}</h2>
          <p className="section-description">{copy.sections.e.description}</p>

          {[
            { key: 'trustOGROData', label: copy.sections.e.questions.trustOGROData },
            { key: 'lessExcelWhatsApp', label: copy.sections.e.questions.lessExcelWhatsApp },
            { key: 'preferOGROOverOldTools', label: copy.sections.e.questions.preferOGROOverOldTools },
          ].map(({ key, label }) => (
            <div key={key} className="form-group">
              <label>{label} <span className="required">{copy.form.required}</span></label>
              <div className="likert-scale">
                {([1, 2, 3, 4, 5] as LikertScale[]).map((value) => (
                  <label key={value} className="likert-option" title={copy.options.likert[value]}>
                    <input
                      type="radio"
                      name={key}
                      value={value}
                      checked={formData[key as keyof SurveyResponse] === value}
                      onChange={() => handleLikertChange(key as keyof SurveyResponse, value)}
                    />
                    <span className="likert-number">{value}</span>
                    <span className="likert-label">{copy.options.likert[value]}</span>
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
          <h2>{copy.sections.f.title}</h2>
          <p className="section-description">{copy.sections.f.description}</p>

          <div className="form-group">
            <label htmlFor="biggestImprovement">
              {copy.sections.f.questions.biggestImprovement}
            </label>
            <textarea
              id="biggestImprovement"
              value={formData.biggestImprovement}
              onChange={(e) => handleInputChange('biggestImprovement', e.target.value)}
              rows={4}
              placeholder={copy.form.placeholders.biggestImprovement}
            />
          </div>

          <div className="form-group">
            <label htmlFor="oneImprovementNeeded">
              {copy.sections.f.questions.oneImprovementNeeded}
            </label>
            <textarea
              id="oneImprovementNeeded"
              value={formData.oneImprovementNeeded}
              onChange={(e) => handleInputChange('oneImprovementNeeded', e.target.value)}
              rows={4}
              placeholder={copy.form.placeholders.oneImprovementNeeded}
            />
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            {copy.form.submitButton}
          </button>
        </div>
      </form>
    </div>
  );
}

