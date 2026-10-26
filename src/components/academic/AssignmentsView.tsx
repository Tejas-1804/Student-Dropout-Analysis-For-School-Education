import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Upload,
  CheckCircle2,
  Plus,
  FileText,
  AlertCircle,
  X
} from 'lucide-react';
import { Assignment, Course, User } from '../../types';
import { storageService } from '../../services/storage';

interface AssignmentsViewProps {
  assignments: Assignment[];
  courses: Course[];
  currentUser: User;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  courses,
  currentUser
}) => {
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'graded'>('all');
  const [activeSubmissionModal, setActiveSubmissionModal] = useState<Assignment | null>(null);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [submissionFileName, setSubmissionFileName] = useState('');
  const [newAsgData, setNewAsgData] = useState({
    courseCode: courses[0]?.code || 'CS501',
    title: '',
    description: '',
    dueDate: '2026-10-18T23:59:00Z',
    maxScore: 100
  });

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmissionModal) return;
    storageService.submitAssignment(
      activeSubmissionModal.id,
      submissionFileName || 'Student_Deliverable_Presidency.pdf'
    );
    setActiveSubmissionModal(null);
    setSubmissionFileName('');
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find((c) => c.code === newAsgData.courseCode) || courses[0];
    storageService.createAssignment({
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      title: newAsgData.title,
      description: newAsgData.description,
      dueDate: newAsgData.dueDate,
      maxScore: Number(newAsgData.maxScore),
      totalStudents: course.enrolledStudentsCount
    });
    setIsCreatingAssignment(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            Course Deliverables & Lab Practicals
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Coursework & Assignments Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Digital lab assignments, project deliverables, and automated submission verification.
          </p>
        </div>

        {(currentUser.role === 'faculty' || currentUser.role === 'admin') && (
          <button
            onClick={() => setIsCreatingAssignment(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {[
          { id: 'all', label: `All Assignments (${assignments.length})` },
          { id: 'ongoing', label: 'Ongoing & Active' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'graded', label: 'Evaluated & Graded' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filter === t.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.map((asg) => (
          <div
            key={asg.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                  {asg.courseCode}
                </span>
                <span className="text-xs text-slate-400 font-medium">Max Marks: {asg.maxScore}</span>
              </div>

              <h2 className="text-base font-bold text-slate-900 mb-1">{asg.title}</h2>
              <div className="text-xs text-slate-500 mb-3">{asg.courseName}</div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {asg.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1 mb-4">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Submission Deadline:</span>
                  </span>
                  <strong className="text-slate-800">
                    {new Date(asg.dueDate).toLocaleDateString()} at 11:59 PM
                  </strong>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Cohort Turn-in:</span>
                  <span className="font-mono text-slate-700">
                    {asg.submissionsCount} of {asg.totalStudents} submitted
                  </span>
                </div>
              </div>
            </div>

            {/* Submission Status or Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {asg.userSubmission ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Submitted ({asg.userSubmission.fileUrl})</span>
                  </div>
                  {asg.userSubmission.score !== undefined && (
                    <span className="font-bold text-xs text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      Score: {asg.userSubmission.score} / {asg.maxScore}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-amber-700 font-medium">Submission Open</span>
                  <button
                    onClick={() => setActiveSubmissionModal(asg)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Submission</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Student Submission Modal */}
      {activeSubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Submit Coursework</h3>
                <div className="text-xs text-slate-500">{activeSubmissionModal.title}</div>
              </div>
              <button
                onClick={() => setActiveSubmissionModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitDeliverable} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deliverable File Attachment (.pdf, .zip, .ipynb)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya_CS501_Algorithms_Benchmark.pdf"
                  value={submissionFileName}
                  onChange={(e) => setSubmissionFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 rounded-lg bg-blue-50 text-blue-900 border border-blue-100 text-[11px] leading-relaxed">
                By submitting, you certify that this submission represents your original academic analysis in adherence to Presidency College academic integrity policies.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubmissionModal(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs"
                >
                  Confirm & Archive Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Create Assignment Modal */}
      {isCreatingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Publish Course Assignment</h3>
              <button
                onClick={() => setIsCreatingAssignment(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Course</label>
                <select
                  value={newAsgData.courseCode}
                  onChange={(e) => setNewAsgData({ ...newAsgData, courseCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.code}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus Benchmark & Paxos Simulation"
                  value={newAsgData.title}
                  onChange={(e) => setNewAsgData({ ...newAsgData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Problem Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed instructions, dataset schema, and grading rubrics..."
                  value={newAsgData.description}
                  onChange={(e) => setNewAsgData({ ...newAsgData, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    value={newAsgData.maxScore}
                    onChange={(e) => setNewAsgData({ ...newAsgData, maxScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    onChange={(e) => setNewAsgData({ ...newAsgData, dueDate: `${e.target.value}T23:59:00Z` })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingAssignment(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs"
                >
                  Publish to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
