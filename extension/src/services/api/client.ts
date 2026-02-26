import axios from 'axios';
import { getOrCreateDeviceId } from '../../utils/deviceId';

const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://backend/v1'
  : 'http://localhost:8000/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const deviceId = await getOrCreateDeviceId();
  config.headers['X-Device-ID'] = deviceId;
  return config;
});

export default apiClient;
