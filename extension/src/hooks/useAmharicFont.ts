import { useState, useEffect } from 'react';

export const useAmharicFont = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (document.fonts.check('1em "Noto Sans Ethiopic"')) {
        setFontLoaded(true);
      } else {
        console.warn('Noto Sans Ethiopic font not loaded. Fallback will be used.');
        setFontLoaded(false);
      }
    });
  }, []);

  return { fontLoaded };
};
