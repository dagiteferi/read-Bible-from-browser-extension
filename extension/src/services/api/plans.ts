import apiClient from './client';
import { CreatePlanRequest, CreatePlanResponse, PlanProgress } from '../../types/api';
import { getOrCreateDeviceId } from '../../utils/deviceId';

export const createPlan = async (planData: CreatePlanRequest): Promise<CreatePlanResponse> => {
  const deviceId = await getOrCreateDeviceId();
  const response = await apiClient.post('/plan/create', { ...planData, device_id: deviceId });
  return response.data;
};

export const getNextUnit = async (planId: string): Promise<any> => { // TODO: Define Unit type
  const response = await apiClient.get(`/plan/${planId}/next-unit`);
  return response.data;
};

export const getPlanProgress = async (planId: string): Promise<PlanProgress> => {
  const response = await apiClient.get(`/plan/${planId}/progress`);
  return response.data;
};
