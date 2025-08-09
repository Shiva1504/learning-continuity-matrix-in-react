import { useState, useMemo, useEffect } from 'react';
import { EngagementEntry, PeerEntry, EngagementWeek, MotivationMessage } from '../types';

// Storage key for engagement data
const STORAGE_KEY = 'learning_engagement_data';

// Mock data
const MOCK_ENGAGEMENT: EngagementEntry[] = [
  { date: '2025-08-01', isCompleted: true },
  { date: '2025-08-02', isCompleted: true },
  { date: '2025-08-03', isCompleted: false },
  { date: '2025-08-04', isCompleted: true },
  { date: '2025-08-05', isCompleted: true },
  { date: '2025-08-06', isCompleted: true },
  { date: '2025-08-07', isCompleted: false },
  { date: '2025-08-08', isCompleted: true },
];

const MOCK_PEERS: PeerEntry[] = [
  { id: 100, displayName: 'Shiva', continuityCount: 5 },
  { id: 101, displayName: 'You', continuityCount: 3 },
  { id: 102, displayName: 'Jagadesh', continuityCount: 2 },
  { id: 103, displayName: 'Yogesh', continuityCount: 4 },
];

const MOTIVATION_MESSAGES: Record<string, MotivationMessage> = {
  low: {
    title: 'Keep Going!',
    description: 'Every day is a new opportunity to learn something new!',
    emoji: '💪',
  },
  medium: {
    title: 'Great Job!',
    description: 'You\'re building a great learning habit!',
    emoji: '✨',
  },
  high: {
    title: 'Amazing!',
    description: 'You\'re on fire! Keep up the fantastic work!',
    emoji: '🔥',
  },
};

const loadEngagementData = (): EngagementEntry[] => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Failed to load engagement data:', error);
  }
  return MOCK_ENGAGEMENT;
};

// Helper function to ensure we're always working with an array
const safeEngagementArray = (data: unknown): EngagementEntry[] => {
  if (!Array.isArray(data)) {
    console.warn('Expected engagement to be an array, got:', data);
    return [];
  }
  return data;
};

export const useEngagement = () => {
  const [engagement, setEngagement] = useState<EngagementEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [peers, setPeers] = useState<PeerEntry[]>(MOCK_PEERS);
  const [lastToggledDay, setLastToggledDay] = useState<string | null>(null);
  const [previousStreak, setPreviousStreak] = useState(0);

  // Calculate current streak
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const engagementArray = safeEngagementArray(engagement);
    const todayIndex = engagementArray.findIndex(entry => entry.date === today);
    
    if (todayIndex === -1) return 0;
    
    for (let i = todayIndex; i >= 0; i--) {
      if (engagementArray[i]?.isCompleted) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [engagement]);

  // Update peers with current user's streak and save to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        console.log('Updating peers with current streak:', currentStreak);
        // Update the current user's streak in the peers array
        setPeers(prevPeers => {
          const updatedPeers = [...prevPeers];
          const currentUserIndex = updatedPeers.findIndex(p => p.id === 101); // ID 101 is the current user
          if (currentUserIndex !== -1) {
            updatedPeers[currentUserIndex] = {
              ...updatedPeers[currentUserIndex],
              continuityCount: currentStreak
            };
            console.log('Updated current user in peers:', updatedPeers[currentUserIndex]);
          }
          return updatedPeers;
        });
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(engagement));
      } catch (error) {
        console.error('Failed to update engagement data:', error);
      }
    }
  }, [engagement, currentStreak, isLoading]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedEngagement = loadEngagementData();
        setEngagement(savedEngagement);
      } catch (error) {
        console.error('Failed to load engagement data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate peak streak
  const peakStreak = useMemo(() => {
    let maxStreak = 0;
    let currentStreak = 0;
    const engagementArray = safeEngagementArray(engagement);

    engagementArray.forEach(entry => {
      if (entry?.isCompleted) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return maxStreak;
  }, [engagement]);

  // Get motivation message based on current streak
  const motivationMessage = useMemo((): MotivationMessage => {
    if (currentStreak >= 5) return MOTIVATION_MESSAGES.high;
    if (currentStreak >= 2) return MOTIVATION_MESSAGES.medium;
    return MOTIVATION_MESSAGES.low;
  }, [currentStreak]);

  // Get current week's data
  const currentWeek = useMemo((): EngagementWeek => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((currentDay + 6) % 7)); // Get Monday of current week
    
    const week: EngagementWeek = {
      startDate: new Date(monday),
      days: [],
    };

    const engagementArray = safeEngagementArray(engagement);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      const engagementEntry = engagementArray.find(entry => entry?.date === dateString);
      const isToday = date.toDateString() === today.toDateString();
      
      week.days.push({
        date,
        isCompleted: engagementEntry?.isCompleted ?? false,
        isToday,
      });
    }

    return week;
  }, [engagement]);

  // Toggle completion status for a day
  const toggleDayCompletion = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setLastToggledDay(dateString);
    
    // Store current streak before updating
    setPreviousStreak(currentStreak);
    
    setEngagement(prev => {
      const prevArray = safeEngagementArray(prev);
      const index = prevArray.findIndex(entry => entry?.date === dateString);
      if (index >= 0) {
        // Update existing entry
        const updated = [...prevArray];
        updated[index] = { ...updated[index], isCompleted: !updated[index]?.isCompleted };
        return updated;
      } else {
        // Add new entry
        return [...prevArray, { date: dateString, isCompleted: true }];
      }
    });
  };

  // Reset to initial mock data
  const resetEngagement = () => {
    setEngagement(MOCK_ENGAGEMENT);
  };

  // Log current engagement state
  const logEngagement = () => {
    console.log('Current Engagement State:', {
      engagement,
      currentStreak,
      peakStreak,
      lastUpdated: new Date().toISOString(),
    });
  };

  // Add loading state to the returned object
  return {
    currentWeek,
    currentStreak,
    previousStreak,
    peakStreak,
    peers: [...peers].sort((a, b) => b.continuityCount - a.continuityCount),
    motivationMessage,
    toggleDayCompletion,
    resetEngagement,
    logEngagement,
    lastToggledDay,
    isLoading,
  };
};
