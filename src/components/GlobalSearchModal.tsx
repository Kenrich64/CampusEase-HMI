import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, BookOpen, FileText, Bell, X, ArrowRight, CornerDownLeft } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { searchModalOpen, setSearchModalOpen, assignments, courses, announcements } = useApp();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'assignments' | 'courses' | 'announcements'>('all');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  if (!searchModalOpen) return null;

  const filteredAssignments = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.courseCode.toLowerCase().includes(query.toLowerCase()) ||
      a.courseName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.instructor.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAnnouncements = announcements.filter(
    (an) =>
      an.title.toLowerCase().includes(query.toLowerCase()) ||
      an.content.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (url: string) => {
    setSearchModalOpen(false);
    navigate(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setSearchModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Global search palette"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assignments, courses, faculty, announcements... (Press Esc to exit)"
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-base outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 rounded">
            ESC
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveFilter('assignments')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeFilter === 'assignments'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Assignments ({filteredAssignments.length})
          </button>
          <button
            onClick={() => setActiveFilter('courses')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeFilter === 'courses'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Courses ({filteredCourses.length})
          </button>
          <button
            onClick={() => setActiveFilter('announcements')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeFilter === 'announcements'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Notices ({filteredAnnouncements.length})
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {(activeFilter === 'all' || activeFilter === 'assignments') && filteredAssignments.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Assignments
              </div>
              {filteredAssignments.slice(0, 4).map((a) => (
                <button
                  key={a.id}
                  onClick={() => handleSelect(`/assignments?id=${a.id}`)}
                  className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {a.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {a.courseCode} • Due {new Date(a.dueDate).toLocaleDateString()} • Status: <span className="capitalize font-medium">{a.status}</span>
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'courses') && filteredCourses.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Enrolled Courses
              </div>
              {filteredCourses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(`/courses/${c.id}`)}
                  className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {c.code}: {c.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {c.instructor} • {c.credits} Credits • {c.schedule}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'announcements') && filteredAnnouncements.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Announcements & Notices
              </div>
              {filteredAnnouncements.slice(0, 3).map((an) => (
                <button
                  key={an.id}
                  onClick={() => handleSelect('/announcements')}
                  className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                        {an.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {an.author} • {new Date(an.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {filteredAssignments.length === 0 && filteredCourses.length === 0 && filteredAnnouncements.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No matching academic records found</p>
              <p className="text-xs mt-1">Try querying "HMI", "assignment", "exam", or course code "CS301".</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 font-mono bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shadow-xs">
              <CornerDownLeft className="w-3 h-3 inline" />
            </kbd>{' '}
            to select
          </span>
          <span>CampusEase Unified Search</span>
        </div>
      </div>
    </div>
  );
};
