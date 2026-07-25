import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiPlus, HiPencil, HiTrash, HiEye } from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchStudents, addStudent, editStudent, removeStudent } from '../store/studentsSlice';
import StudentForm from '../components/StudentForm';
import DeleteModal from '../components/DeleteModal';
import AnimatedPage from '../components/AnimatedPage';
import { Btn, Spinner, Alert, Table, Thead, Th, Tbody, Tr, Td, Empty } from '../components/ui';
import type { Student } from '../types';

const StudentsPage = () => {
  const dispatch = useAppDispatch();
  const { list: students, loading, error } = useAppSelector((s) => s.students);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [toDelete, setToDelete] = useState<Student | null>(null);

  useEffect(() => { dispatch(fetchStudents()); }, [dispatch]);

  const handleAdd = () => { setEditing(null); setFormOpen(true); };
  const handleEdit = (s: Student) => { setEditing(s); setFormOpen(true); };
  const handleDelete = (s: Student) => { setToDelete(s); setDeleteOpen(true); };

  const handleFormSubmit = (student: Student) => {
    if (editing?.id) {
      dispatch(editStudent({ id: editing.id, student }));
    } else {
      dispatch(addStudent(student));
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (toDelete?.id) dispatch(removeStudent(toDelete.id));
    setDeleteOpen(false);
    setToDelete(null);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Students</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{students.length} registered students</p>
          </div>
          <Btn onClick={handleAdd}>
            <HiPlus className="h-4 w-4" /> Add Student
          </Btn>
        </div>

        {error && <Alert>{error}</Alert>}

        {loading && students.length === 0 ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : students.length === 0 ? (
          <Empty message="No students yet. Add your first student!" />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Date of Birth</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </Thead>
            <Tbody>
              {students.map((s) => (
                <Tr key={s.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-100">{s.firstName} {s.lastName}</span>
                    </div>
                  </Td>
                  <Td className="text-gray-500 dark:text-gray-400">{s.email ?? '—'}</Td>
                  <Td className="text-gray-500 dark:text-gray-400">{s.dateOfBirth ?? '—'}</Td>
                  <Td>
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/students/${s.id}`}>
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

        <StudentForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} initial={editing} />
        <DeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} itemName={toDelete ? `${toDelete.firstName} ${toDelete.lastName}` : ''} />
      </div>
    </AnimatedPage>
  );
};

export default StudentsPage;
