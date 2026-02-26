import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSync, setSync } from '../services/storage/sync';
import { UserSettings, TimeRange } from '../types/storage';

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  quietHours: TimeRange;
  workingHours: TimeRange;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: UserSettings = {
  quietHours: { start: '22:00', end: '06:00' },
  workingHours: { start: '08:00', end: '17:00' },
};

export const SettingsProvider = ({ children }) => {
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

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, quietHours, workingHours, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};
