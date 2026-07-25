import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiArrowLeft, HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchSubject } from '../store/subjectsSlice';
import { fetchStudents } from '../store/studentsSlice';
import { fetchScoresBySubject, addScore, editScore, removeScore } from '../store/scoresSlice';
import ScoreForm from '../components/ScoreForm';
import DeleteModal from '../components/DeleteModal';
import AnimatedPage from '../components/AnimatedPage';
import ScoreBadge from '../components/ScoreBadge';
import { Btn, Spinner, Alert, Card, Table, Thead, Th, Tbody, Tr, Td, Empty } from '../components/ui';
import type { Score } from '../types';

const SubjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const subject = useAppSelector((s) => s.subjects.selected);
  const subjectLoading = useAppSelector((s) => s.subjects.loading);
  const { subjectScores: scores, loading: scoresLoading } = useAppSelector((s) => s.scores);
  const students = useAppSelector((s) => s.students.list);
  const subjects = useAppSelector((s) => s.subjects.list);

  const [scoreFormOpen, setScoreFormOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Score | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchSubject(Number(id)));
      dispatch(fetchScoresBySubject(Number(id)));
      dispatch(fetchStudents());
    }
  }, [dispatch, id]);

  const handleAddScore = () => { setEditingScore(null); setScoreFormOpen(true); };
  const handleEditScore = (s: Score) => { setEditingScore(s); setScoreFormOpen(true); };
  const handleDeleteScore = (s: Score) => { setToDelete(s); setDeleteOpen(true); };

  const handleScoreSubmit = (score: Score) => {
    if (editingScore?.id) {
      dispatch(editScore({ id: editingScore.id, score }));
    } else {
      dispatch(addScore(score));
    }
    setScoreFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (toDelete?.id) dispatch(removeScore(toDelete.id));
    setDeleteOpen(false);
    setToDelete(null);
  };

  if (subjectLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!subject) {
    return (
      <div className="text-center py-16 space-y-4">
        <Alert>Subject not found.</Alert>
        <Btn variant="ghost" onClick={() => navigate('/subjects')}>Back to Subjects</Btn>
      </div>
    );
  }

  const avgScore = scores.length > 0
    ? (scores.reduce((sum, s) => sum + s.score, 0) / scores.length).toFixed(1)
    : null;

  return (
    <AnimatedPage>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Btn variant="ghost" onClick={() => navigate('/subjects')} className="px-2">
            <HiArrowLeft className="h-4 w-4" />
          </Btn>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{subject.name}</h1>
            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-mono font-semibold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 mt-1">
              {subject.code}
            </span>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Credits</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1">{subject.credits ?? '—'}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Enrolled Students</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1">{scores.length}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Average Score</p>
            <div className="mt-1">
              {avgScore ? <ScoreBadge score={Number(avgScore)} /> : <span className="text-sm text-gray-500 dark:text-gray-400">—</span>}
            </div>
          </Card>
        </div>

        {subject.description && (
          <Card>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{subject.description}</p>
          </Card>
        )}

        {/* Scores table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Student Scores ({scores.length})</h2>
            <Btn onClick={handleAddScore}>
              <HiPlus className="h-4 w-4" /> Add Score
            </Btn>
          </div>

          {scoresLoading && scores.length === 0 ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : scores.length === 0 ? (
            <Empty message="No scores for this subject yet." />
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Student</Th>
                  <Th>Score</Th>
                  <Th>Exam Type</Th>
                  <Th>Exam Date</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </Thead>
              <Tbody>
                {scores.map((sc) => {
                  const student = students.find((s) => s.id === sc.studentId);
                  return (
                    <Tr key={sc.id}>
                      <Td>
                        <Link to={`/students/${sc.studentId}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                          {student ? `${student.firstName} ${student.lastName}` : `Student #${sc.studentId}`}
                        </Link>
                      </Td>
                      <Td><ScoreBadge score={sc.score} /></Td>
                      <Td className="text-gray-500 dark:text-gray-400">{sc.examType || '—'}</Td>
                      <Td className="text-gray-500 dark:text-gray-400">{sc.examDate || '—'}</Td>
                      <Td>
                        <div className="flex gap-2 justify-end">
                          <Btn variant="icon" onClick={() => handleEditScore(sc)}><HiPencil className="h-4 w-4" /></Btn>
                          <Btn variant="icon-danger" onClick={() => handleDeleteScore(sc)}><HiTrash className="h-4 w-4" /></Btn>
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )}
        </div>
      </div>

      <ScoreForm
        open={scoreFormOpen}
        onClose={() => setScoreFormOpen(false)}
        onSubmit={handleScoreSubmit}
        initial={editingScore}
        students={students}
        subjects={subjects.length > 0 ? subjects : subject ? [subject] : []}
        fixedSubjectId={subject.id}
      />
      <DeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} itemName={`score ${toDelete?.score ?? ''}`} />
    </AnimatedPage>
  );
};

export default SubjectDetailPage;
