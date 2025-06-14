import React, { useState, useEffect } from 'react';
import { EVENT_CATEGORIES, RECURRING_OPTIONS } from '../../utils/constants';
import { getDateKey, formatTime } from '../../utils/dateHelpers';
import { getCategoryColors } from '../../styles/calendarStyles';
import Button from '../UI/Button';
import Input from '../UI/Input';

const EventModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  eventForm, 
  setEventForm, 
  onSave, 
  editingEvent,
  events,
  onDeleteEvent,
  onDeleteRecurringEvent,
  styles,
  isDark 
}) => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null); // Store the event being deleted
  const categoryColors = getCategoryColors(isDark);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setShowRecurringOptions(false);
      setEventToDelete(null);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!eventForm.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!eventForm.allDay && eventForm.startTime && eventForm.endTime) {
      if (eventForm.startTime >= eventForm.endTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onSave();
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedDayEvents = () => {
    if (!selectedDate) return [];
    const dateKey = getDateKey(selectedDate);
    return events[dateKey] || [];
  };

  const handleDeleteEvent = (eventId) => {
    const event = getSelectedDayEvents().find(e => e.id === eventId);
    
    if (!event) {
      console.error('Event not found:', eventId);
      return;
    }
    
    if (event.recurringId) {
      // This is a recurring event - show options
      setEventToDelete(event);
      setShowRecurringOptions(true);
      return;
    }
    
    // Regular event deletion
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDeleteEvent(getDateKey(selectedDate), eventId);
    }
  };

  const handleDeleteRecurring = (deleteType) => {
    if (!eventToDelete) {
      console.error('No event selected for deletion');
      setShowRecurringOptions(false);
      return;
    }
    
    if (deleteType === 'single') {
      // Delete only this instance
      if (window.confirm('Delete only this occurrence of the recurring event?')) {
        onDeleteEvent(getDateKey(selectedDate), eventToDelete.id);
        setShowRecurringOptions(false);
        setEventToDelete(null);
      }
    } else if (deleteType === 'all') {
      // Delete all instances of the recurring event
      if (window.confirm('Delete ALL occurrences of this recurring event? This cannot be undone.')) {
        onDeleteRecurringEvent(eventToDelete.recurringId);
        setShowRecurringOptions(false);
        setEventToDelete(null);
        onClose();
      }
    }
  };

  const getRecurringEventCount = (recurringId) => {
    if (!recurringId) return 0;
    
    let count = 0;
    Object.values(events).forEach(dayEvents => {
      dayEvents.forEach(event => {
        if (event.recurringId === recurringId) {
          count++;
        }
      });
    });
    return count;
  };

  const handleEditEvent = (event) => {
    setEventForm({
      title: event.title,
      description: event.description || '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      allDay: event.allDay || false,
      category: event.category || 'personal',
      recurring: event.recurring || 'none'
    });
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>
            {editingEvent ? 'Edit Event' : 'Add Event'} - {selectedDate?.toLocaleDateString()}
          </h3>
          <button 
            onClick={onClose} 
            style={styles.closeButton}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div style={styles.formGroup}>
            <Input
              label="Title"
              type="text"
              value={eventForm.title}
              onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
              placeholder="Event title"
              required
              error={errors.title}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={eventForm.description}
              onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
              placeholder="Event description"
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              value={eventForm.category}
              onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
              style={styles.select}
            >
              {Object.entries(EVENT_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={{...styles.label, display: 'flex', alignItems: 'center'}}>
              <input
                type="checkbox"
                checked={eventForm.allDay}
                onChange={(e) => setEventForm({...eventForm, allDay: e.target.checked})}
                style={styles.checkbox}
              />
              All Day Event
            </label>
          </div>

          {!eventForm.allDay && (
            <div style={styles.timeInputs}>
              <div style={styles.formGroup}>
                <Input
                  label="Start Time"
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({...eventForm, startTime: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <Input
                  label="End Time"
                  type="time"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm({...eventForm, endTime: e.target.value})}
                  error={errors.endTime}
                  style={styles.input}
                />
              </div>
            </div>
          )}

          {!editingEvent && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Recurring</label>
              <select
                value={eventForm.recurring}
                onChange={(e) => setEventForm({...eventForm, recurring: e.target.value})}
                style={styles.select}
              >
                {Object.entries(RECURRING_OPTIONS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              {eventForm.recurring !== 'none' && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: isDark ? '#d1d5db' : '#6b7280'
                }}>
                  ℹ️ This will create multiple events. You can manage them individually or delete all at once later.
                </div>
              )}
            </div>
          )}

          <div style={styles.formActions}>
            <Button
              onClick={handleSave}
              variant="primary"
              disabled={!eventForm.title || isLoading}
              loading={isLoading}
            >
              {editingEvent ? 'Update Event' : 'Save Event'}
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Events List for Selected Day */}
        {getSelectedDayEvents().length > 0 && (
          <div style={styles.eventList}>
            <h4 style={styles.eventListTitle}>Events on this day:</h4>
            {getSelectedDayEvents().map(event => (
              <div key={event.id} style={styles.eventItem}>
                <div style={styles.eventItemContent}>
                  <div style={styles.eventItemTitle}>
                    <span 
                      style={{
                        ...styles.eventCategoryDot,
                        backgroundColor: categoryColors[event.category]
                      }}
                    />
                    <strong style={styles.eventItemTitleText}>{event.title}</strong>
                    {event.recurringId && (
                      <span style={{
                        fontSize: '10px',
                        backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                        color: isDark ? '#d1d5db' : '#6b7280',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        marginLeft: '8px'
                      }}>
                        🔄 Recurring
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p style={styles.eventItemDescription}>{event.description}</p>
                  )}
                  <div style={styles.eventItemTime}>
                    🕐 {event.allDay ? 'All Day' : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
                  </div>
                </div>
                <div style={styles.eventActions}>
                  <button 
                    onClick={() => handleEditEvent(event)} 
                    style={styles.iconButton}
                    title="Edit event"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)} 
                    style={styles.iconButton}
                    title="Delete event"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recurring Event Delete Options Modal */}
        {showRecurringOptions && eventToDelete && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}>
            <div style={{
              backgroundColor: isDark ? '#374151' : 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: isDark ? '#f9fafb' : '#111827'
              }}>
                Delete Recurring Event
              </h3>
              <p style={{
                marginBottom: '20px',
                color: isDark ? '#d1d5db' : '#6b7280',
                lineHeight: '1.5'
              }}>
                This is part of a recurring event series "{eventToDelete.title}". What would you like to delete?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button
                  onClick={() => handleDeleteRecurring('single')}
                  variant="secondary"
                  style={{ justifyContent: 'flex-start' }}
                >
                  🗑️ Delete only this occurrence
                </Button>
                <Button
                  onClick={() => handleDeleteRecurring('all')}
                  variant="danger"
                  style={{ justifyContent: 'flex-start' }}
                >
                  🗑️ Delete ALL occurrences ({getRecurringEventCount(eventToDelete.recurringId)} events)
                </Button>
                <Button
                  onClick={() => {
                    setShowRecurringOptions(false);
                    setEventToDelete(null);
                  }}
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;