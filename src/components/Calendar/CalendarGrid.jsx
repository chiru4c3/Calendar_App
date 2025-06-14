import React, { memo } from 'react';
import { getDaysInMonth, isToday, getDateKey } from '../../utils/dateHelpers';
import { DAY_NAMES } from '../../utils/constants';
import { getCategoryColors } from '../../styles/calendarStyles';

const CalendarGrid = memo(({ 
  currentDate, 
  events, 
  onDateClick, 
  selectedDate,
  styles,
  isMobile,
  isDark 
}) => {
  const days = getDaysInMonth(currentDate);
  const categoryColors = getCategoryColors(isDark);

  const getDayEvents = (day) => {
    if (!day) return [];
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = getDateKey(date);
    return events[dateKey] || [];
  };

  const renderEventDots = (dayEvents, maxVisible = 3) => {
    const visibleEvents = dayEvents.slice(0, maxVisible);
    const remainingCount = dayEvents.length - maxVisible;

    return (
      <>
        {visibleEvents.map(event => (
          <div
            key={event.id}
            style={{
              ...styles.eventDot,
              backgroundColor: categoryColors[event.category]
            }}
            title={`${event.title} ${event.allDay ? '(All Day)' : `(${event.startTime})`}`}
          >
            {event.allDay ? 'All Day' : event.startTime} - {event.title}
          </div>
        ))}
        {remainingCount > 0 && (
          <div style={styles.eventMoreIndicator}>
            +{remainingCount} more
          </div>
        )}
      </>
    );
  };

  return (
    <div style={styles.grid}>
      {/* Weekday Headers */}
      <div style={styles.weekdays}>
        {DAY_NAMES.map(day => (
          <div key={day} style={styles.weekday}>
            {isMobile ? day.charAt(0) : day}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div style={styles.daysGrid}>
        {days.map((day, index) => {
          const dayEvents = getDayEvents(day);
          const isCurrentDay = day && isToday(day, currentDate);
          const isSelected = selectedDate && day && 
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();

          const cellStyle = {
            ...styles.dayCell,
            ...(day ? {} : styles.dayInactive),
            ...(isCurrentDay ? styles.dayToday : {}),
            ...(isSelected ? styles.daySelected : {})
          };

          return (
            <div
              key={index}
              style={cellStyle}
              onClick={() => day && onDateClick(day)}
              role={day ? "button" : "presentation"}
              tabIndex={day ? 0 : -1}
              aria-label={day ? `${currentDate.getMonth() + 1}/${day}/${currentDate.getFullYear()}` : undefined}
              onKeyDown={(e) => {
                if (day && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onDateClick(day);
                }
              }}
            >
              {day && (
                <>
                  <div style={{
                    ...styles.dayNumber,
                    ...(isCurrentDay ? styles.dayNumberToday : {})
                  }}>
                    {day}
                  </div>
                  <div>
                    {renderEventDots(dayEvents, isMobile ? 2 : 3)}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

CalendarGrid.displayName = 'CalendarGrid';

export default CalendarGrid;
