import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  CheckCheck,
  User,
  Sliders,
  LogOut,
  Type,
  Eye,
  ZapOff,
  UserCheck,
  GraduationCap,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    user,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    preferences,
    updatePreferences,
    toggleTheme,
    setTextScale,
    setSearchModalOpen,
    activeRole,
    setActiveRole,
    logout,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [accessibilityMenuOpen, setAccessibilityMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Breadcrumb mapping
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return [{ label: 'Dashboard', path: '/dashboard' }];
    if (path.startsWith('/assignments')) return [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Assignments', path: '/assignments' }];
    if (path.startsWith('/calendar')) return [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Academic Calendar', path: '/calendar' }];
    if (path.startsWith('/courses')) return [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Courses', path: '/courses' }];
    if (path.startsWith('/feedback')) return [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Feedback & Evaluation', path: '/feedback' }];
    if (path.startsWith('/faculty-insights')) return [{ label: 'Leadership', path: '/faculty-insights' }, { label: 'Faculty & Admin Insights', path: '/faculty-insights' }];
    if (path.startsWith('/announcements')) return [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Announcements', path: '/announcements' }];
    if (path.startsWith('/grades')) return [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Grades & Progress', path: '/grades' }];
    if (path.startsWith('/hmi-principles')) return [{ label: 'Documentation', path: '/hmi-principles' }, { label: '15 HMI Principles', path: '/hmi-principles' }];
    if (path.startsWith('/usability-evaluation')) return [{ label: 'Lab Assessment', path: '/usability-evaluation' }, { label: 'Usability Testing (7 Tasks)', path: '/usability-evaluation' }];
    if (path.startsWith('/preferences')) return [{ label: 'Account', path: '/preferences' }, { label: 'Preferences & Accessibility', path: '/preferences' }];
    if (path.startsWith('/help')) return [{ label: 'Support', path: '/help' }, { label: 'Help & Status Guide', path: '/help' }];
    return [{ label: 'CampusEase', path: '/dashboard' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 apple-glass border-b border-slate-200/80 dark:border-zinc-800 transition-colors">
      {/* Left: Mobile Drawer Trigger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-xl md:hidden text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumbs" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.path}>
              {idx > 0 && <span className="text-slate-300 dark:text-zinc-600">/</span>}
              <Link
                to={crumb.path}
                className={`hover:text-apple-blue dark:hover:text-apple-darkBlue font-medium transition-colors ${
                  idx === breadcrumbs.length - 1 ? 'text-slate-900 dark:text-zinc-100 font-semibold' : ''
                }`}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Center: Global Search Trigger Button */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setSearchModalOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-100/80 dark:bg-zinc-800/60 hover:bg-slate-200/70 dark:hover:bg-zinc-800 rounded-full border border-slate-200/60 dark:border-zinc-700/60 transition-all text-left"
          aria-label="Search portal"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search assignments, courses, notices, surveys...</span>
          </span>
          <kbd className="px-1.5 py-0.5 font-mono text-[10px] font-semibold bg-white dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 rounded border border-slate-200 dark:border-zinc-600 shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Role Switcher, Quick Accessibility, Theme, Notifications, User */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Demo Role Switcher Toggle (Student vs Faculty/Admin) */}
        <div className="hidden lg:flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 text-[11px] font-semibold">
          <button
            onClick={() => {
              setActiveRole('student');
              if (location.pathname === '/faculty-insights') navigate('/dashboard');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
              activeRole === 'student'
                ? 'bg-white dark:bg-zinc-900 text-apple-blue dark:text-apple-darkBlue shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
          <button
            onClick={() => {
              setActiveRole('faculty');
              navigate('/faculty-insights');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
              activeRole === 'faculty'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty View</span>
          </button>
        </div>

        {/* Mobile Search Icon */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
          aria-label="Open search dialog"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Accessibility Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setAccessibilityMenuOpen(!accessibilityMenuOpen);
              setNotificationsOpen(false);
              setProfileMenuOpen(false);
            }}
            className="p-2 rounded-full text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Accessibility Controls"
            aria-label="Accessibility options"
          >
            <Type className="w-4 h-4" />
          </button>

          {accessibilityMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 p-3 bg-white dark:bg-zinc-900 rounded-3xl shadow-apple-elevated border border-slate-200 dark:border-zinc-800 text-xs z-50 animate-in fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-semibold text-slate-900 dark:text-zinc-100 pb-2 border-b border-slate-100 dark:border-zinc-800">
                Visual Ergonomics & Access
              </p>
              
              <div className="py-2.5 space-y-1.5">
                <span className="text-slate-500 font-medium">Text Scaling (WCAG):</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['normal', 'large', 'xlarge'] as const).map((scale) => (
                    <button
                      key={scale}
                      onClick={() => setTextScale(scale)}
                      className={`px-2 py-1 rounded-xl text-center font-medium capitalize transition-colors ${
                        preferences.textScale === scale
                          ? 'bg-apple-blue text-white'
                          : 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {scale === 'normal' ? '100%' : scale === 'large' ? '115%' : '130%'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                <button
                  onClick={() => updatePreferences({ highContrast: !preferences.highContrast })}
                  className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" /> High Contrast
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${preferences.highContrast ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                    {preferences.highContrast ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => updatePreferences({ reducedMotion: !preferences.reducedMotion })}
                  className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ZapOff className="w-3.5 h-3.5" /> Reduced Motion
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${preferences.reducedMotion ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                    {preferences.reducedMotion ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          title={`Switch to ${preferences.theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle dark/light theme"
        >
          {preferences.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileMenuOpen(false);
              setAccessibilityMenuOpen(false);
            }}
            className="relative p-2 rounded-full text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-apple-danger ring-2 ring-white dark:ring-zinc-900" />
            )}
          </button>

          {notificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-3xl shadow-apple-elevated border border-slate-200 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50/70 dark:bg-zinc-950/70 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      notifications.forEach((n) => markNotificationAsRead(n.id));
                    }}
                    className="text-xs text-apple-blue dark:text-apple-darkBlue hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.actionUrl) {
                          setNotificationsOpen(false);
                          navigate(n.actionUrl);
                        }
                      }}
                      className={`p-3.5 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors ${
                        !n.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-semibold ${!n.isRead ? 'text-blue-950 dark:text-blue-200' : 'text-slate-800 dark:text-zinc-200'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="px-4 py-2 bg-slate-50 dark:bg-zinc-950/70 border-t border-slate-100 dark:border-zinc-800 text-center">
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300"
                  >
                    Clear All Notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Avatar & Role Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileMenuOpen(!profileMenuOpen);
              setNotificationsOpen(false);
              setAccessibilityMenuOpen(false);
            }}
            className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
            aria-label="Student account options"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-apple-blue to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {activeRole === 'faculty' ? 'EV' : user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden lg:block text-xs">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 leading-tight">
                {activeRole === 'faculty' ? 'Dr. Eleanor Vance' : user.name}
              </p>
              <p className="text-[10px] text-slate-400">
                {activeRole === 'faculty' ? 'Faculty Coordinator' : user.studentId}
              </p>
            </div>
          </button>

          {profileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-60 bg-white dark:bg-zinc-900 rounded-3xl shadow-apple-elevated border border-slate-200 dark:border-zinc-800 p-2 z-50 text-xs animate-in fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2 border-b border-slate-100 dark:border-zinc-800">
                <p className="font-semibold text-slate-900 dark:text-zinc-100">
                  {activeRole === 'faculty' ? 'Dr. Eleanor Vance (Faculty)' : user.name}
                </p>
                <p className="text-slate-400 truncate">
                  {activeRole === 'faculty' ? 'e.vance@eng.college.edu' : user.email}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-apple-blue dark:bg-zinc-800 dark:text-apple-darkBlue">
                  {activeRole === 'faculty' ? 'Faculty / Admin Session' : 'Student Demo Session'}
                </span>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  to="/feedback"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Student Feedback Hub</span>
                </Link>
                <Link
                  to="/faculty-insights"
                  onClick={() => {
                    setActiveRole('faculty');
                    setProfileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>Faculty Insights Dashboard</span>
                </Link>
                <Link
                  to="/preferences"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Sliders className="w-4 h-4 text-slate-400" />
                  <span>Preferences & Accessibility</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-zinc-800">
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-apple-danger hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out (Demo)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
