import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchScores, addScore, editScore, removeScore } from '../store/scoresSlice';
import { fetchStudents } from '../store/studentsSlice';
import { fetchSubjects } from '../store/subjectsSlice';
import ScoreForm from '../components/ScoreForm';
import DeleteModal from '../components/DeleteModal';
import AnimatedPage from '../components/AnimatedPage';
import ScoreBadge from '../components/ScoreBadge';
import { Btn, Spinner, Alert, Select, Table, Thead, Th, Tbody, Tr, Td, Empty } from '../components/ui';
import type { Score } from '../types';

const ScoresPage = () => {
  const dispatch = useAppDispatch();
  const { list: scores, loading, error } = useAppSelector((s) => s.scores);
  const students = useAppSelector((s) => s.students.list);
  const subjects = useAppSelector((s) => s.subjects.list);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Score | null>(null);
  const [toDelete, setToDelete] = useState<Score | null>(null);
  const [filterStudentId, setFilterStudentId] = useState('');
  const [filterSubjectId, setFilterSubjectId] = useState('');

  useEffect(() => {
    dispatch(fetchScores());
    dispatch(fetchStudents());
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleAdd = () => { setEditing(null); setFormOpen(true); };
  const handleEdit = (s: Score) => { setEditing(s); setFormOpen(true); };
  const handleDelete = (s: Score) => { setToDelete(s); setDeleteOpen(true); };

  const handleFormSubmit = (score: Score) => {
    if (editing?.id) {
      dispatch(editScore({ id: editing.id, score }));
    } else {
      dispatch(addScore(score));
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (toDelete?.id) dispatch(removeScore(toDelete.id));
    setDeleteOpen(false);
    setToDelete(null);
  };

  const filtered = scores.filter((s) => {
    if (filterStudentId && s.studentId !== Number(filterStudentId)) return false;
    if (filterSubjectId && s.subjectId !== Number(filterSubjectId)) return false;
    return true;
  });

  const avgFiltered = filtered.length > 0
    ? (filtered.reduce((sum, s) => sum + s.score, 0) / filtered.length).toFixed(1)
    : null;

  const hasFilter = filterStudentId || filterSubjectId;

  return (
    <AnimatedPage>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Scores</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} scores{avgFiltered ? ` — avg: ${avgFiltered}` : ''}
            </p>
          </div>
          <Btn onClick={handleAdd}>
            <HiPlus className="h-4 w-4" /> Add Score
          </Btn>
        </div>

        {error && <Alert>{error}</Alert>}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Student</span>
            <Select value={filterStudentId} onChange={(e) => setFilterStudentId(e.target.value)} className="w-44">
              <option value="">All</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Subject</span>
            <Select value={filterSubjectId} onChange={(e) => setFilterSubjectId(e.target.value)} className="w-44">
              <option value="">All</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
          </div>
          {hasFilter && (
            <Btn variant="ghost" onClick={() => { setFilterStudentId(''); setFilterSubjectId(''); }}>
              Clear filters
            </Btn>
          )}
        </div>

        {loading && scores.length === 0 ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <Empty message={scores.length === 0 ? 'No scores yet. Add your first score!' : 'No scores match the current filters.'} />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Student</Th>
                <Th>Subject</Th>
                <Th>Score</Th>
                <Th>Exam Type</Th>
                <Th>Exam Date</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </Thead>
            <Tbody>
              {filtered.map((sc) => {
                const student = students.find((s) => s.id === sc.studentId);
                const subject = subjects.find((s) => s.id === sc.subjectId);
                return (
                  <Tr key={sc.id}>
                    <Td>
                      <Link to={`/students/${sc.studentId}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        {student ? `${student.firstName} ${student.lastName}` : `#${sc.studentId}`}
                      </Link>
                    </Td>
                    <Td>
                      <Link to={`/subjects/${sc.subjectId}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {subject?.name ?? `#${sc.subjectId}`}
                      </Link>
                      {subject?.code && <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">({subject.code})</span>}
                    </Td>
                    <Td><ScoreBadge score={sc.score} /></Td>
                    <Td className="text-gray-500 dark:text-gray-400">{sc.examType || '—'}</Td>
                    <Td className="text-gray-500 dark:text-gray-400">{sc.examDate || '—'}</Td>
                    <Td>
                      <div className="flex gap-2 justify-end">
                        <Btn variant="icon" onClick={() => handleEdit(sc)}><HiPencil className="h-4 w-4" /></Btn>
                        <Btn variant="icon-danger" onClick={() => handleDelete(sc)}><HiTrash className="h-4 w-4" /></Btn>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}

        <ScoreForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} initial={editing} students={students} subjects={subjects} />
        <DeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} itemName={`score ${toDelete?.score ?? ''}`} />
      </div>
    </AnimatedPage>
  );
};

export default ScoresPage;
