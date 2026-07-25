import { useState, useEffect } from 'react';
import AppModal from './AppModal';
import { Btn, Input, Textarea, Label } from './ui';
import type { Subject } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (subject: Subject) => void;
  initial?: Subject | null;
}

const empty: Subject = { name: '', code: '', description: '', credits: undefined };

const SubjectForm = ({ open, onClose, onSubmit, initial }: Props) => {
  const [form, setForm] = useState<Subject>(empty);

  useEffect(() => {
    setForm(initial ? { ...initial } : empty);
  }, [initial, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'credits' ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <AppModal show={open} onClose={onClose} title={initial ? 'Edit Subject' : 'Add Subject'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Mathematics" />
        </div>
        <div>
          <Label htmlFor="code">Code *</Label>
          <Input id="code" name="code" value={form.code} onChange={handleChange} required placeholder="MATH101" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={form.description ?? ''} onChange={handleChange} placeholder="Subject description..." rows={3} />
        </div>
        <div>
          <Label htmlFor="credits">Credits</Label>
          <Input id="credits" name="credits" type="number" min={1} max={10} value={form.credits ?? ''} onChange={handleChange} placeholder="3" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Btn type="button" variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn type="submit">{initial ? 'Save Changes' : 'Add Subject'}</Btn>
        </div>
      </form>
    </AppModal>
  );
};

export default SubjectForm;
