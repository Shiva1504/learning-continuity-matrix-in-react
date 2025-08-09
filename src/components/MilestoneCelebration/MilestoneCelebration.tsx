import React, { useEffect, useState } from 'react';
import styles from './MilestoneCelebration.module.css';

interface MilestoneCelebrationProps {
  currentStreak: number;
  previousStreak: number;
}

const MILESTONES = [3, 5, 7, 14, 21, 30];

const getMilestoneMessage = (streak: number): string => {
  switch (streak) {
    case 3: return '3-day streak! Keep it up! 🎉';
    case 5: return '5 days in a row! Amazing! ✨';
    case 7: return 'A whole week! You\'re on fire! 🔥';
    case 14: return 'Two weeks strong! Incredible! 🌟';
    case 21: return 'Three weeks! You\'re unstoppable! 🚀';
    case 30: return 'A whole month! Legendary! 🏆';
    default: return '';
  }
};

const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  currentStreak,
  previousStreak,
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if we've reached a new milestone
    const newMilestone = MILESTONES.find(
      milestone => currentStreak === milestone && previousStreak < milestone
    );

    if (newMilestone) {
      setMessage(getMilestoneMessage(newMilestone));
      setShowCelebration(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentStreak, previousStreak]);

  if (!showCelebration) return null;

  return (
    <div className={styles.celebrationContainer}>
      <div className={styles.celebrationContent}>
        <div className={styles.confetti} />
        <div className={styles.confetti} />
        <div className={styles.confetti} />
        <div className={styles.confetti} />
        <div className={styles.confetti} />
        <div className={styles.message}>{message}</div>
      </div>
    </div>
  );
};

export default MilestoneCelebration;
