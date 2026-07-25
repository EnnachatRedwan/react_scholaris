import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './studentsSlice';
import subjectsReducer from './subjectsSlice';
import scoresReducer from './scoresSlice';

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    subjects: subjectsReducer,
    scores: scoresReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
