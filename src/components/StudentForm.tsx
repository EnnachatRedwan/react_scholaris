import { useState, useEffect } from 'react';
import AppModal from './AppModal';
import { Btn, Input, Label } from './ui';
import type { Student } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (student: Student) => void;
  initial?: Student | null;
}

const empty: Student = { firstName: '', lastName: '', email: '', dateOfBirth: '' };

const StudentForm = ({ open, onClose, onSubmit, initial }: Props) => {
  const [form, setForm] = useState<Student>(empty);

  useEffect(() => {
    setForm(initial ? { ...initial } : empty);
  }, [initial, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <AppModal show={open} onClose={onClose} title={initial ? 'Edit Student' : 'Add Student'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required placeholder="John" />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Doe" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={form.email ?? ''} onChange={handleChange} placeholder="john.doe@example.com" />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" name="dateOfBirth" type="date" value={form.dateOfBirth ?? ''} onChange={handleChange} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Btn type="button" variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn type="submit">{initial ? 'Save Changes' : 'Add Student'}</Btn>
        </div>
      </form>
    </AppModal>
  );
};

export default StudentForm;
