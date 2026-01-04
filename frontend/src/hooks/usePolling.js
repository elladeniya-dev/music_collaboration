import { useEffect, useRef } from 'react';

/**
 * Custom hook for polling data at regular intervals
 * @param {Function} callback - The function to call at each interval
 * @param {number} delay - Delay in milliseconds
 * @param {Array} dependencies - Dependencies array
 */
export const usePolling = (callback, delay, dependencies = []) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => {
      savedCallback.current();
    };

    // Call immediately
    tick();

    // Then set up interval
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...dependencies]);
};
