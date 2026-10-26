import React, { useState } from 'react';
import {
  Bus,
  Clock,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Users,
  Compass
} from 'lucide-react';
import { BusRoute } from '../../types';

interface TransportViewProps {
  routes: BusRoute[];
}

export const TransportView: React.FC<TransportViewProps> = ({ routes }) => {
  const [selectedRoute, setSelectedRoute] = useState<BusRoute>(routes[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            Institutional Transit Logistics
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Presidency College Shuttle & Bus Routes</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time GPS transit monitoring, commuter bus routes, timing schedules, and driver contacts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>3 Fleet Routes Active</span>
          </span>
        </div>
      </div>

      {/* Route Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((route) => {
          const isSelected = selectedRoute.id === route.id;
          const isDelayed = route.status === 'delayed';

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-white border-blue-900 shadow-md ring-1 ring-blue-900'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                  {route.routeNumber}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    isDelayed
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isDelayed ? 'DELAYED' : 'IN TRANSIT'}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 mb-1">{route.routeName}</h2>
              <div className="text-xs text-slate-500 mb-3">Vehicle: {route.busNumber}</div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span>Morning Departure:</span>
                  <strong>{route.departureTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Campus Arrival:</span>
                  <strong className={isDelayed ? 'text-amber-700' : 'text-slate-800'}>
                    {route.estimatedArrival}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Current Occupancy:</span>
                  <span className="font-mono">{route.occupancy}% Seats Filled</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Route Live Progress & Stops */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-bold text-blue-900 uppercase">Live Route Progression</div>
            <h2 className="text-lg font-bold text-slate-900">
              {selectedRoute.routeNumber}: {selectedRoute.routeName}
            </h2>
            <div className="text-xs text-slate-500">
              Bus Registration: <strong>{selectedRoute.busNumber}</strong> · Driver: {selectedRoute.driverName}
            </div>
          </div>

          <a
            href={`tel:${selectedRoute.driverPhone}`}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span>Call Driver ({selectedRoute.driverPhone})</span>
          </a>
        </div>

        {/* Live Stops Progression Bar */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Route Checkpoints & Stops
          </h3>
          <div className="relative">
            <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
              {selectedRoute.stops.map((stop, idx) => {
                const isPassed = idx < selectedRoute.currentStopIndex;
                const isCurrent = idx === selectedRoute.currentStopIndex;

                return (
                  <div
                    key={stop}
                    className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-slate-200 shadow-2xs"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <div className="text-xs font-bold text-slate-800">{stop}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {isCurrent ? 'BUS AT STOP' : isPassed ? 'Departed' : 'Scheduled'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Advisory Transport Policy Note */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Presidency College institutional shuttles operate Mondays through Saturdays. Free Wi-Fi and student ID RFID scanning available on all vehicles. In case of unexpected traffic congestion, automated timetable advisories are dispatched through student push notifications.
          </p>
        </div>
      </div>
    </div>
  );
};
