import { useState } from 'react';
import Header from './Header';
import CalendarGrid from './CalendarGrid';
import EventModal from './EventModal';
import { styles } from '../../styles/calendarStyles';
import { monthNames, dayNames, categoryColors } from '../../utils/constants';
import { getDateKey, getDaysInMonth, isToday, generateRecurringDates } from '../../utils/dateHelpers';
import useLocalStorage from '../../hooks/useLocalStorage';

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useLocalStorage('calendarEvents', {});
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    allDay: false,
    category: 'personal',
    recurring: 'none'
  });

  const getDayEvents = (day) => {
    if (!day) return [];
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = getDateKey(date);
    return events[dateKey] || [];
  };

  const getSelectedDayEvents = () => {
    if (!selectedDate) return [];
    const dateKey = getDateKey(selectedDate);
    return events[dateKey] || [];
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    setShowEventModal(true);
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      allDay: false,
      category: 'personal',
      recurring: 'none'
    });
  };

  const saveEvent = () => {
    if (!eventForm.title || !selectedDate) return;

    const dateKey = getDateKey(selectedDate);
    const newEvent = {
      id: editingEvent ? editingEvent.id : Date.now(),
      ...eventForm,
      date: dateKey
    };

    const updatedEvents = { ...events };
    
    if (!updatedEvents[dateKey]) {
      updatedEvents[dateKey] = [];
    }

    if (editingEvent) {
      updatedEvents[dateKey] = updatedEvents[dateKey].map(event =>
        event.id === editingEvent.id ? newEvent : event
      );
    } else {
      updatedEvents[dateKey].push(newEvent);
    }

    // Handle recurring events
    if (eventForm.recurring !== 'none' && !editingEvent) {
      const recurringDates = generateRecurringDates(selectedDate, eventForm.recurring);
      recurringDates.forEach(date => {
        const recurringDateKey = getDateKey(date);
        if (!updatedEvents[recurringDateKey]) {
          updatedEvents[recurringDateKey] = [];
        }
        updatedEvents[recurringDateKey].push({
          ...newEvent,
          id: Date.now() + Math.random(),
          date: recurringDateKey
        });
      });
    }

    setEvents(updatedEvents);
    setShowEventModal(false);
    setEventForm({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      allDay: false,
      category: 'personal',
      recurring: 'none'
    });
  };

  const deleteEvent = (dateKey, eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = { ...events };
      updatedEvents[dateKey] = updatedEvents[dateKey].filter(event => event.id !== eventId);
      if (updatedEvents[dateKey].length === 0) {
        delete updatedEvents[dateKey];
      }
      setEvents(updatedEvents);
      
      if (editingEvent && editingEvent.id === eventId) {
        setShowEventModal(false);
        setEditingEvent(null);
      }
    }
  };

  const editEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      allDay: event.allDay,
      category: event.category,
      recurring: event.recurring || 'none'
    });
    setShowEventModal(true);
  };

  const searchEvents = () => {
    if (!searchQuery.trim()) return [];
    
    const results = [];
    const query = searchQuery.toLowerCase();
    
    Object.entries(events).forEach(([dateKey, dayEvents]) => {
      dayEvents.forEach(event => {
        if (event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query)) {
          results.push({ ...event, date: dateKey });
        }
      });
    });
    
    return results.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getCategoryColor = (category) => {
    return categoryColors[category] || '#6b7280';
  };

  const days = getDaysInMonth(currentDate);
  const searchResults = searchEvents();

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <Header 
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          monthNames={monthNames}
          styles={styles}
        />
        
        {searchQuery && searchResults.length > 0 && (
          <div style={styles.searchResults}>
            <h3>Search Results:</h3>
            {searchResults.map(event => (
              <div key={event.id} style={{...styles.eventItem, marginTop: '8px'}}>
                <div>
                  <span style={{
                    ...styles.eventDot, 
                    backgroundColor: getCategoryColor(event.category),
                    display: 'inline-block'
                  }}>
                    {event.title}
                  </span>
                  <span style={{marginLeft: '8px', color: '#6c757d', fontSize: '14px'}}>
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  onClick={() => editEvent(event)} 
                  style={styles.iconButton}
                  aria-label="Edit event"
                >
                  ✏️
                </button>
              </div>
            ))}
          </div>
        )}

        <CalendarGrid
          currentDate={currentDate}
          days={days}
          dayNames={dayNames}
          getDayEvents={getDayEvents}
          handleDateClick={handleDateClick}
          isToday={(day) => isToday(day, currentDate)}
          styles={styles}
          getCategoryColor={getCategoryColor}
        />
        
        {showEventModal && (
          <EventModal
            eventForm={eventForm}
            setEventForm={setEventForm}
            saveEvent={saveEvent}
            onClose={() => setShowEventModal(false)}
            editingEvent={editingEvent}
            selectedDate={selectedDate}
            getSelectedDayEvents={getSelectedDayEvents}
            deleteEvent={deleteEvent}
            editEvent={editEvent}
            getDateKey={getDateKey}
            styles={styles}
            getCategoryColor={getCategoryColor}
            monthNames={monthNames}
          />
        )}
      </div>
    </div>
  );
}