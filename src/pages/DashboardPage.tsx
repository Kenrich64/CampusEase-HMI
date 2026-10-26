import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  FileCheck2,
  AlertTriangle,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Bell,
  ArrowUpRight,
  UploadCloud,
  MessageSquareHeart,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user, courses, assignments, announcements, surveys, completedSurveys } = useApp();
  const navigate = useNavigate();

  // Statistics dynamically calculated from actual sample data
  const enrolledCount = courses.length;
  const pendingAssignments = assignments.filter((a) => a.status === 'pending');
  const overdueAssignments = assignments.filter((a) => a.status === 'overdue');
  const submittedAssignments = assignments.filter((a) => a.status === 'submitted');
  const gradedAssignments = assignments.filter((a) => a.status === 'graded');

  // Next upcoming urgent deadline
  const sortedPending = [...pendingAssignments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  const nextUrgentAssignment = sortedPending[0];

  // Feedback Surveys metrics
  const completedCount = completedSurveys.length;
  const openSurveys = surveys.filter((s) => s.status === 'open' && !completedSurveys.some((c) => c.surveyId === s.id));

  // Helper for human-readable days remaining
  const getDaysRemainingText = (dueDateStr: string) => {
    const due = new Date(dueDateStr).getTime();
    const now = new Date('2026-10-25T12:00:00').getTime();
    const diffHours = Math.round((due - now) / (1000 * 60 * 60));
    if (diffHours < 0) return 'Overdue';
    if (diffHours < 24) return `Due in ${diffHours} hours`;
    const days = Math.round(diffHours / 24);
    return `Due in ${days} days (${new Date(dueDateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`;
  };

  // Recharts Data: Weekly Academic Workload
  const weeklyWorkloadData = [
    { day: 'Mon', hours: 4.5, lab: 'HMI Lab', assignments: 1 },
    { day: 'Tue', hours: 3.0, lab: 'DB Systems', assignments: 0 },
    { day: 'Wed', hours: 6.0, lab: 'HMI & Cloud', assignments: 1 },
    { day: 'Thu', hours: 5.0, lab: 'Agile & DB', assignments: 1 },
    { day: 'Fri', hours: 3.5, lab: 'Networks Lab', assignments: 0 },
    { day: 'Sat', hours: 2.0, lab: 'Study Commons', assignments: 0 },
    { day: 'Sun', hours: 1.5, lab: 'Prep', assignments: 0 },
  ];

  // Status Distribution for Pie Chart
  const statusPieData = [
    { name: 'Pending', value: pendingAssignments.length, color: '#0071e3' },
    { name: 'Submitted', value: submittedAssignments.length, color: '#34c759' },
    { name: 'Graded', value: gradedAssignments.length, color: '#af52de' },
    { name: 'Overdue', value: overdueAssignments.length, color: '#ff453a' },
  ];

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner (Apple-inspired gradient) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-xs text-white">
                {user.program}
              </span>
              <span className="text-xs text-blue-200">
                {user.semester} • {user.studentId}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-sm text-blue-100 mt-1 max-w-xl leading-relaxed">
              You have <strong className="text-white underline">{pendingAssignments.length} pending assignments</strong> and{' '}
              {overdueAssignments.length > 0 ? (
                <span className="text-amber-300 font-semibold">{overdueAssignments.length} overdue task needing attention.</span>
              ) : (
                'no overdue items. Great pace!'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/assignments"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-slate-900 font-semibold text-xs shadow-md hover:bg-slate-50 transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-apple-blue" />
              <span>View Assignments</span>
            </Link>
            <Link
              to="/feedback"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold text-xs backdrop-blur-xs border border-white/20 transition-all"
            >
              <MessageSquareHeart className="w-4 h-4 text-pink-300" />
              <span>Course Evaluations ({openSurveys.length})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrolled Courses */}
        <Link
          to="/courses"
          className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-apple-blue shadow-apple-subtle transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enrolled Courses</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-apple-blue flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{enrolledCount}</span>
            <span className="text-xs text-slate-400">active subjects</span>
          </div>
          <div className="mt-2 text-[11px] text-apple-blue font-medium flex items-center gap-1">
            <span>View course catalog</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Pending Assignments */}
        <Link
          to="/assignments?status=pending"
          className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-400 shadow-apple-subtle transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{pendingAssignments.length}</span>
            <span className="text-xs text-slate-400">deliverables</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-600 font-medium flex items-center gap-1">
            <span>Check deadlines</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Course Feedback Progress */}
        <Link
          to="/feedback"
          className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-purple-400 shadow-apple-subtle transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Course Evaluations</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
              {openSurveys.length} Open
            </span>
            <span className="text-xs text-emerald-600 font-medium">{completedCount} submitted</span>
          </div>
          <div className="mt-2 text-[11px] text-purple-600 font-medium flex items-center gap-1">
            <span>Complete evaluations</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Current CGPA */}
        <Link
          to="/grades"
          className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-emerald-400 shadow-apple-subtle transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cumulative GPA</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{user.cgpa}</span>
            <span className="text-xs text-emerald-600 font-medium">Top 5% Tier</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <span>View grades & feedback</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Urgent Next Deadline Spotlight Card */}
      {nextUrgentAssignment && (
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 shadow-apple-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                  Priority Deadline
                </span>
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  {getDaysRemainingText(nextUrgentAssignment.dueDate)}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 mt-1">
                {nextUrgentAssignment.courseCode}: {nextUrgentAssignment.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 line-clamp-1">
                {nextUrgentAssignment.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate(`/assignments?id=${nextUrgentAssignment.id}`)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Simulate Submission</span>
            </button>
          </div>
        </div>
      )}

      {/* Charts Section: Workload Bar Chart + Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Academic Workload Chart (2 Cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                Weekly Academic Workload
              </h2>
              <p className="text-xs text-slate-400">Scheduled laboratory & projected study hours</p>
            </div>
            <span className="text-xs font-semibold text-apple-blue">
              Avg 3.7 hrs/day
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyWorkloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#86868b" fontSize={11} tickLine={false} />
                <YAxis stroke="#86868b" fontSize={11} tickLine={false} unit="h" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 bg-zinc-900 text-white text-xs rounded-xl shadow-lg border border-zinc-700">
                          <p className="font-bold">{data.day}: {data.hours} Hours</p>
                          <p className="text-slate-300 text-[11px] mt-0.5">{data.lab}</p>
                          {data.assignments > 0 && (
                            <p className="text-amber-400 text-[10px] mt-1">⚠️ {data.assignments} assignment deadline</p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]} fill="#0071e3">
                  {weeklyWorkloadData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.assignments > 0 ? '#ff9f0a' : '#0071e3'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-apple-blue" />
              <span>Standard Lab/Study Day</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-500" />
              <span>Day with Active Deadline</span>
            </div>
          </div>
        </div>

        {/* Assignment Status Breakdown Pie Chart (1 Col) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              Assignment Portfolio Status
            </h2>
            <p className="text-xs text-slate-400">Total {assignments.length} assignments registered</p>
          </div>

          <div className="h-44 my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="p-2 bg-zinc-900 text-white text-xs rounded-lg shadow">
                          <p className="font-semibold">{data.name}: {data.value} items</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800 text-xs">
            {statusPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-slate-900 dark:text-zinc-100">
                  {item.value} ({Math.round((item.value / assignments.length) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to="/assignments"
              className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-zinc-700/60 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-apple-blue flex items-center justify-center mb-2">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Submit Work</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Upload lab drafts</p>
            </Link>

            <Link
              to="/feedback"
              className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-pink-50/60 dark:hover:bg-pink-950/40 border border-slate-100 dark:border-zinc-700/60 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/60 text-pink-600 flex items-center justify-center mb-2">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Give Feedback</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Anonymous survey</p>
            </Link>

            <Link
              to="/calendar"
              className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 border border-slate-100 dark:border-zinc-700/60 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center mb-2">
                <Calendar className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Calendar</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Monthly deadlines</p>
            </Link>

            <Link
              to="/faculty-insights"
              className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-purple-50/60 dark:hover:bg-purple-950/40 border border-slate-100 dark:border-zinc-700/60 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 flex items-center justify-center mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Faculty Insights</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Aggregated metrics</p>
            </Link>
          </div>
        </div>

        {/* Recent Announcements Feed (2 Cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                Latest Announcements & Circulars
              </h2>
              <p className="text-xs text-slate-400">Department and academic quality broadcast feed</p>
            </div>
            <Link
              to="/announcements"
              className="text-xs text-apple-blue font-semibold hover:underline flex items-center gap-1"
            >
              <span>View all ({announcements.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((notice) => (
              <Link
                key={notice.id}
                to="/announcements"
                className="block p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors border border-slate-100 dark:border-zinc-700/50 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        notice.category === 'academic'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : notice.category === 'urgent'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {notice.category}
                    </span>
                    {notice.courseCode && (
                      <span className="text-xs font-semibold text-slate-500">
                        {notice.courseCode}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(notice.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100 mt-1.5 group-hover:text-apple-blue transition-colors">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-1 leading-relaxed">
                  {notice.content}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
