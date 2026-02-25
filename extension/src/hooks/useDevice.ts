import { useState, useEffect } from 'react';
import { getOrCreateDeviceId } from '../utils/deviceId';
import { queueOfflineAction } from './useOfflineQueue'; // Assuming this hook exists

export const useDevice = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await getOrCreateDeviceId();
      setDeviceId(id);
    };
    fetchDeviceId();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { deviceId, isOnline, queueOfflineAction };
};
