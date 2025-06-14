const STORAGE_KEY = 'calendarEvents';

export const loadEvents = () => {
  try {
    const savedEvents = localStorage.getItem(STORAGE_KEY);
    return savedEvents ? JSON.parse(savedEvents) : {};
  } catch (error) {
    console.error('Error loading events from localStorage:', error);
    return {};
  }
};

export const saveEvents = (events) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return true;
  } catch (error) {
    console.error('Error saving events to localStorage:', error);
    return false;
  }
};

export const exportEvents = () => {
  const events = loadEvents();
  const dataStr = JSON.stringify(events, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `calendar-events-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importEvents = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const events = JSON.parse(e.target.result);
        saveEvents(events);
        resolve(events);
      } catch (error) {
        reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};