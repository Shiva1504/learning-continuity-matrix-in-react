import React, { useState, useEffect, useCallback, useMemo } from 'react';
import EngagementMatrix from './components/EngagementMatrix/EngagementMatrix';
import MotivationPanel from './components/MotivationPanel/MotivationPanel';
import PeerBenchmark from './components/PeerBenchmark/PeerBenchmark';
import MilestoneCelebration from './components/MilestoneCelebration/MilestoneCelebration';
import KeyboardHelp from './components/KeyboardHelp/KeyboardHelp';
import { useEngagement } from './hooks/useEngagement';
import styles from './App.module.css';

const App: React.FC = () => {
  // All state declarations at the top - called in the same order on every render
  const [focusedDayIndex, setFocusedDayIndex] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLogToast, setShowLogToast] = useState(false);
  
  // Memoize the development environment check
  const isDevelopment = useMemo(() => process.env.NODE_ENV === 'development', []);
  
  // Custom hook - all hooks inside useEngagement must also follow rules
  const {
    currentWeek,
    currentStreak,
    previousStreak,
    peakStreak,
    peers,
    motivationMessage,
    toggleDayCompletion,
    resetEngagement,
    logEngagement,
    lastToggledDay,
    isLoading,
  } = useEngagement();

  // Memoize the loading UI to prevent unnecessary re-renders
  const loadingUI = useMemo(() => (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingSpinner} />
      <p>Loading your learning data...</p>
    </div>
  ), []);

  // Memoize the confirmation dialog to prevent unnecessary re-renders
  const confirmationDialog = useMemo(() => (
    showResetConfirm && (
      <div className={styles.confirmOverlay}>
        <div className={styles.confirmDialog}>
          <p>Are you sure you want to reset all data? This cannot be undone.</p>
          <div className={styles.confirmButtons}>
            <button 
              onClick={() => {
                resetEngagement();
                setShowResetConfirm(false);
              }}
            >
              Yes, Reset
            </button>
            <button onClick={() => setShowResetConfirm(false)}>Cancel</button>
          </div>
        </div>
      </div>
    )
  ), [showResetConfirm, resetEngagement]);

  // Handle keyboard navigation and shortcuts - memoized with useCallback
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't handle keyboard events when typing in inputs
    if (document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA') {
      return;
    }

    // Navigation between days
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
      e.preventDefault();
      
      setFocusedDayIndex(prevIndex => {
        if (prevIndex === null) {
          // Focus on today if no day is focused
          const todayIndex = currentWeek.days.findIndex(day => day.isToday);
          return todayIndex >= 0 ? todayIndex : 0;
        }
        
        let newIndex = prevIndex;
        
        switch (e.key) {
          case 'ArrowLeft':
            return Math.max(0, prevIndex - 1);
          case 'ArrowRight':
            return Math.min(currentWeek.days.length - 1, prevIndex + 1);
          case 'ArrowUp':
            return Math.max(0, prevIndex - 3);
          case 'ArrowDown':
            return Math.min(currentWeek.days.length - 1, prevIndex + 3);
          case ' ':
          case 'Enter':
            toggleDayCompletion(currentWeek.days[prevIndex].date);
            return prevIndex; // Return current index to prevent state update
          default:
            return newIndex;
        }
      });
    }
    
    // Handle keyboard shortcuts
    switch (e.key.toLowerCase()) {
      case 'l':
        logEngagement();
        break;
      case 'r':
        setShowResetConfirm(true);
        break;
      case 'escape':
        setFocusedDayIndex(null);
        break;
      default:
        break;
    }
  }, [currentWeek.days, logEngagement, toggleDayCompletion]);

  // Handle log engagement with toast notification
  const handleLogEngagement = useCallback(() => {
    logEngagement();
    setShowLogToast(true);
    const timer = setTimeout(() => setShowLogToast(false), 3000);
    return () => clearTimeout(timer);
  }, [logEngagement]);

  // Setup keyboard event listeners - all hooks are called unconditionally
  useEffect(() => {
    if (isLoading) {
      return;
    }
    
    const handleKeyDownWrapper = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener('keydown', handleKeyDownWrapper);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDownWrapper);
    };
  }, [handleKeyDown, isLoading]);

  // Early return for loading state - after all hooks are called
  if (isLoading) {
    return loadingUI;
  }

  return (
    <div className={styles.app}>
      {confirmationDialog}
      
      <MilestoneCelebration 
        currentStreak={currentStreak} 
        previousStreak={previousStreak} 
      />
      
      <header className={styles.header}>
        <h1>Learning Continuity Matrix</h1>
        <p className={styles.subtitle}>Track your learning journey and build consistent study habits</p>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <MotivationPanel
            currentStreak={currentStreak}
            peakStreak={peakStreak}
            message={motivationMessage}
            onLogEngagement={handleLogEngagement}
            onResetEngagement={() => setShowResetConfirm(true)}
          />

          <div className={styles.engagementSection}>
            <h2 className={styles.sectionTitle}>This Week's Engagement</h2>
            <EngagementMatrix
              week={currentWeek}
              onDayClick={toggleDayCompletion}
              lastToggledDay={lastToggledDay}
              focusedDayIndex={focusedDayIndex}
            />
          </div>

          <PeerBenchmark peers={peers} />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 EdTech Platform. All rights reserved.</p>
      </footer>
      
      <KeyboardHelp />
      
      {/* Toast notification for log progress */}
      {showLogToast && (
        <div className={styles.toast}>
          <span>✓ Progress logged to console</span>
        </div>
      )}
    </div>
  );
};

export default App;
