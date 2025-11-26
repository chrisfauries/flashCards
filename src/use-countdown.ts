import { useState, useRef, useEffect, useCallback } from 'react';

const useCountdown = (initialMilliseconds: number, onComplete?: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialMilliseconds);
  const rafRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const cancelTimer = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    // If already running, don't start again
    if (rafRef.current) return;

    // Set the target time relative to right now
    endTimeRef.current = Date.now() + initialMilliseconds;

    const tick = () => {
      if (!endTimeRef.current) return;

      const now = Date.now();
      const remaining = endTimeRef.current - now;

      if (remaining <= 0) {
        setTimeLeft(0);
        cancelTimer();
        if (onComplete) onComplete();
      } else {
        setTimeLeft(remaining);
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    tick();
  }, [initialMilliseconds, onComplete, cancelTimer]);

  const reset = useCallback(() => {
    cancelTimer();
    setTimeLeft(initialMilliseconds);
  }, [initialMilliseconds, cancelTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelTimer();
  }, [cancelTimer]);

  return { timeLeft, start, reset };
};

export default useCountdown;