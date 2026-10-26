import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export const GradesPage: React.FC = () => {
  const { user, courses, assignments } = useApp();

  const gradedAssignments = assignments.filter((a) => a.status === 'graded');

  // Academic Course Grade summary data
  const courseGradeSummary = courses.map((course) => {
    const assigned = assignments.filter((a) => a.courseId === course.id);
    const graded = assigned.filter((a) => a.status === 'graded');
    const avgScore =
      graded.length > 0
        ? Math.round(
            graded.reduce((acc, curr) => acc + ((curr.grade || 0) / curr.maxGrade) * 100, 0) /
              graded.length
          )
        : 88; // sample baseline for courses with graded items in progress

    let letterGrade = 'A';
    let gpaPoint = 4.0;
    if (avgScore >= 93) {
      letterGrade = 'A';
      gpaPoint = 4.0;
    } else if (avgScore >= 88) {
      letterGrade = 'A-';
      gpaPoint = 3.7;
    } else if (avgScore >= 82) {
      letterGrade = 'B+';
      gpaPoint = 3.3;
    } else {
      letterGrade = 'B';
      gpaPoint = 3.0;
    }

    return {
      code: course.code,
      name: course.name,
      credits: course.credits,
      averagePercentage: avgScore,
      letterGrade,
      gpaPoint,
      color: course.color,
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Academic Performance & Grades</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Verified laboratory scorecards, qualitative instructor feedback, and cumulative GPA metrics.
          </p>
        </div>
      </div>

      {/* Top Academic Standing Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Cumulative GPA (CGPA)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {user.cgpa}
            </span>
            <span className="text-xs text-slate-400">/ 4.00 Scale</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            First Class with Distinction
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Credits Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {user.creditsEarned}
            </span>
            <span className="text-xs text-slate-400">/ {user.totalCredits} req.</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {user.totalCredits - user.creditsEarned} credits remaining for B.Tech
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Evaluated Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {gradedAssignments.length}
            </span>
            <span className="text-xs text-slate-400">of {assignments.length} total</span>
          </div>
          <p className="mt-2 text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            100% on-time submission record
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Current Semester</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              3.88
            </span>
            <span className="text-xs text-slate-400">SGPA (Projected)</span>
          </div>
          <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            Semester 6 • Fall 2026
          </p>
        </div>
      </div>

      {/* Performance by Course Chart */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Course Grade Distribution & Performance
            </h2>
            <p className="text-xs text-slate-400">Calculated average scores across enrolled engineering subjects</p>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseGradeSummary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="code" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 bg-slate-900 text-white text-xs rounded-xl shadow-lg border border-slate-700">
                        <p className="font-bold">{data.code}: {data.name}</p>
                        <p className="text-blue-400 mt-1">Average Score: {data.averagePercentage}%</p>
                        <p className="text-slate-300">Grade: {data.letterGrade} ({data.gpaPoint} GPA)</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="averagePercentage" radius={[6, 6, 0, 0]} fill="#3b82f6">
                {courseGradeSummary.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graded Assignments Table with Qualitative Instructor Feedback */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Graded Submissions & Qualitative Instructor Feedback
          </h2>
          <p className="text-xs text-slate-400">
            Detailed criteria breakdowns and recommendations from course professors
          </p>
        </div>

        <div className="space-y-4">
          {gradedAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {assignment.courseCode}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {assignment.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950">
                    Score: {assignment.grade} / {assignment.maxGrade} (
                    {Math.round(((assignment.grade || 0) / assignment.maxGrade) * 100)}%)
                  </span>
                </div>
              </div>

              {assignment.feedback && (
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  <strong>Instructor Feedback:</strong> "{assignment.feedback}"
                </div>
              )}

              {assignment.submittedFile && (
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="font-mono">Deliverable: {assignment.submittedFile}</span>
                  <span>Evaluated by Department Panel</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Metric Explanations Box (HMI: Match Between System & Real World) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Understanding Academic Grading Metrics (HMI Transparency)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-600 dark:text-slate-400">
              <div>
                <strong className="text-slate-800 dark:text-slate-200">CGPA (Cumulative):</strong> Weighted average of all grade points across all semesters completed to date.
              </div>
              <div>
                <strong className="text-slate-800 dark:text-slate-200">SGPA (Semester):</strong> Grade point average calculated specifically for the ongoing Fall 2026 semester.
              </div>
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Credits Earned:</strong> Total academic credits fulfilled toward the 120-credit Bachelor of Technology degree requirement.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
