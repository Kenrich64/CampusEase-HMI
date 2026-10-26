import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Eye,
  CheckCircle2,
  Brain,
  Globe,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Accessibility,
  BellRing,
  Feather,
  MousePointerClick,
  Smartphone,
  Layers,
  Lock,
  ListOrdered,
  BarChart2,
  ArrowUpRight,
} from 'lucide-react';

export const HmiPrinciplesPage: React.FC = () => {
  const hmiPrinciples = [
    {
      id: 1,
      name: 'Visibility of System Status',
      category: 'Nielsen Heuristic #1',
      icon: Eye,
      campusEaseFeature: 'Real-Time Status Badges & Urgent Deadline Spotlight',
      targetRoute: '/dashboard',
      designDecision:
        'Deliverables continuously communicate state through standardized color tags (Pending in blue, Overdue in red, Submitted in green, Graded in purple). Urgent deadlines display dynamic hour countdowns, and active toast messages acknowledge every state change immediately.',
      userBenefit:
        'Eliminates ambiguity. Students know whether a deliverable is pending, under grading review, or overdue without hunting through sub-menus.',
      evaluationMethod:
        'Measure participant latency when asked to identify the immediate next deliverable and whether an assignment has been submitted.',
    },
    {
      id: 2,
      name: 'Feedback After User Actions',
      category: 'Interaction Feedback',
      icon: BellRing,
      campusEaseFeature: 'Toast Notifications & Simulated Upload Progress Bars',
      targetRoute: '/assignments',
      designDecision:
        'Submitting assignments, updating profile settings, completing surveys, and changing themes instantly trigger animated, semantic toast notifications with descriptive confirmation receipts.',
      userBenefit:
        'Provides closure and peace of mind. Students never question whether their click or file upload was registered by the system.',
      evaluationMethod:
        'Post-task subjective confidence ratings and observation of whether users attempt redundant duplicate clicks.',
    },
    {
      id: 3,
      name: 'Consistency and Standards',
      category: 'Nielsen Heuristic #4',
      icon: CheckCircle2,
      campusEaseFeature: 'Unified Apple-Inspired Card Patterns & Color Semantics',
      targetRoute: '/courses',
      designDecision:
        'Identical typography hierarchy (SF/Inter font stack), uniform card radii (22px), standard icon semaphoring, and consistent navigation breadcrumbs across every module.',
      userBenefit:
        'Interaction transfer is 100% predictable. Once a student learns how to navigate one course or assignment, all other modules feel instantly familiar.',
      evaluationMethod:
        'Compare task completion time across first-time use versus repeated use across different subjects.',
    },
    {
      id: 4,
      name: 'Recognition Rather than Recall',
      category: 'Nielsen Heuristic #6',
      icon: Brain,
      campusEaseFeature: 'Unified Global Search (Ctrl+K) & Filter Badge Counters',
      targetRoute: '/assignments',
      designDecision:
        'Navigation tabs display exact counts on-screen (e.g. "Pending: 5", "Surveys: 3 Open"). Global Command Palette (`Ctrl+K`) provides instant autocomplete recognition across courses, professors, and assignments.',
      userBenefit:
        'Reduces working memory load. Students recognize course names and titles directly on-screen instead of having to recall complex course codes from memory.',
      evaluationMethod:
        'Task completion time for locating an assignment with search versus browsing, and measuring cognitive workload via NASA-TLX.',
    },
    {
      id: 5,
      name: 'Match Between System and Real-World Language',
      category: 'Nielsen Heuristic #2',
      icon: Globe,
      campusEaseFeature: 'Plain Collegiate Terminology & Academic Metric Glossary',
      targetRoute: '/grades',
      designDecision:
        'Replaces obscure LMS jargon with transparent student vocabulary: "Cumulative GPA", "Credits Completed", "Office Hours Support", and provides an on-screen glossary of metric formulas.',
      userBenefit:
        'Aligns portal information directly with the natural mental model of university students and faculty advisors.',
      evaluationMethod:
        'Comprehension check surveys asking students to explain what their CGPA and credit requirements mean.',
    },
    {
      id: 6,
      name: 'Error Prevention',
      category: 'Nielsen Heuristic #5',
      icon: ShieldCheck,
      campusEaseFeature: 'Pre-Submission Confirmation Modals & Duplicate Shields',
      targetRoute: '/assignments',
      designDecision:
        'Two-step confirmation modal before finalizing assignment submissions and course evaluations. Clear visual cues prevent duplicate survey submissions for the same academic period.',
      userBenefit:
        'Protects students from accidental slips, premature file submissions, or submitting an unfinished evaluation.',
      evaluationMethod:
        'Count of slip attempts intercepted by confirmation dialogs during user testing sessions.',
    },
    {
      id: 7,
      name: 'Clear Error Recovery',
      category: 'Nielsen Heuristic #9',
      icon: RefreshCw,
      campusEaseFeature: 'Replace Deliverable Workflow & Plain-English Error Cues',
      targetRoute: '/assignments',
      designDecision:
        'If an assignment was erroneously submitted, CampusEase allows the student to attach a replacement deliverable in demo mode without bureaucratic lockouts, communicating error states in plain English.',
      userBenefit:
        'Empowers students to rectify mistakes quickly without submission anxiety or stress.',
      evaluationMethod:
        'Time required for a test subject to recover from an intentional mock error (e.g. replacing an uploaded draft).',
    },
    {
      id: 8,
      name: 'User Control and Freedom',
      category: 'Nielsen Heuristic #3',
      icon: Sliders,
      campusEaseFeature: 'Multi-View Switchers, ESC Modal Dismissal & 1-Click Reset',
      targetRoute: '/calendar',
      designDecision:
        'Students can dismiss any dialog with the Escape key or backdrop click, freely toggle between monthly calendar grids and linear lists, and reset all demo data to baseline at any time.',
      userBenefit:
        'Fosters autonomy and safety. Users can explore features knowing they can always reverse an action or switch to their preferred viewing paradigm.',
      evaluationMethod:
        'Observation of user navigation paths and frequency of "Back" or "Cancel" button utilization without frustration.',
    },
    {
      id: 9,
      name: 'Accessibility and Inclusive Design',
      category: 'WCAG 2.1 AA Standards',
      icon: Accessibility,
      campusEaseFeature: 'Font Scaling (100%–130%), High-Contrast Focus & Reduced Motion',
      targetRoute: '/preferences',
      designDecision:
        'WCAG AA compliant color contrast ratios, visible keyboard focus indicators (`:focus-visible`), font scaling controls (100%, 115%, 130%), and a non-color-dependent linear calendar view alternative.',
      userBenefit:
        'Ensures students with visual impairments, motor challenges, or vestibular disorders can study and submit assignments without accessibility barriers.',
      evaluationMethod:
        'Automated accessibility audits (Lighthouse / axe-core) and manual keyboard-only navigation verification.',
    },
    {
      id: 10,
      name: 'Minimal Cognitive Load',
      category: 'Cognitive Engineering',
      icon: Feather,
      campusEaseFeature: 'Progressive Disclosure & De-Cluttered Visual Hierarchy',
      targetRoute: '/dashboard',
      designDecision:
        'Clean card-based dashboard layout showing top urgent priorities first. Defer secondary details (rubrics, syllabus units, historic announcements) into accessible dialogs and tabbed views rather than displaying everything at once.',
      userBenefit:
        'Prevents information overload and cognitive fatigue during intensive exam preparation weeks.',
      evaluationMethod:
        'Eye-tracking heatmaps or subjective cognitive load ratings (NASA-TLX) during complex dashboard navigation.',
    },
    {
      id: 11,
      name: 'Affordances and Signifiers',
      category: 'Norman Design Principles',
      icon: MousePointerClick,
      campusEaseFeature: 'Elevations, Dashed Dropzone Borders & Keyboard Badges',
      targetRoute: '/courses',
      designDecision:
        'Buttons possess noticeable hover states, interactive cursor pointers, keyboard accelerator signifiers (e.g. `Ctrl K`), and dropzones with dashed border signifiers indicating file drop capability.',
      userBenefit:
        'Users can intuitively perceive what elements are interactive without trial-and-error guessing.',
      evaluationMethod:
        'First-click accuracy testing and time to first interaction on new interface components.',
    },
    {
      id: 12,
      name: 'Information Hierarchy',
      category: 'Visual Design Systems',
      icon: Layers,
      campusEaseFeature: 'Spacious Typography Ratios & Restrained Apple Palette',
      targetRoute: '/dashboard',
      designDecision:
        'Deliberate typographic sizing hierarchy (Page title 28px, Section header 18px, Body 14px, Captions 12px), near-black text on warm neutral surfaces, and restrained accent blues to guide eye flow.',
      userBenefit:
        'Establishes immediate scannability. Important deadlines and KPIs stand out clearly from supplementary metadata.',
      evaluationMethod:
        'Card sorting and five-second visual comprehension tests with undergraduate participants.',
    },
    {
      id: 13,
      name: 'Privacy-Aware Interaction Design',
      category: 'Security & Ethical HMI',
      icon: Lock,
      campusEaseFeature: 'Decoupled Anonymous Feedback & 5-Response Privacy Shield',
      targetRoute: '/faculty-insights',
      designDecision:
        'Course evaluations collect zero personal identification (no names, IDs, or timestamps stored in answer records). Faculty dashboards enforce a minimum response threshold (default: 5 responses) before revealing aggregate ratings.',
      userBenefit:
        'Eliminates student fear of instructor retaliation, drastically improving response rates and the honesty of instructional feedback.',
      evaluationMethod:
        'Pre- and post-implementation student trust surveys regarding feedback confidentiality and response willingness.',
    },
    {
      id: 14,
      name: 'Progressive Disclosure for Complex Forms',
      category: 'Survey Ergonomics',
      icon: ListOrdered,
      campusEaseFeature: '5-Step Guided Evaluation Modal with Step Indicators',
      targetRoute: '/feedback',
      designDecision:
        'Multi-step evaluation workflow breaking 9 questions into digestible steps: Privacy Overview -> Teaching Quality -> Resources & Assessment -> Optional Comments -> Final Review.',
      userBenefit:
        'Prevents form abandonment by avoiding towering single-page surveys that overwhelm student participants.',
      evaluationMethod:
        'Survey completion rate and drop-off rate tracking at each step of the evaluation workflow.',
    },
    {
      id: 15,
      name: 'Clear Data Visualization and Interpretation',
      category: 'Visual Data Analytics',
      icon: BarChart2,
      campusEaseFeature: 'Horizontal Comparison Bars, Rating Distributions & Insights',
      targetRoute: '/faculty-insights',
      designDecision:
        'Recharts horizontal bars with explicit color thresholds (Green &ge;4.5, Blue &ge;4.0, Amber &lt;4.0), tooltips with plain-language context, and rule-based recommendations explaining *why* an action is suggested.',
      userBenefit:
        'Faculty and department heads can immediately interpret student sentiment without deciphering complex statistical tables.',
      evaluationMethod:
        'Faculty interview evaluations testing how quickly instructors can identify the top priority improvement area for their subject.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-xs">
            Third-Year Computer Engineering Laboratory Assessment
          </span>
          <span className="text-xs text-blue-200">Course Code: CS301 (HMI)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          15 Human–Machine Interaction (HMI) Design Principles
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 mt-2 max-w-3xl leading-relaxed">
          Comprehensive academic documentation detailing how Nielsen–Norman heuristics, cognitive engineering, WCAG accessibility standards, and privacy-preserving design were translated into concrete interface decisions within CampusEase 2.0.
        </p>
      </div>

      {/* Grid of 15 Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hmiPrinciples.map((item) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle flex flex-col justify-between hover:border-apple-blue transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950 text-apple-blue dark:text-apple-darkBlue flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-apple-blue">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                      {item.id}. {item.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* CampusEase Implementation Feature */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/60 mb-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                  CampusEase 2.0 Implementation
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                  {item.campusEaseFeature}
                </p>
              </div>

              {/* Rationale, Benefit, Evaluation */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                <p>
                  <strong className="text-slate-800 dark:text-zinc-200">Design Rationale:</strong>{' '}
                  {item.designDecision}
                </p>
                <p>
                  <strong className="text-slate-800 dark:text-zinc-200">Student & Faculty Benefit:</strong>{' '}
                  {item.userBenefit}
                </p>
                <p>
                  <strong className="text-slate-800 dark:text-zinc-200">Evaluation Metric:</strong>{' '}
                  <span className="italic">{item.evaluationMethod}</span>
                </p>
              </div>
            </div>

            {/* Interactive "Experience this" Link */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
              <Link
                to={item.targetRoute}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-apple-blue dark:text-apple-darkBlue hover:underline"
              >
                <span>Experience this in CampusEase</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
