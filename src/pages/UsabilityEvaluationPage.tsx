import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UsabilityTaskResult } from '../types';
import {
  FlaskConical,
  Play,
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock,
  Star,
  Calculator,
  ArrowUpRight,
  Info,
  Check,
} from 'lucide-react';

export const UsabilityEvaluationPage: React.FC = () => {
  const { usabilityTasks, updateUsabilityTask, resetUsabilityTasks, addToast } = useApp();

  // Active task stopwatch state
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (activeTaskId !== null) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTaskId]);

  const handleStartTask = (task: UsabilityTaskResult) => {
    setActiveTaskId(task.id);
    setTimerSeconds(task.timeSeconds || 0);
    updateUsabilityTask(task.id, { status: 'in_progress' });
    addToast('Task Timer Started', `Now evaluating: ${task.taskName}`, 'info');
  };

  const handleCompleteTask = (task: UsabilityTaskResult, success: boolean) => {
    setActiveTaskId(null);
    updateUsabilityTask(task.id, {
      status: success ? 'completed' : 'failed',
      timeSeconds: timerSeconds,
    });
    addToast(
      success ? 'Task Completed' : 'Task Marked Unsuccessful',
      `${task.taskName} logged at ${timerSeconds} seconds.`,
      success ? 'success' : 'warning'
    );
  };

  // Metric Formulas & Calculations
  const completedTasks = usabilityTasks.filter((t) => t.status === 'completed');
  const attemptedTasks = usabilityTasks.filter((t) => t.status === 'completed' || t.status === 'failed');

  const taskSuccessRate =
    attemptedTasks.length > 0
      ? Math.round((completedTasks.length / attemptedTasks.length) * 100)
      : 0;

  const totalCompletionTime = completedTasks.reduce((acc, curr) => acc + curr.timeSeconds, 0);
  const meanCompletionTime =
    completedTasks.length > 0
      ? (totalCompletionTime / completedTasks.length).toFixed(1)
      : '0.0';

  const totalErrors = usabilityTasks.reduce((acc, curr) => acc + curr.errorsCount, 0);
  const meanErrorsPerTask =
    attemptedTasks.length > 0 ? (totalErrors / attemptedTasks.length).toFixed(1) : '0.0';

  const ratedTasks = usabilityTasks.filter((t) => t.status !== 'not_started');
  const meanSatisfactionScore =
    ratedTasks.length > 0
      ? (ratedTasks.reduce((acc, curr) => acc + curr.satisfactionRating, 0) / ratedTasks.length).toFixed(1)
      : '5.0';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-xs">
            HMI Laboratory Assessment Module
          </span>
          <span className="text-xs text-purple-200">Formal Usability Testing Protocol (7 Practical Tasks)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Empirical Usability Evaluation & Metric Engine
        </h1>
        <p className="text-xs sm:text-sm text-purple-100 mt-2 max-w-3xl leading-relaxed">
          Standardized empirical testing suite measuring task completion rates, timing, error/slip frequencies, and subjective satisfaction ratings across academic management and anonymous course evaluation workflows.
        </p>
      </div>

      {/* Calculated Metrics Summary Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Task Success Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Task Success Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
              {attemptedTasks.length > 0 ? `${taskSuccessRate}%` : 'Pending'}
            </span>
            <span className="text-xs text-slate-400">
              ({completedTasks.length}/{attemptedTasks.length || 7} completed)
            </span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 font-mono">
            Formula: (Successful / Attempted) × 100
          </p>
        </div>

        {/* Mean Completion Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Mean Completion Time</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-apple-blue flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
              {meanCompletionTime}s
            </span>
            <span className="text-xs text-slate-400">average duration</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 font-mono">
            Formula: Total Time / Completed Tasks
          </p>
        </div>

        {/* Error Frequency Per Task */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Slip / Error Frequency</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
              {totalErrors}
            </span>
            <span className="text-xs text-slate-400">slips logged</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 font-mono">
            Avg: {meanErrorsPerTask} errors/attempt
          </p>
        </div>

        {/* Mean Satisfaction Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Satisfaction Score</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
              {meanSatisfactionScore}
            </span>
            <span className="text-xs text-slate-400">/ 5.0 Likert Scale</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 font-mono">
            Formula: Sum(Ratings) / Rated Tasks
          </p>
        </div>
      </div>

      {/* 7 Practical Usability Tasks Table & Live Evaluation Bench */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-600" />
              <span>Standard 7 Practical Evaluation Tasks (Academic Assessment)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Execute each task with a test subject or self-assess, logging time, errors, and qualitative feedback.
            </p>
          </div>
          <button
            onClick={resetUsabilityTasks}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 font-semibold text-xs transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Evaluation Records</span>
          </button>
        </div>

        <div className="space-y-4">
          {usabilityTasks.map((task) => {
            const isCurrentlyTiming = activeTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrentlyTiming
                    ? 'border-purple-500 bg-purple-50/30 dark:bg-purple-950/20 ring-2 ring-purple-500/20'
                    : task.status === 'completed'
                    ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/15 dark:bg-emerald-950/10'
                    : 'border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        Task #{task.id}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                        {task.taskName}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          task.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : task.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : task.status === 'failed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <Link
                        to={task.targetRoute}
                        className="inline-flex items-center gap-1 font-semibold text-apple-blue hover:underline"
                      >
                        <span>Open Target Feature ({task.targetRoute})</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Stopwatch & Action Controls */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-apple-blue" />
                      <span>{isCurrentlyTiming ? `${timerSeconds}s (Timing...)` : `${task.timeSeconds}s`}</span>
                    </div>

                    {isCurrentlyTiming ? (
                      <>
                        <button
                          onClick={() => handleCompleteTask(task, true)}
                          className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Success</span>
                        </button>
                        <button
                          onClick={() => handleCompleteTask(task, false)}
                          className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Failed</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStartTask(task)}
                        className="px-4 py-1.5 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Test</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Participant Feedback & Error Controls */}
                <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-zinc-700/60 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                  {/* Errors count */}
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Slips / Errors:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateUsabilityTask(task.id, {
                            errorsCount: Math.max(0, task.errorsCount - 1),
                          })
                        }
                        className="w-6 h-6 rounded-md bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold px-1.5 font-mono">{task.errorsCount}</span>
                      <button
                        onClick={() =>
                          updateUsabilityTask(task.id, {
                            errorsCount: task.errorsCount + 1,
                          })
                        }
                        className="w-6 h-6 rounded-md bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Satisfaction rating */}
                  <div className="sm:col-span-4 flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Satisfaction:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateUsabilityTask(task.id, { satisfactionRating: star })}
                          className={`p-0.5 ${
                            star <= task.satisfactionRating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300 dark:text-zinc-700'
                          }`}
                          title={`Rate ${star}/5`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes input */}
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      value={task.notes}
                      onChange={(e) => updateUsabilityTask(task.id, { notes: e.target.value })}
                      placeholder="Participant observations / cognitive friction comments..."
                      className="w-full px-3 py-1 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs outline-none focus:border-apple-blue"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Qualitative Baseline Comparison */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle space-y-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-apple-blue" />
            <span>Qualitative Baseline Comparison (Hypothetical Legacy LMS vs CampusEase 2.0)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Note: This comparison establishes a qualitative, hypothetical baseline against traditional legacy university software (such as legacy Moodle or campus ERPs) based on standard student survey complaints.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 font-semibold text-xs">
                <th className="py-2.5 px-3">Evaluation Dimension</th>
                <th className="py-2.5 px-3 text-rose-600 dark:text-rose-400">Legacy University Portal (Baseline)</th>
                <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">CampusEase 2.0 Redesign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-zinc-200">
                  Deadline Discovery
                </td>
                <td className="py-3 px-3 text-slate-500">
                  Hidden inside individual course syllabi; requires 4-6 manual clicks per course.
                </td>
                <td className="py-3 px-3 text-emerald-700 dark:text-emerald-300 font-medium">
                  Centralized on Dashboard spotlight and unified Deadlines Calendar with 0-1 clicks.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-zinc-200">
                  Course Evaluation Workflows
                </td>
                <td className="py-3 px-3 text-slate-500">
                  Paper forms or clunky Google Forms with student emails captured; fear of retaliation.
                </td>
                <td className="py-3 px-3 text-emerald-700 dark:text-emerald-300 font-medium">
                  100% anonymous 5-step guided modal with decoupled receipts and 5-response privacy shield.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-zinc-200">
                  Faculty Actionable Insights
                </td>
                <td className="py-3 px-3 text-slate-500">
                  Raw CSV spreadsheets exported months later; hard to spot patterns or trends.
                </td>
                <td className="py-3 px-3 text-emerald-700 dark:text-emerald-300 font-medium">
                  Real-time Recharts category bar charts, rating distributions, and rule-based action suggestions.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-zinc-200">
                  Mobile Usability & Accessibility
                </td>
                <td className="py-3 px-3 text-slate-500">
                  Horizontal overflow, unreadable tables, no dark mode, fail WCAG contrast ratios.
                </td>
                <td className="py-3 px-3 text-emerald-700 dark:text-emerald-300 font-medium">
                  Apple-inspired layout, slide-over drawer, dark mode, text scaling up to 130%, high-contrast focus.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
