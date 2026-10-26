import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EvaluationSurvey } from '../types';
import { FeedbackSubmissionModal } from '../components/FeedbackSubmissionModal';
import {
  MessageSquareHeart,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Lock,
  BarChart3,
  Sparkles,
} from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { surveys, completedSurveys, courses, setActiveRole } = useApp();

  const [selectedSurvey, setSelectedSurvey] = useState<EvaluationSurvey | null>(null);

  const completedCount = completedSurveys.length;
  const openSurveys = surveys.filter((s) => s.status === 'open' && !completedSurveys.some((c) => c.surveyId === s.id));
  const totalActionable = surveys.filter((s) => s.status !== 'upcoming').length;
  const completionPercentage = totalActionable > 0 ? Math.round((completedCount / totalActionable) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header (Apple aesthetic: spacious, refined, clear purpose) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-xs text-white">
              Student Voice & Quality Assurance
            </span>
            <span className="text-xs text-blue-200">Fall 2026 Mid-Semester Window</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Feedback & Course Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Your continuous feedback directly shapes laboratory exercises, curriculum pacing, and instructional support. All submissions are 100% anonymous and reviewed in aggregate by department leadership.
          </p>
        </div>

        {/* Quick jump to Faculty Insights View */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-blue-100">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Encrypted Anonymity Guarantee • Minimum 5-Response Shield</span>
          </div>

          <Link
            to="/faculty-insights"
            onClick={() => setActiveRole('faculty')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
            <span>View Faculty / Admin Analytics Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stat Tiles (Apple-style rounded-2xl cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Open Surveys */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <span className="text-xs font-semibold text-slate-500">Surveys Awaiting You</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
              {openSurveys.length}
            </span>
            <span className="text-xs text-slate-400">open subjects</span>
          </div>
          <p className="mt-2 text-[11px] text-apple-blue font-medium">
            Closes Nov 8, 2026
          </p>
        </div>

        {/* Completed Surveys */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <span className="text-xs font-semibold text-slate-500">Evaluations Submitted</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </span>
            <span className="text-xs text-slate-400">completed</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-600 font-medium">
            Anonymous receipts issued
          </p>
        </div>

        {/* Overall Completion Progress */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <span className="text-xs font-semibold text-slate-500">Completion Progress</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
              {completionPercentage}%
            </span>
            <span className="text-xs text-slate-400">of semester goal</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-apple-blue rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Department Response Benchmark */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <span className="text-xs font-semibold text-slate-500">Class Participation</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              72%
            </span>
            <span className="text-xs text-slate-400">cohort average</span>
          </div>
          <p className="mt-2 text-[11px] text-purple-600 font-medium">
            Exceeds 60% department threshold
          </p>
        </div>
      </div>

      {/* Available Surveys Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              Courses Available for Evaluation
            </h2>
            <p className="text-xs text-slate-500">Select an open course survey to provide confidential feedback.</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {openSurveys.length} survey{openSurveys.length === 1 ? '' : 's'} remaining
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {surveys.map((survey) => {
            const isCompleted = completedSurveys.some((c) => c.surveyId === survey.id);
            const isUpcoming = survey.status === 'upcoming';
            const courseMeta = courses.find((c) => c.id === survey.courseId);

            return (
              <div
                key={survey.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200/70 dark:border-emerald-900/40'
                    : isUpcoming
                    ? 'bg-slate-50/50 dark:bg-zinc-900/40 border-slate-200/60 dark:border-zinc-800 opacity-75'
                    : 'bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800 hover:border-apple-blue shadow-apple-subtle hover:shadow-apple-card'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {survey.courseCode}
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : isUpcoming ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Opens Nov 1</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Open Now</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                    {survey.courseName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Instructor: {survey.instructor}</p>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {survey.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Deadline: {new Date(survey.deadline).toLocaleDateString()}
                  </span>

                  {isCompleted ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span>Feedback Logged</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : isUpcoming ? (
                    <span className="text-xs text-slate-400 font-medium">Evaluation Not Yet Open</span>
                  ) : (
                    <button
                      onClick={() => setSelectedSurvey(survey)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      <span>Give Feedback</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Evaluations & Confirmation Tokens Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              <span>Completed Evaluation History & Anonymous Receipts</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Receipt codes prove submission without exposing your confidential ratings.
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {completedCount} Verified
          </span>
        </div>

        {completedSurveys.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No completed evaluations yet. Select an open survey above to submit your first evaluation.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
            {completedSurveys.map((rec, idx) => {
              const matchedSurvey = surveys.find((s) => s.id === rec.surveyId);
              return (
                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-zinc-200">
                      {matchedSurvey ? `${matchedSurvey.courseCode}: ${matchedSurvey.courseName}` : 'Course Evaluation'}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Submitted on {new Date(rec.completedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                      {rec.confirmationCode}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      Decoupled & Anonymous
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Evaluation Survey Modal Trigger */}
      {selectedSurvey && (
        <FeedbackSubmissionModal
          survey={selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
        />
      )}
    </div>
  );
};
