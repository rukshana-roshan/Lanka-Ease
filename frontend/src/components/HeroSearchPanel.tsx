import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Sparkles } from 'lucide-react';

interface HeroSearchPanelProps {
  className?: string;
}

const POPULAR_TAGS = [
  'Electrician',
  'Plumber',
  'Cleaner',
  'AC Repair',
  'Appliance Repair',
  'Painter',
  'Carpenter',
];

const SRI_LANKA_CITIES = [
  'Colombo',
  'Kandy',
  'Galle',
  'Gampaha',
  'Kurunegala',
  'Dehiwala',
  'Negombo',
  'Nugegoda',
  'Kotte',
  'Battaramulla',
];

export const HeroSearchPanel: React.FC<HeroSearchPanelProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Colombo');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) queryParams.set('search', searchQuery.trim());
    if (selectedLocation) queryParams.set('location', selectedLocation);
    
    navigate(`/providers?${queryParams.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    navigate(`/providers?search=${encodeURIComponent(tag)}&location=${encodeURIComponent(selectedLocation)}`);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Floating Search Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-full p-2.5 sm:p-3 transition-all">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Main Search Input */}
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 bg-transparent">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you need help with? e.g. electrician, plumber, cleaner..."
              className="w-full bg-transparent text-sm md:text-base font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-800" />

          {/* Location Selector Dropdown */}
          <div className="relative min-w-[150px] md:min-w-[170px] w-full md:w-auto flex items-center px-4 py-2 bg-transparent">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-200 appearance-none focus:outline-none cursor-pointer pr-6"
            >
              {SRI_LANKA_CITIES.map((city) => (
                <option key={city} value={city} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
          </div>

          {/* Find Help Action Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm md:text-base rounded-full shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shrink-0 active:scale-95"
          >
            <Search className="w-4 h-4 md:w-5 md:h-5 text-white" />
            <span>Find Help</span>
          </button>
        </form>
      </div>

      {/* Popular Tags Row */}
      <div className="mt-3 pt-1 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar px-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500" /> Popular:
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-full border border-slate-700/60 transition-colors whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
