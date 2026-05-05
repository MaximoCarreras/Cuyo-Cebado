/**
 * useCountdown — Hook for real-time countdown timer.
 * Calculates remaining time to a target date and updates every second. [SF]
 */
import { useState, useEffect } from 'react';

/**
 * @param {number} daysFromNow - Number of days from now for the countdown target
 * @returns {{ days, hours, minutes, seconds, isExpired }}
 */
export function useCountdown(daysFromNow = 3) {
  /* Calculate target date once on mount */
  const [targetDate] = useState(() => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);
    target.setHours(23, 59, 59, 0);
    return target.getTime();
  });

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    /* Update every second [RM - interval is cleared on unmount] */
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

/**
 * Pure function to calculate remaining time components.
 * Returns zero values if the countdown has expired.
 */
function calculateTimeLeft(targetDate) {
  const now = Date.now();
  const difference = targetDate - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  };
}
