import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the user agent is a mobile device (phone or tablet).
 *
 * @returns {boolean} - True if the device is mobile, false otherwise.
 */
const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This check ensures that the code runs only on the client-side,
    // where the `navigator` object is available.
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      // Regular expression to test for common mobile and tablet user agents.
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    }
  }, []); // Empty dependency array ensures this effect runs only once after initial render.

  return isMobile;
};

export default useIsMobile;