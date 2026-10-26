import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Assignment, AssignmentStatus } from '../types';
import {
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Award,
  Search,
  Filter,
  ArrowUpDown,
  UploadCloud,
  X,
  FileText,
  Calendar,
} from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const { assignments, courses, submitAssignment } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters & Sorting state
  const statusParam = (searchParams.get('status') as AssignmentStatus | 'all') || 'all';
  const idParam = searchParams.get('id');

  const [filterStatus, setFilterStatus] = useState<AssignmentStatus | 'all'>(statusParam);
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'deadline_asc' | 'deadline_desc' | 'priority' | 'course'>('deadline_asc');

  // Modal State for Assignment Details / Submission
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // If URL has id parameter, open that assignment modal immediately
  useEffect(() => {
    if (idParam) {
      const match = assignments.find((a) => a.id === idParam);
      if (match) {
        setSelectedAssignment(match);
        setSubmissionModalOpen(true);
      }
    }
  }, [idParam, assignments]);

  // Sync status filter with URL if needed
  useEffect(() => {
    if (statusParam && statusParam !== filterStatus) {
      setFilterStatus(statusParam);
    }
  }, [statusParam]);

  // Counts for tabs
  const counts = {
    all: assignments.length,
    pending: assignments.filter((a) => a.status === 'pending').length,
    submitted: assignments.filter((a) => a.status === 'submitted').length,
    overdue: assignments.filter((a) => a.status === 'overdue').length,
    graded: assignments.filter((a) => a.status === 'graded').length,
  };

  // Filtered & Sorted Assignments
  const filteredAssignments = assignments
    .filter((a) => {
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (filterCourse !== 'all' && a.courseId !== filterCourse) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.courseCode.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline_asc') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'deadline_desc') {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const pOrder = { high: 1, medium: 2, low: 3 };
        return pOrder[a.priority] - pOrder[b.priority];
      }
      if (sortBy === 'course') {
        return a.courseCode.localeCompare(b.courseCode);
      }
      return 0;
    });

  // Handle open submission modal
  const handleOpenModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSelectedFileName(assignment.submittedFile || '');
    setSubmissionNotes(assignment.submissionNotes || '');
    setShowConfirmDialog(false);
    setUploadProgress(0);
    setSubmissionModalOpen(true);
    setSearchParams({ id: assignment.id });
  };

  const handleCloseModal = () => {
    setSubmissionModalOpen(false);
    setSelectedAssignment(null);
    setShowConfirmDialog(false);
    searchParams.delete('id');
    setSearchParams(searchParams);
  };

  // Simulated Submission Execution
  const handleSimulateSubmit = () => {
    if (!selectedAssignment) return;
    const fileName = selectedFileName.trim() || `${user_sanitize(selectedAssignment.courseCode)}_Submission.pdf`;

    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            submitAssignment(selectedAssignment.id, fileName, submissionNotes);
            setShowConfirmDialog(false);
            handleCloseModal();
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  const user_sanitize = (code: string) => code.replace(/[^a-zA-Z0-9]/g, '_');

  const getStatusBadge = (status: AssignmentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Submitted</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Overdue</span>
          </span>
        );
      case 'graded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Award className="w-3.5 h-3.5" />
            <span>Graded</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Assignments & Coursework</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track upcoming deadlines, submit lab deliverables, and inspect graded instructor feedback.
          </p>
        </div>
      </div>

      {/* Filter Tabs (All, Pending, Submitted, Overdue, Graded) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {(['all', 'pending', 'submitted', 'overdue', 'graded'] as const).map((tab) => {
          const isActive = filterStatus === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setFilterStatus(tab);
                if (tab === 'all') {
                  searchParams.delete('status');
                } else {
                  searchParams.set('status', tab);
                }
                setSearchParams(searchParams);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="capitalize">{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search, Course Filter & Sort Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input (6 cols) */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assignments by title or course code..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter by Course (3 cols) */}
        <div className="sm:col-span-3 relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm outline-none focus:border-blue-500 cursor-pointer appearance-none"
            aria-label="Filter assignments by course"
          >
            <option value="all">All Enrolled Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.name.slice(0, 24)}...
              </option>
            ))}
          </select>
        </div>

        {/* Sort By (3 cols) */}
        <div className="sm:col-span-3 relative">
          <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm outline-none focus:border-blue-500 cursor-pointer appearance-none"
            aria-label="Sort assignments"
          >
            <option value="deadline_asc">Deadline: Soonest First</option>
            <option value="deadline_desc">Deadline: Latest First</option>
            <option value="priority">Priority: High to Low</option>
            <option value="course">Course Code (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Assignment List Cards */}
      {filteredAssignments.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <FileCheck2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No assignments match your criteria
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting "All" status filter, or clearing the course selection.
          </p>
          <button
            onClick={() => {
              setFilterStatus('all');
              setFilterCourse('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssignments.map((assignment) => {
            const dueDateObj = new Date(assignment.dueDate);
            const isDueSoon =
              assignment.status === 'pending' &&
              dueDateObj.getTime() - new Date('2026-10-25T12:00:00').getTime() < 3 * 24 * 60 * 60 * 1000;

            return (
              <div
                key={assignment.id}
                onClick={() => handleOpenModal(assignment)}
                className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all cursor-pointer hover:shadow-md group flex flex-col justify-between ${
                  assignment.status === 'overdue'
                    ? 'border-rose-200 dark:border-rose-900/50 hover:border-rose-400'
                    : isDueSoon
                    ? 'border-amber-200 dark:border-amber-900/50 hover:border-amber-400'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600'
                }`}
              >
                <div>
                  {/* Top line: Course Code & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-md">
                      {assignment.courseCode}
                    </span>
                    {getStatusBadge(assignment.status)}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {assignment.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {assignment.description}
                  </p>
                </div>

                {/* Bottom line: Due Date, Grade/Priority & Action */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Due {dueDateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {assignment.status === 'graded' ? (
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      Score: {assignment.grade}/{assignment.maxGrade}
                    </span>
                  ) : assignment.status === 'submitted' ? (
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      Under Review
                    </span>
                  ) : (
                    <span
                      className={`font-semibold capitalize ${
                        assignment.priority === 'high'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {assignment.priority} Priority
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assignment Details & Simulated Submission Modal */}
      {submissionModalOpen && selectedAssignment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-label="Assignment submission dialog"
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {selectedAssignment.courseCode}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedAssignment.courseName}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedAssignment.title}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
              {/* Due Date & Status Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>
                    Deadline: <strong>{new Date(selectedAssignment.dueDate).toLocaleString()}</strong>
                  </span>
                </div>
                <div>{getStatusBadge(selectedAssignment.status)}</div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Task Specification & Guidelines
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedAssignment.description}
                </p>
              </div>

              {/* Rubric items if present */}
              {selectedAssignment.rubricItems && (
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Grading Rubric
                  </h4>
                  <div className="space-y-1.5">
                    {selectedAssignment.rubricItems.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs"
                      >
                        <span className="text-slate-700 dark:text-slate-300">{r.criterion}</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{r.weight}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Graded Feedback Section */}
              {selectedAssignment.status === 'graded' && (
                <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-purple-900 dark:text-purple-200 text-xs flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-purple-600" />
                      Evaluated Score
                    </span>
                    <span className="text-base font-extrabold text-purple-700 dark:text-purple-300">
                      {selectedAssignment.grade} / {selectedAssignment.maxGrade} (
                      {Math.round(((selectedAssignment.grade || 0) / selectedAssignment.maxGrade) * 100)}%)
                    </span>
                  </div>
                  {selectedAssignment.feedback && (
                    <div className="mt-2 text-xs text-purple-950 dark:text-purple-200/90 leading-relaxed italic bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-purple-100 dark:border-purple-900/40">
                      "{selectedAssignment.feedback}"
                    </div>
                  )}
                </div>
              )}

              {/* Previous Submission Info */}
              {selectedAssignment.status === 'submitted' && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Current Submission File
                    </span>
                    <span className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">
                      {selectedAssignment.submittedFile}
                    </span>
                  </div>
                  {selectedAssignment.submissionDate && (
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
                      Submitted on: {new Date(selectedAssignment.submissionDate).toLocaleString()}
                    </p>
                  )}
                  {selectedAssignment.submissionNotes && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg">
                      Student notes: {selectedAssignment.submissionNotes}
                    </p>
                  )}
                </div>
              )}

              {/* Simulated Submission Form (For Pending / Overdue or Re-submitting) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {selectedAssignment.status === 'submitted'
                      ? 'Replace Deliverable (Demo Mode)'
                      : 'Upload Deliverable (Simulated Demo)'}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    Simulated Submission
                  </span>
                </div>

                {/* File Dropzone Simulator */}
                <div
                  onClick={() =>
                    setSelectedFileName(
                      `${user_sanitize(selectedAssignment.courseCode)}_Report_${Date.now().toString().slice(-4)}.pdf`
                    )
                  }
                  className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/20"
                >
                  <UploadCloud className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {selectedFileName ? (
                      <span className="text-blue-600 dark:text-blue-400 font-mono flex items-center justify-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        {selectedFileName}
                      </span>
                    ) : (
                      'Click to attach simulated lab deliverable (PDF, ZIP, DOCX)'
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Simulates file selection without uploading private data to any remote server.
                  </p>
                </div>

                {/* Submission Notes */}
                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Optional Submission Notes / GitHub Repo Link
                  </label>
                  <input
                    type="text"
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="e.g. Includes benchmark graphs in appendix and GitHub link"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                {/* Upload Progress Bar if submitting */}
                {isUploading && (
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Uploading to simulated portal...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-150"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer / Actions with Error Prevention */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                Close
              </button>

              {showConfirmDialog ? (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-rose-600 font-medium">
                    Confirm simulated submission?
                  </span>
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSimulateSubmit}
                    disabled={isUploading}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    Yes, Submit Now
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>
                    {selectedAssignment.status === 'submitted'
                      ? 'Update Submission'
                      : 'Simulate Final Submission'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
