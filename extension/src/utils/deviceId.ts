import { getLocal, setLocal } from '../services/storage/local';

const DEVICE_ID_KEY = 'deviceId';

export const generateDeviceId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getOrCreateDeviceId = async (): Promise<string> => {
  let deviceId = await getLocal(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = generateDeviceId();
    await setLocal(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};
