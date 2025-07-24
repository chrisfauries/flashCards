import { useEffect, useRef, useState } from "react";

export const useImagePreloader = (imageUrls: string[]) => {
  const loadedImageCount = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailures, setHasFailures] = useState(false);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setIsLoaded(true);
      return;
    }

    const handleImageLoad = () => {
      loadedImageCount.current++;
      if (loadedImageCount.current === imageUrls.length) {
        setIsLoaded(true);
      }
    };

    const handleImageError = () => {
      setHasFailures(true);
    };

    // Loop through each URL in the provided array.
    imageUrls.forEach((url) => {
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      img.src = url;
    });
  }, [imageUrls]);

  return { isLoaded, hasFailures };
};
