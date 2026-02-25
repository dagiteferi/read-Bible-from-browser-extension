import apiClient from './client';

export const markUnitAsRead = async (unitId: string): Promise<{ success: boolean }> => {
  const response = await apiClient.put(`/unit/${unitId}/read`);
  return response.data;
};
