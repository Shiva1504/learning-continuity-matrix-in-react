import React from 'react';
import { MotivationMessage } from '../../types';
import styles from './MotivationPanel.module.css';

interface MotivationPanelProps {
  currentStreak: number;
  peakStreak: number;
  message: MotivationMessage;
  onLogEngagement: () => void;
  onResetEngagement: () => void;
}

const MotivationPanel: React.FC<MotivationPanelProps> = ({
  currentStreak,
  peakStreak,
  message,
  onLogEngagement,
  onResetEngagement,
}) => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Learning Continuity</h2>
        <div className={styles.streakContainer}>
          <div className={styles.streakItem}>
            <span className={styles.streakLabel}>Current Streak</span>
            <span className={styles.streakValue}>{currentStreak} days</span>
          </div>
          <div className={styles.streakDivider} />
          <div className={styles.streakItem}>
            <span className={styles.streakLabel}>Best Streak</span>
            <span className={styles.streakValue}>{peakStreak} days</span>
          </div>
        </div>
      </div>

      <div className={styles.messageCard}>
        <div className={styles.emoji} role="img" aria-hidden="true">
          {message.emoji}
        </div>
        <div>
          <h3 className={styles.messageTitle}>{message.title}</h3>
          <p className={styles.messageText}>{message.description}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          onClick={onLogEngagement}
          className={styles.secondaryButton}
          aria-label="Log current engagement state"
        >
          Log Progress
        </button>
        <button 
          onClick={onResetEngagement}
          className={styles.resetButton}
          aria-label="Reset engagement data"
        >
          Reset Data
        </button>
      </div>
    </div>
  );
};

export default React.memo(MotivationPanel);
