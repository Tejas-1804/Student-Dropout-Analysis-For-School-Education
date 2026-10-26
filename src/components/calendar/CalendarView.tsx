import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  X
} from 'lucide-react';
import { CalendarEvent } from '../../types';
import { storageService } from '../../services/storage';

interface CalendarViewProps {
  events: CalendarEvent[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'meeting' as CalendarEvent['type'],
    start: '2026-10-04T10:00:00',
    end: '2026-10-04T11:00:00',
    location: 'Counseling Room 104',
    description: ''
  });

  const filteredEvents = events.filter((e) => {
    if (selectedFilter === 'all') return true;
    return e.type === selectedFilter;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.addCalendarEvent({
      title: newEvent.title,
      type: newEvent.type,
      start: newEvent.start,
      end: newEvent.end,
      location: newEvent.location,
      description: newEvent.description,
      color:
        newEvent.type === 'meeting'
          ? '#D97706'
          : newEvent.type === 'exam'
          ? '#DC2626'
          : '#2563EB'
    });
    setIsAddEventOpen(false);
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            Institutional Timetable
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Academic Calendar & Schedules</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Synchronized lectures, mid-term examinations, counselor check-ins, and campus events.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
            {(['month', 'week', 'day', 'agenda'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-md font-semibold capitalize transition-colors ${
                  viewMode === m ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddEventOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Calendar Items' },
          { id: 'class', label: 'Classes & Labs' },
          { id: 'exam', label: 'Exams & Tests' },
          { id: 'assignment', label: 'Course Deliverables' },
          { id: 'meeting', label: 'Pastoral & Mentoring Check-ins' },
          { id: 'event', label: 'Campus Events' }
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedFilter(c.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === c.id
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Full-Screen Month Grid View */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900">October 2026</h2>
              <span className="text-xs text-slate-500">Autonomous Semester Term</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <button className="p-1 hover:bg-slate-200 rounded">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-slate-200 rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-slate-200 text-center text-xs font-bold text-slate-500 bg-slate-50 py-2">
            {daysOfWeek.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 text-xs">
            {/* Generate 35 calendar cells */}
            {Array.from({ length: 35 }).map((_, idx) => {
              const dayNum = idx - 2; // Offset for month start
              const isCurrentMonth = dayNum > 0 && dayNum <= 31;
              const dateStr = `2026-10-${String(dayNum).padStart(2, '0')}`;

              const dayEvents = filteredEvents.filter((e) => e.start.startsWith(dateStr));

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] p-2 flex flex-col justify-between hover:bg-slate-50/50 transition-colors ${
                    !isCurrentMonth ? 'bg-slate-50/30 text-slate-300' : 'text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-semibold text-xs ${
                        dayNum === 2 ? 'w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold' : ''
                      }`}
                    >
                      {isCurrentMonth ? dayNum : ''}
                    </span>
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="px-1.5 py-0.5 rounded text-[10px] truncate font-medium"
                        style={{
                          backgroundColor: `${ev.color || '#2563EB'}15`,
                          color: ev.color || '#2563EB',
                          borderLeft: `2px solid ${ev.color || '#2563EB'}`
                        }}
                        title={`${ev.title} (${ev.location})`}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>

                  <div />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agenda List View */}
      {(viewMode === 'agenda' || viewMode === 'week' || viewMode === 'day') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Agenda & Scheduled Events</h2>
          <div className="space-y-3">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-2.5 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: ev.color || '#2563EB' }}
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{ev.title}</h3>
                    <p className="text-slate-500 mt-0.5">{ev.description}</p>
                    <div className="flex items-center gap-4 text-slate-400 text-[11px] mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(ev.start).toLocaleString()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{ev.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className="px-2.5 py-1 rounded text-[11px] font-bold uppercase"
                  style={{
                    backgroundColor: `${ev.color || '#2563EB'}15`,
                    color: ev.color || '#2563EB'
                  }}
                >
                  {ev.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Schedule Academic Event</h3>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Remedial Algorithms Mentoring Hour"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="meeting">Mentoring Check-in</option>
                    <option value="class">Class / Lab</option>
                    <option value="exam">Examination</option>
                    <option value="event">Campus Event</option>
                    <option value="study_group">Study Circle</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / Room</label>
                  <input
                    type="text"
                    required
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.end}
                    onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional agenda details..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
