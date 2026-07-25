import client from './client';
import type { Subject } from '../types';

export const fetchAllSubjects = () => client.get<Subject[]>('/subjects');
export const fetchSubjectById = (id: number) => client.get<Subject>(`/subjects/${id}`);
export const createSubject = (subject: Subject) => client.post<Subject>('/subjects', subject);
export const updateSubject = (id: number, subject: Subject) => client.put<Subject>(`/subjects/${id}`, subject);
export const deleteSubject = (id: number) => client.delete(`/subjects/${id}`);
