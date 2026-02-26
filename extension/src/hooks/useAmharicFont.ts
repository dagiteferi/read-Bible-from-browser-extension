import { useState, useEffect } from 'react';

export const useAmharicFont = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      try {
        if (document.fonts.check('1em "Noto Sans Ethiopic"')) {
          setFontLoaded(true);
        } else {
          console.warn('Noto Sans Ethiopic font not loaded. Fallback will be used.');
          setFontLoaded(false);
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error checking font:', err);
      } finally {
        setLoading(false);
      }
    }).catch(err => {
      setError(err as Error);
      console.error('Error waiting for document.fonts.ready:', err);
      setLoading(false);
    });
  }, []);

  return { fontLoaded, loading, error };
};