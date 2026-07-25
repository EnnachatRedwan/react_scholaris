import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/studentsApi';
import type { Student } from '../types';

interface StudentsState {
  list: Student[];
  selected: Student | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

export const fetchStudents = createAsyncThunk('students/fetchAll', async () => {
  const res = await api.fetchAllStudents();
  return res.data;
});

export const fetchStudent = createAsyncThunk('students/fetchOne', async (id: number) => {
  const res = await api.fetchStudentById(id);
  return res.data;
});

export const addStudent = createAsyncThunk('students/add', async (student: Student) => {
  const res = await api.createStudent(student);
  return res.data;
});

export const editStudent = createAsyncThunk(
  'students/edit',
  async ({ id, student }: { id: number; student: Student }) => {
    const res = await api.updateStudent(id, student);
    return res.data;
  }
);

export const removeStudent = createAsyncThunk('students/remove', async (id: number) => {
  await api.deleteStudent(id);
  return id;
});

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStudents.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchStudents.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to fetch students'; })
      .addCase(fetchStudent.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStudent.fulfilled, (state, action) => { state.loading = false; state.selected = action.payload; })
      .addCase(fetchStudent.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to fetch student'; })
      .addCase(addStudent.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(addStudent.rejected, (state, action) => { state.error = action.error.message ?? 'Failed to add student'; })
      .addCase(editStudent.fulfilled, (state, action) => {
        const idx = state.list.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        state.selected = action.payload;
      })
      .addCase(editStudent.rejected, (state, action) => { state.error = action.error.message ?? 'Failed to update student'; })
      .addCase(removeStudent.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload);
      })
      .addCase(removeStudent.rejected, (state, action) => { state.error = action.error.message ?? 'Failed to delete student'; });
  },
});

export const { clearSelected, clearError } = studentsSlice.actions;
export default studentsSlice.reducer;
