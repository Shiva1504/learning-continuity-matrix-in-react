import React, { useState, useEffect } from 'react';
import { EngagementWeek } from '../../types';
import styles from './EngagementMatrix.module.css';

interface EngagementMatrixProps {
  week: EngagementWeek;
  onDayClick: (date: Date) => void;
  lastToggledDay: string | null;
  focusedDayIndex: number | null;
}

const EngagementMatrix: React.FC<EngagementMatrixProps> = ({ 
  week, 
  onDayClick,
  lastToggledDay,
  focusedDayIndex
}) => {
  const [animatingDay, setAnimatingDay] = useState<string | null>(null);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Handle animation when a day is toggled
  useEffect(() => {
    if (lastToggledDay) {
      setAnimatingDay(lastToggledDay);
      const timer = setTimeout(() => {
        setAnimatingDay(null);
      }, 300); // Match this with CSS animation duration
      return () => clearTimeout(timer);
    }
  }, [lastToggledDay]);

  const dayRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Focus the day when focusedDayIndex changes
  React.useEffect(() => {
    if (focusedDayIndex !== null && dayRefs.current[focusedDayIndex]) {
      dayRefs.current[focusedDayIndex]?.focus();
    }
  }, [focusedDayIndex]);

  const handleKeyDown = (e: React.KeyboardEvent, date: Date, index: number, isToday: boolean) => {
    if (!isToday) {
      e.preventDefault();
      return;
    }
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onDayClick(date);
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        e.preventDefault();
        break;
    }
  };

  return (
    <div className={styles.matrixContainer}>
      <div className={styles.matrixGrid}>
        {week.days.map((day, index) => {
          const dateString = day.date.toISOString().split('T')[0];
          const dayName = days[day.date.getDay() === 0 ? 6 : day.date.getDay() - 1];
          const dayNumber = day.date.getDate();
          const isAnimating = animatingDay === dateString;
          
          return (
            <div 
              key={dateString}
              ref={el => dayRefs.current[index] = el}
              className={`${styles.dayCell} ${day.isToday ? styles.today : ''} ${
                focusedDayIndex === index ? styles.focused : ''
              } ${!day.isToday ? styles.nonInteractive : ''}`}
              onClick={() => day.isToday && onDayClick(day.date)}
              onKeyDown={(e) => handleKeyDown(e, day.date, index, day.isToday)}
              role={day.isToday ? "button" : "none"}
              tabIndex={day.isToday && focusedDayIndex === index ? 0 : -1}
              aria-label={`${dayName}, ${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${
                day.isToday 
                  ? (day.isCompleted ? 'Completed. Click to toggle.' : 'Not completed. Click to mark as complete.')
                  : (day.isCompleted ? 'Completed' : 'Not completed')
              }`}
              aria-pressed={day.isToday ? day.isCompleted : undefined}
              aria-disabled={!day.isToday}
            >
              <div className={styles.dayName}>{dayName}</div>
              <div className={styles.dayNumber}>{dayNumber}</div>
              <div 
                className={`${styles.completionIndicator} ${
                  day.isCompleted ? styles.completed : ''
                } ${isAnimating ? styles.pulse : ''}`}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(EngagementMatrix);
