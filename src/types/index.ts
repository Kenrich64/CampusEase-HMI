export type AssignmentStatus = 'pending' | 'submitted' | 'overdue' | 'graded';
export type PriorityLevel = 'high' | 'medium' | 'low';

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string or YYYY-MM-DDTHH:mm
  priority: PriorityLevel;
  status: AssignmentStatus;
  maxGrade: number;
  grade?: number;
  feedback?: string;
  submissionDate?: string;
  submittedFile?: string;
  submissionNotes?: string;
  rubricItems?: { criterion: string; weight: number; score?: number }[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  instructorEmail: string;
  department: string;
  credits: number;
  schedule: string;
  room: string;
  color: string;
  progress: number;
  syllabus: string[];
  resources: {
    id: string;
    title: string;
    type: 'pdf' | 'slides' | 'code' | 'link';
    size?: string;
    dateAdded: string;
  }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  category: 'academic' | 'department' | 'campus' | 'urgent';
  courseId?: string;
  courseCode?: string;
  isRead: boolean;
  priority: 'high' | 'normal';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'deadline' | 'grade' | 'announcement' | 'system' | 'feedback';
  isRead: boolean;
  actionUrl?: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  studentId: string;
  program: string;
  semester: string;
  academicYear: string;
  cgpa: number;
  creditsEarned: number;
  totalCredits: number;
  avatarUrl?: string;
  phone?: string;
  advisor: string;
}

export type TextScale = 'normal' | 'large' | 'xlarge';
export type ThemeMode = 'light' | 'dark' | 'system';
export type UserRole = 'student' | 'faculty';

export interface UserPreferences {
  theme: ThemeMode;
  textScale: TextScale;
  highContrast: boolean;
  reducedMotion: boolean;
  emailNotifications: boolean;
  deadlineAlerts: boolean;
  soundEffects: boolean;
}

export interface UsabilityTaskResult {
  id: number;
  taskName: string;
  description: string;
  targetRoute: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  timeSeconds: number;
  errorsCount: number;
  satisfactionRating: number; // 1 to 5
  notes: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

// ==========================================
// FEEDBACK & COURSE EVALUATION TYPES
// ==========================================

export type RatingScaleValue = 1 | 2 | 3 | 4 | 5;

export type EvaluationCategoryKey =
  | 'overallSatisfaction'
  | 'teachingClarity'
  | 'materialOrganization'
  | 'resourceAvailability'
  | 'assessmentFairness'
  | 'pacing'
  | 'supportHelp';

export interface EvaluationSurvey {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  term: string; // e.g. "Fall 2026 - Mid-Semester"
  status: 'open' | 'completed' | 'upcoming';
  startDate: string;
  deadline: string;
  questionsCount: number;
  description: string;
}

// Stored in student's private client state to prevent duplicate submissions
export interface CompletedSurveyRecord {
  surveyId: string;
  courseId: string;
  completedAt: string;
  confirmationCode: string;
}

// Anonymous feedback submission record (NO student ID or identity stored!)
export interface AnonymousFeedbackSubmission {
  id: string;
  surveyId: string;
  courseId: string;
  submittedAt: string;
  ratings: Record<EvaluationCategoryKey, RatingScaleValue>;
  positiveFeedback?: string;
  improvementFeedback?: string;
}

export type ActionRecommendationStatus = 'planned' | 'in_progress' | 'completed';

export interface ActionableRecommendation {
  id: string;
  courseId: string;
  title: string;
  category: 'clarity' | 'resources' | 'fairness' | 'pacing' | 'support' | 'general';
  type: 'strength' | 'improvement' | 'action';
  evidence: string;
  suggestedAction: string;
  status: ActionRecommendationStatus;
  ruleTriggered: string;
}

export interface CourseFeedbackSummary {
  courseId: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  term: string;
  totalEnrolled: number;
  responseCount: number;
  responseRate: number; // Percentage (e.g. 78%)
  meetsThreshold: boolean; // Must be >= minimum response threshold (default 5)
  categoryAverages: Record<EvaluationCategoryKey, number>;
  ratingDistribution: { stars: number; count: number; percentage: number }[];
  historicalTrend?: { period: string; overallScore: number; responseCount: number }[];
  positiveThemes: { theme: string; mentions: number }[];
  improvementThemes: { theme: string; mentions: number }[];
  recommendations: ActionableRecommendation[];
}
