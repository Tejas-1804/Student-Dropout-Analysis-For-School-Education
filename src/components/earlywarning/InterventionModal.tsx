import React, { useState } from 'react';
import { X, Calendar, UserCheck, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Student, User, Intervention } from '../../types';
import { storageService } from '../../services/storage';

interface InterventionModalProps {
  student: Student | null;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
}

export const InterventionModal: React.FC<InterventionModalProps> = ({
  student,
  currentUser,
  isOpen,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Intervention['type']>('remedial_classes');
  const [priority, setPriority] = useState<Intervention['priority']>('high');
  const [assignedTo, setAssignedTo] = useState('Smt. Kavitha Rao (Counseling Center)');
  const [followUpDate, setFollowUpDate] = useState('2026-10-12');
  const [initialNote, setInitialNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      storageService.createIntervention(student.id, {
        title: title || `${type.replace('_', ' ').toUpperCase()} Plan for ${student.name}`,
        type,
        priority,
        assignedTo,
        assignedRole: 'Lead Academic Mentor',
        nextFollowUpDate: followUpDate,
        initialNote
      });

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Structure Student Support Plan</h3>
            <p className="text-xs text-slate-500">
              For {student.name} ({student.studentId} · Sem {student.semester})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Plan Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Remedial Tutoring & Weekly Attendance Milestones"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Support Modality
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              >
                <option value="remedial_classes">Remedial Classes</option>
                <option value="academic_mentoring">Academic Mentoring</option>
                <option value="counseling_session">Pastoral Counseling</option>
                <option value="attendance_check">Attendance Check-in</option>
                <option value="financial_aid">Financial / Scholarship Aid</option>
                <option value="parental_connect">Parental / Guardian Connect</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              >
                <option value="urgent">Urgent Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Standard Monitoring</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Mentor / Counselor
              </label>
              <input
                type="text"
                required
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Next Follow-up Date
              </label>
              <input
                type="date"
                required
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Assessment & Guidance Notes
            </label>
            <textarea
              rows={3}
              placeholder="Record preliminary notes, student communication details, or academic adjustments..."
              value={initialNote}
              onChange={(e) => setInitialNote(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
            Support interventions are tracked in the auditable student dossier. The student will receive an encouraging notification outlining their mentoring contact without punitive labels.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Registering Plan...' : 'Activate Support Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
