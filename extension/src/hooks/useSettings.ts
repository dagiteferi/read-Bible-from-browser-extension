import { useState, useEffect } from 'react';
import { getSync, setSync } from '../services/storage/sync';
import { UserSettings, TimeRange } from '../types/storage'; // Assuming these types exist

const DEFAULT_SETTINGS: UserSettings = {
  quietHours: { start: '22:00', end: '06:00' },
  workingHours: { start: '08:00', end: '17:00' },
  // Add other default settings here
};

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const storedSettings = await getSync('userSettings');
      setSettings({ ...DEFAULT_SETTINGS, ...storedSettings });
      setLoading(false);
    };
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await setSync('userSettings', updated);
  };

  const quietHours: TimeRange = settings.quietHours;
  const workingHours: TimeRange = settings.workingHours;

  return { settings, updateSettings, quietHours, workingHours, loading };
};
