import { useState, useEffect } from 'react';
import { getLocal, setLocal } from '../services/storage/local';
import { syncOfflineActions } from '../services/background/syncManager';

const OFFLINE_QUEUE_KEY = 'offlineActionsQueue';

export interface OfflineAction {
  type: string;
  payload: any;
}

export const useOfflineQueue = () => {
  const [queue, setQueue] = useState<OfflineAction[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const loadQueue = async () => {
      const storedQueue = await getLocal(OFFLINE_QUEUE_KEY) || [];
      setQueue(storedQueue);
    };
    loadQueue();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && queue.length > 0) {
      console.log('Online, attempting to sync offline actions...');
      syncOfflineActions();
      setQueue([]);
      setLocal(OFFLINE_QUEUE_KEY, []);
    }
  }, [isOnline, queue]);

  const queueOfflineAction = async (action: OfflineAction) => {
    const currentQueue = await getLocal(OFFLINE_QUEUE_KEY) || [];
    const updatedQueue = [...currentQueue, action];
    setQueue(updatedQueue);
    await setLocal(OFFLINE_QUEUE_KEY, updatedQueue);
    console.log('Action queued offline:', action);
  };

  return { queue, queueOfflineAction, isOnline };
};
