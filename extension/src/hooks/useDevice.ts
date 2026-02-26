import { useState, useEffect } from 'react';
import { getOrCreateDeviceId } from '../utils/deviceId';
import { useOfflineQueue } from './useOfflineQueue';

export const useDevice = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const { isOnline, queueOfflineAction } = useOfflineQueue(); // Get isOnline and queueOfflineAction from useOfflineQueue

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await getOrCreateDeviceId();
      setDeviceId(id);
    };
    fetchDeviceId();
  }, []);

  return { deviceId, isOnline, queueOfflineAction };
};