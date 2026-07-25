import { useState, useEffect } from 'react';
import AppModal from './AppModal';
import { Btn, Input, Select, Label } from './ui';
import type { Score, Student, Subject } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (score: Score) => void;
  initial?: Score | null;
  students: Student[];
  subjects: Subject[];
  fixedStudentId?: number;
  fixedSubjectId?: number;
}

const empty: Score = { studentId: 0, subjectId: 0, score: 0, examDate: '', examType: '' };
const EXAM_TYPES = ['MIDTERM', 'FINAL', 'QUIZ', 'ASSIGNMENT', 'PROJECT'];

const ScoreForm = ({ open, onClose, onSubmit, initial, students, subjects, fixedStudentId, fixedSubjectId }: Props) => {
  const [form, setForm] = useState<Score>(empty);

  useEffect(() => {
    if (initial) {
      setForm({ ...initial });
    } else {
      setForm({ ...empty, studentId: fixedStudentId ?? 0, subjectId: fixedSubjectId ?? 0 });
    }
  }, [initial, open, fixedStudentId, fixedSubjectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'score' || name === 'studentId' || name === 'subjectId' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <AppModal show={open} onClose={onClose} title={initial ? 'Edit Score' : 'Add Score'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="studentId">Student *</Label>
          <Select id="studentId" name="studentId" value={form.studentId} onChange={handleChange} required disabled={!!fixedStudentId && !initial}>
            <option value={0} disabled>Select a student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="subjectId">Subject *</Label>
          <Select id="subjectId" name="subjectId" value={form.subjectId} onChange={handleChange} required disabled={!!fixedSubjectId && !initial}>
            <option value={0} disabled>Select a subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="score">Score *</Label>
          <Input id="score" name="score" type="number" min={0} max={100} step={0.1} value={form.score} onChange={handleChange} required placeholder="85.5" />
        </div>
        <div>
          <Label htmlFor="examDate">Exam Date</Label>
          <Input id="examDate" name="examDate" type="date" value={form.examDate ?? ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="examType">Exam Type</Label>
          <Select id="examType" name="examType" value={form.examType ?? ''} onChange={handleChange}>
            <option value="">Select type (optional)</option>
            {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Btn type="button" variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn type="submit">{initial ? 'Save Changes' : 'Add Score'}</Btn>
        </div>
      </form>
    </AppModal>
  );
};

export default ScoreForm;
