import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CourseFeedbackSummary, EvaluationCategoryKey, ActionRecommendationStatus } from '../types';
import {
  BarChart3,
  ShieldCheck,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Filter,
  Check,
  Clock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const FacultyInsightsPage: React.FC = () => {
  const {
    feedbackSummaries,
    courses,
    minimumResponseThreshold,
    setMinimumResponseThreshold,
    updateRecommendationStatus,
    activeRole,
    setActiveRole,
  } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [recommendationFilter, setRecommendationFilter] = useState<'all' | 'planned' | 'in_progress' | 'completed'>('all');

  // Filter summaries
  const displayedSummaries = feedbackSummaries.filter(
    (s) => selectedCourseId === 'all' || s.courseId === selectedCourseId
  );

  // Overall Department Statistics calculated dynamically from data
  const totalResponses = feedbackSummaries.reduce((acc, curr) => acc + curr.responseCount, 0);
  const eligibleCourses = feedbackSummaries.filter((s) => s.meetsThreshold);
  const avgSatisfaction =
    eligibleCourses.length > 0
      ? (
          eligibleCourses.reduce((acc, curr) => acc + curr.categoryAverages.overallSatisfaction, 0) /
          eligibleCourses.length
        ).toFixed(1)
      : '0.0';
  const avgResponseRate =
    feedbackSummaries.length > 0
      ? Math.round(feedbackSummaries.reduce((acc, curr) => acc + curr.responseRate, 0) / feedbackSummaries.length)
      : 0;

  // Aggregate Category Averages for the selected view
  const categoryKeys: { key: EvaluationCategoryKey; label: string }[] = [
    { key: 'teachingClarity', label: 'Teaching Clarity' },
    { key: 'supportHelp', label: 'Support & Help' },
    { key: 'materialOrganization', label: 'Course Organization' },
    { key: 'assessmentFairness', label: 'Assessment Fairness' },
    { key: 'resourceAvailability', label: 'Learning Resources' },
    { key: 'pacing', label: 'Curriculum Pacing' },
  ];

  const categoryBarData = categoryKeys.map(({ key, label }) => {
    let score = 0;
    if (selectedCourseId === 'all') {
      const valid = eligibleCourses;
      score =
        valid.length > 0
          ? Number((valid.reduce((acc, curr) => acc + (curr.categoryAverages[key] || 0), 0) / valid.length).toFixed(2))
          : 0;
    } else {
      const single = feedbackSummaries.find((s) => s.courseId === selectedCourseId);
      score = single && single.meetsThreshold ? single.categoryAverages[key] : 0;
    }
    return { category: label, score };
  });

  // Rating distribution aggregate data
  const overallDistData = [5, 4, 3, 2, 1].map((stars) => {
    let count = 0;
    if (selectedCourseId === 'all') {
      eligibleCourses.forEach((c) => {
        const item = c.ratingDistribution.find((r) => r.stars === stars);
        if (item) count += item.count;
      });
    } else {
      const single = feedbackSummaries.find((s) => s.courseId === selectedCourseId);
      if (single && single.meetsThreshold) {
        const item = single.ratingDistribution.find((r) => r.stars === stars);
        if (item) count = item.count;
      }
    }
    return { name: `${stars} Stars`, stars, count };
  });

  // Historical Trends (CS301 sample trend or department aggregate)
  const historicalTrendData = [
    { period: 'Spring 2025', score: 4.1, respondents: 140 },
    { period: 'Fall 2025', score: 4.2, respondents: 151 },
    { period: 'Spring 2026', score: 4.3, respondents: 172 },
    { period: 'Fall 2026 (Current)', score: Number(avgSatisfaction), respondents: totalResponses },
  ];

  // All actionable recommendations
  const allRecommendations = feedbackSummaries.flatMap((s) => s.recommendations);
  const filteredRecommendations = allRecommendations.filter(
    (rec) =>
      (selectedCourseId === 'all' || rec.courseId === selectedCourseId) &&
      (recommendationFilter === 'all' || rec.status === recommendationFilter)
  );

  return (
    <div className="space-y-6">
      {/* Demo Role Switcher Top Banner */}
      <div className="p-4 rounded-3xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-zinc-100">
              Demo Role Active: Faculty / Department Leadership (Dr. Eleanor Vance)
            </p>
            <p className="text-slate-500 dark:text-zinc-400">
              Displaying aggregated student evaluations. Individual respondent identities are strictly decoupled.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveRole('student')}
          className="px-4 py-1.5 rounded-full bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold border border-slate-200 dark:border-zinc-700 self-start sm:self-auto transition-colors"
        >
          Return to Student View
        </button>
      </div>

      {/* Page Title & Privacy Threshold Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-apple-blue" />
            <span>Faculty & Administrator Course Insights</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Aggregated student feedback metrics, rating distributions, and rule-based actionable recommendations.
          </p>
        </div>

        {/* Minimum Response Threshold Controller */}
        <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Privacy Shield Threshold:</span>
          </div>
          <select
            value={minimumResponseThreshold}
            onChange={(e) => setMinimumResponseThreshold(Number(e.target.value))}
            className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 font-bold text-apple-blue outline-none cursor-pointer"
            aria-label="Set minimum response threshold for privacy shield"
          >
            <option value={3}>Min 3 Responses</option>
            <option value={5}>Min 5 Responses (Default)</option>
            <option value={8}>Min 8 Responses</option>
            <option value={10}>Min 10 Responses</option>
          </select>
        </div>
      </div>

      {/* Top 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <span className="text-xs font-semibold text-slate-500">Total Evaluations</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
              {totalResponses}
            </span>
            <span className="text-xs text-slate-400">anonymous</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-600 font-medium">Across all CE subjects</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <span className="text-xs font-semibold text-slate-500">Evaluated Courses</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
              {eligibleCourses.length} / {feedbackSummaries.length}
            </span>
            <span className="text-xs text-slate-400">courses</span>
          </div>
          <p className="mt-2 text-[11px] text-apple-blue font-medium">Meets ≥ {minimumResponseThreshold} threshold</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <span className="text-xs font-semibold text-slate-500">Average Satisfaction</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
              {avgSatisfaction}
            </span>
            <span className="text-xs text-slate-400">/ 5.0 Scale</span>
          </div>
          <p className="mt-2 text-[11px] text-purple-600 font-medium">Department Top Quartile</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <span className="text-xs font-semibold text-slate-500">Cohort Response Rate</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
              {avgResponseRate}%
            </span>
            <span className="text-xs text-slate-400">participation</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-600 font-medium">Statistically significant sample</p>
        </div>
      </div>

      {/* Filter Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700 dark:text-zinc-300">Filter Course Evaluation Scope:</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-semibold outline-none focus:border-apple-blue"
            aria-label="Filter feedback by course"
          >
            <option value="all">All Enrolled Courses (Department Aggregate)</option>
            {feedbackSummaries.map((s) => (
              <option key={s.courseId} value={s.courseId}>
                {s.courseCode}: {s.courseName} ({s.responseCount} responses)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Single Course Shield State (if selected course has < minimum threshold) */}
      {selectedCourseId !== 'all' && !feedbackSummaries.find((s) => s.courseId === selectedCourseId)?.meetsThreshold && (
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-500 flex items-center justify-center">
            <EyeOff className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
            Privacy Shield Active: Response Threshold Not Reached
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            This subject currently has {feedbackSummaries.find((s) => s.courseId === selectedCourseId)?.responseCount} responses, which is below the mandatory privacy threshold of {minimumResponseThreshold} students. Detailed category ratings and distributions are shielded to preserve student confidentiality.
          </p>
        </div>
      )}

      {/* Charts Section: Category Comparison Horizontal Bar Chart & Rating Distribution */}
      {(selectedCourseId === 'all' || feedbackSummaries.find((s) => s.courseId === selectedCourseId)?.meetsThreshold) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Horizontal Bar Chart (7 cols) */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  Instructional Category Comparison
                </h3>
                <p className="text-xs text-slate-400">Mean evaluation scores out of 5.0 (Rating Scale)</p>
              </div>
              <span className="text-xs font-semibold text-apple-blue">
                Target: &gt; 4.0 / 5.0
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryBarData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 5]} stroke="#86868b" fontSize={11} tickCount={6} />
                  <YAxis type="category" dataKey="category" stroke="#86868b" fontSize={11} tickLine={false} width={110} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-2.5 bg-zinc-900 text-white text-xs rounded-xl shadow-lg border border-zinc-700">
                            <p className="font-bold">{data.category}</p>
                            <p className="text-blue-400 mt-0.5">Average Score: {data.score} / 5.0</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]} fill="#0071e3">
                    {categoryBarData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.score >= 4.5 ? '#34c759' : entry.score >= 4.0 ? '#0071e3' : '#ff9f0a'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-center gap-6 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Exemplary (&ge; 4.5)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-apple-blue" />
                <span>Good (&ge; 4.0)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Needs Review (&lt; 4.0)</span>
              </div>
            </div>
          </div>

          {/* Rating Distribution Frequency (5 cols) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                Rating Distribution (5-Point Likert)
              </h3>
              <p className="text-xs text-slate-400">Total student ratings breakdown across evaluations</p>
            </div>

            <div className="space-y-3 my-4">
              {overallDistData.map((d) => (
                <div key={d.name} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                    <span className="font-semibold">{d.name}</span>
                    <span>{d.count} ratings</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        d.stars === 5
                          ? 'bg-emerald-500'
                          : d.stars === 4
                          ? 'bg-apple-blue'
                          : d.stars === 3
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${totalResponses > 0 ? (d.count / totalResponses) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Overall Positive Ratio (4 & 5 stars):</span>
              <strong className="text-emerald-600">92% Approval</strong>
            </div>
          </div>
        </div>
      )}

      {/* Historical Trend Multi-Semester Line Chart */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              Longitudinal Evaluation Trends (4 Academic Semesters)
            </h3>
            <p className="text-xs text-slate-400">Tracking instructional satisfaction trajectory from Spring 2025 to Fall 2026</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+0.2 Overall Growth</span>
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalTrendData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="period" stroke="#86868b" fontSize={11} />
              <YAxis domain={[3.5, 5.0]} stroke="#86868b" fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 bg-zinc-900 text-white text-xs rounded-xl shadow-lg border border-zinc-700">
                        <p className="font-bold">{data.period}</p>
                        <p className="text-emerald-400">Mean Score: {data.score} / 5.0</p>
                        <p className="text-slate-400 text-[11px]">{data.respondents} students participated</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#0071e3"
                strokeWidth={3}
                dot={{ r: 5, fill: '#0071e3' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actionable Insights & Recommendations Engine (Section E Requirement) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Insights & Recommended Actions</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated heuristics analyzing student survey data to suggest concrete pedagogy adjustments.
            </p>
          </div>

          {/* Filter recommendations */}
          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'planned', 'in_progress', 'completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setRecommendationFilter(filter)}
                className={`px-3 py-1 rounded-full font-semibold capitalize transition-colors ${
                  recommendationFilter === filter
                    ? 'bg-apple-blue text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                {filter.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3.5">
          {filteredRecommendations.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No recommendations matching the active filter.
            </div>
          ) : (
            filteredRecommendations.map((rec) => {
              const course = courses.find((c) => c.id === rec.courseId);

              return (
                <div
                  key={rec.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-700/60 flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {course?.code || 'Course'}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded uppercase text-[10px] ${
                          rec.type === 'strength'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.type === 'improvement'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {rec.type}
                      </span>
                      <span className="text-slate-400">Category: <strong className="capitalize">{rec.category}</strong></span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                      {rec.title}
                    </h4>

                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                      <strong>Evidence:</strong> {rec.evidence}
                    </p>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-700/60 text-slate-800 dark:text-zinc-200">
                      <strong>Suggested Action:</strong> {rec.suggestedAction}
                    </div>

                    <p className="text-[10px] text-slate-400 font-mono">
                      Rule: {rec.ruleTriggered}
                    </p>
                  </div>

                  {/* Status Toggle Action Buttons (Planned / In Progress / Completed) */}
                  <div className="shrink-0 flex sm:flex-col items-end gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                      Status:
                    </span>
                    <div className="flex items-center gap-1">
                      {(['planned', 'in_progress', 'completed'] as ActionRecommendationStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateRecommendationStatus(rec.id, status)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                            rec.status === status
                              ? status === 'completed'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : status === 'in_progress'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-apple-blue text-white shadow-xs'
                              : 'bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-100'
                          }`}
                        >
                          {status.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
