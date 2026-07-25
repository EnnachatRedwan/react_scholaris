export interface Student {
  id?: number;
  firstName: string;
  lastName: string;
  email?: string;
  dateOfBirth?: string;
}

export interface Subject {
  id?: number;
  name: string;
  code: string;
  description?: string;
  credits?: number;
}

export interface Score {
  id?: number;
  studentId: number;
  subjectId: number;
  score: number;
  examDate?: string;
  examType?: string;
}
