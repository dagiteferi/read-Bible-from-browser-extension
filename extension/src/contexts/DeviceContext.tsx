import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOrCreateDeviceId } from '../utils/deviceId';
import { OfflineAction, useOfflineQueue } from '../hooks/useOfflineQueue';

interface DeviceContextType {
  deviceId: string | null;
  isOnline: boolean;
  queueOfflineAction: (action: OfflineAction) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider = ({ children }) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const { queueOfflineAction, isOnline } = useOfflineQueue();

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await getOrCreateDeviceId();
      setDeviceId(id);
    };
    fetchDeviceId();
  }, []);

  return (
    <DeviceContext.Provider value={{ deviceId, isOnline, queueOfflineAction }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceContext = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDeviceContext must be used within a DeviceProvider');
  }
  return context;
};
