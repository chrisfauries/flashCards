import { useEffect, useRef } from "react";

const useHighPrecisionInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef(callback);
  const expectedTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    expectedTime.current = performance.now() + delay;

    const loop = () => {
      if (expectedTime.current === null) return;

      const now = performance.now();
      const timeRemaining = expectedTime.current - now;

      if (timeRemaining > 16) {
        rafId.current = requestAnimationFrame(loop);
        return;
      }

      if (timeRemaining > 0) {
        while (performance.now() < expectedTime.current) {}
      }

      savedCallback.current();

      expectedTime.current += delay;
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId.current ?? 0);
  }, [delay]);
};

export default useHighPrecisionInterval;
