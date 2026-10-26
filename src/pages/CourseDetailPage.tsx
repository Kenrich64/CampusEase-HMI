import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FeedbackSubmissionModal } from '../components/FeedbackSubmissionModal';
import {
  BookOpen,
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Calendar,
  FileCheck2,
  Download,
  FileText,
  Megaphone,
  MessageSquareHeart,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { courses, assignments, announcements, surveys, completedSurveys, addToast } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'syllabus' | 'assignments' | 'resources' | 'feedback' | 'notices'>('syllabus');
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
        <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-zinc-600 mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Course Not Found</h2>
        <p className="text-xs text-slate-400 mt-1">The requested course catalog record does not exist.</p>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 px-5 py-2.5 rounded-full bg-apple-blue text-white text-xs font-semibold hover:bg-apple-blueHover"
        >
          Return to Courses
        </button>
      </div>
    );
  }

  const courseAssignments = assignments.filter((a) => a.courseId === course.id);
  const courseAnnouncements = announcements.filter((an) => an.courseId === course.id);
  const courseSurvey = surveys.find((s) => s.courseId === course.id);
  const isSurveyCompleted = courseSurvey ? completedSurveys.some((c) => c.surveyId === courseSurvey.id) : false;

  const handleSimulateDownload = (resourceTitle: string) => {
    addToast('Simulated Download Initiated', `Downloaded: ${resourceTitle}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Back button & Course Banner */}
      <div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-apple-blue mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Courses</span>
        </Link>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-apple-blue dark:bg-zinc-800 dark:text-apple-darkBlue">
                  {course.code}
                </span>
                <span className="text-xs text-slate-400">
                  {course.credits} Credits • {course.department}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
                {course.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {course.instructor}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {course.instructorEmail}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {course.schedule}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {course.room}
                </span>
              </div>
            </div>

            {/* Course Progress Pill */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700/60 text-right min-w-44">
              <span className="text-xs text-slate-500">Syllabus Progress</span>
              <div className="text-2xl font-bold text-apple-blue my-0.5">
                {course.progress}%
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-apple-blue rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'syllabus'
              ? 'bg-apple-blue text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          Curriculum Modules
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'assignments'
              ? 'bg-apple-blue text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span>Course Assignments</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {courseAssignments.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'resources'
              ? 'bg-apple-blue text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span>Learning Resources</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {course.resources.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'feedback'
              ? 'bg-apple-blue text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>Course Evaluation</span>
          {isSurveyCompleted ? (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">✓</span>
          ) : (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">1</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'notices'
              ? 'bg-apple-blue text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span>Course Announcements</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {courseAnnouncements.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Syllabus Modules */}
      {activeTab === 'syllabus' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-2">
            Curriculum Units & Learning Outcomes
          </h3>
          <div className="space-y-2.5">
            {course.syllabus.map((topic, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-apple-blue font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 text-xs font-semibold text-slate-800 dark:text-zinc-200">
                  {topic}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Covered in Lectures
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Course Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-3">
          {courseAssignments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <FileCheck2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs text-slate-400">No active assignments for this course.</p>
            </div>
          ) : (
            courseAssignments.map((a) => (
              <div
                key={a.id}
                onClick={() => navigate(`/assignments?id=${a.id}`)}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-apple-blue cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        a.status === 'overdue'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : a.status === 'submitted'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : a.status === 'graded'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {a.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Due: {new Date(a.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 group-hover:text-apple-blue transition-colors">
                    {a.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{a.description}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button className="px-4 py-2 rounded-full bg-blue-50 text-apple-blue hover:bg-blue-100 dark:bg-zinc-800 dark:text-apple-darkBlue text-xs font-semibold transition-colors">
                    View & Submit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Learning Resources */}
      {activeTab === 'resources' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-2">
            Lecture Slides & Laboratory Bench Resources
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {course.resources.map((res) => (
              <div
                key={res.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-300">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-zinc-100">
                      {res.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Added {new Date(res.dateAdded).toLocaleDateString()} • {res.size || 'PDF Document'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSimulateDownload(res.title)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Course Feedback & Evaluation */}
      {activeTab === 'feedback' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-apple-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-apple-blue">
                Course Quality Assurance
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
                {course.code} Student Course Evaluation
              </h3>
              <p className="text-xs text-slate-500">Instructor: {course.instructor}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Anonymous Evaluation</span>
              </span>
            </div>
          </div>

          {courseSurvey ? (
            <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  Survey Period: <strong>{courseSurvey.term}</strong>
                </span>
                {isSurveyCompleted ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Submitted</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Open (Deadline {new Date(courseSurvey.deadline).toLocaleDateString()})</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                {courseSurvey.description}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {courseSurvey.questionsCount} rating questions • 2 optional written prompts
                </span>

                {isSurveyCompleted ? (
                  <span className="text-xs font-semibold text-emerald-600">
                    Evaluation recorded anonymously. Thank you!
                  </span>
                ) : (
                  <button
                    onClick={() => setShowEvaluationModal(true)}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>Begin Anonymous Survey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No active evaluation surveys scheduled for this course.
            </div>
          )}

          {showEvaluationModal && courseSurvey && (
            <FeedbackSubmissionModal
              survey={courseSurvey}
              onClose={() => setShowEvaluationModal(false)}
            />
          )}
        </div>
      )}

      {/* Tab 5: Course Notices */}
      {activeTab === 'notices' && (
        <div className="space-y-3">
          {courseAnnouncements.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <Megaphone className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs text-slate-400">No specific notices published for this course.</p>
            </div>
          ) : (
            courseAnnouncements.map((an) => (
              <div
                key={an.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-apple-blue">
                    Posted by {an.author} ({an.authorRole})
                  </span>
                  <span className="text-slate-400">
                    {new Date(an.date).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  {an.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {an.content}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
