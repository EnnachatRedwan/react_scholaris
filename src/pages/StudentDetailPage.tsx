import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiArrowLeft, HiPlus, HiPencil, HiTrash, HiPrinter } from 'react-icons/hi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchStudent } from '../store/studentsSlice';
import { fetchSubjects } from '../store/subjectsSlice';
import { fetchScoresByStudent, addScore, editScore, removeScore } from '../store/scoresSlice';
import ScoreForm from '../components/ScoreForm';
import DeleteModal from '../components/DeleteModal';
import AnimatedPage from '../components/AnimatedPage';
import ScoreBadge from '../components/ScoreBadge';
import { Btn, Spinner, Alert, Card, Table, Thead, Th, Tbody, Tr, Td, Empty } from '../components/ui';
import type { Score } from '../types';

const grade = (score: number) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

const StudentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const student = useAppSelector((s) => s.students.selected);
  const studentLoading = useAppSelector((s) => s.students.loading);
  const { studentScores: scores, loading: scoresLoading } = useAppSelector((s) => s.scores);
  const subjects = useAppSelector((s) => s.subjects.list);
  const students = useAppSelector((s) => s.students.list);

  const [scoreFormOpen, setScoreFormOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Score | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchStudent(Number(id)));
      dispatch(fetchScoresByStudent(Number(id)));
      dispatch(fetchSubjects());
    }
  }, [dispatch, id]);

  const handleAddScore = () => { setEditingScore(null); setScoreFormOpen(true); };
  const handleEditScore = (s: Score) => { setEditingScore(s); setScoreFormOpen(true); };
  const handleDeleteScore = (s: Score) => { setToDelete(s); setDeleteOpen(true); };

  const handleScoreSubmit = (score: Score) => {
    if (editingScore?.id) {
      dispatch(editScore({ id: editingScore.id, score }));
    } else {
      dispatch(addScore(score));
    }
    setScoreFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (toDelete?.id) dispatch(removeScore(toDelete.id));
    setDeleteOpen(false);
    setToDelete(null);
  };

  const handlePrint = () => {
    if (!student) return;

    const avg = scores.length > 0
      ? (scores.reduce((sum, s) => sum + s.score, 0) / scores.length).toFixed(1)
      : null;

    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // Header bar
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageW, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Scholaris', 14, 14);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Student Academic Report', pageW - 14, 9, { align: 'right' });
    doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageW - 14, 16, { align: 'right' });

    // Student info
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text(`${student.firstName} ${student.lastName}`, 14, 34);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);

    const infoY = 42;
    const col = (pageW - 28) / 3;

    // Info boxes
    [
      { label: 'EMAIL', value: student.email || '—' },
      { label: 'DATE OF BIRTH', value: student.dateOfBirth || '—' },
      { label: 'STUDENT ID', value: String(student.id ?? 'N/A') },
    ].forEach((item, i) => {
      const x = 14 + i * col;
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(x, infoY, col - 4, 16, 2, 2, 'FD');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(156, 163, 175);
      doc.text(item.label, x + 4, infoY + 6);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(17, 24, 39);
      doc.text(item.value, x + 4, infoY + 13);
    });

    // Scores table
    const tableRows = scores.map((sc) => {
      const subject = subjects.find((s) => s.id === sc.subjectId);
      return [
        subject?.name ?? `Subject #${sc.subjectId}`,
        subject?.code ?? '—',
        sc.examType || '—',
        sc.examDate || '—',
        String(sc.score),
        grade(sc.score),
      ];
    });

    const scoreColor = (s: number): [number, number, number] =>
      s >= 80 ? [21, 128, 61] : s >= 60 ? [180, 83, 9] : [185, 28, 28];

    autoTable(doc, {
      startY: infoY + 24,
      head: [['Subject', 'Code', 'Exam Type', 'Exam Date', 'Score', 'Grade']],
      body: tableRows.length > 0 ? tableRows : [['No scores recorded.', '', '', '', '', '']],
      headStyles: { fillColor: [37, 99, 235], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        4: { halign: 'center', fontStyle: 'bold' },
        5: { halign: 'center', fontStyle: 'bold' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && (data.column.index === 4 || data.column.index === 5)) {
          const scoreVal = scores[data.row.index]?.score;
          if (scoreVal !== undefined) {
            data.cell.styles.textColor = scoreColor(scoreVal);
          }
        }
      },
    });

    // Average summary
    const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
    if (avg) {
      const [r, g2, b] = scoreColor(Number(avg));
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(pageW - 60, finalY, 46, 18, 2, 2, 'FD');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(59, 130, 246);
      doc.text('OVERALL AVERAGE', pageW - 37, finalY + 6, { align: 'center' });
      doc.setFontSize(14);
      doc.setTextColor(r, g2, b);
      doc.text(avg, pageW - 37, finalY + 14, { align: 'center' });
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setDrawColor(229, 231, 235);
    doc.line(14, footerY - 4, pageW - 14, footerY - 4);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text('Scholaris — School Management System', 14, footerY);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageW - 14, footerY, { align: 'right' });

    doc.save(`${student.firstName}_${student.lastName}_results.pdf`);
  };

  if (studentLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!student) {
    return (
      <div className="text-center py-16 space-y-4">
        <Alert>Student not found.</Alert>
        <Btn variant="ghost" onClick={() => navigate('/students')}>Back to Students</Btn>
      </div>
    );
  }

  const avgScore = scores.length > 0
    ? (scores.reduce((sum, s) => sum + s.score, 0) / scores.length).toFixed(1)
    : null;

  return (
    <AnimatedPage>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Btn variant="ghost" onClick={() => navigate('/students')} className="px-2">
              <HiArrowLeft className="h-4 w-4" />
            </Btn>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{student.firstName} {student.lastName}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Student Profile</p>
            </div>
          </div>
          <Btn variant="ghost" onClick={handlePrint}>
            <HiPrinter className="h-4 w-4" /> Print Results
          </Btn>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Email</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1">{student.email ?? '—'}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Date of Birth</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1">{student.dateOfBirth ?? '—'}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Average Score</p>
            <div className="mt-2">
              {avgScore ? (
                <span className={`text-4xl font-bold ${
                  Number(avgScore) >= 80
                    ? 'text-green-600 dark:text-green-400'
                    : Number(avgScore) >= 60
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {avgScore}
                </span>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">—</span>
              )}
            </div>
          </Card>
        </div>

        {/* Scores table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Scores ({scores.length})</h2>
            <Btn onClick={handleAddScore}>
              <HiPlus className="h-4 w-4" /> Add Score
            </Btn>
          </div>

          {scoresLoading && scores.length === 0 ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : scores.length === 0 ? (
            <Empty message="No scores recorded for this student." />
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Subject</Th>
                  <Th>Score</Th>
                  <Th>Grade</Th>
                  <Th>Exam Type</Th>
                  <Th>Exam Date</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </Thead>
              <Tbody>
                {scores.map((sc) => {
                  const subject = subjects.find((s) => s.id === sc.subjectId);
                  return (
                    <Tr key={sc.id}>
                      <Td>
                        <Link to={`/subjects/${sc.subjectId}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                          {subject?.name ?? `Subject #${sc.subjectId}`}
                        </Link>
                        {subject?.code && <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">({subject.code})</span>}
                      </Td>
                      <Td><ScoreBadge score={sc.score} /></Td>
                      <Td>
                        <span className="font-bold text-sm text-gray-600 dark:text-gray-300">{grade(sc.score)}</span>
                      </Td>
                      <Td className="text-gray-500 dark:text-gray-400">{sc.examType || '—'}</Td>
                      <Td className="text-gray-500 dark:text-gray-400">{sc.examDate || '—'}</Td>
                      <Td>
                        <div className="flex gap-2 justify-end">
                          <Btn variant="icon" onClick={() => handleEditScore(sc)}><HiPencil className="h-4 w-4" /></Btn>
                          <Btn variant="icon-danger" onClick={() => handleDeleteScore(sc)}><HiTrash className="h-4 w-4" /></Btn>
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )}
        </div>
      </div>

      <ScoreForm
        open={scoreFormOpen}
        onClose={() => setScoreFormOpen(false)}
        onSubmit={handleScoreSubmit}
        initial={editingScore}
        students={students.length > 0 ? students : student ? [student] : []}
        subjects={subjects}
        fixedStudentId={student.id}
      />
      <DeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} itemName={`score ${toDelete?.score ?? ''}`} />
    </AnimatedPage>
  );
};

export default StudentDetailPage;
