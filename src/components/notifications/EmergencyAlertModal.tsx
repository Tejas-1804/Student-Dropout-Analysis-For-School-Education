import React, { useState } from 'react';
import {
  AlertOctagon,
  X,
  Send,
  Radio,
  Eye,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { storageService } from '../../services/storage';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  isOpen,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'urgent' | 'critical'>('urgent');
  const [audience, setAudience] = useState('All Presidency Scholars & Faculty');
  const [isPreview, setIsPreview] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  if (!isOpen) return null;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      storageService.broadcastEmergencyAlert({
        title,
        message,
        severity,
        audience
      });
      setIsBroadcasting(false);
      onClose();
      alert(`Emergency Broadcast successfully pushed to ${audience} across SMS, email, and mobile portal.`);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-red-200 shadow-2xl max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Institutional Emergency Broadcast Composer
            </h3>
            <p className="text-xs text-slate-500">
              Executive authority: Office of Academic Affairs & Disaster Management
            </p>
          </div>
        </div>

        {!isPreview ? (
          <form onSubmit={(e) => { e.preventDefault(); setIsPreview(true); }} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alert Title / Headline
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Weather Advisory: Heavy Rains & Shift to Remote Sessions"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Severity Tier
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="urgent">Urgent Advisory</option>
                  <option value="critical">Critical / Life Safety Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Audience
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="All Presidency Scholars & Faculty">All Scholars & Faculty</option>
                  <option value="Undergraduate Students Only">Undergraduate Students</option>
                  <option value="Faculty & Staff Only">Faculty & Academic Staff</option>
                  <option value="Computer Science & Engineering">CS & Engineering Department</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Broadcast Directive & Message Body
              </label>
              <textarea
                rows={4}
                required
                placeholder="Explicit instructions, safety guidelines, and schedule adjustments..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Alert</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="text-slate-500 font-semibold uppercase text-[10px]">
              Live Simulation Preview (As seen on all student devices)
            </div>

            <div
              className={`p-4 rounded-xl border-2 space-y-2 ${
                severity === 'critical'
                  ? 'bg-red-50 border-red-600 text-red-950 animate-pulse'
                  : 'bg-amber-50 border-amber-500 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-700" />
                  <span className="text-sm uppercase tracking-wide">
                    {severity === 'critical' ? 'CRITICAL CAMPUS BROADCAST' : 'URGENT CAMPUS ADVISORY'}
                  </span>
                </span>
                <span className="text-[10px] font-mono">BROADCAST ID #9821</span>
              </div>
              <h4 className="font-extrabold text-sm">{title}</h4>
              <p className="leading-relaxed">{message}</p>
              <div className="text-[10px] opacity-80 pt-1 border-t border-black/10">
                Audience: {audience} · Authorized by Principal Dr. Anand Ramanathan
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPreview(false)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
              >
                ← Back to Edit
              </button>
              <button
                type="button"
                onClick={handleBroadcast}
                disabled={isBroadcasting}
                className="px-5 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md flex items-center gap-2"
              >
                <Radio className="w-4 h-4 animate-ping" />
                <span>{isBroadcasting ? 'Broadcasting Fleet...' : 'Confirm & Dispatch Broadcast'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
