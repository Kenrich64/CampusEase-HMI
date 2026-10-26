import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EvaluationSurvey, EvaluationCategoryKey, RatingScaleValue } from '../types';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Star,
  Send,
  HelpCircle,
} from 'lucide-react';

interface FeedbackSubmissionModalProps {
  survey: EvaluationSurvey;
  onClose: () => void;
}

export const FeedbackSubmissionModal: React.FC<FeedbackSubmissionModalProps> = ({ survey, onClose }) => {
  const { submitAnonymousFeedback, completedSurveys } = useApp();

  const isAlreadyCompleted = completedSurveys.some((c) => c.surveyId === survey.id);

  // 5-step guided form:
  // 1: Overview & Privacy Assurance
  // 2: Teaching & Course Material (3 questions)
  // 3: Resources, Assessment & Pacing (4 questions)
  // 4: Qualitative Written Feedback (Optional)
  // 5: Final Review & Anonymous Submission
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form ratings state
  const [ratings, setRatings] = useState<Record<EvaluationCategoryKey, RatingScaleValue>>({
    overallSatisfaction: 5,
    teachingClarity: 5,
    materialOrganization: 4,
    resourceAvailability: 4,
    assessmentFairness: 5,
    pacing: 4,
    supportHelp: 5,
  });

  const [positiveFeedback, setPositiveFeedback] = useState('');
  const [improvementFeedback, setImprovementFeedback] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rating label descriptions (ensures evaluation does not depend on color alone - HMI accessibility)
  const ratingLabels: Record<RatingScaleValue, { label: string; desc: string }> = {
    1: { label: '1 - Poor', desc: 'Significantly below expectations' },
    2: { label: '2 - Fair', desc: 'Needs noticeable improvement' },
    3: { label: '3 - Satisfactory', desc: 'Meets academic standards' },
    4: { label: '4 - Good', desc: 'Exceeds standard expectations' },
    5: { label: '5 - Excellent', desc: 'Outstanding instructional quality' },
  };

  const handleRatingChange = (category: EvaluationCategoryKey, value: RatingScaleValue) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleNext = () => {
    setValidationError('');
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setValidationError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      submitAnonymousFeedback(
        survey.id,
        survey.courseId,
        ratings,
        positiveFeedback.trim() || undefined,
        improvementFeedback.trim() || undefined
      );
      onClose();
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Course evaluation survey modal"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Survey Information & Close */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-apple-blue dark:text-apple-darkBlue">
                Anonymous Course Evaluation
              </span>
              <span className="text-slate-300 dark:text-zinc-700">•</span>
              <span className="text-xs text-slate-500 font-medium">{survey.term}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
              {survey.courseCode}: {survey.courseName}
            </h2>
            <p className="text-xs text-slate-500">Instructor: {survey.instructor}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close evaluation form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator (Apple-style step pills) */}
        {!isAlreadyCompleted && (
          <div className="px-6 py-3 bg-slate-50/70 dark:bg-zinc-950/40 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center gap-1.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition-all ${
                      currentStep === step
                        ? 'bg-apple-blue text-white shadow-xs'
                        : currentStep > step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-zinc-800 text-slate-500'
                    }`}
                  >
                    {currentStep > step ? '✓' : step}
                  </span>
                  {step < 5 && <span className="w-4 h-0.5 bg-slate-200 dark:bg-zinc-800 hidden sm:inline-block" />}
                </div>
              ))}
            </div>

            <span className="text-slate-500 font-medium">
              Step {currentStep} of 5:{' '}
              <strong className="text-slate-800 dark:text-zinc-200">
                {currentStep === 1 && 'Privacy & Overview'}
                {currentStep === 2 && 'Teaching Quality'}
                {currentStep === 3 && 'Resources & Assessment'}
                {currentStep === 4 && 'Written Comments'}
                {currentStep === 5 && 'Review & Submit'}
              </strong>
            </span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          {isAlreadyCompleted ? (
            /* Duplicate Submission Shield */
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                Evaluation Already Completed
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                You have already submitted an anonymous evaluation for {survey.courseCode} ({survey.term}). To protect evaluation integrity, only one submission per student is recorded.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-semibold"
                >
                  Return to Feedback Hub
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Overview & Privacy Assurance */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs leading-relaxed space-y-2">
                    <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200 text-sm">
                      <ShieldCheck className="w-5 h-5 text-apple-blue" />
                      <span>Anonymity Guarantee & Privacy Protection</span>
                    </div>
                    <p className="text-blue-800/90 dark:text-blue-300/90">
                      Your course evaluation responses are <strong>100% anonymous</strong>. Neither course instructors nor department heads can view individual student names, IDs, or timestamps.
                    </p>
                    <p className="text-blue-800/80 dark:text-blue-300/80">
                      Responses are aggregated only after a minimum response threshold (5 or more students) has been reached to protect individual privacy.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-zinc-400">
                    <h4 className="font-semibold text-slate-800 dark:text-zinc-200 text-sm">
                      Why Your Feedback Matters:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                      <li>Helps instructors calibrate pacing and clarify difficult lab concepts.</li>
                      <li>Informs department curriculum improvements and resource allocation.</li>
                      <li>Encourages faculty to maintain effective, highly rated teaching practices.</li>
                    </ul>
                  </div>

                  <div className="pt-2 text-xs text-slate-400">
                    Estimated completion time: <strong>2–3 minutes</strong>. You will be able to review all responses before final submission.
                  </div>
                </div>
              )}

              {/* STEP 2: Teaching Quality & Content Ratings */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* 1. Overall Course Satisfaction */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-900 dark:text-zinc-100 text-xs">
                        1. Overall Course Satisfaction <span className="text-apple-danger">*</span>
                      </label>
                      <span className="text-xs font-semibold text-apple-blue">
                        {ratingLabels[ratings.overallSatisfaction].label}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {([1, 2, 3, 4, 5] as RatingScaleValue[]).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleRatingChange('overallSatisfaction', val)}
                          className={`p-2.5 rounded-2xl border text-center transition-all ${
                            ratings.overallSatisfaction === val
                              ? 'border-apple-blue bg-blue-50 dark:bg-blue-950/60 text-apple-blue shadow-xs font-bold'
                              : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Star
                              className={`w-4 h-4 ${
                                ratings.overallSatisfaction >= val
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300 dark:text-zinc-700'
                              }`}
                            />
                            <span className="text-xs">{val}</span>
                          </div>
                          <span className="text-[10px] block truncate">{ratingLabels[val].label.split(' - ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Teaching Clarity */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-900 dark:text-zinc-100 text-xs">
                        2. Teaching Clarity & Explanation of Complex Topics <span className="text-apple-danger">*</span>
                      </label>
                      <span className="text-xs font-semibold text-apple-blue">
                        {ratingLabels[ratings.teachingClarity].label}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {([1, 2, 3, 4, 5] as RatingScaleValue[]).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleRatingChange('teachingClarity', val)}
                          className={`p-2.5 rounded-2xl border text-center transition-all ${
                            ratings.teachingClarity === val
                              ? 'border-apple-blue bg-blue-50 dark:bg-blue-950/60 text-apple-blue shadow-xs font-bold'
                              : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400'
                          }`}
                        >
                          <span className="text-xs font-bold block">{val}</span>
                          <span className="text-[10px] block truncate text-slate-500">{ratingLabels[val].label.split(' - ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Material Organization */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-900 dark:text-zinc-100 text-xs">
                        3. Organization and Coherence of Course Material <span className="text-apple-danger">*</span>
                      </label>
                      <span className="text-xs font-semibold text-apple-blue">
                        {ratingLabels[ratings.materialOrganization].label}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {([1, 2, 3, 4, 5] as RatingScaleValue[]).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleRatingChange('materialOrganization', val)}
                          className={`p-2.5 rounded-2xl border text-center transition-all ${
                            ratings.materialOrganization === val
                              ? 'border-apple-blue bg-blue-50 dark:bg-blue-950/60 text-apple-blue shadow-xs font-bold'
                              : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400'
                          }`}
                        >
                          <span className="text-xs font-bold block">{val}</span>
                          <span className="text-[10px] block truncate text-slate-500">{ratingLabels[val].label.split(' - ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Resources, Assessment & Pacing */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* 4. Availability of Learning Resources */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-900 dark:text-zinc-100 text-xs">
                        4. Quality & Availability of Learning Resources & Lab Sheets <span className="text-apple-danger">*</span>
                      </label>
                      <span className="text-xs font-semibold text-apple-blue">
                        {ratingLabels[ratings.resourceAvailability].label}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {([1, 2, 3, 4, 5] as RatingScaleValue[]).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleRatingChange('resourceAvailability', val)}
                          className={`p-2.5 rounded-2xl border text-center transition-all ${
                            ratings.resourceAvailability === val
                              ? 'border-apple-blue bg-blue-50 dark:bg-blue-950/60 text-apple-blue shadow-xs font-bold'
                              : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400'
                          }`}
                        >
                          <span className="text-xs font-bold block">{val}</span>
                          <span className="text-[10px] block truncate text-slate-500">{ratingLabels[val].label.split(' - ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Fairness and Clarity of Assessment */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-900 dark:text-zinc-100 text-xs">
                        5. Fairness and Transparency of Grading Rubrics <span className="text-apple-danger">*</span>
                      </label>
                      <span className="text-xs font-semibold text-apple-blue">
                        {ratingLabels[ratings.assessmentFairness].label}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {([1, 2, 3, 4, 5] as RatingScaleValue[]).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleRatingChange('assessmentFairness', val)}
                          className={`p-2.5 rounded-2xl border text-center transition-all ${
                            ratings.assessmentFairness === val
                              ? 'border-apple-blue bg-blue-50 dark:bg-blue-950/60 text-apple-blue shadow-xs font-bold'
                              : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400'
                          }`}
                        >
                          <span className="text-xs font-bold block">{val}</span>
                          <span className="text-[10px] block truncate text-slate-500">{ratingLabels[val].label.split(' - ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 6. Pace of Teaching */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-900 dark:text-zinc-100 text-xs">
                        6. Pace of Curriculum Progression <span className="text-apple-danger">*</span>
                      </label>
                      <span className="text-xs font-semibold text-apple-blue">
                        {ratingLabels[ratings.pacing].label}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {([1, 2, 3, 4, 5] as RatingScaleValue[]).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleRatingChange('pacing', val)}
                          className={`p-2.5 rounded-2xl border text-center transition-all ${
                            ratings.pacing === val
                              ? 'border-apple-blue bg-blue-50 dark:bg-blue-950/60 text-apple-blue shadow-xs font-bold'
                              : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400'
                          }`}
                        >
                          <span className="text-xs font-bold block">{val}</span>
                          <span className="text-[10px] block truncate text-slate-500">{ratingLabels[val].label.split(' - ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 7. Opportunities to Ask Questions & Support */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-900 dark:text-zinc-100 text-xs">
                        7. Instructor Support, Mentorship & Office Hours Access <span className="text-apple-danger">*</span>
                      </label>
                      <span className="text-xs font-semibold text-apple-blue">
                        {ratingLabels[ratings.supportHelp].label}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {([1, 2, 3, 4, 5] as RatingScaleValue[]).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleRatingChange('supportHelp', val)}
                          className={`p-2.5 rounded-2xl border text-center transition-all ${
                            ratings.supportHelp === val
                              ? 'border-apple-blue bg-blue-50 dark:bg-blue-950/60 text-apple-blue shadow-xs font-bold'
                              : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400'
                          }`}
                        >
                          <span className="text-xs font-bold block">{val}</span>
                          <span className="text-[10px] block truncate text-slate-500">{ratingLabels[val].label.split(' - ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Optional Qualitative Feedback */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-xs text-slate-500 flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      Written comments are strictly optional. Please do not include identifying personal information (such as your name or roll number) in your text.
                    </span>
                  </div>

                  {/* Positive Strengths */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-900 dark:text-zinc-100">
                      What aspects of this course or teaching style are most effective? (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={positiveFeedback}
                      onChange={(e) => setPositiveFeedback(e.target.value)}
                      placeholder="e.g. Hands-on laboratory wireframing exercises helped me understand cognitive load principles..."
                      className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 text-xs focus:bg-white dark:focus:bg-zinc-900 focus:border-apple-blue outline-none transition-colors"
                    />
                  </div>

                  {/* Areas for Improvement */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-900 dark:text-zinc-100">
                      What specific improvements would you suggest for the remainder of the term? (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={improvementFeedback}
                      onChange={(e) => setImprovementFeedback(e.target.value)}
                      placeholder="e.g. Releasing the rubric grading criteria a few days earlier would help reduce submission ambiguity..."
                      className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 text-xs focus:bg-white dark:focus:bg-zinc-900 focus:border-apple-blue outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Anonymous Submit */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-zinc-100 text-xs">
                      Summary of Your Evaluation Scores
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 flex justify-between">
                        <span className="text-slate-500">Overall Satisfaction:</span>
                        <strong>{ratings.overallSatisfaction} / 5</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 flex justify-between">
                        <span className="text-slate-500">Teaching Clarity:</span>
                        <strong>{ratings.teachingClarity} / 5</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 flex justify-between">
                        <span className="text-slate-500">Organization:</span>
                        <strong>{ratings.materialOrganization} / 5</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 flex justify-between">
                        <span className="text-slate-500">Resources:</span>
                        <strong>{ratings.resourceAvailability} / 5</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 flex justify-between">
                        <span className="text-slate-500">Fairness:</span>
                        <strong>{ratings.assessmentFairness} / 5</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 flex justify-between">
                        <span className="text-slate-500">Pacing:</span>
                        <strong>{ratings.pacing} / 5</strong>
                      </div>
                    </div>

                    {(positiveFeedback || improvementFeedback) && (
                      <div className="pt-2 border-t border-slate-200/50 dark:border-zinc-700/50 text-xs space-y-1">
                        <span className="text-slate-500 font-semibold">Written Comments Provided:</span>
                        {positiveFeedback && (
                          <p className="italic text-slate-700 dark:text-zinc-300 line-clamp-1">
                            Strengths: "{positiveFeedback}"
                          </p>
                        )}
                        {improvementFeedback && (
                          <p className="italic text-slate-700 dark:text-zinc-300 line-clamp-1">
                            Improvement: "{improvementFeedback}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Once submitted, this response will be decoupled from your account and merged into the anonymous department aggregate. You will not be able to modify it.
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {validationError && (
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 text-xs font-medium">
              {validationError}
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation Actions */}
        {!isAlreadyCompleted && (
          <div className="px-6 py-4 bg-slate-50/90 dark:bg-zinc-950/80 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-slate-500 hover:text-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Recording Anonymous Submission...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm & Submit Anonymously</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
