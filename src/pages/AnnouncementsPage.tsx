import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Announcement } from '../types';
import {
  Megaphone,
  CheckCheck,
  Search,
  Filter,
  Calendar,
  User,
  X,
} from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { announcements, markAnnouncementAsRead, markAllAnnouncementsAsRead } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'academic' | 'department' | 'campus' | 'urgent'>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Announcement | null>(null);

  const unreadCount = announcements.filter((a) => !a.isRead).length;

  const filteredAnnouncements = announcements.filter((notice) => {
    if (categoryFilter !== 'all' && notice.category !== categoryFilter) return false;
    if (unreadOnly && notice.isRead) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        notice.title.toLowerCase().includes(q) ||
        notice.content.toLowerCase().includes(q) ||
        notice.author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenNotice = (notice: Announcement) => {
    setSelectedNotice(notice);
    if (!notice.isRead) {
      markAnnouncementAsRead(notice.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Announcements & Circulars</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official department notices, examination schedules, campus events, and academic circulars.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAnnouncementsAsRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 font-semibold text-xs transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search (6 cols) */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars by keyword, instructor, or topic..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category Pills (4 cols) */}
        <div className="sm:col-span-4 relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm outline-none focus:border-blue-500 cursor-pointer appearance-none"
            aria-label="Filter notices by category"
          >
            <option value="all">All Notice Categories</option>
            <option value="academic">Academic & Curriculum</option>
            <option value="department">Department & Faculty</option>
            <option value="campus">Campus & Library</option>
            <option value="urgent">Urgent & Administrative</option>
          </select>
        </div>

        {/* Unread Only Toggle (2 cols) */}
        <div className="sm:col-span-2 flex items-center">
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              unreadOnly
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>Unread Only</span>
            {unreadCount > 0 && (
              <span className={`px-1 rounded-full text-[10px] ${unreadOnly ? 'bg-white/20' : 'bg-blue-100 text-blue-700'}`}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3.5">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Megaphone className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-slate-400 font-medium">No announcements match your search filters.</p>
          </div>
        ) : (
          filteredAnnouncements.map((notice) => (
            <div
              key={notice.id}
              onClick={() => handleOpenNotice(notice)}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all cursor-pointer hover:shadow-sm group ${
                !notice.isRead
                  ? 'border-blue-300 dark:border-blue-800/80 bg-blue-50/20 dark:bg-blue-950/10'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      notice.category === 'academic'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : notice.category === 'urgent'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : notice.category === 'department'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {notice.category}
                  </span>

                  {notice.courseCode && (
                    <span className="text-xs font-bold text-slate-500">
                      {notice.courseCode}
                    </span>
                  )}

                  {!notice.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" title="Unread notice" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(notice.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {notice.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                {notice.content}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{notice.author} • {notice.authorRole}</span>
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  Read full notice →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Full Notice Modal */}
      {selectedNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedNotice(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Announcement view"
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
              <div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedNotice.category === 'academic'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : selectedNotice.category === 'urgent'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {selectedNotice.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {selectedNotice.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span>By: <strong>{selectedNotice.author}</strong> ({selectedNotice.authorRole})</span>
                <span>{new Date(selectedNotice.date).toLocaleString()}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                {selectedNotice.content}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
