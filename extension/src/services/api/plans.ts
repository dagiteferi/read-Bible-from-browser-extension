import apiClient from './client';
import { CreatePlanRequest, CreatePlanResponse, PlanProgress } from '../../types/api';

export const createPlan = async (planData: CreatePlanRequest): Promise<CreatePlanResponse> => {
  const response = await apiClient.post('/plan/create', planData);
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
