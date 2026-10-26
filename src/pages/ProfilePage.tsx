import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  SlidersHorizontal,
  Sun,
  Moon,
  Type,
  Eye,
  ZapOff,
  RotateCcw,
  ShieldAlert,
  Save,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, preferences, updatePreferences, resetAllDemoData } = useApp();

  // Local state for profile form
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    advisor: user.advisor,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to restore all demo data to baseline defaults? This will revert modified profile details, submissions, and preference flags.'
      )
    ) {
      resetAllDemoData();
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        advisor: user.advisor,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <SlidersHorizontal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Profile & Portal Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Personalize interface ergonomics, typography scaling, high-contrast visibility, and student metadata.
        </p>
      </div>

      {/* Accessibility & Ergonomics Preferences Card (HMI: User Control & Freedom, Inclusive Design) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Type className="w-5 h-5 text-blue-600" />
            <span>Accessibility & Visual Ergonomics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time interface adjustments stored in browser LocalStorage.
          </p>
        </div>

        {/* Theme Preference */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Color Theme Mode
          </label>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              type="button"
              onClick={() => updatePreferences({ theme: 'light' })}
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                preferences.theme === 'light'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Theme</span>
            </button>
            <button
              type="button"
              onClick={() => updatePreferences({ theme: 'dark' })}
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                preferences.theme === 'dark'
                  ? 'border-blue-600 bg-slate-800 text-blue-400 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Moon className="w-4 h-4 text-blue-400" />
              <span>Dark Theme</span>
            </button>
          </div>
        </div>

        {/* Text Scaling */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Text Size Scaling (WCAG 1.4.4 Resize Text)
          </label>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { id: 'normal', label: 'Default (100%)', scale: 'normal' },
              { id: 'large', label: 'Large (115%)', scale: 'large' },
              { id: 'xlarge', label: 'X-Large (130%)', scale: 'xlarge' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updatePreferences({ textScale: opt.scale as any })}
                className={`p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  preferences.textScale === opt.scale
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles: High Contrast & Reduced Motion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>High-Contrast Focus</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Enhances border contrast for high readability.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updatePreferences({ highContrast: !preferences.highContrast })}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                preferences.highContrast ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  preferences.highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ZapOff className="w-4 h-4 text-blue-600" />
                <span>Reduced Motion</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Disables non-essential transitions and micro-animations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updatePreferences({ reducedMotion: !preferences.reducedMotion })}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                preferences.reducedMotion ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  preferences.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Student Profile Information Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Student Profile Details</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit student demonstration profile information.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {user.studentId}
          </span>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Faculty Academic Advisor
              </label>
              <input
                type="text"
                value={formData.advisor}
                onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Reset Demo Data */}
      <div className="p-5 sm:p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
          <ShieldAlert className="w-5 h-5" />
          <span>Evaluation Reset Zone</span>
        </div>
        <p className="text-xs text-rose-800/80 dark:text-rose-300/80 leading-relaxed">
          Need to re-test task workflows from scratch for a clean assessment evaluation? Resetting clears modified assignment deliverables, read flags, and restores initial sample state.
        </p>
        <button
          onClick={handleResetData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Demo Data to Defaults</span>
        </button>
      </div>
    </div>
  );
};
