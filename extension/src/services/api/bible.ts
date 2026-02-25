import apiClient from './client';
import { BookMetadata } from '../../types/api';

export const getBooks = async (): Promise<string[]> => {
  const response = await apiClient.get('/books');
  return response.data;
};

export const getBookMetadata = async (book: string): Promise<BookMetadata> => {
  const response = await apiClient.get(`/metadata/${book}`);
  return response.data;
};
