import { useState, useEffect } from 'react';
import { getSync, setSync } from '../services/storage/sync';
import { UserSettings, TimeRange } from '../types/storage';

const DEFAULT_SETTINGS: UserSettings = {
  quietHours: { start: '22:00', end: '06:00' },
  workingHours: { start: '08:00', end: '17:00' },
};

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await getSync('userSettings');
        setSettings({ ...DEFAULT_SETTINGS, ...storedSettings });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      await setSync('userSettings', updated);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const quietHours: TimeRange = settings.quietHours;
  const workingHours: TimeRange = settings.workingHours;

  return { settings, updateSettings, quietHours, workingHours, loading, error };
};
