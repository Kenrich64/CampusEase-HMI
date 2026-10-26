import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FileCheck2,
  CalendarDays,
  BookOpenCheck,
  Megaphone,
  Award,
  Sparkles,
  FlaskConical,
  SlidersHorizontal,
  HelpCircle,
  GraduationCap,
  X,
  RotateCcw,
  MessageSquareHeart,
  BarChart3,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { assignments, announcements, surveys, completedSurveys, resetAllDemoData, activeRole } = useApp();
  const navigate = useNavigate();

  const pendingAssignmentsCount = assignments.filter((a) => a.status === 'pending').length;
  const overdueAssignmentsCount = assignments.filter((a) => a.status === 'overdue').length;
  const unreadAnnouncementsCount = announcements.filter((a) => !a.isRead).length;

  const openSurveysCount = surveys.filter(
    (s) => s.status === 'open' && !completedSurveys.some((c) => c.surveyId === s.id)
  ).length;

  const handleReset = () => {
    if (window.confirm('Reset all demo data (assignments, evaluations, preferences, notices, usability metrics) to initial defaults?')) {
      resetAllDemoData();
      navigate('/dashboard');
    }
  };

  const navLinks = [
    {
      group: 'STUDENT PORTAL',
      items: [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        {
          name: 'Assignments',
          to: '/assignments',
          icon: FileCheck2,
          badge: pendingAssignmentsCount + (overdueAssignmentsCount > 0 ? ` (${overdueAssignmentsCount} overdue)` : ''),
          badgeVariant: overdueAssignmentsCount > 0 ? 'danger' : 'info',
        },
        { name: 'Academic Calendar', to: '/calendar', icon: CalendarDays },
        { name: 'My Courses', to: '/courses', icon: BookOpenCheck },
        {
          name: 'Feedback & Evaluation',
          to: '/feedback',
          icon: MessageSquareHeart,
          badge: openSurveysCount > 0 ? `${openSurveysCount} Open` : 'Completed',
          badgeVariant: openSurveysCount > 0 ? 'warning' : 'success',
        },
        {
          name: 'Announcements',
          to: '/announcements',
          icon: Megaphone,
          badge: unreadAnnouncementsCount > 0 ? `${unreadAnnouncementsCount} new` : undefined,
          badgeVariant: 'warning',
        },
        { name: 'Grades & Progress', to: '/grades', icon: Award },
      ],
    },
    {
      group: 'FACULTY & INSIGHTS',
      items: [
        {
          name: 'Faculty & Admin Insights',
          to: '/faculty-insights',
          icon: BarChart3,
          badge: 'Analytics',
          badgeVariant: 'purple',
        },
      ],
    },
    {
      group: 'HMI LABORATORY PROJECT',
      items: [
        {
          name: 'HMI Design Principles',
          to: '/hmi-principles',
          icon: Sparkles,
          badge: '15 Principles',
          badgeVariant: 'purple',
        },
        {
          name: 'Usability Evaluation',
          to: '/usability-evaluation',
          icon: FlaskConical,
          badge: '7 Tasks Lab',
          badgeVariant: 'purple',
        },
      ],
    },
    {
      group: 'PREFERENCES & SUPPORT',
      items: [
        { name: 'Preferences & Access', to: '/preferences', icon: SlidersHorizontal },
        { name: 'Help & Status Guide', to: '/help', icon: HelpCircle },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-slate-200/80 dark:border-zinc-800 transition-colors select-none">
      {/* Apple-style Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 dark:border-zinc-800">
        <NavLink to="/dashboard" onClick={onClose} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-apple-blue to-indigo-600 text-white flex items-center justify-center shadow-md shadow-apple-blue/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-zinc-100">
                Campus<span className="text-apple-blue dark:text-apple-darkBlue">Ease</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-50 dark:bg-zinc-800 text-apple-blue dark:text-apple-darkBlue">
                2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">HMI Human-Centered LMS</p>
          </div>
        </NavLink>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full md:hidden text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800"
          aria-label="Close navigation sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navLinks.map((section) => (
          <div key={section.group}>
            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              {section.group}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-slate-100 dark:bg-zinc-800 text-apple-blue dark:text-apple-darkBlue font-semibold shadow-2xs'
                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5">
                        <item.icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-apple-blue dark:text-apple-darkBlue'
                              : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-zinc-300'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            item.badgeVariant === 'danger'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : item.badgeVariant === 'warning'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : item.badgeVariant === 'success'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.badgeVariant === 'purple'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Reset Demo Data Button */}
      <div className="p-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-slate-300 shadow-2xs transition-all"
          title="Reset sample assignments and actions to initial state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-apple-blue" />
          <span>Reset Demo Data (2.0)</span>
        </button>
        <p className="mt-2 text-[10px] text-center text-slate-400 leading-tight">
          Third-Year CE HMI Assessment Prototype
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={onClose}
        >
          <div
            className="w-72 h-full bg-white dark:bg-zinc-900 shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
