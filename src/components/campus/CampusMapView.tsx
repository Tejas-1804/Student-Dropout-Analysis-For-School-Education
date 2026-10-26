import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  Clock,
  Compass,
  Building,
  CheckCircle2,
  X
} from 'lucide-react';
import { CampusLocation } from '../../types';

interface CampusMapViewProps {
  locations: CampusLocation[];
}

export const CampusMapView: React.FC<CampusMapViewProps> = ({ locations }) => {
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation>(locations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [navRouteFrom, setNavRouteFrom] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Campus Points' },
    { id: 'academic', label: 'Academic & Blocks' },
    { id: 'labs', label: 'Research & Labs' },
    { id: 'admin', label: 'Administration' },
    { id: 'library', label: 'Library' },
    { id: 'amenities', label: 'Support & Amenities' },
    { id: 'sports', label: 'Sports Arena' }
  ];

  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || loc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            Presidency Bengaluru Campus
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Interactive Campus Navigation & Facility Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore academic blocks, advanced computing laboratories, student support suites, and campus commons.
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search building, lab, library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === c.id
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main Map + Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Illustrated Interactive Campus Map */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 relative overflow-hidden">
          <div className="relative w-full aspect-16/10 bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            {/* Architectural Grid and Green Lawn Illustration SVG */}
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 1000 625"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Campus Grounds */}
              <rect width="1000" height="625" fill="#0B1329" />

              {/* Campus Roads and Walkways */}
              <path
                d="M 50 310 Q 500 290 950 310"
                stroke="#1E293B"
                strokeWidth="48"
                strokeLinecap="round"
              />
              <path
                d="M 500 40 L 500 580"
                stroke="#1E293B"
                strokeWidth="40"
                strokeLinecap="round"
              />
              <path
                d="M 280 180 Q 500 400 750 480"
                stroke="#334155"
                strokeWidth="16"
                strokeDasharray="6 6"
              />

              {/* Lush University Courtyard Lawns */}
              <rect x="80" y="80" width="220" height="180" rx="16" fill="#064E3B" fillOpacity="0.35" stroke="#059669" strokeWidth="2" strokeDasharray="4 4" />
              <rect x="700" y="80" width="220" height="180" rx="16" fill="#064E3B" fillOpacity="0.35" stroke="#059669" strokeWidth="2" strokeDasharray="4 4" />
              <rect x="180" y="380" width="220" height="180" rx="16" fill="#064E3B" fillOpacity="0.35" stroke="#059669" strokeWidth="2" strokeDasharray="4 4" />

              {/* Campus Central Amphitheatre / Plaza */}
              <circle cx="500" cy="310" r="65" fill="#1E293B" stroke="#3B82F6" strokeWidth="3" />
              <circle cx="500" cy="310" r="40" fill="#0F172A" />
              <text x="500" y="315" fill="#93C5FD" fontSize="12" fontWeight="bold" textAnchor="middle">
                CENTRAL PLAZA
              </text>

              {/* Illustrated Building Volumes */}
              {/* Block A: Admin Tower */}
              <g transform="translate(260, 220)">
                <rect x="0" y="0" width="120" height="90" rx="8" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="2" />
                <text x="60" y="45" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">BLOCK A</text>
                <text x="60" y="60" fill="#93C5FD" fontSize="9" textAnchor="middle">Main Tower</text>
              </g>

              {/* Block B: Aryabhatta Computing */}
              <g transform="translate(520, 160)">
                <rect x="0" y="0" width="130" height="95" rx="8" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="2" />
                <text x="65" y="45" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">BLOCK B</text>
                <text x="65" y="60" fill="#93C5FD" fontSize="9" textAnchor="middle">Computing & AI</text>
              </g>

              {/* Central Library */}
              <g transform="translate(360, 360)">
                <rect x="0" y="0" width="130" height="85" rx="8" fill="#312E81" stroke="#A78BFA" strokeWidth="2" />
                <text x="65" y="42" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">LIBRARY</text>
                <text x="65" y="58" fill="#DDD6FE" fontSize="9" textAnchor="middle">Knowledge Commons</text>
              </g>

              {/* Block C: Ramanujan Labs */}
              <g transform="translate(630, 280)">
                <rect x="0" y="0" width="130" height="90" rx="8" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="2" />
                <text x="65" y="45" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">BLOCK C</text>
                <text x="65" y="60" fill="#93C5FD" fontSize="9" textAnchor="middle">GPU Cloud Labs</text>
              </g>

              {/* Sports Pavilion */}
              <g transform="translate(730, 440)">
                <rect x="0" y="0" width="140" height="80" rx="8" fill="#064E3B" stroke="#34D399" strokeWidth="2" />
                <text x="70" y="42" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">SPORTS ARENA</text>
                <text x="70" y="56" fill="#A7F3D0" fontSize="9" textAnchor="middle">Pavilion & Gym</text>
              </g>

              {/* Student Wellbeing Center */}
              <g transform="translate(200, 420)">
                <rect x="0" y="0" width="110" height="75" rx="8" fill="#78350F" stroke="#FBBF24" strokeWidth="2" />
                <text x="55" y="38" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">WELLBEING</text>
                <text x="55" y="52" fill="#FDE68A" fontSize="8" textAnchor="middle">Counseling Hub</text>
              </g>
            </svg>

            {/* Interactive Location Pin Hotspots */}
            {locations.map((loc) => {
              const isSelected = selectedLocation.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  style={{
                    left: `${loc.coordinates.x}%`,
                    top: `${loc.coordinates.y}%`
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform ${
                    isSelected ? 'scale-125' : 'hover:scale-110'
                  }`}
                  title={loc.name}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 ${
                      isSelected
                        ? 'bg-blue-600 border-white text-white ring-4 ring-blue-500/40'
                        : 'bg-white border-slate-900 text-slate-900'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-8 bg-slate-950/95 text-white text-[10px] font-semibold py-1 px-2.5 rounded whitespace-nowrap shadow-xl border border-slate-800 z-30">
                    {loc.name}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Tap any building pin to inspect facilities and schedule hours</span>
            <span>Bengaluru Campus Map · Scale: 1:500</span>
          </div>
        </div>

        {/* Right 4 Cols: Selected Location Details Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded uppercase">
                  {selectedLocation.category}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-2">
                  {selectedLocation.name}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedLocation.building} · {selectedLocation.floor}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedLocation.description}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Operating Hours: <strong>{selectedLocation.openHours}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Navigation className="w-4 h-4 text-slate-400" />
                <span>Accessible via North & Central Walkway gates</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Available Facilities & Suites
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                {selectedLocation.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => {
                  setNavRouteFrom(selectedLocation.name);
                  alert(`Campus navigation route plotted to ${selectedLocation.name}. Estimated walking time: 4 mins.`);
                }}
                className="w-full py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>Get Walking Directions</span>
              </button>
            </div>
          </div>

          {/* Quick Location Directory List */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Campus Points of Interest ({filteredLocations.length})
            </h3>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedLocation.id === loc.id
                      ? 'bg-blue-50 text-blue-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{loc.name}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{loc.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
