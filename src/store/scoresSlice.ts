import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/scoresApi';
import type { Score } from '../types';

interface ScoresState {
  list: Score[];
  selected: Score | null;
  studentScores: Score[];
  subjectScores: Score[];
  loading: boolean;
  error: string | null;
}

const initialState: ScoresState = {
  list: [],
  selected: null,
  studentScores: [],
  subjectScores: [],
  loading: false,
  error: null,
};

export const fetchScores = createAsyncThunk('scores/fetchAll', async () => {
  const res = await api.fetchAllScores();
  return res.data;
});

export const fetchScore = createAsyncThunk('scores/fetchOne', async (id: number) => {
  const res = await api.fetchScoreById(id);
  return res.data;
});

export const fetchScoresByStudent = createAsyncThunk('scores/byStudent', async (studentId: number) => {
  const res = await api.fetchScoresByStudentId(studentId);
  return res.data;
});

export const fetchScoresBySubject = createAsyncThunk('scores/bySubject', async (subjectId: number) => {
  const res = await api.fetchScoresBySubjectId(subjectId);
  return res.data;
});

export const addScore = createAsyncThunk('scores/add', async (score: Score) => {
  const res = await api.createScore(score);
  return res.data;
});

export const editScore = createAsyncThunk(
  'scores/edit',
  async ({ id, score }: { id: number; score: Score }) => {
    const res = await api.updateScore(id, score);
    return res.data;
  }
);

export const removeScore = createAsyncThunk('scores/remove', async (id: number) => {
  await api.deleteScore(id);
  return id;
});

const scoresSlice = createSlice({
  name: 'scores',
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
    },
    clearError(state) {
      state.error = null;
    },
    clearStudentScores(state) {
      state.studentScores = [];
    },
    clearSubjectScores(state) {
      state.subjectScores = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScores.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchScores.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchScores.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to fetch scores'; })
      .addCase(fetchScore.fulfilled, (state, action) => { state.selected = action.payload; })
      .addCase(fetchScoresByStudent.pending, (state) => { state.loading = true; })
      .addCase(fetchScoresByStudent.fulfilled, (state, action) => { state.loading = false; state.studentScores = action.payload; })
      .addCase(fetchScoresByStudent.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Error'; })
      .addCase(fetchScoresBySubject.pending, (state) => { state.loading = true; })
      .addCase(fetchScoresBySubject.fulfilled, (state, action) => { state.loading = false; state.subjectScores = action.payload; })
      .addCase(fetchScoresBySubject.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Error'; })
      .addCase(addScore.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(addScore.rejected, (state, action) => { state.error = action.error.message ?? 'Failed to add score'; })
      .addCase(editScore.fulfilled, (state, action) => {
        const idx = state.list.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        state.selected = action.payload;
      })
      .addCase(editScore.rejected, (state, action) => { state.error = action.error.message ?? 'Failed to update score'; })
      .addCase(removeScore.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload);
        state.studentScores = state.studentScores.filter((s) => s.id !== action.payload);
        state.subjectScores = state.subjectScores.filter((s) => s.id !== action.payload);
      })
      .addCase(removeScore.rejected, (state, action) => { state.error = action.error.message ?? 'Failed to delete score'; });
  },
});

export const { clearSelected, clearError, clearStudentScores, clearSubjectScores } = scoresSlice.actions;
export default scoresSlice.reducer;
