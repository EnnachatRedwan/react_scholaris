import client from './client';
import type { Student } from '../types';

export const fetchAllStudents = () => client.get<Student[]>('/students');
export const fetchStudentById = (id: number) => client.get<Student>(`/students/${id}`);
export const createStudent = (student: Student) => client.post<Student>('/students', student);
export const updateStudent = (id: number, student: Student) => client.put<Student>(`/students/${id}`, student);
export const deleteStudent = (id: number) => client.delete(`/students/${id}`);
