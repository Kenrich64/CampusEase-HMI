import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  StudentProfile,
  Course,
  Assignment,
  Announcement,
  NotificationItem,
  UserPreferences,
  UsabilityTaskResult,
  ToastMessage,
  TextScale,
  UserRole,
  EvaluationSurvey,
  CompletedSurveyRecord,
  CourseFeedbackSummary,
  EvaluationCategoryKey,
  RatingScaleValue,
  ActionRecommendationStatus,
} from '../types';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PREFERENCES,
  INITIAL_USABILITY_TASKS,
  INITIAL_SURVEYS,
  INITIAL_COMPLETED_SURVEYS,
  INITIAL_FEEDBACK_SUMMARIES,
} from '../data/mockData';

interface AppContextType {
  // Role switcher (Demo capability: Student vs Faculty/Admin)
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;

  user: StudentProfile;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  courses: Course[];
  assignments: Assignment[];
  submitAssignment: (id: string, fileName: string, notes?: string) => boolean;
  announcements: Announcement[];
  markAnnouncementAsRead: (id: string) => void;
  markAllAnnouncementsAsRead: () => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  toggleTheme: () => void;
  setTextScale: (scale: TextScale) => void;
  usabilityTasks: UsabilityTaskResult[];
  updateUsabilityTask: (id: number, updates: Partial<UsabilityTaskResult>) => void;
  resetUsabilityTasks: () => void;
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  resetAllDemoData: () => void;

  // Feedback & Course Evaluation
  surveys: EvaluationSurvey[];
  completedSurveys: CompletedSurveyRecord[];
  feedbackSummaries: CourseFeedbackSummary[];
  minimumResponseThreshold: number;
  setMinimumResponseThreshold: (threshold: number) => void;
  submitAnonymousFeedback: (
    surveyId: string,
    courseId: string,
    ratings: Record<EvaluationCategoryKey, RatingScaleValue>,
    positiveFeedback?: string,
    improvementFeedback?: string
  ) => boolean;
  updateRecommendationStatus: (recId: string, status: ActionRecommendationStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'campusease_profile_v2',
  ASSIGNMENTS: 'campusease_assignments_v2',
  ANNOUNCEMENTS: 'campusease_announcements_v2',
  NOTIFICATIONS: 'campusease_notifications_v2',
  PREFERENCES: 'campusease_preferences_v2',
  USABILITY_TASKS: 'campusease_usability_tasks_v2',
  AUTH: 'campusease_auth_status_v2',
  ROLE: 'campusease_active_role_v2',
  SURVEYS: 'campusease_surveys_v2',
  COMPLETED_SURVEYS: 'campusease_completed_surveys_v2',
  FEEDBACK_SUMMARIES: 'campusease_feedback_summaries_v2',
  THRESHOLD: 'campusease_feedback_threshold_v2',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Demo Role state (Student vs Faculty/Administrator)
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return saved ? (JSON.parse(saved) as UserRole) : 'student';
  });

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    addToast(
      'View Mode Switched',
      role === 'faculty'
        ? 'Active View: Faculty / Administrator (Dr. Eleanor Vance, CS Dept Coordinator)'
        : 'Active View: Student Portal (Alex Mercer, 3rd Year CE)',
      'info'
    );
  };

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved) : true;
  });

  // Profile
  const [user, setUser] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
  });

  // Courses (read-only reference)
  const [courses] = useState<Course[]>(INITIAL_COURSES);

  // Assignments
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return saved ? JSON.parse(saved) : INITIAL_PREFERENCES;
  });

  // Usability Tasks
  const [usabilityTasks, setUsabilityTasks] = useState<UsabilityTaskResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USABILITY_TASKS);
    return saved ? JSON.parse(saved) : INITIAL_USABILITY_TASKS;
  });

  // Surveys
  const [surveys, setSurveys] = useState<EvaluationSurvey[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SURVEYS);
    return saved ? JSON.parse(saved) : INITIAL_SURVEYS;
  });

  // Student's private survey completion records (No answers attached, just tracking completion)
  const [completedSurveys, setCompletedSurveys] = useState<CompletedSurveyRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_SURVEYS);
    return saved ? JSON.parse(saved) : INITIAL_COMPLETED_SURVEYS;
  });

  // Feedback summaries across courses for faculty/admin insights
  const [feedbackSummaries, setFeedbackSummaries] = useState<CourseFeedbackSummary[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK_SUMMARIES);
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK_SUMMARIES;
  });

  // Minimum response threshold (default: 5 responses)
  const [minimumResponseThreshold, setMinimumResponseThresholdState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THRESHOLD);
    return saved ? JSON.parse(saved) : 5;
  });

  const setMinimumResponseThreshold = (val: number) => {
    setMinimumResponseThresholdState(val);
    // Re-evaluate meetsThreshold for summaries
    setFeedbackSummaries((prev) =>
      prev.map((s) => ({
        ...s,
        meetsThreshold: s.responseCount >= val,
      }))
    );
    addToast('Privacy Threshold Updated', `Minimum responses required for aggregate reporting set to ${val}.`, 'info');
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Search Modal
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Apply visual preferences to document DOM
  useEffect(() => {
    const root = document.documentElement;
    // Dark mode class
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // High contrast class
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion class
    if (preferences.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Text scaling CSS variable
    let scaleVal = '1';
    if (preferences.textScale === 'large') scaleVal = '1.12';
    if (preferences.textScale === 'xlarge') scaleVal = '1.25';
    root.style.setProperty('--font-scale', scaleVal);
  }, [preferences]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, JSON.stringify(activeRole));
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USABILITY_TASKS, JSON.stringify(usabilityTasks));
  }, [usabilityTasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
  }, [surveys]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_SURVEYS, JSON.stringify(completedSurveys));
  }, [completedSurveys]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK_SUMMARIES, JSON.stringify(feedbackSummaries));
  }, [feedbackSummaries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THRESHOLD, JSON.stringify(minimumResponseThreshold));
  }, [minimumResponseThreshold]);

  // Global hotkey: Ctrl+K or Cmd+K to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast Helpers
  const addToast = (
    title: string,
    message?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info',
    duration = 4500
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, title, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Profile update
  const updateProfile = (updates: Partial<StudentProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      addToast('Profile Updated', 'Your profile details have been saved locally.', 'success');
      return updated;
    });
  };

  // Assignment submission workflow
  const submitAssignment = (id: string, fileName: string, notes?: string): boolean => {
    const target = assignments.find((a) => a.id === id);
    if (!target) {
      addToast('Error', 'Assignment could not be located.', 'error');
      return false;
    }

    const now = new Date().toISOString();
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status: 'submitted',
            submissionDate: now,
            submittedFile: fileName,
            submissionNotes: notes || '',
          };
        }
        return a;
      })
    );

    // Also add an automated confirmation notification
    const newNotification: NotificationItem = {
      id: 'n_' + Date.now(),
      title: 'Submission Received',
      message: `Your simulated submission for "${target.title}" was registered on ${new Date().toLocaleDateString()}.`,
      timestamp: 'Just now',
      type: 'system',
      isRead: false,
      actionUrl: '/assignments',
    };
    setNotifications((prev) => [newNotification, ...prev]);

    addToast(
      'Simulated Submission Successful',
      `"${target.title}" marked as Submitted. Timestamp logged.`,
      'success'
    );
    return true;
  };

  // Announcements
  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const markAllAnnouncementsAsRead = () => {
    setAnnouncements((prev) => prev.map((item) => ({ ...item, isRead: true })));
    addToast('Notices Updated', 'All announcements marked as read.', 'info');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    addToast('Notifications Cleared', 'All notification alerts have been cleared.', 'info');
  };

  // Preferences
  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...prefs };
      return updated;
    });
  };

  const toggleTheme = () => {
    setPreferences((prev) => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      addToast('Theme Switched', `Active theme: ${nextTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`, 'info');
      return { ...prev, theme: nextTheme };
    });
  };

  const setTextScale = (scale: TextScale) => {
    setPreferences((prev) => ({ ...prev, textScale: scale }));
    addToast('Display Scaled', `Interface text size changed to: ${scale.toUpperCase()}`, 'info');
  };

  // Usability tasks
  const updateUsabilityTask = (id: number, updates: Partial<UsabilityTaskResult>) => {
    setUsabilityTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const resetUsabilityTasks = () => {
    setUsabilityTasks(INITIAL_USABILITY_TASKS);
    addToast('Usability Tasks Reset', 'Evaluation task records reset to baseline.', 'info');
  };

  // Anonymous Course Evaluation Submission Workflow
  const submitAnonymousFeedback = (
    surveyId: string,
    courseId: string,
    ratings: Record<EvaluationCategoryKey, RatingScaleValue>,
    positiveFeedback?: string,
    improvementFeedback?: string
  ): boolean => {
    // 1. Check duplicate submission
    const alreadyCompleted = completedSurveys.some((c) => c.surveyId === surveyId);
    if (alreadyCompleted) {
      addToast('Already Evaluated', 'You have already submitted an anonymous evaluation for this course survey.', 'warning');
      return false;
    }

    const confirmationCode = `CE-EVAL-${Math.floor(10000 + Math.random() * 90000)}-ANON`;
    const now = new Date().toISOString();

    // 2. Add to student private completed survey tracker (Separated from anonymous answers!)
    const newRecord: CompletedSurveyRecord = {
      surveyId,
      courseId,
      completedAt: now,
      confirmationCode,
    };
    setCompletedSurveys((prev) => [...prev, newRecord]);

    // 3. Mark survey as completed for student view
    setSurveys((prev) =>
      prev.map((s) => (s.id === surveyId ? { ...s, status: 'completed' } : s))
    );

    // 4. Update the aggregate CourseFeedbackSummary dynamically
    setFeedbackSummaries((prev) =>
      prev.map((summary) => {
        if (summary.courseId === courseId) {
          const newResponseCount = summary.responseCount + 1;
          const newResponseRate = Math.min(100, Math.round((newResponseCount / summary.totalEnrolled) * 100));
          const meets = newResponseCount >= minimumResponseThreshold;

          // Re-average category scores
          const updatedAverages: Record<EvaluationCategoryKey, number> = { ...summary.categoryAverages };
          (Object.keys(ratings) as EvaluationCategoryKey[]).forEach((key) => {
            const currentAvg = summary.categoryAverages[key] || 4.0;
            const newAvg = Number((((currentAvg * summary.responseCount) + ratings[key]) / newResponseCount).toFixed(2));
            updatedAverages[key] = newAvg;
          });

          // Update rating distribution for overall satisfaction
          const overallRating = ratings.overallSatisfaction;
          const updatedDist = summary.ratingDistribution.map((d) => {
            if (d.stars === overallRating) {
              const newCount = d.count + 1;
              return { ...d, count: newCount, percentage: Math.round((newCount / newResponseCount) * 100) };
            }
            return { ...d, percentage: Math.round((d.count / newResponseCount) * 100) };
          });

          return {
            ...summary,
            responseCount: newResponseCount,
            responseRate: newResponseRate,
            meetsThreshold: meets,
            categoryAverages: updatedAverages,
            ratingDistribution: updatedDist,
          };
        }
        return summary;
      })
    );

    // 5. Add confirmation notification
    const feedbackNotif: NotificationItem = {
      id: 'n_eval_' + Date.now(),
      title: 'Course Evaluation Confirmed',
      message: `Your anonymous feedback was recorded successfully with receipt #${confirmationCode}. Thank you for helping improve teaching quality!`,
      timestamp: 'Just now',
      type: 'feedback',
      isRead: false,
      actionUrl: '/feedback',
    };
    setNotifications((prev) => [feedbackNotif, ...prev]);

    addToast(
      'Anonymous Evaluation Submitted',
      `Thank you! Receipt #${confirmationCode} generated. Responses stored anonymously.`,
      'success'
    );
    return true;
  };

  // Update actionable recommendation status (Faculty/Admin tool)
  const updateRecommendationStatus = (recId: string, status: ActionRecommendationStatus) => {
    setFeedbackSummaries((prev) =>
      prev.map((summary) => ({
        ...summary,
        recommendations: summary.recommendations.map((rec) =>
          rec.id === recId ? { ...rec, status } : rec
        ),
      }))
    );
    addToast('Recommendation Updated', `Actionable plan marked as ${status.replace('_', ' ').toUpperCase()}.`, 'info');
  };

  // Authentication
  const login = () => {
    setIsAuthenticated(true);
    addToast('Logged In', 'Welcome to CampusEase Student Portal 2.0 demo.', 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    addToast('Logged Out', 'You have been signed out of the demo session.', 'info');
  };

  // Reset entire demo data
  const resetAllDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.USABILITY_TASKS);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.SURVEYS);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_SURVEYS);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK_SUMMARIES);
    localStorage.removeItem(STORAGE_KEYS.THRESHOLD);

    setUser(INITIAL_STUDENT_PROFILE);
    setAssignments(INITIAL_ASSIGNMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPreferences(INITIAL_PREFERENCES);
    setUsabilityTasks(INITIAL_USABILITY_TASKS);
    setSurveys(INITIAL_SURVEYS);
    setCompletedSurveys(INITIAL_COMPLETED_SURVEYS);
    setFeedbackSummaries(INITIAL_FEEDBACK_SUMMARIES);
    setMinimumResponseThresholdState(5);
    setActiveRoleState('student');
    setIsAuthenticated(true);

    addToast(
      'CampusEase 2.0 Reset',
      'All courses, assignments, anonymous evaluations, and preferences have been restored to initial defaults.',
      'info'
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        user,
        updateProfile,
        courses,
        assignments,
        submitAssignment,
        announcements,
        markAnnouncementAsRead,
        markAllAnnouncementsAsRead,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        preferences,
        updatePreferences,
        toggleTheme,
        setTextScale,
        usabilityTasks,
        updateUsabilityTask,
        resetUsabilityTasks,
        toasts,
        addToast,
        removeToast,
        searchModalOpen,
        setSearchModalOpen,
        isAuthenticated,
        login,
        logout,
        resetAllDemoData,
        surveys,
        completedSurveys,
        feedbackSummaries,
        minimumResponseThreshold,
        setMinimumResponseThreshold,
        submitAnonymousFeedback,
        updateRecommendationStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
