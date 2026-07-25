import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiAcademicCap, HiBookOpen, HiStar, HiArrowRight, HiChartBar } from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchStudents } from '../store/studentsSlice';
import { fetchSubjects } from '../store/subjectsSlice';
import { fetchScores } from '../store/scoresSlice';
import AnimatedPage from '../components/AnimatedPage';
import ScoreBadge from '../components/ScoreBadge';
import { Spinner, Card } from '../components/ui';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const students = useAppSelector((s) => s.students.list);
  const subjects = useAppSelector((s) => s.subjects.list);
  const scores = useAppSelector((s) => s.scores.list);
  const loading = useAppSelector((s) => s.students.loading || s.subjects.loading || s.scores.loading);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchSubjects());
    dispatch(fetchScores());
  }, [dispatch]);

  const avgScore = scores.length > 0
    ? (scores.reduce((sum, s) => sum + s.score, 0) / scores.length).toFixed(1)
    : '—';

  const stats = [
    { label: 'Total Students', value: students.length, icon: HiAcademicCap, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', link: '/students' },
    { label: 'Total Subjects', value: subjects.length, icon: HiBookOpen, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', link: '/subjects' },
    { label: 'Total Scores', value: scores.length, icon: HiStar, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', link: '/scores' },
    { label: 'Average Score', value: avgScore, icon: HiChartBar, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30', link: '/scores' },
  ];

  if (loading && students.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your school data</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <Link to={stat.link}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stat.value}</p>
                      </div>
                      <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Students */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">Recent Students</h2>
              <Link to="/students" className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                View all <HiArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {students.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No students yet</p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {students.slice(0, 5).map((s) => (
                  <li key={s.id} className="py-2.5 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{s.firstName} {s.lastName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{s.email ?? '—'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Recent Scores */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">Recent Scores</h2>
              <Link to="/scores" className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                View all <HiArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {scores.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No scores yet</p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {scores.slice(0, 5).map((sc) => {
                  const student = students.find((s) => s.id === sc.studentId);
                  const subject = subjects.find((s) => s.id === sc.subjectId);
                  return (
                    <li key={sc.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {student ? `${student.firstName} ${student.lastName}` : `Student #${sc.studentId}`}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{subject?.name ?? `Subject #${sc.subjectId}`}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ScoreBadge score={sc.score} />
                        {sc.examType && <span className="text-xs text-gray-400 dark:text-gray-500">{sc.examType}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
