"use client";

import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  grades,
  exams,
  subjects,
  students,
  classes,
  sections,
} from "@/lib/mock-data";

interface ReportCardProps {
  studentId: string;
  examId?: string;
}

export function ReportCardPDF({ studentId, examId }: ReportCardProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const student = students.find((s) => s.id === studentId);
  const studentClass = classes.find((c) => c.id === student?.classId);
  const studentSection = sections.find((s) => s.id === student?.sectionId);

  const relevantExams = useMemo(() => {
    if (examId) return exams.filter((e) => e.id === examId);
    return exams.filter(
      (e) => e.classId === student?.classId && e.status === "completed"
    );
  }, [examId, student]);

  const studentGrades = useMemo(
    () => grades.filter((g) => g.studentId === studentId),
    [studentId]
  );

  const subjectResults = useMemo(() => {
    const map = new Map<
      string,
      { total: number; count: number; subjectId: string }
    >();
    studentGrades.forEach((g) => {
      if (!relevantExams.some((e) => e.id === g.examId)) return;
      const existing = map.get(g.subjectId);
      if (existing) {
        existing.total += g.percentage;
        existing.count += 1;
      } else {
        map.set(g.subjectId, {
          total: g.percentage,
          count: 1,
          subjectId: g.subjectId,
        });
      }
    });
    return Array.from(map.values()).map((item) => {
      const subject = subjects.find((s) => s.id === item.subjectId);
      const latestGrade = studentGrades.find(
        (g) => g.subjectId === item.subjectId
      );
      const avgPercentage =
        Math.round((item.total / item.count) * 10) / 10;
      return {
        subject: subject?.name || "Unknown",
        code: subject?.code || "",
        marksObtained: latestGrade?.marksObtained || 0,
        totalMarks: latestGrade?.totalMarks || 100,
        percentage: avgPercentage,
        grade: latestGrade?.grade || "-",
      };
    });
  }, [studentGrades, relevantExams]);

  const overallPercentage = useMemo(() => {
    if (subjectResults.length === 0) return 0;
    const totalObtained = subjectResults.reduce(
      (sum, s) => sum + s.marksObtained,
      0
    );
    const totalMarks = subjectResults.reduce(
      (sum, s) => sum + s.totalMarks,
      0
    );
    return totalMarks > 0
      ? Math.round((totalObtained / totalMarks) * 1000) / 10
      : 0;
  }, [subjectResults]);

  const overallGrade = useMemo(() => {
    const p = overallPercentage;
    if (p >= 90) return "A+";
    if (p >= 80) return "A";
    if (p >= 70) return "B+";
    if (p >= 60) return "B";
    if (p >= 50) return "C+";
    if (p >= 40) return "C";
    return "F";
  }, [overallPercentage]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !reportRef.current) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Report Card - ${student?.name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; color: #1a1a1a; }
            .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
            .school-name { font-size: 24px; font-weight: bold; color: #2563eb; }
            .subtitle { font-size: 14px; color: #666; }
            .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 15px; background: #f8fafc; border-radius: 8px; margin-bottom: 20px; }
            .info-label { font-weight: 600; color: #475569; }
            .info-value { color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #2563eb; color: white; padding: 10px 12px; text-align: left; font-size: 13px; }
            td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            tr:nth-child(even) { background: #f8fafc; }
            .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            .summary-card { padding: 15px; border: 2px solid #e2e8f0; border-radius: 8px; text-align: center; }
            .summary-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
            .summary-value { font-size: 28px; font-weight: bold; color: #2563eb; }
            .grade-a { color: #16a34a; }
            .grade-b { color: #2563eb; }
            .grade-c { color: #f59e0b; }
            .grade-f { color: #dc2626; }
            .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 2px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${reportRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!student) return null;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={handlePrint}>
          <Download className="mr-2 h-4 w-4" />
          Download Report Card
        </Button>
      </div>
      <div ref={reportRef}>
        <div className="header">
          <div className="school-name">Greenfield Academy</div>
          <div className="subtitle">Student Report Card</div>
          <div className="subtitle">Academic Year 2025-2026</div>
        </div>

        <div className="student-info">
          <div>
            <span className="info-label">Student Name: </span>
            <span className="info-value">{student.name}</span>
          </div>
          <div>
            <span className="info-label">Student ID: </span>
            <span className="info-value">{student.studentId}</span>
          </div>
          <div>
            <span className="info-label">Class: </span>
            <span className="info-value">
              {studentClass?.name} - Section {studentSection?.name}
            </span>
          </div>
          <div>
            <span className="info-label">Date of Birth: </span>
            <span className="info-value">
              {new Date(student.dateOfBirth).toLocaleDateString()}
            </span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th style={{ textAlign: "center" }}>Marks Obtained</th>
              <th style={{ textAlign: "center" }}>Total</th>
              <th style={{ textAlign: "center" }}>Percentage</th>
              <th style={{ textAlign: "center" }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {subjectResults.map((result) => (
              <tr key={result.code}>
                <td style={{ fontWeight: 600 }}>{result.subject}</td>
                <td style={{ textAlign: "center" }}>{result.marksObtained}</td>
                <td style={{ textAlign: "center" }}>{result.totalMarks}</td>
                <td style={{ textAlign: "center" }}>{result.percentage}%</td>
                <td style={{ textAlign: "center", fontWeight: 700 }}>
                  {result.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="summary">
          <div className="summary-card">
            <div className="summary-label">Overall Percentage</div>
            <div className="summary-value">{overallPercentage}%</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Overall Grade</div>
            <div className={`summary-value ${
              overallGrade.startsWith("A")
                ? "grade-a"
                : overallGrade.startsWith("B")
                ? "grade-b"
                : overallGrade.startsWith("C")
                ? "grade-c"
                : "grade-f"
            }`}>
              {overallGrade}
            </div>
          </div>
        </div>

        <div className="footer">
          <p>This is a computer-generated report card.</p>
          <p>Greenfield Academy | 1200 University Blvd, Springfield, IL 62701</p>
        </div>
      </div>
    </div>
  );
}