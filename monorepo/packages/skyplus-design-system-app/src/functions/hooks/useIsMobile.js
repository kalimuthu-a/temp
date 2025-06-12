import { useEffect, useState } from 'react';

/**
 *
 * Is Mobile hook for React
 *
 * @returns {[isMobile: boolean]}
 */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleWindowSizeChange = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return [isMobile];
};

export default useIsMobile;
