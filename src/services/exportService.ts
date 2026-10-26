import { Student } from '../types';

export function exportStudentsToCSV(students: Student[]) {
  const headers = [
    'Student ID',
    'Full Name',
    'Email',
    'Department',
    'Course',
    'Semester',
    'CGPA',
    'Attendance Rate (%)',
    'Missed Assignments',
    'Recent Exam Avg (%)',
    'Academic Trend',
    'Dropout Risk Level',
    'Risk Score',
    'Human Reviewed',
    'Active Interventions'
  ];

  const rows = students.map((s) => [
    `"${s.studentId}"`,
    `"${s.name}"`,
    `"${s.email}"`,
    `"${s.department}"`,
    `"${s.course}"`,
    s.semester,
    s.cgpa.toFixed(2),
    s.attendanceRate,
    s.missedAssignments,
    s.recentExamAverage,
    `"${s.academicTrend}"`,
    `"${s.riskAssessment.level}"`,
    s.riskAssessment.score,
    s.riskAssessment.isHumanReviewed ? 'YES' : 'NO',
    s.interventions.length
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Presidency_College_Student_Risk_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printAcademicReport(student: Student) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Academic & Support Profile - ${student.name} (${student.studentId})</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 24px; font-weight: bold; color: #0f172a; margin: 0; }
          .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
          .card-title { font-size: 13px; font-weight: 600; text-transform: uppercase; color: #475569; margin-bottom: 8px; }
          .metric { font-size: 22px; font-weight: bold; color: #0f172a; }
          .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          .table th, .table td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
          .table th { background: #f1f5f9; font-weight: 600; }
          .badge { display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: 600; border-radius: 4px; }
          .badge-high { background: #fee2e2; color: #b91c1c; }
          .badge-mod { background: #fef3c7; color: #b45309; }
          .badge-low { background: #dcfce7; color: #15803d; }
          .disclaimer { margin-top: 32px; padding: 12px; border-left: 4px solid #3b82f6; background: #eff6ff; font-size: 12px; color: #1e40af; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">PRESIDENCY COLLEGE</h1>
            <div class="subtitle">Office of Academic Affairs · Student Retention & Support Dossier</div>
          </div>
          <div style="text-align: right; font-size: 12px; color: #64748b;">
            Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}<br/>
            Confidential Document
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-title">Student Profile</div>
            <div><strong>Name:</strong> ${student.name}</div>
            <div><strong>Student ID:</strong> ${student.studentId}</div>
            <div><strong>Department:</strong> ${student.department}</div>
            <div><strong>Course & Semester:</strong> ${student.course}, Semester ${student.semester}</div>
            <div><strong>Mentor:</strong> ${student.mentorName}</div>
          </div>
          <div class="card">
            <div class="card-title">Academic & Risk Indicators</div>
            <div><strong>Cumulative CGPA:</strong> <span class="metric">${student.cgpa.toFixed(2)}</span> / 10.0</div>
            <div><strong>Classroom Attendance:</strong> ${student.attendanceRate}%</div>
            <div><strong>Early-Warning Indicator:</strong> <span class="badge ${student.riskAssessment.level === 'HIGH' ? 'badge-high' : student.riskAssessment.level === 'MODERATE' ? 'badge-mod' : 'badge-low'}">${student.riskAssessment.level} RISK (Score: ${student.riskAssessment.score})</span></div>
            <div><strong>Human Review Status:</strong> ${student.riskAssessment.isHumanReviewed ? `Reviewed by ${student.riskAssessment.reviewedBy || 'Authorized Staff'}` : 'Pending Human Review'}</div>
          </div>
        </div>

        <h3>Course Attendance Breakdown</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Course Name</th>
              <th>Classes Attended</th>
              <th>Total Classes</th>
              <th>Percentage</th>
              <th>Faculty</th>
            </tr>
          </thead>
          <tbody>
            ${student.subjectAttendance
              .map(
                (s) => `
              <tr>
                <td>${s.subjectCode}</td>
                <td>${s.subjectName}</td>
                <td>${s.attended}</td>
                <td>${s.total}</td>
                <td>${s.percentage}%</td>
                <td>${s.facultyName}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="disclaimer">
          <strong>Institutional Governance Note:</strong> The early-warning risk indicator is derived from statistical feature contributions (SHAP explainability) to assist faculty in proactive pastoral and academic care. It must never be used punitively or as a definitive projection of academic discontinuation.
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
