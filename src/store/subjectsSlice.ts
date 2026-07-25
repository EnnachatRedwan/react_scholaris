import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/subjectsApi';
import type { Subject } from '../types';

interface SubjectsState {
  list: Subject[];
  selected: Subject | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubjectsState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

export const fetchSubjects = createAsyncThunk('subjects/fetchAll', async () => {
  const res = await api.fetchAllSubjects();
  return res.data;
});

export const fetchSubject = createAsyncThunk('subjects/fetchOne', async (id: number) => {
  const res = await api.fetchSubjectById(id);
  return res.data;
});

export const addSubject = createAsyncThunk('subjects/add', async (subject: Subject) => {
  const res = await api.createSubject(subject);
  return res.data;
});

export const editSubject = createAsyncThunk(
  'subjects/edit',
  async ({ id, subject }: { id: number; subject: Subject }) => {
    const res = await api.updateSubject(id, subject);
    return res.data;
  }
);

export const removeSubject = createAsyncThunk('subjects/remove', async (id: number) => {
  await api.deleteSubject(id);
  return id;
});

const subjectsSlice = createSlice({
  name: 'subjects',
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
      .addCase(fetchSubjects.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSubjects.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchSubjects.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to fetch subjects'; })
      .addCase(fetchSubject.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSubject.fulfilled, (state, action) => { state.loading = false; state.selected = action.payload; })
      .addCase(fetchSubject.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to fetch subject'; })
      .addCase(addSubject.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(addSubject.rejected, (state, action) => { state.error = action.error.message ?? 'Failed to add subject'; })
      .addCase(editSubject.fulfilled, (state, action) => {
        const idx = state.list.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        state.selected = action.payload;
      })
      .addCase(editSubject.rejected, (state, action) => { state.error = action.error.message ?? 'Failed to update subject'; })
      .addCase(removeSubject.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload);
      })
      .addCase(removeSubject.rejected, (state, action) => { state.error = action.error.message ?? 'Failed to delete subject'; });
  },
});

export const { clearSelected, clearError } = subjectsSlice.actions;
export default subjectsSlice.reducer;
