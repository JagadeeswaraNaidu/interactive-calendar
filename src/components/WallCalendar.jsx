import React, { useMemo, useState, useEffect } from 'react';
import { format, isSameMonth, isSameDay, isWithinInterval, isToday, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Clock, Trash2, RefreshCw, 
  User, Briefcase, ChevronUp, ChevronDown, CalendarDays,
  Sun, Moon 
} from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar';

export default function WallCalendar() {
  const {
    currentMonth, calendarDays, startDate, endDate, currentNote, 
    daysCount, noteType, setNoteType, handleDayClick, 
    handleNotesChange, deleteNote, hasNotes, getHoliday, 
    nextMonth, prevMonth, nextYear, prevYear, jumpToToday
  } = useCalendar();

  const [theme, setTheme] = useState('light');
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate Progress Percentage
  const progressPercent = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const total = differenceInDays(endDate, startDate) + 1;
    const elapsed = differenceInDays(new Date(), startDate) + 1;
    if (elapsed < 0) return 0;
    return Math.min(Math.round((elapsed / total) * 100), 100);
  }, [startDate, endDate]);

  const randomQuote = useMemo(() => ["Have a great day!", "Make day better than yesterday!", "Stay consistent"][Math.floor(Math.random() * 3)], []);
  const isDark = theme === 'dark';
  
  const s = {
    bg: isDark ? 'bg-[#0f172a]' : 'bg-[#f1f5f9]',
    card: isDark ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-white',
    sidebar: isDark ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-[#fafafa] border-slate-100',
    textMain: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-500' : 'text-slate-400',
    timeText: isDark ? 'text-blue-400' : 'text-slate-600',
    gridDate: isDark ? 'text-slate-200' : 'text-slate-600',
    gridInactive: isDark ? 'text-slate-700' : 'text-slate-200',
    input: isDark ? 'text-slate-100 placeholder:text-slate-800' : 'text-slate-800 placeholder:text-slate-200',
    noteBox: isDark 
      ? 'bg-slate-900/40 border-slate-700/50 focus-within:border-blue-500/50' 
      : 'bg-white border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus-within:border-blue-400'
  };

  return (
    <div className={`min-h-screen ${s.bg} flex items-center justify-center p-0 md:p-8 lg:p-12 font-sans antialiased transition-colors duration-500`}>
      <div className={`${s.card} w-full max-w-6xl flex flex-col md:flex-row md:rounded-[3.5rem] shadow-2xl overflow-hidden border transition-all`}>
        
        {/* LEFT SIDEBAR */}
        <div className={`w-full md:w-[42%] ${s.sidebar} flex flex-col border-b md:border-b-0 md:border-r`}>
          <div className="h-64 md:h-[45%] relative overflow-hidden group">
            <motion.div 
              className="w-full h-full cursor-pointer"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            >
              <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="hero" />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-6 md:p-10 flex flex-col justify-end pointer-events-none">
              <div className="flex justify-between items-end pointer-events-auto">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">{format(currentMonth, 'MMMM')}</h1>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-blue-400 text-xl md:text-3xl font-mono leading-none">{format(currentMonth, 'yyyy')}</span>
                    <div className="flex bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-0.5">
                      <button onClick={nextYear} className="p-1 text-blue-400 hover:text-white"><ChevronUp size={14}/></button>
                      <button onClick={prevYear} className="p-1 text-blue-400 hover:text-white"><ChevronDown size={14}/></button>
                      <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="px-2 border-l border-white/10 ml-1">
                        {isDark ? <Sun size={14} className="text-yellow-400"/> : <Moon size={14} className="text-blue-300"/>}
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={jumpToToday} className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white hover:text-slate-900 transition-all">
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 flex-grow flex flex-col gap-8">
            <div className="flex items-center justify-between gap-4">
              <div className={`flex ${isDark ? 'bg-slate-800' : 'bg-slate-200/50'} p-1 rounded-2xl`}>
                {['personal', 'work'].map((type) => (
                  <button key={type} onClick={() => setNoteType(type)} className={`px-5 py-2.5 rounded-xl text-[10px] font-bold transition-all ${noteType === type ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>
                    {type === 'personal' ? <User size={14} /> : <Briefcase size={14} />}
                  </button>
                ))}
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Days</p>
                <p className={`text-2xl md:text-4xl font-mono font-black ${s.textMain}`}>{daysCount}</p>
              </div>
            </div>

            <div className="flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-3 bg-blue-500/5 py-1.5 px-4 rounded-full border border-blue-500/10">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </div>
                  <span className={`text-[11px] font-mono font-black tracking-widest ${s.timeText}`}>
                    {format(time, 'HH:mm:ss')}
                  </span>
                </div>
                {currentNote && <button onClick={deleteNote} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>}
              </div>

              <div className={`relative flex-grow rounded-[2rem] border p-6 min-h-[150px] ${s.noteBox}`}>
                <textarea
                  className={`w-full h-full bg-transparent border-none focus:ring-0 text-xl font-medium italic resize-none leading-relaxed ${s.input}`}
                  placeholder="Notes..."
                  value={currentNote}
                  onChange={(e) => handleNotesChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CALENDAR */}
        <div className={`w-full md:w-[58%] p-6 md:p-12 lg:p-16 flex flex-col ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}>
          <header className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 md:mb-16">
            <h2 className={`text-3xl md:text-5xl font-black tracking-tighter italic uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>Blueprint.</h2>
            
            {startDate && endDate && (
              <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-full">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progressPercent}%` }} 
                  className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>
            )}

            <div className={`flex gap-2 p-1 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <button onClick={prevMonth} className="p-2 hover:bg-blue-600 hover:text-white rounded-lg text-slate-400 transition-all"><ChevronLeft size={20}/></button>
              <button onClick={nextMonth} className="p-2 hover:bg-blue-600 hover:text-white rounded-lg text-slate-400 transition-all"><ChevronRight size={20}/></button>
            </div>
          </header>

          <div className="grid grid-cols-7 w-full mb-6 text-[15px] font-mono font-black text-slate-400 text-center tracking-widest uppercase">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
          </div>

          <div className="flex-grow">
            <div className="grid grid-cols-7 w-full gap-y-4 md:gap-y-8">
              {calendarDays.map((day) => {
                const isCur = isSameMonth(day, currentMonth);
                const isS = startDate && isSameDay(day, startDate);
                const isE = endDate && isSameDay(day, endDate);
                const isB = startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate });
                return (
                  <div key={day.toString()} className="relative aspect-square flex items-center justify-center">
                    {(isB || isS || isE) && <div className={`absolute inset-0 bg-blue-600/20 ${isS ? 'rounded-l-full' : ''} ${isE ? 'rounded-r-full' : ''} scale-y-[0.6]`} />}
                    <button onClick={() => handleDayClick(day)} className={`relative z-10 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xs md:text-sm font-mono transition-all ${!isCur ? s.gridInactive : `font-bold ${s.gridDate}`} ${(isS || isE) ? 'bg-blue-600 !text-white shadow-lg' : isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} ${isToday(day) && !isS ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' : ''}`}>
                      {format(day, 'd')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          
          <footer className="mt-10 pt-8 border-t border-slate-100/10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
             <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><CalendarDays size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Range Duration</span>
                  <span className={`text-[11px] md:text-sm font-mono font-bold ${s.textMain}`}>
                    {startDate ? format(startDate, 'dd.MM.yy') : '...'} — {endDate ? format(endDate, 'dd.MM.yy') : '...'}
                  </span>
                </div>
             </div>
             <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
               {startDate && endDate ? `Sprint Progress: ${progressPercent}%` : randomQuote}
             </div>
          </footer>
        </div>
      </div>
    </div>
  );
}