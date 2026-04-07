import React, { useState, useMemo, useEffect } from 'react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek,
  endOfWeek, isSameMonth, isSameDay, eachDayOfInterval, isBefore,
  startOfToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, NotebookPen } from 'lucide-react';
import './index.css';

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('calendar-notes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('calendar-notes', JSON.stringify(notes));
  }, [notes]);

  const today = startOfToday();
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const dayKey = format(selectedDate, 'yyyy-MM-dd');
  const currentNotes = notes[dayKey] || '';

  const handleNoteChange = (e) => {
    const value = e.target.value;
    setNotes(prev => {
      if (!value) {
        const next = { ...prev };
        delete next[dayKey];
        return next;
      }
      return {
        ...prev,
        [dayKey]: value
      };
    });
  };

  const getDayClass = (day) => {
    let classes = ['day-cell'];
    if (!isSameMonth(day, currentMonth)) classes.push('other-month');
    else classes.push('current-month');
    if (isSameDay(day, today)) classes.push('today');
    if (isSameDay(day, selectedDate)) classes.push('selected');
    const dKey = format(day, 'yyyy-MM-dd');
    if (notes[dKey]) classes.push('has-note');
    const dayOfWeek = day.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) classes.push('weekend');
    return classes.join(' ');
  };

  return (
    <div className="calendar-wrapper">
      <div className="spiral-container">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="spiral-ring" />
        ))}
      </div>

      <div className="hero-container">
        <img
          src="/hero.png"
          alt="Calendar"
          className="hero-image"
        />

        <div className="nav-buttons">
          <button onClick={prevMonth} className="nav-btn" aria-label="Previous Month">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="nav-btn" aria-label="Next Month">
            <ChevronRight size={20} />
          </button>
        </div>

        <svg className="shape-overlay" preserveAspectRatio="none" viewBox="0 0 1000 100" xmlns="http://www.w3.org/2000/svg">
          <path className="shape-accent" d="M0,100 L0,20 L300,80 L600,0 L1000,100 Z" opacity="0.6" />
          <path className="shape-base" d="M0,100 L0,40 L400,90 L700,20 L1000,100 Z" />
        </svg>

        <div className="month-display">
          <div className="year text-white">{format(currentMonth, 'yyyy')}</div>
          <div className="month">{format(currentMonth, 'MMMM')}</div>
        </div>
      </div>

      <div className="calendar-body">
        <div className="notes-section">
          <div className="notes-header">
            <NotebookPen size={18} />
            <span>Notes for {format(selectedDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="notes-lines">
            <textarea
              className="notes-textarea"
              placeholder={`Write something for ${format(selectedDate, 'do MMMM')}...`}
              value={currentNotes}
              onChange={handleNoteChange}
            />
          </div>
        </div>

        <div className="grid-section">
          <div className="weekdays">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d, i) => (
              <div key={d} className={`weekday ${i >= 5 ? 'weekend' : ''}`}>{d}</div>
            ))}
          </div>

          <div className="days-grid">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={getDayClass(day)}
                onClick={() => onDateClick(day)}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
