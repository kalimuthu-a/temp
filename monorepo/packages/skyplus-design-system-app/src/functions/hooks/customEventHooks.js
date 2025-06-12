import { useCallback, useEffect } from 'react';

export function useCustomEventDispatcher() {
  return useCallback((eventName, eventData = {}) => {
    const event = new CustomEvent(eventName, { detail: eventData });
    window.dispatchEvent(event);
  }, []);
}

export function useCustomEventListener(eventName, callback) {
  const memoizedCallback = useCallback((event) => {
    if (event.detail) {
      callback(event.detail);
    }
  }, [callback]);

  useEffect(() => {
    window.addEventListener(eventName, memoizedCallback);

    return () => {
      window.removeEventListener(eventName, memoizedCallback);
    };
  }, [eventName, memoizedCallback]);
}
