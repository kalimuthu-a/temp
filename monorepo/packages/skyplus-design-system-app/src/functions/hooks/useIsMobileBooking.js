import { useEffect, useState } from 'react';

/**
 *
 * Is Mobile hook for React
 *
 * @returns {[isMobile: boolean]}
 */
const useIsMobileBooking = () => {
  const [isMobile, setIsMobile] = useState(window.screen.availWidth <= 1024);

  const handleWindowSizeChange = () => {
    setIsMobile(window.screen.availWidth <= 1024);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return [isMobile];
};

export default useIsMobileBooking;
