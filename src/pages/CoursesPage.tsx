import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  BookOpenCheck,
  User,
  MapPin,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const { courses, assignments } = useApp();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <BookOpenCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Enrolled Academic Courses</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Third-Year Semester 6 Curriculum: Syllabi, course modules, lecture slides, and instructor channels.
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => {
          const courseAssignments = assignments.filter((a) => a.courseId === course.id);
          const pendingCount = courseAssignments.filter((a) => a.status === 'pending').length;

          return (
            <div
              key={course.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Course Code & Credits */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {course.code}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {course.credits} Credits • {course.department}
                  </span>
                </div>

                {/* Course Name */}
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.name}
                </h3>

                {/* Instructor & Location info */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.room}</span>
                  </div>
                </div>

                {/* Course Progress */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Syllabus Progress</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {pendingCount > 0 ? (
                    <strong className="text-amber-600 dark:text-amber-400">
                      {pendingCount} pending task{pendingCount > 1 ? 's' : ''}
                    </strong>
                  ) : (
                    'All tasks up to date'
                  )}
                </span>

                <Link
                  to={`/courses/${course.id}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Open Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
