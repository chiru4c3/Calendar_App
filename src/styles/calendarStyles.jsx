const getResponsiveStyles = () => {
  const isMobile = window.innerWidth < 768;
  
  return {
    app: {
      minHeight: '100vh',
      padding: isMobile ? '10px' : '20px',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    // ... (add all other style definitions)
  };
};

export const styles = getResponsiveStyles();

// Calendar-specific styles using CSS-in-JS with design tokens
export const getCalendarStyles = (isMobile = false, isDark = false) => {
  const theme = {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8'
      },
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827'
      },
      success: { 500: '#10b981', 600: '#059669' },
      warning: { 500: '#f59e0b', 600: '#d97706' },
      error: { 500: '#ef4444', 600: '#dc2626' },
      purple: { 500: '#8b5cf6', 600: '#7c3aed' }
    },
    spacing: {
      1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem',
      5: '1.25rem', 6: '1.5rem', 8: '2rem', 10: '2.5rem',
      12: '3rem', 16: '4rem', 20: '5rem'
    },
    fontSize: {
      xs: '0.75rem', sm: '0.875rem', base: '1rem',
      lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem',
      '3xl': '1.875rem', '4xl': '2.25rem'
    },
    borderRadius: {
      sm: '0.25rem', md: '0.375rem', lg: '0.5rem',
      xl: '0.75rem', '2xl': '1rem', full: '9999px'
    },
    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  };

  return {
    // Main App Container
    app: {
      minHeight: '100vh',
      padding: isMobile ? theme.spacing[3] : theme.spacing[5],
      backgroundColor: isDark ? theme.colors.gray[900] : theme.colors.gray[50],
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      transition: 'background-color 0.3s ease'
    },

    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: isDark ? theme.colors.gray[800] : 'white',
      borderRadius: theme.borderRadius['2xl'],
      boxShadow: theme.boxShadow.xl,
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },

    // Header Styles
    header: {
      background: isDark 
        ? 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'
        : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: 'white',
      padding: isMobile ? theme.spacing[4] : theme.spacing[6],
      position: 'relative',
      overflow: 'hidden'
    },

    headerContent: {
      position: 'relative',
      zIndex: 1
    },

    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[5],
      flexWrap: 'wrap',
      gap: theme.spacing[4]
    },

    title: {
      fontSize: isMobile ? theme.fontSize['2xl'] : theme.fontSize['4xl'],
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[3],
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },

    titleIcon: {
      fontSize: isMobile ? theme.fontSize['2xl'] : theme.fontSize['3xl'],
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
    },

    // Controls Section
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[4],
      flexWrap: 'wrap'
    },

    viewToggle: {
      display: 'flex',
      gap: theme.spacing[1],
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[1],
      backdropFilter: 'blur(10px)'
    },

    viewButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      fontSize: theme.fontSize.sm,
      fontWeight: '500',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    },

    viewButtonActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'scale(1.05)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    },

    // Search Bar
    searchContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },

    searchInput: {
      padding: `${theme.spacing[2]} ${theme.spacing[10]} ${theme.spacing[2]} ${theme.spacing[3]}`,
      border: 'none',
      borderRadius: theme.borderRadius.lg,
      width: isMobile ? '180px' : '240px',
      fontSize: theme.fontSize.sm,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: theme.colors.gray[800],
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    },

    searchIcon: {
      position: 'absolute',
      right: theme.spacing[3],
      fontSize: theme.fontSize.base,
      color: theme.colors.gray[500],
      pointerEvents: 'none'
    },

    // Action Buttons
    actionButtons: {
      display: 'flex',
      gap: theme.spacing[2]
    },

    actionButton: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: 'none',
      color: 'white',
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      fontSize: theme.fontSize.sm,
      fontWeight: '500',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)'
    },

    // Month Navigation
    monthNav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing[4]
    },

    navButton: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: 'none',
      color: 'white',
      fontSize: theme.fontSize['2xl'],
      width: '44px',
      height: '44px',
      borderRadius: theme.borderRadius.full,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)'
    },

    currentMonth: {
      fontSize: isMobile ? theme.fontSize.xl : theme.fontSize['3xl'],
      fontWeight: '600',
      textAlign: 'center',
      flex: 1,
      margin: `0 ${theme.spacing[4]}`,
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      letterSpacing: '-0.025em'
    },

    todayButton: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: 'none',
      color: 'white',
      padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      fontSize: theme.fontSize.sm,
      fontWeight: '500',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)'
    },

    // Search Results
    searchResults: {
      padding: theme.spacing[5],
      backgroundColor: isDark ? theme.colors.gray[700] : theme.colors.gray[100],
      borderBottom: `1px solid ${isDark ? theme.colors.gray[600] : theme.colors.gray[200]}`,
      animation: 'fadeIn 0.3s ease-out'
    },

    searchResultsTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      color: isDark ? theme.colors.gray[100] : theme.colors.gray[800],
      marginBottom: theme.spacing[3]
    },

    // Calendar Grid
    grid: {
      padding: isMobile ? theme.spacing[3] : theme.spacing[6]
    },

    weekdays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[2]
    },

    weekday: {
      textAlign: 'center',
      fontWeight: '600',
      color: isDark ? theme.colors.gray[400] : theme.colors.gray[500],
      padding: `${theme.spacing[3]} 0`,
      fontSize: theme.fontSize.sm,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },

    daysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: theme.spacing[2]
    },

    // Day Cell Styles
    dayCell: {
      minHeight: isMobile ? '80px' : '120px',
      border: `1px solid ${isDark ? theme.colors.gray[600] : theme.colors.gray[200]}`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[2],
      cursor: 'pointer',
      backgroundColor: isDark ? theme.colors.gray[800] : 'white',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    },

    dayInactive: {
      cursor: 'default',
      backgroundColor: 'transparent',
      border: 'none'
    },

    dayToday: {
      backgroundColor: isDark ? theme.colors.primary[900] : theme.colors.primary[50],
      borderColor: theme.colors.primary[500],
      boxShadow: `0 0 0 2px ${theme.colors.primary[500]}20`
    },

    daySelected: {
      backgroundColor: isDark ? theme.colors.primary[800] : theme.colors.primary[100],
      borderColor: theme.colors.primary[600],
      transform: 'scale(1.02)'
    },

    dayNumber: {
      fontWeight: '600',
      marginBottom: theme.spacing[1],
      color: isDark ? theme.colors.gray[200] : theme.colors.gray[700],
      fontSize: theme.fontSize.sm
    },

    dayNumberToday: {
      color: theme.colors.primary[600],
      fontSize: theme.fontSize.base,
      fontWeight: '700'
    },

    // Event Styles
    eventDot: {
      fontSize: theme.fontSize.xs,
      padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
      borderRadius: theme.borderRadius.sm,
      color: 'white',
      marginBottom: theme.spacing[1],
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500'
    },

    eventMoreIndicator: {
      fontSize: theme.fontSize.xs,
      color: isDark ? theme.colors.gray[400] : theme.colors.gray[500],
      marginTop: theme.spacing[1],
      fontWeight: '500'
    },

    // Modal Styles
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing[5],
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.3s ease-out'
    },

    modalContent: {
      backgroundColor: isDark ? theme.colors.gray[800] : 'white',
      borderRadius: theme.borderRadius['2xl'],
      padding: theme.spacing[6],
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: theme.boxShadow.xl,
      animation: 'slideIn 0.3s ease-out',
      border: isDark ? `1px solid ${theme.colors.gray[700]}` : 'none'
    },

    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[6],
      paddingBottom: theme.spacing[4],
      borderBottom: `1px solid ${isDark ? theme.colors.gray[700] : theme.colors.gray[200]}`
    },

    modalTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: '600',
      color: isDark ? theme.colors.gray[100] : theme.colors.gray[900]
    },

    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: theme.fontSize['2xl'],
      color: isDark ? theme.colors.gray[400] : theme.colors.gray[500],
      cursor: 'pointer',
      width: '32px',
      height: '32px',
      borderRadius: theme.borderRadius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease'
    },

    // Form Styles
    formGroup: {
      marginBottom: theme.spacing[4]
    },

    label: {
      display: 'block',
      fontWeight: '500',
      color: isDark ? theme.colors.gray[300] : theme.colors.gray[700],
      fontSize: theme.fontSize.sm,
      marginBottom: theme.spacing[2]
    },

    input: {
      width: '100%',
      padding: `${theme.spacing[3]} ${theme.spacing[3]}`,
      border: `1px solid ${isDark ? theme.colors.gray[600] : theme.colors.gray[300]}`,
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.fontSize.sm,
      backgroundColor: isDark ? theme.colors.gray[700] : 'white',
      color: isDark ? theme.colors.gray[100] : theme.colors.gray[900],
      transition: 'all 0.2s ease',
      boxSizing: 'border-box'
    },

    textarea: {
      width: '100%',
      padding: `${theme.spacing[3]} ${theme.spacing[3]}`,
      border: `1px solid ${isDark ? theme.colors.gray[600] : theme.colors.gray[300]}`,
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.fontSize.sm,
      backgroundColor: isDark ? theme.colors.gray[700] : 'white',
      color: isDark ? theme.colors.gray[100] : theme.colors.gray[900],
      resize: 'vertical',
      minHeight: '80px',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box'
    },

    select: {
      width: '100%',
      padding: `${theme.spacing[3]} ${theme.spacing[3]}`,
      border: `1px solid ${isDark ? theme.colors.gray[600] : theme.colors.gray[300]}`,
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.fontSize.sm,
      backgroundColor: isDark ? theme.colors.gray[700] : 'white',
      color: isDark ? theme.colors.gray[100] : theme.colors.gray[900],
      transition: 'all 0.2s ease',
      boxSizing: 'border-box'
    },

    checkbox: {
      marginRight: theme.spacing[2],
      accentColor: theme.colors.primary[500]
    },

    timeInputs: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing[4]
    },

    // Button Styles
    formActions: {
      display: 'flex',
      gap: theme.spacing[3],
      marginTop: theme.spacing[6],
      paddingTop: theme.spacing[4],
      borderTop: `1px solid ${isDark ? theme.colors.gray[700] : theme.colors.gray[200]}`
    },

    button: {
      flex: 1,
      padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
      border: 'none',
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.fontSize.sm,
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[2]
    },

    buttonPrimary: {
      backgroundColor: theme.colors.primary[600],
      color: 'white'
    },

    buttonSecondary: {
      backgroundColor: isDark ? theme.colors.gray[700] : theme.colors.gray[200],
      color: isDark ? theme.colors.gray[200] : theme.colors.gray[700]
    },

    buttonDanger: {
      backgroundColor: theme.colors.error[500],
      color: 'white'
    },

    // Event List Styles
    eventList: {
      marginTop: theme.spacing[6],
      paddingTop: theme.spacing[6],
      borderTop: `1px solid ${isDark ? theme.colors.gray[700] : theme.colors.gray[200]}`
    },

    eventListTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      color: isDark ? theme.colors.gray[100] : theme.colors.gray[900],
      marginBottom: theme.spacing[4]
    },

    eventItem: {
      backgroundColor: isDark ? theme.colors.gray[700] : theme.colors.gray[50],
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing[3],
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      border: `1px solid ${isDark ? theme.colors.gray[600] : theme.colors.gray[200]}`,
      transition: 'all 0.2s ease'
    },

    eventItemContent: {
      flex: 1
    },

    eventItemTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[1]
    },

    eventCategoryDot: {
      width: '10px',
      height: '10px',
      borderRadius: theme.borderRadius.full,
      flexShrink: 0
    },

    eventItemTitleText: {
      fontWeight: '600',
      color: isDark ? theme.colors.gray[100] : theme.colors.gray[900],
      fontSize: theme.fontSize.base
    },

    eventItemDescription: {
      fontSize: theme.fontSize.sm,
      color: isDark ? theme.colors.gray[400] : theme.colors.gray[600],
      margin: `${theme.spacing[1]} 0`,
      lineHeight: theme.lineHeight.relaxed
    },

    eventItemTime: {
      fontSize: theme.fontSize.xs,
      color: isDark ? theme.colors.gray[400] : theme.colors.gray[500],
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[1]
    },

    eventActions: {
      display: 'flex',
      gap: theme.spacing[2],
      marginLeft: theme.spacing[3]
    },

    iconButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: theme.fontSize.base,
      padding: theme.spacing[2],
      borderRadius: theme.borderRadius.md,
      transition: 'all 0.2s ease',
      color: isDark ? theme.colors.gray[400] : theme.colors.gray[500]
    },

    // Loading and Error States
    loadingSpinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid currentColor',
      borderTop: '3px solid transparent',
      borderRadius: theme.borderRadius.full,
      animation: 'spin 1s linear infinite'
    },

    errorMessage: {
      backgroundColor: isDark ? theme.colors.error[900] : theme.colors.error[50],
      color: isDark ? theme.colors.error[200] : theme.colors.error[600],
      padding: theme.spacing[3],
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing[4],
      fontSize: theme.fontSize.sm,
      border: `1px solid ${isDark ? theme.colors.error[800] : theme.colors.error[200]}`
    },

    successMessage: {
      backgroundColor: isDark ? theme.colors.success[900] : theme.colors.success[50],
      color: isDark ? theme.colors.success[200] : theme.colors.success[600],
      padding: theme.spacing[3],
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing[4],
      fontSize: theme.fontSize.sm,
      border: `1px solid ${isDark ? theme.colors.success[800] : theme.colors.success[200]}`
    }
  };
};

// Category color mapping
export const getCategoryColors = (isDark = false) => ({
  personal: isDark ? '#60a5fa' : '#3b82f6',
  work: isDark ? '#34d399' : '#10b981',
  important: isDark ? '#f87171' : '#ef4444',
  other: isDark ? '#a78bfa' : '#8b5cf6'
});

// Animation keyframes for CSS-in-JS
export const animations = {
  fadeIn: {
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(-10px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    }
  },
  slideIn: {
    '@keyframes slideIn': {
      from: { opacity: 0, transform: 'translateX(-20px)' },
      to: { opacity: 1, transform: 'translateX(0)' }
    }
  },
  spin: {
    '@keyframes spin': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' }
    }
  }
};