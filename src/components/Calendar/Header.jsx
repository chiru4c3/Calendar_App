import React from 'react';
import { MONTH_NAMES, VIEW_MODES } from '../../utils/constants';
import Button from '../UI/Button';

const Header = ({ 
  currentDate, 
  onDateChange, 
  searchQuery, 
  onSearchChange, 
  viewMode, 
  onViewModeChange,
  onTodayClick,
  onExport,
  onImport,
  isMobile 
}) => {
  const styles = {
    header: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: 'white',
      padding: isMobile ? '16px' : '24px'
    },
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '16px'
    },
    title: {
      fontSize: isMobile ? '20px' : '28px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap'
    },
    viewToggle: {
      display: 'flex',
      gap: '4px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '4px'
    },
    viewButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      transition: 'background-color 0.2s'
    },
    viewButtonActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)'
    },
    searchBar: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    searchInput: {
      padding: '8px 32px 8px 12px',
      border: 'none',
      borderRadius: '6px',
      width: isMobile ? '150px' : '200px',
      fontSize: '14px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: '#333'
    },
    searchIcon: {
      position: 'absolute',
      right: '8px',
      fontSize: '16px',
      color: '#666'
    },
    monthNav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    navButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      color: 'white',
      fontSize: '24px',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s'
    },
    currentMonth: {
      fontSize: isMobile ? '18px' : '24px',
      fontWeight: '600',
      textAlign: 'center',
      flex: 1,
      margin: '0 16px'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      transition: 'background-color 0.2s'
    },
    // Hide export/import on mobile
    desktopOnly: {
      display: isMobile ? 'none' : 'flex',
      gap: '8px'
    }
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <div style={styles.header}>
      <div style={styles.headerTop}>
        <h1 style={styles.title}>
          <span>📅</span>
          Calendar App
        </h1>
        
        <div style={styles.controls}>
          {/* View Toggle - Hide on mobile */}
          {!isMobile && (
            <div style={styles.viewToggle}>
              {Object.values(VIEW_MODES).map(mode => (
                <button
                  key={mode}
                  style={{
                    ...styles.viewButton,
                    ...(viewMode === mode ? styles.viewButtonActive : {})
                  }}
                  onClick={() => onViewModeChange(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          )}
          
          {/* Search Bar */}
          <div style={styles.searchBar}>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
          
          {/* Export/Import - Desktop Only */}
          <div style={styles.desktopOnly}>
            <button style={styles.actionButton} onClick={onExport}>
              📤 Export
            </button>
            <label style={styles.actionButton}>
              📥 Import
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>
      
      <div style={styles.monthNav}>
        <button onClick={handlePrevMonth} style={styles.navButton}>
          ‹
        </button>
        <div style={styles.currentMonth}>
          {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button onClick={handleNextMonth} style={styles.navButton}>
          ›
        </button>
        <button onClick={onTodayClick} style={styles.actionButton}>
          Today
        </button>
      </div>
    </div>
  );
};

export default Header;