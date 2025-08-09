import React from 'react';
import { PeerEntry } from '../../types';
import styles from './PeerBenchmark.module.css';

interface PeerBenchmarkProps {
  peers: PeerEntry[];
  currentUserId?: number;
}

const PeerBenchmark: React.FC<PeerBenchmarkProps> = ({ peers, currentUserId = 101 }) => {
  // Debug log to track component updates
  console.log('PeerBenchmark rendering with peers:', peers);
  
  if (peers.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>All Learners</h3>
      <div className={styles.leaderboard}>
        {peers.map((peer, index) => {
          const isCurrentUser = peer.id === currentUserId;
          const rank = index + 1;
          
          return (
            <div 
              key={peer.id}
              className={`${styles.leaderboardItem} ${isCurrentUser ? styles.currentUser : ''}`}
              aria-current={isCurrentUser ? 'true' : undefined}
            >
              <div className={styles.rank} aria-label={`Rank ${rank}`}>
                {rank}
              </div>
              <div className={styles.name}>
                {isCurrentUser ? 'You' : peer.displayName}
              </div>
              <div className={styles.streak}>
                {peer.continuityCount} day{peer.continuityCount !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(PeerBenchmark);
