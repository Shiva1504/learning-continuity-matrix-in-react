import React, { useState, useEffect } from 'react';
import styles from './KeyboardHelp.module.css';

const KeyboardHelp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Show the help button after 5 seconds of inactivity
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
    };

    // Initial setup
    resetTimer();

    // Add event listeners
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
    setIsVisible(false);
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`${styles.keyboardHelp} ${isOpen ? styles.open : ''}`}>
      <button 
        className={styles.toggleButton}
        onClick={toggleHelp}
        aria-label={isOpen ? 'Close keyboard shortcuts help' : 'Show keyboard shortcuts help'}
        aria-expanded={isOpen}
      >
        {isOpen ? '×' : '?'}
      </button>
      
      {isOpen && (
        <div className={styles.helpContent}>
          <h3>Keyboard Shortcuts</h3>
          <ul>
            <li><kbd>?</kbd> - Toggle this help</li>
            <li><kbd>Esc</kbd> - Close any open dialogs or this help</li>
            <li><kbd>←</kbd> <kbd>→</kbd> - Navigate between days</li>
            <li><kbd>Space</kbd> or <kbd>Enter</kbd> - Toggle day completion</li>
            <li><kbd>L</kbd> - Log current progress to console</li>
            <li><kbd>R</kbd> - Reset all data (requires confirmation)</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default KeyboardHelp;
