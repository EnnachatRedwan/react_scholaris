import client from './client';
import type { Score } from '../types';

export const fetchAllScores = () => client.get<Score[]>('/scores');
export const fetchScoreById = (id: number) => client.get<Score>(`/scores/${id}`);
export const fetchScoresByStudentId = (studentId: number) => client.get<Score[]>(`/scores/student/${studentId}`);
export const fetchScoresBySubjectId = (subjectId: number) => client.get<Score[]>(`/scores/subject/${subjectId}`);
export const createScore = (score: Score) => client.post<Score>('/scores', score);
export const updateScore = (id: number, score: Score) => client.put<Score>(`/scores/${id}`, score);
export const deleteScore = (id: number) => client.delete(`/scores/${id}`);
