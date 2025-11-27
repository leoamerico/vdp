import { useEffect, useRef } from 'react';

export function usePolling(callback, intervalMs = 300000) { // Default 5 min
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }
        if (intervalMs !== null) {
            const id = setInterval(tick, intervalMs);
            return () => clearInterval(id);
        }
    }, [intervalMs]);
}
