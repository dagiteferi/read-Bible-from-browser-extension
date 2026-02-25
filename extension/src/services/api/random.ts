import apiClient from './client';
import { RandomVerseResponse } from '../../types/api';

export const getRandomVerse = async (): Promise<RandomVerseResponse> => {
  const response = await apiClient.post('/random-verse');
  return response.data;
};
