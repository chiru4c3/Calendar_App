import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWindowSize } from './hooks/useWindowSize';
import { getDateKey, generateRecurringDates } from './utils/dateHelpers';
import { exportEvents, importEvents } from './utils/storage';
import { getCalendarStyles, getCategoryColors } from './styles/calendarStyles';
import { VIEW_MODES } from './utils/constants';
import Header from './components/Calendar/Header';
import CalendarGrid from './components/Calendar/CalendarGrid';
import EventModal from './components/Calendar/EventModal';
import './styles/global.css';

const App = () => {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useLocalStorage('calendarEvents', {});
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
  const [isDark, setIsDark] = useState(false);
  const [notification, setNotification] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    allDay: false,
    category: 'personal',
    recurring: 'none'
  });

  // Hooks
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 768;

  // Memoized styles with error handling
  const styles = useMemo(() => {
    try {
      return getCalendarStyles(isMobile, isDark);
    } catch (error) {
      console.error('Error generating styles:', error);
      // Return basic fallback styles
      return {
        app: { minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
        container: { maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white' }
      };
    }
  }, [isMobile, isDark]);

  // Dark mode detection
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);
      
      const handleChange = (e) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    } catch (error) {
      console.error('Error setting up dark mode detection:', error);
    }
  }, []);

  // Notification auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Event handlers
  const handleDateClick = (day) => {
    try {
      const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(selected);
      setShowEventModal(true);
      setEditingEvent(null);
      resetEventForm();
    } catch (error) {
      console.error('Error handling date click:', error);
      setNotification({ type: 'error', message: 'Error selecting date' });
    }
  };

  const resetEventForm = () => {
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

  // Generate unique ID for recurring event series
  const generateRecurringId = () => {
    return `recurring_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const saveEvent = () => {
    try {
      if (!eventForm.title || !selectedDate) return;

      const dateKey = getDateKey(selectedDate);
      const recurringId = eventForm.recurring !== 'none' && !editingEvent ? generateRecurringId() : null;
      
      const newEvent = {
        id: editingEvent ? editingEvent.id : Date.now(),
        ...eventForm,
        date: dateKey,
        recurringId: editingEvent ? editingEvent.recurringId : recurringId
      };

      const updatedEvents = { ...events };
      if (!updatedEvents[dateKey]) {
        updatedEvents[dateKey] = [];
      }

      if (editingEvent) {
        // Update existing event
        updatedEvents[dateKey] = updatedEvents[dateKey].map(event =>
          event.id === editingEvent.id ? newEvent : event
        );
        setNotification({ type: 'success', message: 'Event updated successfully!' });
      } else {
        // Add new event
        updatedEvents[dateKey].push(newEvent);
        
        // Handle recurring events
        if (eventForm.recurring !== 'none') {
          const recurringDates = generateRecurringDates(selectedDate, eventForm.recurring);
          recurringDates.forEach(date => {
            const recurringDateKey = getDateKey(date);
            if (!updatedEvents[recurringDateKey]) {
              updatedEvents[recurringDateKey] = [];
            }
            updatedEvents[recurringDateKey].push({
              ...newEvent,
              id: Date.now() + Math.random(),
              date: recurringDateKey,
              recurringId: recurringId
            });
          });
          setNotification({ 
            type: 'success', 
            message: `Recurring event created! ${recurringDates.length + 1} events added.` 
          });
        } else {
          setNotification({ type: 'success', message: 'Event created successfully!' });
        }
      }

      setEvents(updatedEvents);
      setShowEventModal(false);
      resetEventForm();
    } catch (error) {
      console.error('Error saving event:', error);
      setNotification({ type: 'error', message: 'Error saving event' });
    }
  };

  const deleteEvent = (dateKey, eventId) => {
    try {
      const updatedEvents = { ...events };
      updatedEvents[dateKey] = updatedEvents[dateKey].filter(event => event.id !== eventId);
      if (updatedEvents[dateKey].length === 0) {
        delete updatedEvents[dateKey];
      }
      setEvents(updatedEvents);
      setNotification({ type: 'success', message: 'Event deleted successfully!' });
    } catch (error) {
      console.error('Error deleting event:', error);
      setNotification({ type: 'error', message: 'Error deleting event' });
    }
  };

  const editEvent = (event) => {
    try {
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
    } catch (error) {
      console.error('Error editing event:', error);
      setNotification({ type: 'error', message: 'Error editing event' });
    }
  };

  const searchEvents = () => {
    try {
      if (!searchQuery) return [];
      const results = [];
      Object.entries(events).forEach(([dateKey, dayEvents]) => {
        dayEvents.forEach(event => {
          if (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              event.description.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push({ ...event, date: dateKey });
          }
        });
      });
      return results.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error('Error searching events:', error);
      return [];
    }
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleExport = () => {
    try {
      exportEvents();
      setNotification({ type: 'success', message: 'Events exported successfully!' });
    } catch (error) {
      console.error('Error exporting events:', error);
      setNotification({ type: 'error', message: 'Failed to export events.' });
    }
  };

  const handleImport = async (file) => {
    try {
      const importedEvents = await importEvents(file);
      setEvents(importedEvents);
      setNotification({ type: 'success', message: 'Events imported successfully!' });
    } catch (error) {
      console.error('Error importing events:', error);
      setNotification({ type: 'error', message: 'Failed to import events. Please check the file format.' });
    }
  };

  const searchResults = searchEvents();

  // New function to delete all recurring events
  const deleteRecurringEvent = (recurringId) => {
    try {
      const updatedEvents = { ...events };
      let deletedCount = 0;

      // Remove all events with the same recurringId
      Object.keys(updatedEvents).forEach(dateKey => {
        const originalLength = updatedEvents[dateKey].length;
        updatedEvents[dateKey] = updatedEvents[dateKey].filter(event => event.recurringId !== recurringId);
        deletedCount += originalLength - updatedEvents[dateKey].length;
        
        // Remove empty date entries
        if (updatedEvents[dateKey].length === 0) {
          delete updatedEvents[dateKey];
        }
      });

      setEvents(updatedEvents);
      setNotification({ 
        type: 'success', 
        message: `All recurring events deleted! ${deletedCount} events removed.` 
      });
    } catch (error) {
      console.error('Error deleting recurring events:', error);
      setNotification({ type: 'error', message: 'Error deleting recurring events' });
    }
  };

  // Error boundary fallback
  if (!styles.app) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Calendar App</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        {/* Notification */}
        {notification && (
          <div style={notification.type === 'error' ? styles.errorMessage : styles.successMessage}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <Header
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onTodayClick={handleTodayClick}
          onExport={handleExport}
          onImport={handleImport}
          isMobile={isMobile}
        />

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div style={styles.searchResults}>
            <h3 style={styles.searchResultsTitle}>Search Results:</h3>
            {searchResults.map(event => (
              <div key={event.id} style={{...styles.eventItem, marginTop: '8px'}}>
                <div>
                  <span style={{
                    ...styles.eventDot, 
                    backgroundColor: getCategoryColors(isDark)[event.category], 
                    display: 'inline-block'
                  }}>
                    {event.title}
                  </span>
                  <span style={{marginLeft: '8px', color: isDark ? '#9ca3af' : '#6c757d', fontSize: '14px'}}>
                    {event.date}
                  </span>
                </div>
                <button onClick={() => editEvent(event)} style={styles.iconButton}>✏️</button>
              </div>
            ))}
          </div>
        )}

        {/* Calendar Grid */}
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          onDateClick={handleDateClick}
          selectedDate={selectedDate}
          styles={styles}
          isMobile={isMobile}
          isDark={isDark}
        />

        {/* Event Modal */}
        <EventModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          selectedDate={selectedDate}
          eventForm={eventForm}
          setEventForm={setEventForm}
          onSave={saveEvent}
          editingEvent={editingEvent}
          events={events}
          onDeleteEvent={deleteEvent}
          onDeleteRecurringEvent={deleteRecurringEvent} // New prop
          styles={styles}
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default App;