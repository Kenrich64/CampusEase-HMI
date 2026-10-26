import React from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Keyboard,
} from 'lucide-react';

export const HelpGuidancePage: React.FC = () => {
  const statusDefinitions = [
    {
      status: 'Pending',
      badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      icon: Clock,
      definition:
        'Deliverable is published by faculty and actively awaiting student submission. The due date is in the future.',
      studentAction:
        'Open the assignment modal, attach simulated files, add notes, and submit before deadline.',
    },
    {
      status: 'Submitted',
      badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      icon: CheckCircle2,
      definition:
        'Student has submitted a deliverable file. The file is registered in local state and queued for instructor evaluation.',
      studentAction:
        'You may review your uploaded file name or replace the submission prior to the deadline.',
    },
    {
      status: 'Overdue',
      badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
      icon: AlertTriangle,
      definition:
        'The deadline has passed without a confirmed student submission. Marked with high visual salience.',
      studentAction:
        'Check course policy on late submissions or contact the course instructor immediately.',
    },
    {
      status: 'Graded',
      badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      icon: Award,
      definition:
        'Faculty evaluation is finalized. Official numerical score, letter grade, and written feedback are available.',
      studentAction:
        'Inspect rubric scoring criteria and qualitative advice in the Grades page.',
    },
  ];

  const shortcuts = [
    { keys: 'Ctrl + K  /  ⌘ + K', description: 'Open unified global search dialog across all data' },
    { keys: 'Escape', description: 'Close any active dialog, search modal, or slide-over drawer' },
    { keys: 'Tab / Shift + Tab', description: 'Cycle through keyboard-accessible interactive focus controls' },
    { keys: 'Enter / Space', description: 'Activate buttons, links, and simulated dropzone triggers' },
  ];

  const faqs = [
    {
      q: 'Is CampusEase connected to a live university server?',
      a: 'No. CampusEase is an academic usability prototype built specifically for a third-year Computer Engineering HMI laboratory assessment. All courses, grades, notices, and submissions are simulated in client-side LocalStorage.',
    },
    {
      q: 'How do I test the submission workflow for the HMI evaluation?',
      a: 'Go to the Assignments page, select any pending assignment (such as CS301 Heuristic Evaluation), click on the simulated dropzone, and click "Yes, Submit Now". You will see an immediate status change to "Submitted" and receive a confirmation toast notification.',
    },
    {
      q: 'How do I reset changes made during testing?',
      a: 'Click the "Reset Demo Data" button located at the bottom of the navigation sidebar or under the Preferences page. This immediately restores all baseline courses, assignments, and usability task metrics.',
    },
    {
      q: 'Where are the Nielsen-Norman HMI principles documented in the app?',
      a: 'Visit the "HMI Design Principles" page in the navigation sidebar, which provides detailed rationale, student benefits, and direct links to the concrete interface features demonstrating all 12 principles.',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Portal Guidance & Status Glossary</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Everything students and lab evaluators need to understand portal workflows, status signifiers, and navigation shortcuts.
        </p>
      </div>

      {/* Assignment Status Signifier Matrix */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Assignment Status Signifiers & States
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Explicit color semantics reduce cognitive recall and ambiguity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statusDefinitions.map((item) => (
            <div
              key={item.status}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${item.badgeClass}`}>
                  {item.status}
                </span>
                <item.icon className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {item.definition}
              </p>
              <p className="text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                <strong>Student Action:</strong> {item.studentAction}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts Table */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-blue-600" />
          <span>Keyboard Accessibility & Power Shortcuts</span>
        </h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between gap-4">
              <span className="font-mono font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                {sc.keys}
              </span>
              <span className="text-slate-600 dark:text-slate-400 text-right">
                {sc.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Frequently Asked Questions (Academic Viva Prep)
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs"
            >
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                {faq.q}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
