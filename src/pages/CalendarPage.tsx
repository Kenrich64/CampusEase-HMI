import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Calendar as CalendarIcon,
  ArrowRight,
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { assignments } = useApp();
  const navigate = useNavigate();

  // Mode: 'calendar' or 'list' (List alternative for accessibility and screen readers)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  // Current calendar viewing month (Year: 2026, Month: 9 for October (0-indexed))
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1));
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-27');

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar grid days for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Additional academic events (midterms, symposia, breaks)
  const academicEvents = [
    { id: 'ev1', date: '2026-10-21', title: 'AWS Cloud Workshop', category: 'workshop' },
    { id: 'ev2', date: '2026-10-28', title: 'Google UX Guest Lecture (CS301)', category: 'lecture' },
    { id: 'ev3', date: '2026-11-04', title: 'HMI Laboratory Final Presentations', category: 'assessment' },
    { id: 'ev4', date: '2026-11-16', title: 'Fall Mid-Semester Theory Exams Begin', category: 'exam' },
    { id: 'ev5', date: '2026-11-21', title: 'Annual Engineering Hackathon', category: 'event' },
  ];

  // Helper to get deadlines & events for a given YYYY-MM-DD
  const getItemsForDate = (dateStr: string) => {
    const matchedAssignments = assignments.filter((a) => a.dueDate.startsWith(dateStr));
    const matchedEvents = academicEvents.filter((e) => e.date === dateStr);
    return { assignments: matchedAssignments, events: matchedEvents };
  };

  const selectedDateItems = getItemsForDate(selectedDate);

  // Month label
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Page Header + View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Academic Deadline Calendar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual month planner with accessible table view, synchronizing lab deadlines and institute events.
          </p>
        </div>

        {/* View Mode Toggle (Calendar vs Accessible List) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Accessible List View</span>
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Grid (8 cols) */}
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {monthName}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(2026, 9, 1))}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  Oct 2026
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-slate-400 mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Day Cells Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty padding before day 1 */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 opacity-40" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const formattedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const { assignments: dayAssignments, events: dayEvents } = getItemsForDate(formattedDateStr);
                const isSelected = selectedDate === formattedDateStr;
                const isToday = formattedDateStr === '2026-10-25';

                return (
                  <button
                    key={dayNum}
                    onClick={() => setSelectedDate(formattedDateStr)}
                    className={`h-20 p-1.5 sm:p-2 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 shadow-xs ring-2 ring-blue-500/20'
                        : isToday
                        ? 'border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-900 font-bold'
                        : 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold ${
                          isToday
                            ? 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]'
                            : isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {dayNum}
                      </span>
                    </div>

                    {/* Deadline indicators */}
                    <div className="space-y-1 overflow-hidden">
                      {dayAssignments.slice(0, 1).map((a) => (
                        <div
                          key={a.id}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold truncate ${
                            a.status === 'overdue'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : a.status === 'submitted'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {a.courseCode}
                        </div>
                      ))}

                      {dayEvents.slice(0, 1).map((ev) => (
                        <div
                          key={ev.id}
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold truncate bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                        >
                          {ev.title.slice(0, 10)}..
                        </div>
                      ))}

                      {dayAssignments.length + dayEvents.length > 2 && (
                        <span className="text-[9px] text-slate-400 block text-right font-medium">
                          +{dayAssignments.length + dayEvents.length - 1} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Detail Sidebar (4 cols) */}
          <div className="lg:col-span-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Schedule for {new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <p className="text-xs text-slate-400">Events & assignment submissions</p>
                </div>
              </div>

              {selectedDateItems.assignments.length === 0 && selectedDateItems.events.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">No deadlines or events on this date</p>
                  <p className="text-[11px] mt-1 text-slate-400">Click a day with a colored badge to inspect.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateItems.assignments.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => navigate(`/assignments?id=${a.id}`)}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-blue-400 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {a.courseCode}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            a.status === 'overdue'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : a.status === 'submitted'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2 group-hover:text-blue-600 transition-colors">
                        {a.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {a.description}
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                        <span>Open details & submit</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}

                  {selectedDateItems.events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                        {ev.category} Event
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                        {ev.title}
                      </h4>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Deadlines Quick Glance */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Next Immediate Deadlines
              </span>
              <div className="space-y-2">
                {assignments
                  .filter((a) => a.status === 'pending')
                  .slice(0, 2)
                  .map((a) => (
                    <button
                      key={a.id}
                      onClick={() => navigate(`/assignments?id=${a.id}`)}
                      className="w-full text-left p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 text-xs flex items-center justify-between transition-colors"
                    >
                      <div className="truncate mr-2">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{a.title}</p>
                        <p className="text-[10px] text-slate-400">{a.courseCode} • Due {new Date(a.dueDate).toLocaleDateString()}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Accessible List-Based Alternative View (HMI: Accessible & Inclusive Design) */
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Accessible Chronological Deadlines & Milestones
            </h2>
            <p className="text-xs text-slate-400">
              Screen-reader friendly, non-color-dependent linear list ordered by due date.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold text-xs">
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Course</th>
                  <th className="py-3 px-3">Deliverable / Event</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {assignments.map((assignment) => {
                  const dateObj = new Date(assignment.dueDate);
                  return (
                    <tr
                      key={assignment.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3 font-mono text-xs whitespace-nowrap">
                        <strong>{dateObj.toLocaleDateString()}</strong> at{' '}
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {assignment.courseCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {assignment.title}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {assignment.description}
                        </p>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            assignment.status === 'overdue'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : assignment.status === 'submitted'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : assignment.status === 'graded'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {assignment.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/assignments?id=${assignment.id}`)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold text-xs transition-colors"
                        >
                          View / Submit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
