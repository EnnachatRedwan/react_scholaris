import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiPlus, HiPencil, HiTrash, HiEye } from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchSubjects, addSubject, editSubject, removeSubject } from '../store/subjectsSlice';
import SubjectForm from '../components/SubjectForm';
import DeleteModal from '../components/DeleteModal';
import AnimatedPage from '../components/AnimatedPage';
import { Btn, Spinner, Alert, Table, Thead, Th, Tbody, Tr, Td, Empty } from '../components/ui';
import type { Subject } from '../types';

const SubjectsPage = () => {
  const dispatch = useAppDispatch();
  const { list: subjects, loading, error } = useAppSelector((s) => s.subjects);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [toDelete, setToDelete] = useState<Subject | null>(null);

  useEffect(() => { dispatch(fetchSubjects()); }, [dispatch]);

  const handleAdd = () => { setEditing(null); setFormOpen(true); };
  const handleEdit = (s: Subject) => { setEditing(s); setFormOpen(true); };
  const handleDelete = (s: Subject) => { setToDelete(s); setDeleteOpen(true); };

  const handleFormSubmit = (subject: Subject) => {
    if (editing?.id) {
      dispatch(editSubject({ id: editing.id, subject }));
    } else {
      dispatch(addSubject(subject));
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (toDelete?.id) dispatch(removeSubject(toDelete.id));
    setDeleteOpen(false);
    setToDelete(null);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Subjects</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{subjects.length} subjects available</p>
          </div>
          <Btn onClick={handleAdd}>
            <HiPlus className="h-4 w-4" /> Add Subject
          </Btn>
        </div>

        {error && <Alert>{error}</Alert>}

        {loading && subjects.length === 0 ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : subjects.length === 0 ? (
          <Empty message="No subjects yet. Add your first subject!" />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Name</Th>
                <Th>Code</Th>
                <Th>Credits</Th>
                <Th>Description</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </Thead>
            <Tbody>
              {subjects.map((s) => (
                <Tr key={s.id}>
                  <Td className="font-medium text-gray-800 dark:text-gray-100">{s.name}</Td>
                  <Td>
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-mono font-semibold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                      {s.code}
                    </span>
                  </Td>
                  <Td className="text-gray-500 dark:text-gray-400">
                    {s.credits != null ? (
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {s.credits} cr
                      </span>
                    ) : '—'}
                  </Td>
                  <Td className="text-gray-400 dark:text-gray-500 max-w-xs truncate">{s.description || '—'}</Td>
                  <Td>
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/subjects/${s.id}`}>
                        <Btn variant="icon" title="View"><HiEye className="h-4 w-4" /></Btn>
                      </Link>
                      <Btn variant="icon" onClick={() => handleEdit(s)} title="Edit"><HiPencil className="h-4 w-4" /></Btn>
                      <Btn variant="icon-danger" onClick={() => handleDelete(s)} title="Delete"><HiTrash className="h-4 w-4" /></Btn>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        <SubjectForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} initial={editing} />
        <DeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} itemName={toDelete?.name ?? ''} />
      </div>
    </AnimatedPage>
  );
};

export default SubjectsPage;
