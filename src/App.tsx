import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import StudentDetailPage from './pages/StudentDetailPage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import ScoresPage from './pages/ScoresPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="students/:id" element={<StudentDetailPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="subjects/:id" element={<SubjectDetailPage />} />
        <Route path="scores" element={<ScoresPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
