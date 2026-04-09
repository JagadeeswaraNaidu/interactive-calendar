import { useState, useEffect } from 'react';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, addMonths, subMonths, isSameDay, 
  isAfter, isSameMonth, differenceInDays, format, addYears, subYears 
} from 'date-fns';

const HOLIDAYS = [
  { date: new Date(2026, 0, 1), name: "New Year's Day" },
  { date: new Date(2026, 0, 26), name: "Republic Day" },
  { date: new Date(2026, 7, 15), name: "Independence Day" },
  { date: new Date(2026, 9, 2), name: "Gandhi Jayanti" },
  { date: new Date(2026, 11, 25), name: "Christmas" },
];

export function useCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [noteType, setNoteType] = useState("personal");
  const [allNotes, setAllNotes] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('calendar_vault_v8');
    if (saved) setAllNotes(JSON.parse(saved));
  }, []);

  const currentKey = `${format(currentMonth, 'yyyy-MMMM')}-${noteType}`;
  
  const handleNotesChange = (val) => {
    const updated = { ...allNotes, [currentKey]: val };
    setAllNotes(updated);
    localStorage.setItem('calendar_vault_v8', JSON.stringify(updated));
  };

  const deleteNote = () => {
    const updated = { ...allNotes };
    delete updated[currentKey];
    setAllNotes(updated);
    localStorage.setItem('calendar_vault_v8', JSON.stringify(updated));
  };

  const hasNotes = (type) => {
    const key = `${format(currentMonth, 'yyyy-MMMM')}-${type}`;
    return !!allNotes[key];
  };

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
  });

  const handleDayClick = (day) => {
    if (!isSameMonth(day, currentMonth)) setCurrentMonth(startOfMonth(day));
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else {
      if (isSameDay(day, startDate)) setStartDate(null);
      else if (isAfter(day, startDate)) setEndDate(day);
      else setStartDate(day);
    }
  };

  return {
    currentMonth, calendarDays, startDate, endDate, 
    currentNote: allNotes[currentKey] || "",
    daysCount: (startDate && endDate) ? differenceInDays(endDate, startDate) + 1 : startDate ? 1 : 0,
    noteType, setNoteType, handleDayClick, handleNotesChange, deleteNote, hasNotes,
    getHoliday: (day) => HOLIDAYS.find(h => isSameDay(h.date, day)),
    nextMonth: () => setCurrentMonth(addMonths(currentMonth, 1)),
    prevMonth: () => setCurrentMonth(subMonths(currentMonth, 1)),
    nextYear: () => setCurrentMonth(addYears(currentMonth, 1)),
    prevYear: () => setCurrentMonth(subYears(currentMonth, 1)),
    jumpToToday: () => { setCurrentMonth(new Date()); setStartDate(new Date()); setEndDate(null); }
  };
}